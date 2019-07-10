import { stringify } from 'qs';
import request from '@/utils/request';

export async function queryProjectNotice() {
  return request('/api/project/notice');
}

export async function queryActivities() {
  return request('/api/activities');
}

export async function queryRule(params) {
  return request(`/api/rule?${stringify(params)}`);
}

export async function removeRule(params) {
  return request('/api/rule', {
    method: 'POST',
    data: {
      ...params,
      method: 'delete',
    },
  });
}

export async function addRule(params) {
  return request('/api/rule', {
    method: 'POST',
    data: {
      ...params,
      method: 'post',
    },
  });
}

export async function updateRule(params = {}) {
  return request(`/api/rule?${stringify(params.query)}`, {
    method: 'POST',
    data: {
      ...params.body,
      method: 'update',
    },
  });
}

export async function fakeSubmitForm(params) {
  return request('/api/forms', {
    method: 'POST',
    data: params,
  });
}

export async function fakeChartData() {
  return request('/api/fake_chart_data');
}

export async function queryTags() {
  return request('/api/tags');
}

export async function queryBasicProfile(id) {
  return request(`/api/profile/basic?id=${id}`);
}

export async function queryAdvancedProfile() {
  return request('/api/profile/advanced');
}

export async function queryFakeList(params) {
  return request(`/api/fake_list?${stringify(params)}`);
}

export async function removeFakeList(params) {
  const { count = 5, ...restParams } = params;
  return request(`/api/fake_list?count=${count}`, {
    method: 'POST',
    data: {
      ...restParams,
      method: 'delete',
    },
  });
}

export async function addFakeList(params) {
  const { count = 5, ...restParams } = params;
  return request(`/api/fake_list?count=${count}`, {
    method: 'POST',
    data: {
      ...restParams,
      method: 'post',
    },
  });
}

export async function updateFakeList(params) {
  const { count = 5, ...restParams } = params;
  return request(`/api/fake_list?count=${count}`, {
    method: 'POST',
    data: {
      ...restParams,
      method: 'update',
    },
  });
}

export async function fakeAccountLogin(params) {
  return request('/api/login/account', {
    method: 'POST',
    data: params,
  });
}

export async function fakeRegister(params) {
  return request('/api/register', {
    method: 'POST',
    data: params,
  });
}

export async function queryNotices(params = {}) {
  return request(`/api/notices?${stringify(params)}`);
}

export async function getFakeCaptcha(mobile) {
  return request(`/api/captcha?mobile=${mobile}`);
}

export async function queryTable(params = {}) {
  return request(`/api/generator/table?${stringify(params)}`, {
    getResponse: true,
  });
}

export async function getGeneratorDs() {
  return request(`/api/generator/datasource/generator`);
}

export async function updateGeneratorDs(params = {}) {
  return request(`/api/generator/datasource`, {
    method: 'PUT',
    data: params,
    getResponse: true,
  });
}

export async function codeGenerator(params = {}) {
  return request(`/api/generator/code`, {
    method: 'POST',
    data: params,
    responseType: 'blob',
    getResponse: true,
  });
}

export async function queryConfig(params = {}) {
  return request(`/api/generator/config?${stringify(params)}`, {
    getResponse: true,
  });
}

export async function getConfig(id) {
  return request(`/api/generator/config/${id}`);
}

export async function addConfig(params) {
  return request(`/api/generator/config`, {
    method: 'POST',
    data: params,
    getResponse: true,
  });
}

export async function updateConfig(params) {
  return request(`/api/generator/config`, {
    method: 'PUT',
    data: params,
    getResponse: true,
  });
}

export async function deleteConfig(ids) {
  return request(`/api/generator/config`, {
    method: 'DELETE',
    data: ids,
    getResponse: true,
  });
}

export async function queryTemplate(params = {}) {
  return request(`/api/generator/template?${stringify(params)}`, {
    getResponse: true,
  });
}

export async function getTemplate(id) {
  return request(`/api/generator/template/${id}`);
}

export async function addTemplate(params) {
  return request(`/api/generator/template`, {
    method: 'POST',
    data: params,
    getResponse: true,
  });
}

export async function updateTemplate(params) {
  return request(`/api/generator/template`, {
    method: 'PUT',
    data: params,
    getResponse: true,
  });
}

