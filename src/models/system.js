import { querySystem, getSystem, addSystem, updateSystem, deleteSystem } from '@/services/api';
import { formatMessage, FormattedMessage } from 'umi/locale';

export default {
  namespace: 'system',

  state: {
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
  },

  effects: {
    *fetch({ payload }, { call, put }) {
      const { offset, limit } = payload;
      const result = yield call(querySystem, payload);
      const list = result.data;
      const total = Number.parseInt(result.response.headers.get('X-Total-Count'));
      const totalPage = total === 0 ? 1 : Math.ceil(total / limit);
      const currentPage = (offset / limit) + 1;
      
      //list为空total大于0 跳到最后一页
      if (list.length === 0 && total > 0) {
        yield put({
          type: 'fetch',
          payload: {
            ...payload,
            offset: (totalPage - 1) * limit,
            limit: limit,
          }
        })
      } else {
        yield put({
          type: 'queryList',
          payload: {
            currentPage: currentPage,
            pageSize: limit,
            total: total,
            list: list,
          }
        });
      }
    },
    *appendFetch({ payload }, { call, put }) {
      const { offset, limit } = payload;
      const result = yield call(querySystem, payload);
      const list = result.data;
      const total = Number.parseInt(result.response.headers.get('X-Total-Count'));
      const currentPage = (offset / limit) + 1;
      yield put({
        type: 'appendList',
        payload: {
          currentPage: currentPage,
          pageSize: limit,
          total: total,
          list: list,
        }
      });
    },
    *fetchById({ payload, callback }, { call, put }) {
      const response = yield call(getSystem, payload);
      if (response) {
        callback(response);
      }
    },
    *deleteByIds({ payload, callback }, { call, put }) {
      const response = yield call(deleteSystem, payload);
      if (response) {
        callback(response);
      }
    },
    *submitForm({ payload, callback }, { call, put }) {
      const response = !payload.id ? yield call(addSystem, payload) : yield call(updateSystem, payload);
      if (response) {
        callback(response);
      }
    }
  },

  reducers: {
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
  },
};