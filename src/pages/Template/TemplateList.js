import React, { PureComponent } from 'react';
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
} from 'antd';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import { getOrder, getFilterByMap } from '@/utils/utils';
import styles from '@/pages/TableList.less';

const FormItem = Form.Item;

const typeMap = new Map([[0, 'Velocity'], [1, 'Freemarker']]);
const typeFilter = getFilterByMap(typeMap);

/* eslint react/no-multi-comp:0 */
@connect(({ template, loading }) => ({
  template,
  loading: loading.effects['template/fetch'],
}))
@Form.create()
class TemplateList extends PureComponent {
  state = {
    selectedRowKeys: [],
  };

  componentDidMount() {
    const {
      template: { list, pagination, queryParams },
    } = this.props;

    this.queryList(pagination, queryParams);
  }

  queryList = (pagination, queryParams) => {
    let sorter;
    if (queryParams.sorter) {
      sorter = {
        field: queryParams.sorter.field,
        order: getOrder(queryParams.sorter.order),
      };
    }

    const { dispatch } = this.props;

    dispatch({
      type: 'template/fetch',
      payload: {
        ...queryParams.fieldsValue,
        ...queryParams.filters,
        ...sorter,
        offset: (pagination.current - 1) * pagination.pageSize,
        limit: pagination.pageSize,
      },
    });
  };

  saveQueryParams = queryParams => {
    const { dispatch } = this.props;
    dispatch({
      type: 'template/saveQueryParams',
      payload: queryParams,
    });
  };

  addOrEdit = id => {
    if (id) {
      router.push(`/template/template-form/${id}`);
    } else {
      router.push(`/template/template-form`);
    }
  };

  duplicate = id => {
    router.push(`/template/template-form/duplicate/${id}`);
  };

  profile = id => {
    router.push(`/template/template-profile/${id}`);
  };

  delete = id => {
    const ids = [];
    ids.push(id);
    this.deleteBatch(ids);
  };

  deleteBatch = ids => {
    Modal.confirm({
      title: formatMessage({ id: 'modal.delete' }),
      content: formatMessage({ id: 'modal.deleteConfirm' }),
      okText: formatMessage({ id: 'modal.confirm' }),
      cancelText: formatMessage({ id: 'modal.cancel' }),
      onOk: () => {
        const { dispatch } = this.props;
        dispatch({
          type: 'template/deleteByIds',
          payload: ids,
          callback: response => {
            this.setState({
              selectedRowKeys: [],
            });
            const {
              template: { pagination, queryParams },
            } = this.props;

            this.queryList(pagination, queryParams);
          },
        });
      },
    });
  };

  handleSearch = e => {
    e.preventDefault();

    const {
      form,
      template: { pagination, queryParams },
    } = this.props;

    form.validateFields((err, fieldsValue) => {
      if (err) return;

      const queryParamsTemp = {
        ...queryParams,
        fieldsValue: fieldsValue,
      };
      this.saveQueryParams({
        ...queryParamsTemp,
      });

      this.queryList(pagination, queryParamsTemp);
    });
  };

  handleSelectRows = (selectedRowKeys, selectedRows) => {
    this.setState({
      selectedRowKeys: selectedRowKeys,
    });
  };

  handleTableChange = (paginationArg, filtersArg, sorter) => {
    const {
      template: { queryParams },
    } = this.props;

    const queryParamsTemp = {
      ...queryParams,
      filters: filtersArg,
      sorter: sorter,
    };
    this.saveQueryParams({
      ...queryParamsTemp,
    });

    this.queryList(paginationArg, queryParamsTemp);
  };

  renderSearchForm = fieldsValue => {
    const {
      form: { getFieldDecorator },
    } = this.props;
    return (
      <Form onSubmit={this.handleSearch} layout="inline">
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col md={8} sm={24}>
            <FormItem label={<FormattedMessage id="app.template.name" />}>
              {getFieldDecorator('name', {
                initialValue: fieldsValue && fieldsValue.name,
              })(<Input placeholder={formatMessage({ id: 'app.template.name.placeholder' })} />)}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <span className={styles.submitButtons}>
              <Button type="primary" htmlType="submit">
                <FormattedMessage id="table.search" />
              </Button>
            </span>
          </Col>
        </Row>
      </Form>
    );
  };

