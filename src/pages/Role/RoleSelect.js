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
  Spin,
  Tag,
} from 'antd';


const Option = Select.Option;

@connect(({ role, loading }) => ({
  role,
  loading: loading.effects['role/fetch'] || loading.effects['role/appendFetch'],
}))
@Form.create()
class RoleSelect extends PureComponent {
  state = {
    list: [],
    offset: 0,
    limit: 10,
  };

  constructor(props) {
    super(props);

    const { value } = this.props;
    this.state = {
      list: (value && value.map(item => { return ({ id: item.id, name: item.name }) })) || [],
      offset: 0,
      limit: 10,
    }
  }

  handleSearch = value => {
    const { dispatch, role } = this.props;
    this.setState({
      offset: 0,
    });

    dispatch({
      type: 'role/clearList',
    });

    dispatch({
      type: 'role/fetch',
      payload: {
        name: value,
        offset: 0,
        limit: this.state.limit,
      },
    });
  };

  handlePopupScrollRole = e => {
    const { dispatch, role } = this.props;
    //是否滚动到底部
    const scrollEnd = e.target.scrollTop + e.target.clientHeight + 1 >= e.target.scrollHeight;
    const roleEnd = role.pagination.total <= this.state.offset + this.state.limit;

    if (!roleEnd && scrollEnd) {
      const { offset, limit } = this.state;
      this.setState({
        offset: offset + limit,
      });

      dispatch({
        type: 'role/appendFetch',
        payload: {
          offset: offset + limit,
          limit: limit,
        },
      });
    }
  };


  handleSelectBlur = () => {
    this.setState({
      offset: 0,
    });
  }

  handleSelect = (val) => {
    const { onSelect, onChange } = this.props;
    if (onSelect) {
      onSelect(val.key);
    }

    if (onChange) {
      //onChange应该是被FormItem getFieldDecorator 包括传进来的
      const { list } = this.state;
      list.push({
        id: val.key,
        name: val.label,
      });
      this.setState({
        list,
      });
      onChange(list);
    }
  }

  handleDeselect = (val) => {
    const onChange = this.props.onChange;
    if (onChange) {
      //onChange应该是被FormItem getFieldDecorator 包括传进来的
      const { list } = this.state;
      const filterList = list.filter(item => item.id !== val.key);
      this.setState({
        list: filterList
      });
      onChange(filterList);
    }
  }

  render() {
    const {
      loading,
      role,
      value,
    } = this.props;

    const {
      offset,
    } = this.state;

    return (
      <Select
        showSearch
        mode="multiple"
        labelInValue
        defaultValue={value && value.map(item => { return ({ key: item.id }) })}
        placeholder={formatMessage({ id: 'app.role.select.placeholder' })}
        notFoundContent={loading ? <Spin size="small" /> : null}
        loading={loading}
        filterOption={false}
        onSearch={this.handleSearch}
        onFocus={this.handleSearch}
        onBlur={this.handleSelectBlur}
        onSelect={this.handleSelect}
        onDeselect={this.handleDeselect}
        style={{ width: '100%' }}
        onPopupScroll={this.handlePopupScrollRole}
        dropdownRender={menu => (
          <div>
            {menu}
            {(offset > 0 || (value && value.length > 0)) && loading ? (
              <Spin style={{ padding: '8px' }} size="small" />
            ) : null}
          </div>
        )}
      >
        {value && value.map(item => (
          <Option key={item.id} value={item.id}>{item.name}</Option>
        ))}
        {role.list
          .filter(item => !value || (value.filter(v => item.id === v.id).length === 0))
          .map(item => (
            <Option key={item.id} value={item.id}>{item.name}</Option>
          ))}
      </Select>
    );
  }
}

export default RoleSelect;