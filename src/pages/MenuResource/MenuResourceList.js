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
import Authorized from '@/utils/Authorized';
import { getOrder, getFilterByMap } from '@/utils/utils';
import styles from '@/pages/TableList.less';
import MenuResourceForm from '@/pages/MenuResource/MenuResourceForm';
import MenuResourceProfile from '@/pages/MenuResource/MenuResourceProfile';
import SystemSelect from '@/pages/System/SystemSelect';
import MenuTree from '@/pages/Menu/MenuTree';

const FormItem = Form.Item;


/* eslint react/no-multi-comp:0 */
@connect(({ menuResource, loading }) => ({
  menuResource,
  loading: loading.effects['menuResource/fetch'],
}))
@Form.create()
class MenuResourceList extends PureComponent {
  state = {
    selectedRowKeys: [],
    selectedId: '',
    duplicate: false,
    formShow: false,
    profileShow: false,
    selectedSystemId: '',
    selectedMenuId: '',
  };

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'menu/save',
      payload: {
        systemMenuData: [],
      },
    })
    dispatch({
      type: 'menuResource/clearList',
    });
  }

  handleSystemSelect = (systemId) => {
    this.setState({
      selectedSystemId: systemId,
    });
    const { dispatch } = this.props;
    dispatch({
      type: 'menu/fetchSystemMenuData',
      payload: {
        systemId,
      },
    });
  }

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

  addOrEdit = id => {
    const { selectedMenuId } = this.state;
    if (!selectedMenuId) {
      message.error('请选中无下级的菜单');
      return;
    }
    if (id) {
      this.setState({
        selectedId: id,
      });
      this.handleFormShow(true);
    } else {
      this.handleFormShow(true);
    }
  };

  duplicate = id => {
    this.setState({
      selectedId: id,
      duplicate: true,
    });
    this.handleFormShow(true);
  };

  afterFormClose = () => {
    this.setState({
      selectedId: '',
      duplicate: false,
      formShow: false,
    });
  }

  handleFormShow = flag => {
    if (!flag) {
      const { dispatch } = this.props;
      this.setState({
        selectedId: '',
        duplicate: false,
      });
    }
    this.setState({
      formShow: !!flag,
    });
  };

  handleProfileShow = flag => {
    if (!flag) {
      const { dispatch } = this.props;
      this.setState({
        selectedId: '',
      });
    }
    this.setState({
      profileShow: !!flag,
    });
  };

  profile = id => {
    this.setState({
      selectedId: id,
    });
    this.handleProfileShow(true);
  };


  afterProfileClose = () => {
    this.setState({
      selectedId: '',
      profileShow: false,
    });
  }

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
          type: 'menuResource/deleteByIds',
          payload: ids,
          callback: response => {
            this.setState({
              selectedRowKeys: [],
            });
            const {
              menuResource: { pagination, queryParams },
            } = this.props;

            this.queryList(pagination, queryParams);
          },
        });
      },
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

  render() {
    const {
      menuResource: { list, pagination, queryParams },
      loading,
    } = this.props;

    const {
      selectedRowKeys,
      selectedId,
      duplicate,
      formShow,
      profileShow,
      selectedSystemId,
      selectedMenuId,
    } = this.state;

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
      {
        title: formatMessage({ id: 'table.operation' }),
        render: (text, record) => (
          <span>
            <Authorized authority={['auth:menuResource:edit']}>
              <a
                onClick={e => {
                  e.preventDefault();
                  this.addOrEdit(record.id);
                }}
              >
                <FormattedMessage id="table.edit" />
              </a>
              <Divider type="vertical" />
            </Authorized>
            <Authorized authority={['auth:menuResource:profile', 'auth:menuResource:edit', 'auth:menuResource:duplicate', 'auth:menuResource:delete']}>
              <MoreBtn current={record.id} />
            </Authorized>
          </span>
        ),
      },
    ];

    const MoreBtn = props => (
      <Dropdown
        overlay={
          <Menu>
            {Authorized.check(['auth:menuResource:profile'],
              <Menu.Item key="info" onClick={() => this.profile(props.current)}>
                <FormattedMessage id="table.info" />
              </Menu.Item>)}
            {Authorized.check(['auth:menuResource:edit'],
              <Menu.Item key="edit" onClick={() => this.addOrEdit(props.current)}>
                <FormattedMessage id="table.edit" />
              </Menu.Item>)}
            {Authorized.check(['auth:menuResource:duplicate'],
              <Menu.Item key="duplicate" onClick={() => this.duplicate(props.current)}>
                <FormattedMessage id="table.duplicate" />
              </Menu.Item>)}
            {Authorized.check(['auth:menuResource:delete'],
              <Menu.Item key="delete" onClick={() => this.delete(props.current)}>
                <FormattedMessage id="table.delete" />
              </Menu.Item>
            )}
          </Menu>
        }
      >
        <a>
          <FormattedMessage id="table.more" /> <Icon type="down" />
        </a>
      </Dropdown>
    );

    return (
      <PageHeaderWrapper title={formatMessage({ id: 'menu.menuResource.menuResourceList' })}>
        <Card bordered={false}>
          <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
            <Col span={6}>
              <SystemSelect onSelect={this.handleSystemSelect} />
              <MenuTree selectedSystemId={selectedSystemId} updatable={true} onSelect={this.onTreeSelect} />
            </Col>
            <Col span={18}>
              <div className={styles.tableList}>
                {this.renderSearchForm(queryParams.fieldsValue)}
                <div className={styles.tableListOperator}>
                  {selectedMenuId &&
                    (<Authorized authority={['auth:menuResource:add']}>
                      <Button icon="plus" type="primary" onClick={() => this.addOrEdit()}>
                        <FormattedMessage id="table.add" />
                      </Button>
                    </Authorized>)
                  }
                  {selectedRowKeys.length > 0 && (
                    <Authorized authority={['auth:menuResource:delete']}>
                      <Button type="danger" onClick={() => this.deleteBatch(selectedRowKeys)}>
                        <FormattedMessage id="table.deleteBatch" />
                      </Button>
                    </Authorized>
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
            </Col>
          </Row>
        </Card>
        {formShow ? <MenuResourceForm
          id={selectedId}
          menuId={selectedMenuId}
          systemId={selectedSystemId}
          duplicate={duplicate}
          afterClose={this.afterFormClose}
          queryList={this.queryList}
        /> : null}
        {profileShow ? <MenuResourceProfile
          id={selectedId}
          afterClose={this.afterProfileClose}
        /> : null}
      </PageHeaderWrapper>
    );
  }
}

export default MenuResourceList;
