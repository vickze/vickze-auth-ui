/**
 * request 网络请求工具
 * 更详细的 api 文档: https://github.com/umijs/umi-request
 */
import { extend } from 'umi-request';
import { notification } from 'antd';
import router from 'umi/router';
import { getToken } from '@/utils/token';
import { formatMessage, FormattedMessage } from 'umi/locale';


const ignoreNotification = [
  //{ method: 'POST', url: '/api/auth/token' },
  //{ method: 'DELETE', url: '/api/auth/token' },
];

const getUrlRelativePath = (url) => {
  var arrUrl = url.split("//");

  var start = arrUrl[1].indexOf("/");
  var relUrl = arrUrl[1].substring(start);//stop省略，截取从start开始到结尾的所有字符

  if (relUrl.indexOf("?") != -1) {
    relUrl = relUrl.split("?")[0];
  }
  return relUrl;
}

/**
 * 异常处理程序
 */
const errorHandler = error => {
  const { response = {}, data = {} } = error;
  const errortext = data.error
    || (data.msg && formatMessage({ id: data.msg }))
    || formatMessage({ id: 'app.response.status.' + response.status })
    || response.statusText;

  const { status, url } = response;

  notification.error({
    //message: formatMessage({ id: 'app.response.request.error' }, { status: response.status, url: response.url }),
    //description: errortext,
    message: errortext,
  });

  if (status === 401) {
    // @HACK
    /* eslint-disable no-underscore-dangle */
    window.g_app._store.dispatch({
      type: 'login/logout',
    });
    return;
  }
  // environment should not be used
  // if (status === 403) {
  //   router.push('/exception/403');
  //   return;
  // }
  // if (status <= 504 && status >= 500) {
  //   router.push('/exception/500');
  //   return;
  // }
  // if (status >= 404 && status < 422) {
  //   router.push('/exception/404');
  // }
};


/**
 * 配置request请求时的默认参数
 */
const request = extend({
  errorHandler, // 默认错误处理
  credentials: 'include', // 默认请求是否带上cookie
  headers: {
    'System-Key': 'vickze-auth',
  },
});
request.interceptors.request.use((url, options) => {
  const token = getToken();
  if (token) {
    options.headers.Authorization = token;
  }

  return {
    url,
    options,
  };
});

request.interceptors.response.use((response, options) => {
  if (response.status >= 200 && response.status < 300) {
    if (options.method === 'POST' || options.method === 'PUT' || options.method === 'DELETE') {
      const _interface = { method: options.method, url: getUrlRelativePath(response.url) };

      if (!ignoreNotification.find(item => item.method === _interface.method && item.url === _interface.url)) {
        notification.success({
          message: formatMessage({ id: 'form.submit.success' }),
          duration: 1,
        });
      }
    }
  }
  return response;
});


export default request;
