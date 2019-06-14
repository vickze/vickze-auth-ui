import React, { Component } from 'react';
import { connect } from 'dva';
import { Card, Badge, Table, Divider, Modal } from 'antd';
import DescriptionList from '@/components/DescriptionList';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import moment from 'moment';
import { formatMessage, FormattedMessage } from 'umi/locale';


const { Description } = DescriptionList;


@connect(({ system, loading }) => ({
  system,
  loading: loading.effects['system/fetchById'],
}))
class SystemProfile extends Component {
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
      type: 'system/fetchById',
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
      loading,
      afterClose,
    } = this.props;

    const { data, show } = this.state;

    return (
      afterClose ?
        <Modal
          width={840}
          bodyStyle={{ padding: '32px 40px 48px' }}
          destroyOnClose
          title={<FormattedMessage id="app.system.info.title" />}
          visible={show}
          footer={null}
          onCancel={this.handleCancel}
          afterClose={() => afterClose()}
        >
          <Card bordered={false} loading={loading}>
            <DescriptionList size="large" style={{ marginBottom: 32 }}>
              <Description term="ID">{data.id}</Description>
              <Description term={<FormattedMessage id="app.system.name" />}>{data.name}</Description>
              <Description term={<FormattedMessage id="app.system.key" />}>{data.key}</Description>
              <Description term={<FormattedMessage id="app.system.interceptInterface" />}>{data.interceptInterface}</Description>
              <Description term={<FormattedMessage id="app.system.notResourceLogin" />}>{data.notResourceLogin}</Description>
              <Description term={<FormattedMessage id="table.createTime" />}>{moment(data.createTime).format('YYYY-MM-DD HH:mm:ss')}</Description>
              <Description term={<FormattedMessage id="table.updateTime" />}>{moment(data.updateTime).format('YYYY-MM-DD HH:mm:ss')}</Description>
            </DescriptionList>
            <Divider style={{ marginBottom: 32 }} />
          </Card>
        </Modal>
        :
        <PageHeaderWrapper title={<FormattedMessage id="app.system.info.title" />}>
          <Card bordered={false} loading={loading}>
            <DescriptionList size="large" style={{ marginBottom: 32 }}>
              <Description term="ID">{data.id}</Description>
              <Description term={<FormattedMessage id="app.system.name" />}>{data.name}</Description>
              <Description term={<FormattedMessage id="app.system.key" />}>{data.key}</Description>
              <Description term={<FormattedMessage id="app.system.notResourceLogin" />}>{data.notResourceLogin ? <FormattedMessage id='app.system.notResourceLogin.yes' /> : <FormattedMessage id='app.system.notResourceLogin.no' />}</Description>
              <Description term={<FormattedMessage id="table.createTime" />}>{moment(data.createTime).format('YYYY-MM-DD HH:mm:ss')}</Description>
              <Description term={<FormattedMessage id="table.updateTime" />}>{moment(data.updateTime).format('YYYY-MM-DD HH:mm:ss')}</Description>
            </DescriptionList>
            <Divider style={{ marginBottom: 32 }} />
          </Card>
        </PageHeaderWrapper>
    );
  }
}

export default SystemProfile;