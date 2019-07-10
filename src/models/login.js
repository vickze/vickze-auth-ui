import { stringify } from 'qs';
import { fakeAccountLogin, getFakeCaptcha, createToken, validateToken, deleteToken } from '@/services/api';
import { setAuthority, clearAuthority } from '@/utils/authority';
import { setToken, getToken, clearToken } from '@/utils/token';
import { ssoLogin, ssoLogout } from '@/utils/sso';
import { getPageQuery } from '@/utils/utils';
import { reloadAuthorized } from '@/utils/Authorized';
import router from 'umi/router';

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
        yield put({
          type: 'changeLoginStatus',
          payload: {
            status: true,
            //type: 'account',
            ...response,
          },
        });
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
        router.push(redirect || '/');
      }
    },
    *getCaptcha({ payload }, { call }) {
      yield call(getFakeCaptcha, payload);
    },
    *validate({ callback }, { call }) {
      const token = getToken();
      let { redirect } = getPageQuery();

      if (!token) {
        if (SSO) {
          ssoLogin(redirect || window.location.origin);
        }
        callback();
        return;
      }
      const response = yield call(validateToken);
      //token有效
      if (response) {
        const urlParams = new URL(window.location.href);
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
        router.push(redirect || '/');
      } else {
        //token无效  
        if (SSO) {
          ssoLogin(redirect || window.location.origin);
        }
        callback();
      }
    },
    *logout({ payload = {} }, { call, put }) {
      const token = getToken();
      //reducer同步
      yield put({
        type: 'changeLoginStatus',
        payload: {
          status: false,
          // currentAuthority: 'guest',
        },
      });

      const { redirect } = getPageQuery();
      if (SSO) {
        if (!payload.expire) {
          //主动登出
          ssoLogout(redirect || (window.location.pathname !== '/login' ? window.location.href : window.location.origin));
        } else {
          //token失效
          ssoLogin(redirect || (window.location.pathname !== '/login' ? window.location.href : window.location.origin));
        }
        
        return;
      }

      //token存在且为主动登出不是失效，调用删除token接口
      if (token && !payload.expire) {
        yield call(deleteToken, token);
      }

      // redirect
      if (window.location.pathname !== '/login' && !redirect) {
        router.replace({
          pathname: '/login',
          query: {
            redirect: window.location.href,
          },
        })
      }
    },
  },

  reducers: {
    changeLoginStatus(state, { payload }) {
      //登录
      if (payload.status) {
        setToken(payload.token);
        setAuthority(payload.permissions);
      } else {
        //登出
        clearToken();
        clearAuthority();
      }
      reloadAuthorized();
      return {
        ...state,
        // status: payload.status,
        // type: payload.type,
      };
    },
  },
};
