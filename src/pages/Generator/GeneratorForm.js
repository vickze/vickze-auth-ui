import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import moment from 'moment';
import router from 'umi/router';
import { formatMessage, FormattedMessage } from 'umi/locale';
import {
  Row,
  Col,
  Table,
  Card,
  Form,
  Input,
  Select,
  Icon,
  Button,
  Dropdown,
  Menu,
  InputNumber,
  DatePicker,
  Modal,
  message,
  Badge,
  Divider,
  Steps,
  Radio,
  Spin,
} from 'antd';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import { getOrder } from '@/utils/utils';
import styles from '@/pages/TableList.less';

const FormItem = Form.Item;
const { Option } = Select;

@connect(({ generator, config, template, loading }) => ({
  generator,
  config,
  template,
  generatorLoading: loading.effects['generator/fetch'] || loading.effects['generator/appendFetch'],
  configLoading: loading.effects['config/fetch'] || loading.effects['config/appendFetch'],
  templateLoading: loading.effects['template/fetch'] || loading.effects['template/appendFetch'],
  submitting: loading.effects['generator/submitForm'],
}))
@Form.create()
class GeneratorForm extends PureComponent {
  state = {
    //选择的数据库表
    selectedRows: [],
    offset: 0,
    limit: 10,
  };

  componentDidMount() {
    const {
      dispatch,
      generator: { selectedRows },
    } = this.props;

    this.setState({
      selectedRows,
    });

    this.clearList();
  }

