import { queryTable, getGeneratorDs, updateGeneratorDs, codeGenerator } from '@/services/api';
import router from 'umi/router';
import { formatMessage, FormattedMessage } from 'umi/locale';

export default {
  namespace: 'generator',

  state: {
    params: {}, //除pagination外其他查询信息
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
    selectedRows: [],
    datasource: {},
  },

  effects: {
    *fetch({ payload }, { call, put }) {
      const { offset, limit } = payload;
      const result = yield call(queryTable, payload);
      const list = result.data;
      const total = Number.parseInt(result.response.headers.get('X-Total-Count'));
      const totalPage = total === 0 ? 1 : Math.ceil(total / limit);
      const currentPage = offset / limit + 1;

      //list为空total大于0 跳到最后一页
      if (list.length === 0 && total > 0) {
        yield put({
          type: 'fetch',
          payload: {
            ...payload,
            offset: (totalPage - 1) * limit,
            limit: limit,
          },
        });
      } else {
        yield put({
          type: 'queryList',
          payload: {
            currentPage: currentPage,
            pageSize: limit,
            total: total,
            list: list,
          },
        });
      }
    },
    *appendFetch({ payload }, { call, put }) {
      const { offset, limit } = payload;
      const result = yield call(queryTable, payload);
      const list = result.data;
      const total = Number.parseInt(result.response.headers.get('X-Total-Count'));
      const currentPage = offset / limit + 1;
      yield put({
        type: 'appendList',
        payload: {
          currentPage: currentPage,
          pageSize: limit,
          total: total,
          list: list,
        },
      });
    },
    *fetchDs({ payload }, { call, put }) {
      const response = yield call(getGeneratorDs, payload);
      yield put({
        type: 'queryDs',
        payload: response,
      });
    },
    *submitDsForm({ payload }, { call, put }) {
      const response = yield call(updateGeneratorDs, payload);
      if (response) {
        yield put({
          type: 'clearList',
        });
        router.push(`/generator/generator-list`);
      }
    },
    *submitForm({ payload }, { call, put }) {
      const result = yield call(codeGenerator, payload);
      const response = result.response;
      const a = window.document.createElement('a');
      const downUrl = window.URL.createObjectURL(result.data);// 获取 blob 本地文件连接 (blob 为纯二进制对象，不能够直接保存到磁盘上)
      const filenameArray = response.headers.get('Content-Disposition').split('filename=')[1].split('.');
      const filename = `${decodeURI(filenameArray[0])}.${filenameArray[1]}`;
      a.href = downUrl;
      a.download = filename.toString();
      a.click();
      window.URL.revokeObjectURL(downUrl);
    },
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
    queryDs(state, action) {
      return {
        ...state,
        datasource: action.payload,
      };
    },
    saveParams(state, action) {
      return {
        ...state,
        params: action.payload,
      };
    },
    saveSelectedRows(state, action) {
      return {
        ...state,
        selectedRows: action.payload,
      };
    },
    clearSelectedRows(state) {
      return {
        ...state,
        selectedRows: [],
      };
    },
    clearList(state) {
      return {
        ...state,
        list: [],
      };
    },
  },
};
