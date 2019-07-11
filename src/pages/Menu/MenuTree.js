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
  Dropdown,
  Menu,
} from 'antd';
import Authorized from '@/utils/Authorized';
import MenuForm from '@/pages/Menu/MenuForm';
import MenuProfile from '@/pages/Menu/MenuProfile';

const Search = Input.Search;
const { TreeNode } = Tree;

const loopGetExpandedKey = (tree, key) => {
  const result = [];
  tree.forEach(item => {
    if (item.children) {
      result.push(...loopGetExpandedKey(item.children, key));
    }
    if (key && key !== '' && item.name.indexOf(key) > -1) {
      result.push(item.id);
    }
  });
  return result;
};

@connect(({ menu, loading }) => ({
  menu,
  loading: loading.effects['menu/fetchSystemMenuData'],
}))
@Form.create()
class MenuTree extends PureComponent {
  state = {
    expandedKeys: [],
    searchValue: '',
    autoExpandParent: true,
    selectedId: '',
    selectedParentId: '',
    duplicate: false,
    formShow: false,
    profileShow: false,
  };


  add = id => {
    this.setState({
      selectedParentId: id || '',
      formShow: true,
    });
  }

  edit = id => {
    this.setState({
      selectedId: id || '',
      formShow: true,
    });
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
      content: formatMessage({ id: 'app.menu.deleteConfirm' }),
      okText: formatMessage({ id: 'modal.confirm' }),
      cancelText: formatMessage({ id: 'modal.cancel' }),
      onOk: () => {
        const { dispatch } = this.props;
        dispatch({
          type: 'menu/deleteByIds',
          payload: ids,
          callback: (response) => {
            this.queryList();
          },
        });
      },
    })
  }

  queryList = () => {
    const { selectedSystemId } = this.props;
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

  onExpand = expandedKeys => {
    this.setState({
      expandedKeys,
      autoExpandParent: false,
    });
  }

  onChange = e => {
    const value = e.target.value;
    this.onSearch(value);
  };

  onSearch = value => {
    const {
      menu: { systemMenuData },
    } = this.props;

    const expandedKeys = loopGetExpandedKey(systemMenuData, value);

    this.setState({
      expandedKeys,
      searchValue: value,
      autoExpandParent: true,
    });
  }

  onTreeSelect = (selectedKeys, e) => {
    //不含子节点
    if (e.selected && (!e.node.props.children || e.node.props.children.length === 0)) {
      this.setState({
        selectedMenuId: e.node.props.eventKey,
      });

      const {
        onSelect
      } = this.props;
      onSelect(true, e.node.props.eventKey);
    } else {
      const {
        onSelect
      } = this.props;
      onSelect(false);
    }
  };

  render() {
    const {
      loading,
      menu: { systemMenuData },
      updatable,
      selectedSystemId
    } = this.props;

    const {
      searchValue,
      expandedKeys,
      autoExpandParent,
      selectedId,
      selectedParentId,
      duplicate,
      formShow,
      profileShow,
    } = this.state;

    const flag = Authorized.check()

    const getRightClickeMenu = id => (
      <Menu>
        {Authorized.check(['auth:menu:add'], <Menu.Item key="add" onClick={() => this.add(id)}><FormattedMessage id="table.add" /></Menu.Item>)}
        {Authorized.check(['auth:menu:profile'], <Menu.Item key="info" onClick={() => this.profile(id)}><FormattedMessage id="table.info" /></Menu.Item>)}
        {Authorized.check(['auth:menu:edit'], <Menu.Item key="edit" onClick={() => this.edit(id)}><FormattedMessage id="table.edit" /></Menu.Item>)}
        {Authorized.check(['auth:menu:duplicate'], <Menu.Item key="duplicate" onClick={() => this.duplicate(id)}><FormattedMessage id="table.duplicate" /></Menu.Item>)}
        {Authorized.check(['auth:menu:delete'], <Menu.Item key="delete" onClick={() => this.delete(id)}><FormattedMessage id="table.delete" /></Menu.Item>)}
      </Menu>
    );

    const loop = data => data.map(item => {
      const index = item.name.indexOf(searchValue);
      const beforeStr = item.name.substr(0, index);
      const afterStr = item.name.substr(index + searchValue.length);
      const name =
        index > -1 ? (
          updatable ?
            (Authorized.check(['auth:menu:add', 'auth:menu:profile', 'auth:menu:edit', 'auth:menu:duplicate', 'auth:menu:delete'],
              <Dropdown overlay={getRightClickeMenu(item.id)} trigger={['contextMenu']}>
                <span>
                  {beforeStr}
                  <span style={{ color: '#f50' }}>{searchValue}</span>
                  {afterStr}
                </span>
              </Dropdown>)
              ||
              <span>
                {beforeStr}
                <span style={{ color: '#f50' }}>{searchValue}</span>
                {afterStr}
              </span>
            )
            :
            (
              <span>
                {beforeStr}
                <span style={{ color: '#f50' }}>{searchValue}</span>
                {afterStr}
              </span>
            )
        ) : (
            updatable ?
              (Authorized.check(['auth:menu:add', 'auth:menu:profile', 'auth:menu:edit', 'auth:menu:duplicate', 'auth:menu:delete'],
                <Dropdown overlay={getRightClickeMenu(item.id)} trigger={['contextMenu']}><span>{item.name}</span></Dropdown>)
                ||
                <span>{item.name}</span>
              )
              :
              (<span>{item.name}</span>)
          );
      if (item.children) {
        return (
          <TreeNode key={item.id} title={name}>
            {loop(item.children)}
          </TreeNode>
        );
      }
      return <TreeNode key={item.id} title={name} />;
    });

    return (
      <div>
        {loading ?
          <Spin style={{ padding: '8px' }} size="small" /> : systemMenuData.length > 0 ?
            <div>
              <Tree
                //showIcon
                onExpand={this.onExpand}
                expandedKeys={expandedKeys}
                autoExpandParent={autoExpandParent}
                onSelect={this.onTreeSelect}
              >
                {loop(systemMenuData)}
              </Tree>
              <Search style={{ marginBottom: 8 }} placeholder="Search" onChange={this.onChange} onSearch={this.onSearch} />
            </div>
            : selectedSystemId && updatable ?
              (<Authorized authority={['auth:menu:add']}>
                <div style={{ marginTop: 8, marginLeft: 5 }}><a onClick={() => this.add()}><FormattedMessage id="table.add" /></a></div>
              </Authorized>)
              : null}
        {
          formShow ? <MenuForm
            id={selectedId}
            parentId={selectedParentId}
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
      </div>
    );
    ;
  }
}

export default MenuTree;
