import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { message } from 'antd';
import router from 'umi/router';
import { formatMessage, FormattedMessage } from 'umi/locale';
import {
  Row,
  Col,
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
} from 'antd';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';

const FormItem = Form.Item;
const { TextArea } = Input;


class InterfaceInput extends React.Component {
  static getDerivedStateFromProps(nextProps) {
    // Should be a controlled component.
    if ('value' in nextProps) {
      return {
        ...(nextProps.value || {}),
      };
    }
    return null;
  }

  constructor(props) {
    super(props);

    const value = props.value || {};
    this.state = {
      uri: value.uri || '',
      method: value.method || 'GET',
    };
  }

  handleUriChange = e => {
    const uri = e.target.value;
    if (!('value' in this.props)) {
      this.setState({ uri });
    }
    this.triggerChange({ uri });
  };

  handleMethodChange = method => {
    if (!('value' in this.props)) {
      this.setState({ method });
    }
    this.triggerChange({ method });
  };

  triggerChange = changedValue => {
    // Should provide an event to pass value to Form.
    const onChange = this.props.onChange;
    if (onChange) {
      onChange(Object.assign({}, this.state, changedValue));
    }
  };

  render() {
    const { size, placeholder } = this.props;
    const state = this.state;
    return (
      <span>
        <Input
          type="text"
          size={size}
          placeholder={placeholder}
          value={state.uri}
          onChange={this.handleUriChange}
          style={{ width: '67%', marginRight: '3%' }}
        />
        <Select
          value={state.method}
          size={size}
          style={{ width: '22%', marginRight: '3%' }}
          onChange={this.handleMethodChange}
        >
          <Option value="GET">GET</Option>
          <Option value="POST">POST</Option>
          <Option value="PUT">PUT</Option>
          <Option value="DELETE">DELETE</Option>
        </Select>
      </span>
    );
  }
}


@connect(({ menuResource, loading }) => ({
  menuResource,
  loading: loading.effects['menuResource/fetchById'],
  submitting: loading.effects['menuResource/submitForm'],
}))
@Form.create()
class MenuResourceForm extends PureComponent {
  state = {
    show: true,
    data: {
      interfaces: [{
        uri: '',
        method: 'GET',
      }],
    },
  }
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    const { dispatch, id } = this.props;
    if (id) {
      dispatch({
        type: 'menuResource/fetchById',
        payload: id,
        callback: (response) => {
          this.setState({
            data: {
              ...response,
              interfaces: response.interfaces.map(item => {
                return {
                  uri: item.interfaceUri,
                  method: item.interfaceMethod,
                }
              }),
            },
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
          type: 'menuResource/submitForm',
          payload: {
            ...values,
            interfaces: values.interfaces.map(item => {
              return {
                interfaceUri: item.uri,
                interfaceMethod: item.method,
              }
            }),
          },
          callback: (response) => {
            this.handleCancel();
            const {
              queryList,
              menuResource: {
                pagination, queryParams
              },
            } = this.props;
            queryList(pagination, queryParams);
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

  addInterfacesFormItem = () => {
    const { data } = this.state;
    this.setState({
      data: {
        ...data,
        interfaces: data.interfaces.concat({
          uri: '',
          method: 'GET',
        }),
      },
    });
  }

  removeInterfacesFormItem = (i) => {
    const { data } = this.state;
    //delete 数组长度不变，下标元素值为undefine
    delete data.interfaces[i];
    this.setState({
      data: {
        ...data,
        interfaces:  data.interfaces.filter(item => item),
      }
    });
  }

  checkUri = (rule, value, callback) => {
    if (value.uri) {
      callback();
      return;
    }
    callback(formatMessage({ id: 'validation.menuResource.interfaces.uri' }));
  };

  render() {
    const {
      loading,
      submitting,
      form: { getFieldDecorator, getFieldValue },
      id,
      menuId,
      systemId,
      duplicate,
      afterClose,
    } = this.props;

    const { show, data } = this.state;

    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 4 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 20 },
      },
    };
    const formItemLayoutWithOutLabel = {
      wrapperCol: {
        xs: { span: 24, offset: 0 },
        sm: { span: 20, offset: 4 },
      },
    };

    const submitFormLayout = {
      wrapperCol: {
        xs: { span: 24, offset: 0 },
        sm: { span: 10, offset: 7 },
      },
    };

    const interfacesFormItem = data.interfaces.map((value, i) => {
      return (
        <FormItem {...(i === 0 ? formItemLayout : formItemLayoutWithOutLabel)} label={i === 0 ? <FormattedMessage id="app.menuResource.interfaces" /> : null}>
          {getFieldDecorator(`interfaces[${i}]`, {
            initialValue: value,
            rules: [{ validator: this.checkUri }],
          })(<InterfaceInput placeholder={formatMessage({ id: 'app.menuResource.interfaces.uri' })} />)}
          {data.interfaces.length > 1 ? (
            <Icon
              className="dynamic-delete-button"
              type="minus-circle-o"
              onClick={() => this.removeInterfacesFormItem(i)}
            />
          ) : null}
        </FormItem>
      )
    })

    return (
      <Modal
        width={640}
        bodyStyle={{ padding: '32px 40px 48px' }}
        destroyOnClose
        title={!id || duplicate ? <FormattedMessage id="app.menuResource.add.title" /> : <FormattedMessage id="app.menuResource.edit.title" />}
        visible={show}
        footer={this.renderFooter()}
        onCancel={this.handleCancel}
        afterClose={() => afterClose()}
      >
        <Card bordered={false} loading={loading}>
          <Form hideRequiredMark style={{ marginTop: 8 }}>
            {getFieldDecorator('id', { initialValue: data.id })
              (<Input hidden />)}
            {getFieldDecorator('menuId', { initialValue: data.menuId || menuId })(
              <Input hidden />
            )}
            {getFieldDecorator('systemId', { initialValue: data.systemId || systemId })(
              <Input hidden />
            )}
            <FormItem {...formItemLayout} label={<FormattedMessage id="app.menuResource.name" />}>
              {getFieldDecorator('name', {
                initialValue: data.name,
                rules: [
                  {
                    required: true,
                    message: formatMessage({ id: 'validation.menuResource.name' }),
                  },
                ],
              })(<Input style={{ width: '95%' }} placeholder={formatMessage({ id: 'app.menuResource.name.placeholder' })} />)}
            </FormItem>
            <FormItem {...formItemLayout} label={<FormattedMessage id="app.menuResource.permission" />}>
              {getFieldDecorator('permission', {
                initialValue: data.permission,
                rules: [
                  {
                    required: true,
                    message: formatMessage({ id: 'validation.menuResource.permission' }),
                  },
                ],
              })(<Input style={{ width: '95%' }} placeholder={formatMessage({ id: 'app.menuResource.permission.placeholder' })} />)}
            </FormItem>
            {interfacesFormItem}
            <Form.Item {...formItemLayoutWithOutLabel}>
              <Button type="dashed" onClick={this.addInterfacesFormItem} style={{ width: '95%' }}>
                <Icon type="plus" /> Add field
              </Button>
            </Form.Item>
          </Form>
        </Card>
      </Modal>
    );
  }
}

export default MenuResourceForm;
