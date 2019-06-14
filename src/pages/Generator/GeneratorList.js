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
} from 'antd';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import { getOrder } from '@/utils/utils';
import styles from '@/pages/TableList.less';

const FormItem = Form.Item;

/* eslint react/no-multi-comp:0 */
@connect(({ generator, loading }) => ({
  generator,
  loading: loading.effects['generator/fetch'],
}))
@Form.create()
class GeneratorList extends PureComponent {
  componentDidMount() {
    const {
      generator: { list, pagination, params },
    } = this.props;

    this.queryList(pagination, params);
  }

  queryList = (pagination, params) => {
    let sorter;
    if (params.sorter) {
      sorter = {
        field: params.sorter.field,
        order: getOrder(params.sorter.order),
      };
    }

    const { dispatch } = this.props;

    dispatch({
      type: 'generator/fetch',
      payload: {
        ...params.fieldsValue,
        ...params.filters,
        ...sorter,
        offset: (pagination.current - 1) * pagination.pageSize,
        limit: pagination.pageSize,
      },
    });
  };

  saveParams = params => {
    const { dispatch } = this.props;
    dispatch({
      type: 'generator/saveParams',
      payload: params,
    });
  };

  handleSearch = e => {
    e.preventDefault();

    const {
      form,
      generator: { pagination, params },
    } = this.props;

    form.validateFields((err, fieldsValue) => {
      if (err) return;

      const paramsTemp = {
        ...params,
        fieldsValue: fieldsValue,
      };
      this.saveParams({
        ...paramsTemp,
      });

      this.queryList(pagination, paramsTemp);
    });
  };

  handleSelectRows = (selectedRowKeys, selectedRows) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'generator/saveSelectedRows',
      payload: selectedRows,
    });
  };

  handleTableChange = (paginationArg, filtersArg, sorter) => {
    const {
      generator: { params },
    } = this.props;

    const paramsTemp = {
      ...params,
      filters: filtersArg,
      sorter: sorter,
    };
    this.saveParams({
      ...paramsTemp,
    });

    this.queryList(paginationArg, paramsTemp);
  };

  renderSearchForm() {
    const {
      form: { getFieldDecorator },
    } = this.props;
    return (
      <Form onSubmit={this.handleSearch} layout="inline">
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col md={8} sm={24}>
            <FormItem label={<FormattedMessage id="app.generator.tableName" />}>
              {getFieldDecorator('tableName')(
                <Input placeholder={formatMessage({ id: 'app.generator.tableName.placeholder' })} />
              )}
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

  generator = () => {
    router.push(`/generator/generator-form`);
  };

  changeDs = () => {
    router.push(`/generator/generator-ds-form`);
  };

  render() {
    const {
      generator: { list, pagination, params, selectedRows },
      loading,
    } = this.props;

    const rowSelection = {
      selectedRowsKeys: selectedRows.map(item => item.tableName),
      onChange: this.handleSelectRows,
    };

    const columns = [
      {
        title: formatMessage({ id: 'app.generator.tableName' }),
        dataIndex: 'tableName',
        sorter: true,
      },
      {
        title: formatMessage({ id: 'app.generator.tableComment' }),
        dataIndex: 'tableComment',
        sorter: true,
      },
    ];

    return (
      <PageHeaderWrapper title={formatMessage({ id: 'menu.generator.generatorList' })}>
        <Card bordered={false}>
          <div className={styles.tableList}>
            <div className={styles.tableListForm}>{this.renderSearchForm()}</div>
            <div className={styles.tableListOperator}>
              <Button type="primary" onClick={() => this.generator()}>
                <FormattedMessage id="app.generator.code" />
              </Button>
              <Button onClick={() => this.changeDs()}>
                <FormattedMessage id="app.generator.changeDs" />
              </Button>
            </div>
            <Table
              loading={loading}
              rowKey="tableName"
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

export default GeneratorList;
