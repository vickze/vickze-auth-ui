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
import Authorized from '@/utils/Authorized';
import { getOrder, getFilterByMap } from '@/utils/utils';
import styles from '@/pages/TableList.less';
import RoleForm from '@/pages/Role/RoleForm';
import RoleProfile from '@/pages/Role/RoleProfile';
import AssignPermission from '@/pages/Role/AssignPermission';

const FormItem = Form.Item;


/* eslint react/no-multi-comp:0 */
@connect(({ role, loading }) => ({
  role,
  loading: loading.effects['role/fetch'],
}))
@Form.create()
class RoleList extends PureComponent {
  state = {
    selectedRowKeys: [],
    selectedId: '',
    duplicate: false,
    formShow: false,
    profileShow: false,
    assignPermissonShow: false,
  };

  componentDidMount() {
    const {
      role: { list, pagination, queryParams },
    } = this.props;

    this.queryList(pagination, queryParams);
  }

  queryList = (pagination, queryParams) => {
    let sorter;
    if (queryParams.sorter) {
      sorter = {
        field: queryParams.sorter.field,
        order: getOrder(queryParams.sorter.order),
      }
    }

    const { dispatch } = this.props;

    dispatch({
      type: 'role/fetch',
      payload: {
        ...queryParams.fieldsValue,
        ...queryParams.filters,
        ...sorter,
        offset: (pagination.current - 1) * pagination.pageSize,
        limit: pagination.pageSize,
      },
    });
  }

