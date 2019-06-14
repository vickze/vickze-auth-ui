import memoizeOne from 'memoize-one';
import isEqual from 'lodash/isEqual';
import { formatMessage } from 'umi-plugin-react/locale';
import Authorized from '@/utils/Authorized';
import { menu } from '../defaultSettings';
import { queryMenuTree, getMenu, addMenu, updateMenu, deleteMenu } from '@/services/api';

const { check } = Authorized;

// Conversion router to menu.
function formatter(data, parentAuthority, parentName) {
  if (!data) {
    return undefined;
  }
  return data
    .map(item => {
      if (!item.name || !item.path) {
        return null;
      }

      let locale = 'menu';
      if (parentName && parentName !== '/') {
        locale = `${parentName}.${item.name}`;
      } else {
        locale = `menu.${item.name}`;
      }
      // if enableMenuLocale use item.name,
      // close menu international
      const name = menu.disableLocal
        ? item.name
        : formatMessage({ id: locale, defaultMessage: item.name });
      const result = {
        ...item,
        name,
        locale,
        authority: item.authority || parentAuthority,
      };
      if (item.routes) {
        const children = formatter(item.routes, item.authority, locale);
        // Reduce memory usage
        result.children = children;
      }
      delete result.routes;
      return result;
    })
    .filter(item => item);
}

const memoizeOneFormatter = memoizeOne(formatter, isEqual);

/**
 * get SubMenu or Item
 */
const getSubMenu = item => {
  // doc: add hideChildrenInMenu
  if (item.children && !item.hideChildrenInMenu && item.children.some(child => child.name)) {
    return {
      ...item,
      children: filterMenuData(item.children), // eslint-disable-line
    };
  }
  return item;
};

/**
 * filter menuData
 */
const filterMenuData = menuData => {
  if (!menuData) {
    return [];
  }
  return menuData
    .filter(item => item.name && !item.hideInMenu)
    .map(item => check(item.authority, getSubMenu(item)))
    .filter(item => item);
};

/**
 * filter menuData (include not authority)
 */
const filterAllMenuData = menuData => {
  if (!menuData) {
    return menuData;
  }

  return menuData
    .filter(item => item.name && !item.hideInMenu)
    .map(item => {
      return {
        ...item,
        children: filterAllMenuData(item.children),
      };
    });
};

/**
 * 获取面包屑映射
 * @param {Object} menuData 菜单配置
 */
const getBreadcrumbNameMap = menuData => {
  if (!menuData) {
    return {};
  }
  const routerMap = {};

  const flattenMenuData = data => {
    data.forEach(menuItem => {
      if (menuItem.children) {
        flattenMenuData(menuItem.children);
      }
      // Reduce memory usage
      routerMap[menuItem.path] = menuItem;
    });
  };
  flattenMenuData(menuData);
  return routerMap;
};

const memoizeOneGetBreadcrumbNameMap = memoizeOne(getBreadcrumbNameMap, isEqual);

export default {
  namespace: 'menu',

  state: {
    menuData: [],
    routerData: [],
    menuResource: [],
    breadcrumbNameMap: {},

    queryParams: {}, //除pagination外其他查询信息
    list: [],
    pagination: {
      current: 1,
      pageSize: 10,
      total: 0,
      showTotal: total => formatMessage({ id: 'table.total' }, { total: total }),
      pageSizeOptions: ['10', '20', '30'],
      showSizeChanger: true,
      showQuickJumper: true,
    },
    systemMenuData: [],
  },

  effects: {
    *getMenuData({ payload }, { put }) {
      const { routes, authority, path } = payload;
      const originalMenuData = memoizeOneFormatter(routes, authority, path);
      const menuData = filterMenuData(originalMenuData);
      const breadcrumbNameMap = memoizeOneGetBreadcrumbNameMap(originalMenuData);
      yield put({
        type: 'save',
        payload: { menuData, breadcrumbNameMap, routerData: routes },
      });
    },
    *fetchSystemMenuData({ payload }, { call, put }) {
      const response = yield call(queryMenuTree, payload);
      console.log(JSON.stringify(response, null, 2));
      yield put({
        type: 'save',
        payload: { systemMenuData: response },
      })
    },
    *fetchById({ payload, callback }, { call, put }) {
      const response = yield call(getMenu, payload);
      if (response) {
        callback(response);
      }
    },
    *deleteByIds({ payload, callback }, { call, put }) {
      const response = yield call(deleteMenu, payload);
      if (response) {
        yield put({
          type: 'clearList',
        });
        callback(response);
      }
    },
    *submitForm({ payload, callback }, { call, put }) {
      const response = !payload.id ? yield call(addMenu, payload) : yield call(updateMenu, payload);
      if (response) {
        callback(response);
      }
    }
  },

  reducers: {
    save(state, action) {
      return {
        ...state,
        ...action.payload,
      };
    },

    queryList(state, action) {
      return {
        ...state,
        list: action.payload.list,
        pagination: {
          ...state.pagination,
          total: action.payload.total,
          current: action.payload.currentPage,
          pageSize: action.payload.pageSize,
        },
      };
    },
    appendList(state, action) {
      return {
        ...state,
        list: state.list.concat(action.payload.list),
        pagination: {
          ...state.pagination,
          total: action.payload.total,
          current: action.payload.currentPage,
          pageSize: action.payload.pageSize,
        },
      };
    },
    saveQueryParams(state, action) {
      return {
        ...state,
        queryParams: action.payload,
      }
    },
    clearList(state) {
      return {
        ...state,
        list: [],
      }
    },
  },
};
