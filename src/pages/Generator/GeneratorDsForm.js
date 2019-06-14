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

const FormItem = Form.Item;

@connect(({ generator, loading }) => ({
  generator,
  loading: loading.effects['generator/fetchDs'],
  submitting: loading.effects['generator/submitDsForm'],
}))
@Form.create()
class GeneratorDsForm extends PureComponent {
  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'generator/fetchDs',
    });
  }

  handleReturn = () => {
    router.push(`/generator/generator-list`);
  };

  handleSubmit = e => {
    const { dispatch, form } = this.props;
    e.preventDefault();
    form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        dispatch({
          type: 'generator/submitDsForm',
          payload: {
            ...values,
            ds: 'generator',
          },
        });
      }
    });
  };

  render() {
    const {
      loading,
      submitting,
      generator: { datasource },
      form: { getFieldDecorator, getFieldValue },
    } = this.props;

    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 6 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 12 },
      },
    };

    const submitFormLayout = {
      wrapperCol: {
        xs: { span: 24, offset: 0 },
        sm: { span: 10, offset: 7 },
      },
    };

    return (
      <PageHeaderWrapper title={<FormattedMessage id="app.generator.changeDs" />}>
        <Card bordered={false} loading={loading}>
          <Form onSubmit={this.handleSubmit} hideRequiredMark style={{ marginTop: 8 }}>
            <Form.Item
              {...formItemLayout}
              label={<FormattedMessage id="app.generator.currentDs" />}
            >
              <span className="ant-form-text">{datasource.jdbcUrl}</span>
            </Form.Item>
            <FormItem {...formItemLayout} label={<FormattedMessage id="app.generator.jdbcUrl" />}>
              {getFieldDecorator('jdbcUrl', {
                rules: [
                  {
                    required: true,
                    message: formatMessage({ id: 'validation.generator.jdbcUrl' }),
                  },
                ],
              })(
                <Input placeholder={formatMessage({ id: 'app.generator.jdbcUrl.placeholder' })} />
              )}
            </FormItem>
            <FormItem {...formItemLayout} label={<FormattedMessage id="app.generator.username" />}>
              {getFieldDecorator('username', {
                rules: [
                  {
                    required: true,
                    message: formatMessage({ id: 'validation.generator.username' }),
                  },
                ],
              })(
                <Input placeholder={formatMessage({ id: 'app.generator.username.placeholder' })} />
              )}
            </FormItem>
            <FormItem {...formItemLayout} label={<FormattedMessage id="app.generator.password" />}>
              {getFieldDecorator('password')(
                <Input placeholder={formatMessage({ id: 'app.generator.password.placeholder' })} />
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

export default GeneratorDsForm;
