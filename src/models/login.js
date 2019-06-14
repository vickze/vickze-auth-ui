import { routerRedux } from 'dva/router';
import { stringify } from 'qs';
import { fakeAccountLogin, getFakeCaptcha, createToken, deleteToken } from '@/services/api';
import { setAuthority, clearAuthority } from '@/utils/authority';
import { setToken, getToken, clearToken } from '@/utils/token';
import { getPageQuery } from '@/utils/utils';
import { reloadAuthorized } from '@/utils/Authorized';

export default {
  namespace: 'login',

  state: {
    status: undefined,
  },

  effects: {
    *login({ payload }, { call, put }) {
      const response = yield call(createToken, payload);
      // Login successfully
      if (response) {
        // yield put({
        //   type: 'changeLoginStatus',
        //   payload: {
        //     status: true,
        //     type: 'account',
        //     ...response,
        //   },
        // });
        setToken(response.token);
        setAuthority(response.permissions);
        reloadAuthorized();
        const urlParams = new URL(window.location.href);
        const params = getPageQuery();
        let { redirect } = params;
        if (redirect) {
          const redirectUrlParams = new URL(redirect);
          if (redirectUrlParams.origin === urlParams.origin) {
            redirect = redirect.substr(urlParams.origin.length);
            if (redirect.match(/^\/.*#/)) {
              redirect = redirect.substr(redirect.indexOf('#') + 1);
            }
          } else {
            redirect = null;
          }
        }
        yield put(routerRedux.replace(redirect || '/'));
      }
    },

    *getCaptcha({ payload }, { call }) {
      yield call(getFakeCaptcha, payload);
    },

    *logout(_, { call, put }) {
      const token = getToken();
      //reducer同步
      yield put({
        type: 'changeLoginStatus',
        payload: {
          // status: false,
          // currentAuthority: 'guest',
        },
      });
      if (!token) {
        return;
      }
      yield call(deleteToken, token);

      const { redirect } = getPageQuery();
      // redirect
      if (window.location.pathname !== '/login' && !redirect) {
        yield put(
          routerRedux.replace({
            pathname: '/login',
            search: stringify({
              redirect: window.location.href,
            }),
          })
        );
      }
    },
  },

  reducers: {
    changeLoginStatus(state, { payload }) {
      clearToken();
      clearAuthority();
      reloadAuthorized();
      return {
        ...state,
        // status: payload.status,
        // type: payload.type,
      };
    },
  },
};
