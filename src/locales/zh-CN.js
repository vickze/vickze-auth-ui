import analysis from './zh-CN/analysis';
import exception from './zh-CN/exception';
import form from './zh-CN/form';
import globalHeader from './zh-CN/globalHeader';
import login from './zh-CN/login';
import menu from './zh-CN/menu';
import monitor from './zh-CN/monitor';
import result from './zh-CN/result';
import settingDrawer from './zh-CN/settingDrawer';
import settings from './zh-CN/settings';
import pwa from './zh-CN/pwa';
import component from './zh-CN/component';
import editor from './zh-CN/editor';
import table from './zh-CN/table';
import modal from './zh-CN/modal';
import generator from './zh-CN/generator';
import config from './zh-CN/config';
import template from './zh-CN/template';
import menuResource from './zh-CN/menuResource';
import role from './zh-CN/role';
import user from './zh-CN/user';
import system from './zh-CN/system';

export default {
  'app.title': '权限控制中心',
  'app.description': '微服务架构多系统权限控制解决方案',
  'navBar.lang': '语言',
  'layout.user.link.help': '帮助',
  'layout.user.link.privacy': '隐私',
  'layout.user.link.terms': '条款',
  'app.home.introduce': '介绍',
  'app.forms.basic.title': '基础表单',
  'app.forms.basic.description':
    '表单页用于向用户收集或验证信息，基础表单常见于数据项较少的表单场景。',
  'app.response.request.error': '请求错误 {status}: {url}',
  'app.response.status.200': '服务器成功返回请求的数据。',
  'app.response.status.201': '新建或修改数据成功。',
  'app.response.status.202': '一个请求已经进入后台排队（异步任务）。',
  'app.response.status.204': '删除数据成功。',
  'app.response.status.400': '发出的请求有错误，服务器没有进行新建或修改数据的操作。',
  'app.response.status.401': '用户没有权限（令牌、用户名、密码错误）。',
  'app.response.status.403': '用户得到授权，但是访问是被禁止的。',
  'app.response.status.404': '发出的请求针对的是不存在的记录，服务器没有进行操作。',
  'app.response.status.406': '请求的格式不可得。',
  'app.response.status.410': '请求的资源被永久删除，且不会再得到的。',
  'app.response.status.422': '当创建一个对象时，发生一个验证错误。',
  'app.response.status.500': '服务器发生错误，请检查服务器。',
  'app.response.status.502': '网关错误。',
  'app.response.status.503': '服务不可用，服务器暂时过载或维护。',
  'app.response.status.504': '网关超时。',
  ...analysis,
  ...exception,
  ...form,
  ...globalHeader,
  ...login,
  ...menu,
  ...monitor,
  ...result,
  ...settingDrawer,
  ...settings,
  ...pwa,
  ...component,
  ...editor,
  ...table,
  ...modal,
  ...generator,
  ...config,
  ...template,
  ...menuResource,
  ...role,
  ...user,
  ...system,
};
