import React, { Component } from 'react';
import { connect } from 'dva';
import { Card, Badge, Table, Divider, Modal } from 'antd';
import DescriptionList from '@/components/DescriptionList';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import moment from 'moment';
import { formatMessage, FormattedMessage } from 'umi/locale';


const { Description } = DescriptionList;


@connect(({ system, menu, loading }) => ({
  system,
  menu,
  loading: loading.effects['menu/fetchById'],
}))
class MenuProfile extends Component {
  constructor(props) {
    super(props);
    this.state = {
      //prop.id modal传进来的， (props.match && props.match.params.id) url 上的
      id: props.id || (props.match && props.match.params.id),
      data: {},
      show: true,
    }
  }

  componentDidMount() {
    const { dispatch } = this.props;
    const { id } = this.state;
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

  handleCancel = () => {
    this.setState({
      show: false,
    })
  }


  render() {
    const {
      system: { list },
      menu: {
        systemMenuData,
      },
      loading,
      afterClose,
    } = this.props;

    const { data, show } = this.state;

    const getSystemName = () => {
      let systemName;
      //value应该是被FormItem getFieldDecorator 包括传进来的
      if (data.systemId) {
        const filterList = list.filter(d => d.id === Number.parseInt(data.systemId));
        if (filterList.length > 0) {
          systemName = filterList[0].name;
        }
      }
      return systemName;
    }

    const getMenuName = () => {
      if (!data.parentId) {
        return null;
      }
      if (!systemMenuData) {
        return null;
      }
      for (const item of systemMenuData) {
        if (item.id === data.parentId) {
          return item.name;
        }
        if (item.children) {
          return getMenuName(item.children);
        }
      }
      return null;
    }


    return (
      <Modal
        width={840}
        bodyStyle={{ padding: '32px 40px 48px' }}
        destroyOnClose
        title={<FormattedMessage id="app.menu.info.title" />}
        visible={show}
        footer={null}
        onCancel={this.handleCancel}
        afterClose={() => afterClose()}
      >
        <Card bordered={false} loading={loading}>
          <DescriptionList size="large" style={{ marginBottom: 32 }}>
            <Description term="ID">{data.id}</Description>
            <Description term={<FormattedMessage id="app.menu.systemId" />}>{getSystemName()}</Description>
            <Description term={<FormattedMessage id="app.menu.parentId" />}>{getMenuName()}</Description>
            <Description term={<FormattedMessage id="app.menu.name" />}>{data.name}</Description>
            <Description term={<FormattedMessage id="table.createTime" />}>{moment(data.createTime).format('YYYY-MM-DD HH:mm:ss')}</Description>
            <Description term={<FormattedMessage id="table.updateTime" />}>{moment(data.updateTime).format('YYYY-MM-DD HH:mm:ss')}</Description>
          </DescriptionList>
          <Divider style={{ marginBottom: 32 }} />
        </Card>
      </Modal>
    );
  }
}

export default MenuProfile;