  render() {
    const {
      template: { list, pagination, queryParams },
      loading,
    } = this.props;

    const { selectedRowKeys } = this.state;

    const rowSelection = {
      selectedRowKeys,
      onChange: this.handleSelectRows,
    };

    const columns = [
      {
        title: 'ID',
        dataIndex: 'id',
        render: val => <a onClick={() => this.profile(val)}>{val}</a>,
      },
      {
        title: formatMessage({ id: 'app.template.name' }),
        dataIndex: 'name',
      },
      {
        title: formatMessage({ id: 'app.template.fileName' }),
        dataIndex: 'fileName',
      },
      {
        title: formatMessage({ id: 'app.template.type' }),
        dataIndex: 'type',
        filters: typeFilter,
        filterMultiple: true, 
        filteredValue: (queryParams && queryParams.filters && queryParams.filters.type) || [],
        render: val => `${typeMap.get(val)}`,
      },
      {
        title: formatMessage({ id: 'table.createTime' }),
        dataIndex: 'createTime',
        sorter: true,
        sortOrder:
          queryParams &&
          queryParams.sorter &&
          queryParams.sorter.field === 'createTime' &&
          queryParams.sorter.order,
        render: val => moment(val).format('YYYY-MM-DD HH:mm:ss'),
      },
      {
        title: formatMessage({ id: 'table.updateTime' }),
        dataIndex: 'updateTime',
        sorter: true,
        sortOrder:
          queryParams &&
          queryParams.sorter &&
          queryParams.sorter.field === 'updateTime' &&
          queryParams.sorter.order,
        render: val => moment(val).format('YYYY-MM-DD HH:mm:ss'),
      },
      {
        title: formatMessage({ id: 'table.operation' }),
        render: (text, record) => (
          <span>
            <a
              onClick={e => {
                e.preventDefault();
                this.addOrEdit(record.id);
              }}
            >
              <FormattedMessage id="table.edit" />
            </a>
            <Divider type="vertical" />
            <MoreBtn current={record.id} />
          </span>
        ),
      },
    ];

    const MoreBtn = props => (
      <Dropdown
        overlay={
          <Menu>
            <Menu.Item key="info" onClick={() => this.profile(props.current)}>
              <FormattedMessage id="table.info" />
            </Menu.Item>
            <Menu.Item key="edit" onClick={() => this.addOrEdit(props.current)}>
              <FormattedMessage id="table.edit" />
            </Menu.Item>
            <Menu.Item key="duplicate" onClick={() => this.duplicate(props.current)}>
              <FormattedMessage id="table.duplicate" />
            </Menu.Item>
            <Menu.Item key="delete" onClick={() => this.delete(props.current)}>
              <FormattedMessage id="table.delete" />
            </Menu.Item>
          </Menu>
        }
      >
        <a>
          <FormattedMessage id="table.more" /> <Icon type="down" />
        </a>
      </Dropdown>
    );

    return (
      <PageHeaderWrapper title={formatMessage({ id: 'menu.template.templateList' })}>
        <Card bordered={false}>
          <div className={styles.tableList}>
            <div className={styles.tableListForm}>
              {this.renderSearchForm(queryParams.fieldsValue)}
            </div>
            <div className={styles.tableListOperator}>
              <Button icon="plus" type="primary" onClick={() => this.addOrEdit()}>
                <FormattedMessage id="table.add" />
              </Button>
              {selectedRowKeys.length > 0 && (
                <span>
                  <Button type="danger" onClick={() => this.deleteBatch(selectedRowKeys)}>
                    <FormattedMessage id="table.deleteBatch" />
                  </Button>
                </span>
              )}
            </div>
            <Table
              loading={loading}
              rowKey="id"
              dataSource={list}
              pagination={pagination}
              columns={columns}
              rowSelection={rowSelection}
              onChange={this.handleTableChange}
            />
          </div>
        </Card>
      </PageHeaderWrapper>
    );
  }
}

export default TemplateList;
