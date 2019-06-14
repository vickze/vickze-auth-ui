import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { message } from 'antd';
import router from 'umi/router';
import { formatMessage, FormattedMessage } from 'umi/locale';
import {
  Form,
  Input,
  DatePicker,
  Select,
  Button,
  Card,
  InputNumber,
  Radio,
  Icon,
  Tooltip,
  Modal,
  Tree,
  Spin
} from 'antd';

const Option = Select.Option;

@connect(({ system, loading }) => ({
  system,
  loading: loading.effects['system/fetch'] || loading.effects['system/appendFetch'],
}))
@Form.create()
class SystemSelect extends PureComponent {
  state = {
    systemId: '',
    offset: 0,
    limit: 10,
  };


  handleSearchSystem = value => {
    const { dispatch, system } = this.props;
    this.setState({
      offset: 0,
    });

    dispatch({
      type: 'system/clearList',
    });

    dispatch({
      type: 'system/fetch',
      payload: {
        name: value,
        offset: 0,
        limit: this.state.limit,
      },
    });
  };

  handlePopupScrollSystem = e => {
    const { dispatch, system } = this.props;
    //是否滚动到底部
    const scrollEnd = e.target.scrollTop + e.target.clientHeight + 1 >= e.target.scrollHeight;
    const systemEnd = system.pagination.total <= this.state.offset + this.state.limit;

    if (!systemEnd && scrollEnd) {
      const { offset, limit } = this.state;
      this.setState({
        offset: offset + limit,
      });

      dispatch({
        type: 'system/appendFetch',
        payload: {
          offset: offset + limit,
          limit: limit,
        },
      });
    }
  };


  handleSystemSelectBlur = () => {
    this.setState({
      offset: 0,
    });
  }

  handleSystemSelect = (systemId) => {
    const { onSelect, onChange } = this.props;
    if (onSelect) {
      onSelect(systemId);
    }
    // Should provide an event to pass value to Form.
    if (onChange) {
      //onChange应该是被FormItem getFieldDecorator 包括传进来的
      onChange(systemId);
    }
  }

  render() {
    const {
      loading,
      system,
      value,
    } = this.props;

    const {
      offset,
    } = this.state;

    let defaultSelect;
    //value应该是被FormItem getFieldDecorator 包括传进来的
    if (value && !loading && system.list) {
      const selectedList = system.list.filter(d => d.id === Number.parseInt(value));
      if (selectedList.length > 0) {
        defaultSelect = selectedList[0].name;
      }
    }
    
    return (
      <Select
        showSearch
        defaultValue={defaultSelect}
        disabled={defaultSelect}
        placeholder={formatMessage({ id: 'app.system.select.placeholder' })}
        notFoundContent={loading ? <Spin size="small" /> : null}
        loading={loading}
        filterOption={false}
        onSearch={this.handleSearchSystem}
        onFocus={this.handleSearchSystem}
        onBlur={this.handleSystemSelectBlur}
        onSelect={this.handleSystemSelect}
        style={{ width: '100%' }}
        onPopupScroll={this.handlePopupScrollSystem}
        dropdownRender={menu => (
          <div>
            {menu}
            {offset > 0 && loading ? (
              <Spin style={{ padding: '8px' }} size="small" />
            ) : null}
          </div>
        )}
      >
        {system.list.map(d => (
          <Option key={d.id}>{d.name}</Option>
        ))}
      </Select>
    );
  }
}

export default SystemSelect;