export async function deleteTemplate(ids) {
  return request(`/api/generator/template`, {
    method: 'DELETE',
    data: ids,
    getResponse: true
  });
}


export async function queryMenuResource(params = {}) {
  return request(`/api/auth/menuResource?${stringify(params)}`, {
    getResponse: true,
  });
}

export async function getMenuResource(id) {
  return request(`/api/auth/menuResource/${id}`);
}

export async function addMenuResource(params) {
  return request(`/api/auth/menuResource`, {
    method: 'POST',
    data: params,
    getResponse: true,
  });
}

export async function updateMenuResource(params) {
  return request(`/api/auth/menuResource`, {
    method: 'PUT',
    data: params,
    getResponse: true,
  });
}

export async function deleteMenuResource(ids) {
  return request(`/api/auth/menuResource`, {
    method: 'DELETE',
    data: ids,
    getResponse: true,
  });
}

export async function queryRole(params = {}) {
  return request(`/api/auth/role?${stringify(params)}`, {
    getResponse: true,
  });
}

export async function getRole(id) {
  return request(`/api/auth/role/${id}`);
}

export async function addRole(params) {
  return request(`/api/auth/role`, {
    method: 'POST',
    data: params,
    getResponse: true,
  });
}

export async function updateRole(params) {
  return request(`/api/auth/role`, {
    method: 'PUT',
    data: params,
    getResponse: true,
  });
}

export async function deleteRole(ids) {
  return request(`/api/auth/role`, {
    method: 'DELETE',
    data: ids,
    getResponse: true,
  });
}

export async function getRoleMenuResources(params) {
  return request(`/api/auth/role/menuResource?${stringify(params)}`);
}

export async function assignMenuResource(params) {
  return request(`/api/auth/role/assignMenuResource`, {
    method: 'POST',
    data: params,
    getResponse: true,
  });
}

export async function queryUser(params = {}) {
  return request(`/api/auth/user?${stringify(params)}`, {
    getResponse: true,
  });
}

export async function getUser(id) {
  return request(`/api/auth/user/${id}`);
}

export async function addUser(params) {
  return request(`/api/auth/user`, {
    method: 'POST',
    data: params,
    getResponse: true,
  });
}

export async function updateUser(params) {
  return request(`/api/auth/user`, {
    method: 'PUT',
    data: params,
    getResponse: true,
  });
}

export async function deleteUser(ids) {
  return request(`/api/auth/user`, {
    method: 'DELETE',
    data: ids,
    getResponse: true,
  });
}

export async function queryCurrentUser() {
  return request(`/api/auth/user/_current`);
}

export async function createToken(params) {
  return request(`/api/auth/token`, {
    method: 'POST',
    data: params,
  });
}


export async function validateToken() {
  return request(`/api/auth/token/validate`, {
    method: 'GET',
  });
}

export async function deleteToken(token) {
  return request(`/api/auth/token`, {
    method: 'DELETE',
    headers: {
      Authorization: token,
    },
    getResponse: true,
    errorHandler: () => {
      //
    }
  });
}


export async function querySystem(params = {}) {
  return request(`/api/auth/system?${stringify(params)}`, {
    getResponse: true,
  });
}

export async function getSystem(id) {
  return request(`/api/auth/system/${id}`);
}

export async function addSystem(params) {
  return request(`/api/auth/system`, {
    method: 'POST',
    data: params,
    getResponse: true,
  });
}

export async function updateSystem(params) {
  return request(`/api/auth/system`, {
    method: 'PUT',
    data: params,
    getResponse: true,
  });
}

export async function deleteSystem(ids) {
  return request(`/api/auth/system`, {
    method: 'DELETE',
    data: ids,
    getResponse: true,
  });
}

export async function queryMenuTree(params = {}) {
  return request(`/api/auth/menu/tree?${stringify(params)}`);
}

export async function getMenu(id) {
  return request(`/api/auth/menu/${id}`);
}

export async function addMenu(params) {
  return request(`/api/auth/menu`, {
    method: 'POST',
    data: params,
    getResponse: true,
  });
}

export async function updateMenu(params) {
  return request(`/api/auth/menu`, {
    method: 'PUT',
    data: params,
    getResponse: true,
  });
}

export async function deleteMenu(ids) {
  return request(`/api/auth/menu`, {
    method: 'DELETE',
    data: ids,
    getResponse: true,
  });
}

