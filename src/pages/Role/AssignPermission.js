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
  Tree,
  Spin,
  Tag,
} from 'antd';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import { getOrder, getFilterByMap } from '@/utils/utils';
import styles from '@/pages/TableList.less';
import SystemSelect from '@/pages/System/SystemSelect';
import MenuTree from '@/pages/Menu/MenuTree';

const FormItem = Form.Item;


/* eslint react/no-multi-comp:0 */
@connect(({ role, menuResource, loading }) => ({
  role,
  menuResource,
  loading: loading.effects['menuResource/fetch'],
  submitting: loading.effects['role/assignMenuResource'],
}))
@Form.create()
class AssignPermission extends PureComponent {


  constructor(props) {
    super(props);
    this.state = {
      //prop.id modal传进来的， (props.match && props.match.params.id) url 上的
      roleId: props.roleId || (props.match && props.match.params.roleId),
      show: true,
      systemId: '',
      menuResources: [],
      selectedRowKeys: [],
      selectedMenuId: '',
    };
  }

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'menu/save',
      payload: {
        systemMenuData: [],
      },
    });
    dispatch({
      type: 'menuResource/clearList',
    });

  }

  handleSystemSelect = (systemId) => {
    const { dispatch } = this.props;
    const { roleId } = this.state;
    this.setState({
      systemId,
    });
    dispatch({
      type: 'role/fetchMenuResources',
      payload: {
        roleId,
        systemId
      },
      callback: response => {
        this.setState({
          menuResources: response,
        });
      },
    });
    dispatch({
      type: 'menu/fetchSystemMenuData',
      payload: {
        systemId,
      },
    });
  }

  handleSubmit = () => {
    const { dispatch } = this.props;

    const { menuResources, roleId, systemId } = this.state;

    dispatch({
      type: 'role/assignMenuResource',
      payload: {
        roleId,
        systemId,
        menuResourceIds: menuResources.map(m => m.id),
      },
      callback: () => {
        this.handleCancel();
      },
    });
  };

  handleCancel = () => {
    this.setState({
      show: false,
    });
    const { dispatch } = this.props;
    dispatch({
      type: 'menuResource/clearList',
    });
  };

  handleReturn = () => {
    router.push("/role/role-list");
  };

  onExpand = expandedKeys => {
    this.setState({
      expandedKeys,
      autoExpandParent: false,
    });
  };


  onTreeSelect = (flag, selectedMenuId) => {
    //不含子节点
    if (flag) {
      this.setState({
        selectedMenuId: selectedMenuId,
      });

      const {
        menuResource: { pagination, queryParams },
      } = this.props;
      const queryParamsTemp = {
        ...queryParams,
        fieldsValue: {
          menuId: selectedMenuId,
        },
      };
      this.saveQueryParams({
        ...queryParamsTemp,
      });
      this.queryList(pagination, queryParamsTemp);
    } else {
      const { dispatch } = this.props;
      dispatch({
        type: 'menuResource/clearList',
      });
      this.setState({
        selectedMenuId: '',
      });
    }
    //console.log(JSON.stringify(e, null,2));
  };

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
      type: 'menuResource/fetch',
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
      type: 'menuResource/saveQueryParams',
      payload: queryParams,
    });
  };

  handleSearch = () => {
    //e.preventDefault();

    const {
      form,
      menuResource: { pagination, queryParams },
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

  handleSelect = (record, selected) => {
    console.log(record);
    console.log(selected);
    let { menuResources } = this.state;
    if (selected) {
      if (!menuResources.find(m => m.id === record.id)) {
        menuResources.push(record);
      }
    } else {
      menuResources = menuResources.filter(m => m.id !== record.id);
    }
    console.log(menuResources);
    this.setState({
      menuResources: menuResources,
    });
  };

  handleSelectAll = (selected, selectedRows) => {
    console.log(selected);
    console.log(selectedRows);
    let { menuResources } = this.state;
    if (selected) {
      selectedRows.forEach(row => {
        if (!menuResources.find(m => m.id === row.id)) {
          menuResources.push(row);
        }
        this.setState({
          menuResources: menuResources,
        });
      });
    } else {
      menuResources = menuResources.filter(m => !selectedRows.find(row => row.id === m.id));
      this.setState({
        menuResources: menuResources,
        selectedRowKeys: [],
      });
    }
  };

  handleTableChange = (paginationArg, filtersArg, sorter) => {
    const {
      menuResource: { queryParams },
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
    const { selectedMenuId } = this.state;
    return (
      <Form layout="inline">
        {getFieldDecorator('menuId', { initialValue: selectedMenuId })(<Input hidden />)}
      </Form>
    );
  };

  renderFooter = () => {
    const { submitting } = this.props;
    return [
      <Button
        key="submit"
        type="primary"
        htmlType="submit"
        loading={submitting}
        onClick={this.handleSubmit}
      >
        <FormattedMessage id="form.submit" />
      </Button>,
      <Button key="cancel" style={{ marginLeft: 8 }} onClick={this.handleCancel}>
        <FormattedMessage id="form.cancel" />
      </Button>,
    ];
  };

  render() {
    const {
      menuResource: { list, pagination, queryParams },
      loading,
      submitting,
      roleMenuPermissionLoading,
      afterClose,
    } = this.props;

    const {
      roleId,
      menuResources,
      show,
      selectedRowKeys,
      selectedMenuId,
    } = this.state;

    list.forEach(o => {
      if (menuResources.find(m => m.id === o.id)) {
        selectedRowKeys.push(o.id);
      }
    });

    const rowSelection = {
      selectedRowKeys,
      onChange: this.handleSelectRows,
      onSelect: this.handleSelect,
      onSelectAll: this.handleSelectAll,
    };

    const columns = [
      {
        title: 'ID',
        dataIndex: 'id',
        render: val => <a onClick={() => this.profile(val)}>{val}</a>,
      },
      {
        title: formatMessage({ id: 'app.menuResource.menuId' }),
        dataIndex: 'menuId',
      },
      {
        title: formatMessage({ id: 'app.menuResource.name' }),
        dataIndex: 'name',
      },
      {
        title: formatMessage({ id: 'app.menuResource.permission' }),
        dataIndex: 'permission',
      },
      {
        title: formatMessage({ id: 'app.menuResource.interfaces' }),
        dataIndex: 'interfaces',
        render: val => val.map((item, index) => {
          if (item.interfaceMethod === 'GET') {
            return <Tag key={index} style={{ marginBottom: 5 }} color="magenta">{item.interfaceMethod} {item.interfaceUri}</Tag>
          }
          if (item.interfaceMethod === 'POST') {
            return <Tag key={index} style={{ marginBottom: 5 }} color="blue">{item.interfaceMethod} {item.interfaceUri}</Tag>
          }
          if (item.interfaceMethod === 'PUT') {
            return <Tag key={index} style={{ marginBottom: 5 }} color="green">{item.interfaceMethod} {item.interfaceUri}</Tag>
          }
          return <Tag key={index} style={{ marginBottom: 5 }} color="red">{item.interfaceMethod} {item.interfaceUri}</Tag>
        }),
      },
    ];

    return (
      afterClose ?
        <Modal
          width={1000}
          bodyStyle={{ padding: '32px 40px 48px' }}
          destroyOnClose
          title={formatMessage({ id: 'menu.menuResource.menuResourceList' })}
          visible={show}
          footer={this.renderFooter()}
          onCancel={this.handleCancel}
          afterClose={() => afterClose()}
        >
          <Card bordered={false}>
            <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
              <Col span={6}>
                <SystemSelect onSelect={this.handleSystemSelect} />
                <MenuTree onSelect={this.onTreeSelect} />
              </Col>
              <Col span={18}>
                <div className={styles.tableList}>
                  {this.renderSearchForm(queryParams.fieldsValue)}
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
              </Col>
            </Row>
          </Card>
        </Modal>
        :
        <PageHeaderWrapper title={formatMessage({ id: 'menu.menuResource.menuResourceList' })}>
          <Card bordered={false}>
            <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
              <Col span={6}>
                <SystemSelect onSelect={this.handleSystemSelect} />
                <MenuTree onSelect={this.onTreeSelect} />
              </Col>
              <Col span={18}>
                <div className={styles.tableList}>
                  {this.renderSearchForm(queryParams.fieldsValue)}
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
              </Col>
            </Row>
            <Row style={{ marginTop: 10 }}>
              <Col span={24} style={{ textAlign: 'right' }}>
                <Button
                  key="submit"
                  type="primary"
                  htmlType="submit"
                  loading={submitting}
                  onClick={this.handleSubmit}
                >
                  <FormattedMessage id="form.submit" />
                </Button>
                <Button key="cancel" style={{ marginLeft: 8 }} onClick={this.handleReturn}>
                  <FormattedMessage id="form.return" />
                </Button>
              </Col>
            </Row>
          </Card>
        </PageHeaderWrapper>
    );
  }
}

export default AssignPermission;