  clearList = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'generator/clearList',
    });
    dispatch({
      type: 'config/clearList',
    });
    dispatch({
      type: 'template/clearList',
    });
  };

  handleSearchGenerator = value => {
    const { dispatch, generator } = this.props;
    this.setState({
      offset: 0,
    });

    dispatch({
      type: 'generator/clearList',
    });

    dispatch({
      type: 'generator/fetch',
      payload: {
        tableName: value,
        offset: 0,
        limit: this.state.limit,
      },
    });
  };

  handleBlur = () => {
    this.setState({
      offset: 0,
    });
  }

  handlePopupScrollGenerator = e => {
    const { dispatch, generator } = this.props;
    //是否滚动到底部
    const scrollEnd = e.target.scrollTop + e.target.clientHeight + 1 >= e.target.scrollHeight;
    const generatorEnd = generator.pagination.total <= this.state.offset + this.state.limit;

    if (!generatorEnd && scrollEnd) {
      const { offset, limit } = this.state;
      this.setState({
        offset: offset + limit,
      });

      dispatch({
        type: 'generator/appendFetch',
        payload: {
          offset: offset + limit,
          limit: limit,
        },
      });
    }
  };

  handleSearchConfig = value => {
    const { dispatch, config } = this.props;
    this.setState({
      offset: 0,
    });

    dispatch({
      type: 'config/clearList',
    });

    dispatch({
      type: 'config/fetch',
      payload: {
        name: value,
        offset: 0,
        limit: this.state.limit,
      },
    });
  };

  handlePopupScrollConfig = e => {
    const { dispatch, config } = this.props;
    //是否滚动到底部
    const scrollEnd = e.target.scrollTop + e.target.clientHeight + 1 >= e.target.scrollHeight;
    const configEnd = config.pagination.total <= this.state.offset + this.state.limit;

    if (!configEnd && scrollEnd) {
      const { offset, limit } = this.state;
      this.setState({
        offset: offset + limit,
      });

      dispatch({
        type: 'config/appendFetch',
        payload: {
          offset: offset + limit,
          limit: limit,
        },
      });
    }
  };

  handleSearchTemplate = value => {
    const { dispatch, template } = this.props;
    this.setState({
      offset: 0,
    });

    dispatch({
      type: 'template/clearList',
    });

    dispatch({
      type: 'template/fetch',
      payload: {
        name: value,
        offset: 0,
        limit: this.state.limit,
      },
    });
  };

  handlePopupScrollTemplate = e => {
    const { dispatch, template } = this.props;
    //是否滚动到底部
    const scrollEnd = e.target.scrollTop + e.target.clientHeight + 1 >= e.target.scrollHeight;
    const templateEnd = template.pagination.total <= this.state.offset + this.state.limit;

    if (!templateEnd && scrollEnd) {
      const { offset, limit } = this.state;
      this.setState({
        offset: offset + limit,
      });

      dispatch({
        type: 'template/appendFetch',
        payload: {
          offset: offset + limit,
          limit: limit,
        },
      });
    }
  };

  handleReturn = () => {
    router.push(`/generator/generator-list`);
  };

  handleSubmit = e => {
    const { dispatch, form } = this.props;
    e.preventDefault();
    form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        dispatch({
          type: 'generator/submitForm',
          payload: values,
        });
        this.clearList();
      }
    });
  };

  render() {
    const {
      generator,
      config,
      template,
      generatorLoading,
      configLoading,
      templateLoading,
      submitting,
      form: { getFieldDecorator, getFieldValue },
    } = this.props;

    const { selectedRows, offset } = this.state;

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
      <PageHeaderWrapper title={<FormattedMessage id="app.generator.code" />}>
        <Card bordered={false}>
          <Form onSubmit={this.handleSubmit} hideRequiredMark style={{ marginTop: 8 }}>
            <FormItem {...formItemLayout} label={<FormattedMessage id="app.generator.table" />}>
              {getFieldDecorator('tableNames', {
                initialValue: selectedRows.map(item => item.tableName),
                rules: [
                  { required: true, message: formatMessage({ id: 'validation.generator.table' }) },
                ],
              })(
                <Select
                  mode="multiple"
                  placeholder={formatMessage({ id: 'app.generator.table.placeholder' })}
                  notFoundContent={generatorLoading ? <Spin size="small" /> : null}
                  loading={generatorLoading}
                  filterOption={false}
                  onSearch={this.handleSearchGenerator}
                  onFocus={this.handleSearchGenerator}
                  onBlur={this.handleBlur}
                  style={{ width: '100%' }}
                  onPopupScroll={this.handlePopupScrollGenerator}
                  dropdownRender={menu => (
                    <div>
                      {menu}
                      {offset > 0 && generatorLoading ? (
                        <Spin style={{ padding: '8px' }} size="small" />
                      ) : null}
                    </div>
                  )}
                >
                  {generator.list.map(d => (
                    <Option key={d.tableName}>{d.tableName}</Option>
                  ))}
                </Select>
              )}
            </FormItem>
            <FormItem {...formItemLayout} label={<FormattedMessage id="app.generator.config" />}>
              {getFieldDecorator('configId', {
                rules: [
                  { required: true, message: formatMessage({ id: 'validation.generator.config' }) },
                ],
              })(
                <Select
                  showSearch
                  placeholder={formatMessage({ id: 'app.generator.config.placeholder' })}
                  notFoundContent={configLoading ? <Spin size="small" /> : null}
                  loading={configLoading}
                  filterOption={false}
                  onSearch={this.handleSearchConfig}
                  onFocus={this.handleSearchConfig}
                  style={{ width: '100%' }}
                  onPopupScroll={this.handlePopupScrollConfig}
                  dropdownRender={menu => (
                    <div>
                      {menu}
                      {offset > 0 && configLoading ? (
                        <Spin style={{ padding: '8px' }} size="small" />
                      ) : null}
                    </div>
                  )}
                >
                  {config.list.map(d => (
                    <Option key={d.id}>{d.name}</Option>
                  ))}
                </Select>
              )}
            </FormItem>
            <FormItem {...formItemLayout} label={<FormattedMessage id="app.generator.template" />}>
              {getFieldDecorator('templateIds', {
                rules: [
                  {
                    required: true,
                    message: formatMessage({ id: 'validation.generator.template' }),
                  },
                ],
              })(
                <Select
                  mode="multiple"
                  placeholder={formatMessage({ id: 'app.generator.template.placeholder' })}
                  notFoundContent={templateLoading ? <Spin size="small" /> : null}
                  loading={templateLoading}
                  filterOption={false}
                  onSearch={this.handleSearchTemplate}
                  onFocus={this.handleSearchTemplate}
                  style={{ width: '100%' }}
                  onPopupScroll={this.handlePopupScrollTemplate}
                  dropdownRender={menu => (
                    <div>
                      {menu}
                      {offset > 1 && templateLoading ? (
                        <Spin style={{ padding: '8px' }} size="small" />
                      ) : null}
                    </div>
                  )}
                >
                  {template.list.map(d => (
                    <Option key={d.id}>{d.name}</Option>
                  ))}
                </Select>
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

export default GeneratorForm;
