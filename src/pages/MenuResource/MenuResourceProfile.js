import React, { Component } from 'react';
import { connect } from 'dva';
import { Card, Badge, Table, Divider, Modal } from 'antd';
import DescriptionList from '@/components/DescriptionList';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import moment from 'moment';
import { formatMessage, FormattedMessage } from 'umi/locale';


const { Description } = DescriptionList;


@connect(({ menuResource, loading }) => ({
  menuResource,
  loading: loading.effects['menuResource/fetchById'],
}))
class MenuResourceProfile extends Component {
  state = {
    show: true,
    data: {},
  }

  constructor(props) {
    super(props);
  }

  componentDidMount() {
    const { dispatch, id } = this.props;
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

  handleCancel = () => {
    this.setState({
      show: false,
    })
    const { dispatch } = this.props;
  }


  render() {
    const {
      loading,
      afterClose,
    } = this.props;

    const { show, data } = this.state;

    return (
      <Modal
        width={840}
        bodyStyle={{ padding: '32px 40px 48px' }}
        destroyOnClose
        title={<FormattedMessage id="app.menuResource.info.title" />}
        visible={show}
        footer={null}
        onCancel={this.handleCancel}
        afterClose={() => afterClose()}
      >
        <Card bordered={false} loading={loading}>
          <DescriptionList size="large" style={{ marginBottom: 32 }}>
            <Description term="ID">{data.id}</Description>
            <Description term={<FormattedMessage id="app.menuResource.menuId" />}>{data.menuId}</Description>
            <Description term={<FormattedMessage id="app.menuResource.name" />}>{data.name}</Description>
            <Description term={<FormattedMessage id="app.menuResource.permission" />}>{data.permission}</Description>
            <Description term={<FormattedMessage id="table.createTime" />}>{moment(data.createTime).format('YYYY-MM-DD HH:mm:ss')}</Description>
            <Description term={<FormattedMessage id="table.updateTime" />}>{moment(data.updateTime).format('YYYY-MM-DD HH:mm:ss')}</Description>
          </DescriptionList>
          <Divider style={{ marginBottom: 32 }} />
        </Card>
      </Modal>
    );
  }
}

export default MenuResourceProfile;