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
import MenuForm from '@/pages/Menu/MenuForm';
import MenuProfile from '@/pages/Menu/MenuProfile';
import SystemSelect from '@/pages/System/SystemSelect';

const FormItem = Form.Item;


/* eslint react/no-multi-comp:0 */
@connect(({ menu, loading }) => ({
  menu,
  loading: loading.effects['menu/fetchSystemMenuData'],
}))
@Form.create()
class MenuList extends PureComponent {
  state = {
    selectedSystemId: '',
    selectedRowKeys: [],
    selectedId: '',
    duplicate: false,
    formShow: false,
    profileShow: false,
  };

  componentDidMount() {
    const {
      dispatch,
      menu: { list, pagination, queryParams },
    } = this.props;

    dispatch({
      type: 'menu/save',
      payload: {
        systemMenuData: [],
      },
    })
  }

  queryList = () => {
    const { selectedSystemId } = this.state;
    if (selectedSystemId) {
      const { dispatch } = this.props;
      dispatch({
        type: 'menu/fetchSystemMenuData',
        payload: {
          systemId: selectedSystemId,
        },
      });
    }
  }

  saveQueryParams = (queryParams) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'menu/saveQueryParams',
      payload: queryParams,
    });
  }


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
          type: 'menu/deleteByIds',
          payload: ids,
          callback: (response) => {
            this.setState({
              selectedRowKeys: [],
            });

            this.queryList();
          },
        });
      },
    })
  }

  handleSystemSelect = (systemId) => {
    this.setState({
      selectedSystemId: systemId,
    })
    const { dispatch } = this.props;
    dispatch({
      type: 'menu/fetchSystemMenuData',
      payload: {
        systemId,
      },
    });
  }


  handleSelectRows = (selectedRowKeys, selectedRows) => {
    this.setState({
      selectedRowKeys: selectedRowKeys,
    });
  };


  renderSearchForm = fieldsValue => {
    const {
      form: { getFieldDecorator },
    } = this.props;
    return (
      <SystemSelect onSelect={this.handldSystemSelect} />
    );
  }

  render() {
    const {
      menu: {
        systemMenuData,
      },
      loading,
    } = this.props;


    const {
      selectedSystemId, selectedRowKeys, selectedId, duplicate, formShow, profileShow,
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
        title: formatMessage({ id: 'app.menu.name' }),
        dataIndex: 'name',
      },
      {
        title: formatMessage({ id: 'table.operation' }),
        render: (text, record) => (
          <span>
            <Authorized authority={['auth:menu:edit']}>
              <a onClick={e => {
                e.preventDefault();
                this.addOrEdit(record.id);
              }
              }>
                <FormattedMessage id="table.edit" />
              </a>
              <Divider type="vertical" />
            </Authorized>
            <Authorized authority={['auth:menu:profile', 'auth:menu:edit', 'auth:menu:duplicate', 'auth:menu:delete']}>
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
            {Authorized.check(['auth:menu:profile'], <Menu.Item key="info" onClick={() => this.profile(props.current)}><FormattedMessage id="table.info" /></Menu.Item>)}
            {Authorized.check(['auth:menu:edit'], <Menu.Item key="edit" onClick={() => this.addOrEdit(props.current)}><FormattedMessage id="table.edit" /></Menu.Item>)}
            {Authorized.check(['auth:menu:duplicate'], <Menu.Item key="duplicate" onClick={() => this.duplicate(props.current)}><FormattedMessage id="table.duplicate" /></Menu.Item>)}
            {Authorized.check(['auth:menu:delete'], <Menu.Item key="delete" onClick={() => this.delete(props.current)}><FormattedMessage id="table.delete" /></Menu.Item>)}
          </Menu>
        }
      >
        <a>
          <FormattedMessage id="table.more" /> <Icon type="down" />
        </a>
      </Dropdown>
    );

    return (
      <PageHeaderWrapper title={formatMessage({ id: 'menu.menu.menuList' })}>
        <Card bordered={false}>
          <div className={styles.tableList}>
            <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
              <Col span={6} style={{ marginBottom: 24 }}>
                <SystemSelect onSelect={this.handleSystemSelect} />
              </Col>
            </Row>
            <div className={styles.tableListOperator}>
              {selectedSystemId && (
                <Authorized authority={['auth:menu:add']}>
                  <Button icon="plus" type="primary" onClick={() => this.addOrEdit()} >
                    <FormattedMessage id="table.add" />
                  </Button>
                </Authorized>
              )}
              {selectedRowKeys.length > 0 && (
                <Authorized authority={['auth:menu:delete']}>
                  <span>
                    <Button type="danger" onClick={() => this.deleteBatch(selectedRowKeys)}><FormattedMessage id="table.deleteBatch" /></Button>
                  </span>
                </Authorized>
              )}
            </div>
            <Table
              loading={loading}
              rowKey='id'
              dataSource={systemMenuData}
              pagination={false}
              columns={columns}
              rowSelection={rowSelection}
            />
          </div>
        </Card>
        {
          formShow ? <MenuForm
            id={selectedId}
            systemId={selectedSystemId}
            duplicate={duplicate}
            afterClose={this.afterFormClose}
            queryList={this.queryList}
          /> : null
        }
        {
          profileShow ? <MenuProfile
            id={selectedId}
            afterClose={this.afterProfileClose}
          /> : null
        }
      </PageHeaderWrapper >
    );
  }
}

export default MenuList;