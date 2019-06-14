import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { message } from 'antd';
import router from 'umi/router';
import { formatMessage, FormattedMessage } from 'umi/locale';
import {
  Form,
  Input,
  DatePicker,
  Select,
  Button,
  Card,
  InputNumber,
  Radio,
  Icon,
  Tooltip,
} from 'antd';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import MonacoEditor from 'react-monaco-editor';

const FormItem = Form.Item;
const { TextArea } = Input;

@connect(({ template, loading }) => ({
  template,
  loading: loading.effects['template/fetchById'],
  submitting: loading.effects['template/submitForm'],
}))
@Form.create()
class TemplateForm extends PureComponent {
  state = {
    data: {}
  }

  componentDidMount() {
    const {
      dispatch,
      match: {
        params: { id },
      },
    } = this.props;

    if (id) {
      dispatch({
        type: 'template/fetchById',
        payload: id,
        callback: (response) => {
          this.setState({
            data: response,
          });
        },
      });
    }
  }

  handleReturn = () => {
    router.push(`/template/template-list`);
  };

  handleSubmit = e => {
    const {
      dispatch,
      form,
      match: {
        params: { duplicate },
      },
    } = this.props;
    e.preventDefault();
    form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        if (duplicate) {
          delete values.id;
        }
        dispatch({
          type: 'template/submitForm',
          payload: values,
          callback: response => {
            router.push(`/config/config-list`);
          },
        });
      }
    });
  };

  render() {
    const {
      loading,
      submitting,
      form: { getFieldDecorator, getFieldValue },
      match: {
        params: { duplicate, id },
      },
    } = this.props;

    const { data } = this.state;

    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 2 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 20 },
      },
    };

    const submitFormLayout = {
      wrapperCol: {
        xs: { span: 24, offset: 0 },
        sm: { span: 10, offset: 7 },
      },
    };

    const options = {
      //selectOnLineNumbers: true,
      //readOnly: true
    };

    return (
      <PageHeaderWrapper
        title={
          !id || !duplicate ? (
            <FormattedMessage id="app.template.add.title" />
          ) : (
              <FormattedMessage id="app.template.edit.title" />
            )
        }
      >
        <Card bordered={false} loading={loading}>
          <Form onSubmit={this.handleSubmit} hideRequiredMark style={{ marginTop: 8 }}>
            {getFieldDecorator('id', { initialValue: data.id })(<Input hidden />)}
            <FormItem {...formItemLayout} label={<FormattedMessage id="app.template.name" />}>
              {getFieldDecorator('name', {
                initialValue: data.name,
                rules: [
                  {
                    required: true,
                    message: formatMessage({ id: 'validation.template.name' }),
                  },
                ],
              })(<Input placeholder={formatMessage({ id: 'app.template.name.placeholder' })} />)}
            </FormItem>
            <FormItem {...formItemLayout} label={<FormattedMessage id="app.template.fileName" />}>
              {getFieldDecorator('fileName', {
                initialValue: data.fileName,
                rules: [
                  {
                    required: true,
                    message: formatMessage({ id: 'validation.template.fileName' }),
                  },
                ],
              })(
                <Input placeholder={formatMessage({ id: 'app.template.fileName.placeholder' })} />
              )}
            </FormItem>
            {/* <FormItem {...formItemLayout} label={<FormattedMessage id="app.template.content" />}>
              {getFieldDecorator('content', {
                initialValue: data.content,
                rules: [
                  {
                    required: true,
                    message: formatMessage({ id: 'validation.template.content' }),
                  },
                ],
              })(
                <TextArea
                  autosize
                  style={{
                    background: '#272822',
                    padding: 10,
                    overflow: 'auto',
                    color: '#fff',
                    fontSize: '1em',
                    minHeight: 256,
                    overflow: 'hidden',
                  }}
                  placeholder={formatMessage({ id: 'app.template.content.placeholder' })}
                  rows={4}
                />
              )}
            </FormItem> */}
            <FormItem  {...formItemLayout} label={<FormattedMessage id="app.template.content" />}>
              {getFieldDecorator('content', {
                initialValue: data.content,
                rules: [
                  {
                    required: true,
                    message: formatMessage({ id: 'validation.template.content' }),
                  },
                ],
              })(
                <MonacoEditor
                  width="100%"
                  height="600"
                  options={options}
                  language="plaintext"
                  theme="vs-dark"
                />
              )}
            </FormItem>
            <FormItem
              {...formItemLayout}
              label={<FormattedMessage id="app.template.type" />}
              help={<FormattedMessage id="app.template.type.help" />}
            >
              {getFieldDecorator('type', {
                initialValue: data.type || '0',
              })(
                <Radio.Group>
                  <Radio value="0">Velocity</Radio>
                  <Radio value="1">Freemarker</Radio>
                </Radio.Group>
              )}
            </FormItem>
            <FormItem {...submitFormLayout} style={{ marginTop: 32 }}>
              <Button type="primary" htmlType="submit" loading={submitting}>
                <FormattedMessage id="form.submit" />
              </Button>
              <Button style={{ marginLeft: 8 }} onClick={this.handleReturn}>
                <FormattedMessage id="form.return" />
              </Button>
            </FormItem>
          </Form>
        </Card>
      </PageHeaderWrapper>
    );
  }
}

export default TemplateForm;
