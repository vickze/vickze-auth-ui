import React, { PureComponent, Children } from 'react';
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
  Modal,
  TreeSelect,
} from 'antd';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import SystemSelect from '@/pages/System/SystemSelect';

const FormItem = Form.Item;
const { TextArea } = Input;

@connect(({ menu, loading }) => ({
  menu,
  loading: loading.effects['menu/fetchById'],
  submitting: loading.effects['menu/submitForm'],
}))
@Form.create()
class MenuForm extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      data: {},
      show: true,
    }
  }

  componentDidMount() {
    const { dispatch, id } = this.props;
    if (id) {
      dispatch({
        type: 'menu/fetchById',
        payload: id,
        callback: (response) => {
          this.setState({
            data: response || {},
          });
        }
      });
    }
  }

  handleCancel = () => {
    this.setState({
      show: false,
    })
  }

  handleSubmit = e => {
    const {
      dispatch,
      form,
      duplicate,
    } = this.props;
    e.preventDefault();
    form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        if (duplicate) {
          delete values.id;
        }
        dispatch({
          type: 'menu/submitForm',
          payload: values,
          callback: (response) => {
            this.handleCancel();
            const { queryList } = this.props;
            queryList();
          },
        });
      }
    });
  };

  renderFooter = () => {
    const { submitting } = this.props;
    return [
      <Button key="submit" type="primary" htmlType="submit" loading={submitting} onClick={this.handleSubmit}>
        <FormattedMessage id="form.submit" />
      </Button>,
      <Button key="cancel" style={{ marginLeft: 8 }} onClick={this.handleCancel}>
        <FormattedMessage id="form.cancel" />
      </Button>
    ];
  }

  checkSystem = (rule, value, callback) => {
    if (value.systemId) {
      callback();
      return;
    }
    callback(formatMessage({ id: 'validation.menuResource.interfaces.uri' }));
  };

  render() {
    const {
      loading,
      submitting,
      id,
      parentId,
      menu: { systemMenuData },
      form: { getFieldDecorator, getFieldValue },
      systemId,
      duplicate,
      afterClose,
    } = this.props;

    const { data , show } = this.state;

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

    const treeSelectLoop = data => {
      if (!data) {
        return null;
      }
      return data.map(item => {
        return {
          title: item.name,
          key: item.id,
          value: item.id,
          children: treeSelectLoop(item.children),
        }
      })
    }

    return (
      <Modal
        width={640}
        bodyStyle={{ padding: '32px 40px 48px' }}
        destroyOnClose
        title={!id || duplicate ? <FormattedMessage id="app.menu.add.title" /> : <FormattedMessage id="app.menu.edit.title" />}
        visible={show}
        footer={this.renderFooter()}
        onCancel={this.handleCancel}
        afterClose={() => afterClose()}
      >
        <Card bordered={false} loading={loading}>
          <Form hideRequiredMark style={{ marginTop: 8 }}>
            {getFieldDecorator('id', { initialValue: data.id })
              (<Input hidden />)}
            <FormItem {...formItemLayout} label={<FormattedMessage id="app.menu.systemId" />}>
              {getFieldDecorator('systemId', {
                initialValue: systemId || data.systemId,
                rules: [
                  {
                    required: true,
                    message: formatMessage({ id: 'validation.menu.systemId' }),
                  },
                ],
              })(<SystemSelect />)}
            </FormItem>
            <FormItem {...formItemLayout} label={<FormattedMessage id="app.menu.parentId" />}>
              {getFieldDecorator('parentId', {
                initialValue: parentId || data.parentId,
              })(
                <TreeSelect style={{ width: '100%' }}
                  treeData={treeSelectLoop(systemMenuData)}
                  placeholder={formatMessage({ id: 'app.menu.parentId.placeholder' })}
                  treeDefaultExpandAll
                />)}
            </FormItem>
            <FormItem {...formItemLayout} label={<FormattedMessage id="app.menu.name" />}>
              {getFieldDecorator('name', {
                initialValue: data.name,
                rules: [
                  {
                    required: true,
                    message: formatMessage({ id: 'validation.menu.name' }),
                  },
                ],
              })(<Input placeholder={formatMessage({ id: 'app.menu.name.placeholder' })} />)}
            </FormItem>
          </Form>
        </Card>
      </Modal>
    );
  }
}

export default MenuForm;