  saveQueryParams = (queryParams) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'role/saveQueryParams',
      payload: queryParams,
    });
  }


  assignPermisson = (id) => {
    this.setState({
      selectedId: id,
      assignPermissonShow: true,
    });
  }

  afterAssignPermissionClose = () => {
    this.setState({
      selectedId: '',
      assignPermissonShow: false,
    });
  };


  addOrEdit = id => {
    if (id) {
      this.setState({
        selectedId: id,
        formShow: true,
      });
    } else {
      this.setState({
        formShow: true,
      });
    }
  }

  duplicate = (id) => {
    this.setState({
      selectedId: id,
      duplicate: true,
      formShow: true,
    });
  }

  afterFormClose = () => {
    this.setState({
      selectedId: '',
      duplicate: false,
      formShow: false,
    });
  }

  profile = id => {
    this.setState({
      selectedId: id,
      profileShow: true,
    });
  }

  afterProfileClose = () => {
    this.setState({
      selectedId: '',
      profileShow: false,
    });
  }

  delete = (id) => {
    const ids = [];
    ids.push(id);
    this.deleteBatch(ids);
  }


  deleteBatch = (ids) => {
    Modal.confirm({
      title: formatMessage({ id: 'modal.delete' }),
      content: formatMessage({ id: 'modal.deleteConfirm' }),
      okText: formatMessage({ id: 'modal.confirm' }),
      cancelText: formatMessage({ id: 'modal.cancel' }),
      onOk: () => {
        const { dispatch } = this.props;
        dispatch({
          type: 'role/deleteByIds',
          payload: ids,
          callback: (response) => {
            this.setState({
              selectedRowKeys: [],
            });
            const {
              role: { pagination, queryParams },
            } = this.props;

            this.queryList(pagination, queryParams);
          },
        });
      },
    })
  }

  handleSearch = e => {
    e.preventDefault();

    const {
      form,
      role: { pagination, queryParams },
    } = this.props;

    form.validateFields((err, fieldsValue) => {
      if (err) return;

      const queryParamsTemp = {
        ...queryParams,
        fieldsValue: fieldsValue,
      }
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
      role: { queryParams }
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
            <FormItem label={<FormattedMessage id="app.role.name" />}>
              {getFieldDecorator('name', {
                initialValue: fieldsValue && fieldsValue.name,
              })(<Input placeholder={formatMessage({ id: 'app.role.name.placeholder' })} />)}
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
  }

  render() {
    const {
      role: {
        list, pagination, queryParams
      },
      loading,
    } = this.props;


    const {
      selectedRowKeys, selectedId, duplicate, formShow, profileShow, assignPermissonShow,
    } = this.state;

    const rowSelection = {
      selectedRowKeys,
      onChange: this.handleSelectRows,
    };

    const columns = [
      {
        title: 'ID',
        dataIndex: 'id',
        render: val => <a onClick={() => this.profile(val)}>{val}</a>
      },
      {
        title: formatMessage({ id: 'app.role.name' }),
        dataIndex: 'name',
      },
      {
        title: formatMessage({ id: 'app.role.remark' }),
        dataIndex: 'remark',
      },
      {
        title: formatMessage({ id: 'table.createTime' }),
        dataIndex: 'createTime',
        sorter: true,
        sortOrder: queryParams && queryParams.sorter && queryParams.sorter.field === 'createTime' && queryParams.sorter.order,
        render: val => moment(val).format('YYYY-MM-DD HH:mm:ss'),
      },
      {
        title: formatMessage({ id: 'table.updateTime' }),
        dataIndex: 'updateTime',
        sorter: true,
        sortOrder: queryParams && queryParams.sorter && queryParams.sorter.field === 'updateTime' && queryParams.sorter.order,
        render: val => moment(val).format('YYYY-MM-DD HH:mm:ss'),
      },
      {
        title: formatMessage({ id: 'table.operation' }),
        render: (text, record) => (
          <span>
            <Authorized authority={['auth:role:edit']}>
              <a onClick={e => {
                e.preventDefault();
                this.addOrEdit(record.id);
              }
              }>
                <FormattedMessage id="table.edit" />
              </a>
              <Divider type="vertical" />
            </Authorized>
            <Authorized authority={['auth:role:profile', 'auth:role:edit', 'auth:role:duplicate', 'auth:role:delete']}>
              <MoreBtn current={record.id} />
            </Authorized>
          </span>
        ),
      }
    ];

    const MoreBtn = props => (
      <Dropdown
        overlay={
          <Menu>
            {Authorized.check(['auth:role:profile'], <Menu.Item key="info" onClick={() => this.profile(props.current)}><FormattedMessage id="table.info" /></Menu.Item>)}
            {Authorized.check(['auth:role:edit'], <Menu.Item key="edit" onClick={() => this.addOrEdit(props.current)}><FormattedMessage id="table.edit" /></Menu.Item>)}
            {Authorized.check(['auth:role:duplicate'], <Menu.Item key="duplicate" onClick={() => this.duplicate(props.current)}><FormattedMessage id="table.duplicate" /></Menu.Item>)}
            {Authorized.check(['auth:role:delete'], <Menu.Item key="delete" onClick={() => this.delete(props.current)}><FormattedMessage id="table.delete" /></Menu.Item>)}
          </Menu>
        }
      >
        <a>
          <FormattedMessage id="table.more" /> <Icon type="down" />
        </a>
      </Dropdown>
    );

    return (
      <PageHeaderWrapper title={formatMessage({ id: 'menu.role.roleList' })}>
        <Card bordered={false}>
          <div className={styles.tableList}>
            <div className={styles.tableListForm}>{this.renderSearchForm(queryParams.fieldsValue)}</div>
            <div className={styles.tableListOperator}>
              <Authorized authority={['auth:role:add']}>
                <Button icon="plus" type="primary" onClick={() => this.addOrEdit()} >
                  <FormattedMessage id="table.add" />
                </Button>
              </Authorized>
              <Authorized authority={['auth:role:assignPermission']}>
              {selectedRowKeys.length == 1 && (
                <span>
                  <Button icon="assign" type="primary" onClick={() => this.assignPermisson(selectedRowKeys[0])} >
                    <FormattedMessage id="app.role.assign" />
                  </Button>
                </span>
              )}
              </Authorized>
              <Authorized authority={['auth:role:delete']}>
                {selectedRowKeys.length > 0 && (
                  <span>
                    <Button type="danger" onClick={() => this.deleteBatch(selectedRowKeys)}><FormattedMessage id="table.deleteBatch" /></Button>
                  </span>
                )}
              </Authorized>
            </div>
            <Table
              loading={loading}
              rowKey='id'
              dataSource={list}
              pagination={pagination}
              columns={columns}
              rowSelection={rowSelection}
              onChange={this.handleTableChange}
            />
          </div>
        </Card>
        {formShow ? <RoleForm
          id={selectedId}
          duplicate={duplicate}
          afterClose={this.afterFormClose}
          queryList={this.queryList}
        /> : null}
        {profileShow ? <RoleProfile
          id={selectedId}
          afterClose={this.afterProfileClose}
        /> : null}
        {assignPermissonShow ?
          <AssignPermission
            roleId={selectedId}
            show={assignPermissonShow}
            afterClose={this.afterAssignPermissionClose}
          /> : null}
      </PageHeaderWrapper>
    );
  }
}

export default RoleList;