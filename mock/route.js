export default {
  '/api/auth_routes': {
    '/form/advanced-form': { authority: ['admin', 'user'] },
  },
  '/api/routes': [
     // app
  {
    path: '/',
    component: '../layouts/BasicLayout',
    Routes: ['src/pages/Authorized'],
    routes: [
      // dashboard
      { path: '/', redirect: '/dashboard/analysis', },
      {
        path: '/generator',
        icon: 'export',
        name: 'generator',
        routes: [
          {
            path: '/generator/generator-list',
            name: 'generatorList',
            component: './Generator/GeneratorList',
          },
          {
            path: '/generator/generator-ds-form',
            name: 'generatorDsForm',
            component: './Generator/GeneratorDsForm',
          },
          {
            path: '/generator/generator-form',
            name: 'generatorForm',
            component: './Generator/GeneratorForm',
          },
        ],
      },
      {
        path: '/config',
        icon: 'environment',
        name: 'config',
        authority: ['config:list'],
        routes: [
          {
            path: '/config/config-list',
            name: 'configList',
            component: './Config/ConfigList',
            authority: ['config:list'],
          },
          {
            path: '/config/config-form',
            name: 'configForm',
            component: './Config/ConfigForm',
            hideInMenu: true,
            authority: ['config:add'],
          },
          {
            path: '/config/config-form/:id',
            name: 'configForm',
            component: './Config/ConfigForm',
            hideInMenu: true,
            authority: ['config:edit'],
          },
          {
            path: '/config/config-profile/:id',
            name: 'configProfile',
            component: './Config/ConfigProfile',
            hideInMenu: true,
            authority: ['config:edit'],
          },
        ],
      },
      {
        path: '/template',
        icon: 'copy',
        name: 'template',
        routes: [
          {
            path: '/template/template-list',
            name: 'templateList',
            component: './Template/TemplateList',
          },
          {
            path: '/template/template-form',
            name: 'templateForm',
            component: './Template/TemplateForm',
            hideInMenu: true,
          },
          {
            path: '/template/template-form/:id',
            name: 'templateForm',
            component: './Template/TemplateForm',
            hideInMenu: true,
          },
          {
            path: '/template/template-form/:duplicate/:id',
            name: 'templateForm',
            component: './Template/TemplateForm',
            hideInMenu: true,
          },
          {
            path: '/template/template-profile/:id',
            name: 'templateProfile',
            component: './Template/TemplateProfile',
            hideInMenu: true,
          },
        ],
      },
      {
        path: '/role',
        icon: '',
        name: 'role',
        routes: [
          {
            path: '/role/role-list',
            name: 'roleList',
            component: './Role/RoleList',
          },
          {
            path: '/role/role-form',
            name: 'roleForm',
            component: './Role/RoleForm',
            hideInMenu: true,
          },
          {
            path: '/role/role-form/:id',
            name: 'roleForm',
            component: './Role/RoleForm',
            hideInMenu: true,
          },
          {
            path: '/role/role-form/:duplicate/:id',
            name: 'roleForm',
            component: './Role/RoleForm',
            hideInMenu: true,
          },
          {
            path: '/role/role-profile/:id',
            name: 'roleProfile',
            component: './Role/RoleProfile',
            hideInMenu: true,
          },
        ],
      },
      {
        path: '/muser',
        icon: '',
        name: 'user',
        routes: [
          {
            path: '/muser/user-list',
            name: 'userList',
            component: './User/UserList',
          },
          {
            path: '/muser/user-form',
            name: 'userForm',
            component: './User/UserForm',
            hideInMenu: true,
          },
          {
            path: '/muser/user-form/:id',
            name: 'userForm',
            component: './User/UserForm',
            hideInMenu: true,
          },
          {
            path: '/muser/user-form/:duplicate/:id',
            name: 'userForm',
            component: './User/UserForm',
            hideInMenu: true,
          },
          {
            path: '/muser/user-profile/:id',
            name: 'userProfile',
            component: './User/UserProfile',
            hideInMenu: true,
          },
        ],
      },
      {
        path: '/menu',
        icon: 'appstore',
        name: 'menu',
        routes: [
          {
            path: '/menu/menu-resource-list',
            name: 'menuResourceList',
            component: './Menu/MenuResourceList',
          },
        ],
      },
      {
        path: '/dashboard',
        name: 'dashboard',
        icon: 'dashboard',
        routes: [
          {
            path: '/dashboard/analysis',
            name: 'analysis',
            component: './Dashboard/Analysis',
          },
          {
            path: '/dashboard/monitor',
            name: 'monitor',
            component: './Dashboard/Monitor',
          },
          {
            path: '/dashboard/workplace',
            name: 'workplace',
            component: './Dashboard/Workplace',
          },
        ],
      },
      // forms
      {
        path: '/form',
        icon: 'form',
        name: 'form',
        routes: [
          {
            path: '/form/basic-form',
            name: 'basicform',
            component: './Forms/BasicForm',
          },
          {
            path: '/form/step-form',
            name: 'stepform',
            component: './Forms/StepForm',
            hideChildrenInMenu: true,
            routes: [
              {
                path: '/form/step-form',
                redirect: '/form/step-form/info',
              },
              {
                path: '/form/step-form/info',
                name: 'info',
                component: './Forms/StepForm/Step1',
              },
              {
                path: '/form/step-form/confirm',
                name: 'confirm',
                component: './Forms/StepForm/Step2',
              },
              {
                path: '/form/step-form/result',
                name: 'result',
                component: './Forms/StepForm/Step3',
              },
            ],
          },
          {
            path: '/form/advanced-form',
            name: 'advancedform',
            component: './Forms/AdvancedForm',
          },
        ],
      },
      // list
      {
        path: '/list',
        icon: 'table',
        name: 'list',
        routes: [
          {
            path: '/list/table-list',
            name: 'searchtable',
            component: './List/TableList',
          },
          {
            path: '/list/basic-list',
            name: 'basiclist',
            component: './List/BasicList',
          },
          {
            path: '/list/card-list',
            name: 'cardlist',
            component: './List/CardList',
          },
          {
            path: '/list/search',
            name: 'searchlist',
            component: './List/List',
            routes: [
              {
                path: '/list/search',
                redirect: '/list/search/articles',
              },
              {
                path: '/list/search/articles',
                name: 'articles',
                component: './List/Articles',
              },
              {
                path: '/list/search/projects',
                name: 'projects',
                component: './List/Projects',
              },
              {
                path: '/list/search/applications',
                name: 'applications',
                component: './List/Applications',
              },
            ],
          },
        ],
      },
      {
        path: '/profile',
        name: 'profile',
        icon: 'profile',
        routes: [
          // profile
          {
            path: '/profile/basic',
            name: 'basic',
            component: './Profile/BasicProfile',
          },
          {
            path: '/profile/basic/:id',
            name: 'basic',
            hideInMenu: true,
            component: './Profile/BasicProfile',
          },
          {
            path: '/profile/advanced',
            name: 'advanced',
            authority: ['admin'],
            component: './Profile/AdvancedProfile',
          },
        ],
      },
      {
        name: 'result',
        icon: 'check-circle-o',
        path: '/result',
        routes: [
          // result
          {
            path: '/result/success',
            name: 'success',
            component: './Result/Success',
          },
          { path: '/result/fail', name: 'fail', component: './Result/Error' },
        ],
      },
      {
        name: 'exception',
        icon: 'warning',
        path: '/exception',
        routes: [
          // exception
          // {
          //   path: '/exception/403',
          //   name: 'not-permission',
          //   component: './Exception/403',
          // },
          {
            path: '/exception/404',
            name: 'not-find',
            component: './Exception/404',
          },
          {
            path: '/exception/500',
            name: 'server-error',
            component: './Exception/500',
          },
          {
            path: '/exception/trigger',
            name: 'trigger',
            hideInMenu: true,
            component: './Exception/TriggerException',
          },
        ],
      },
      {
        name: 'account',
        icon: 'user',
        path: '/account',
        routes: [
          {
            path: '/account/center',
            name: 'center',
            component: './Account/Center/Center',
            routes: [
              {
                path: '/account/center',
                redirect: '/account/center/articles',
              },
              {
                path: '/account/center/articles',
                component: './Account/Center/Articles',
              },
              {
                path: '/account/center/applications',
                component: './Account/Center/Applications',
              },
              {
                path: '/account/center/projects',
                component: './Account/Center/Projects',
              },
            ],
          },
          {
            path: '/account/settings',
            name: 'settings',
            component: './Account/Settings/Info',
            routes: [
              {
                path: '/account/settings',
                redirect: '/account/settings/base',
              },
              {
                path: '/account/settings/base',
                component: './Account/Settings/BaseView',
              },
              {
                path: '/account/settings/security',
                component: './Account/Settings/SecurityView',
              },
              {
                path: '/account/settings/binding',
                component: './Account/Settings/BindingView',
              },
              {
                path: '/account/settings/notification',
                component: './Account/Settings/NotificationView',
              },
            ],
          },
        ],
      },
      //  editor
      {
        name: 'editor',
        icon: 'highlight',
        path: '/editor',
        routes: [
          {
            path: '/editor/flow',
            name: 'flow',
            component: './Editor/GGEditor/Flow',
          },
          {
            path: '/editor/mind',
            name: 'mind',
            component: './Editor/GGEditor/Mind',
          },
          {
            path: '/editor/koni',
            name: 'koni',
            component: './Editor/GGEditor/Koni',
          },
        ],
      },
      {
        component: '404',
      },
    ],
  },
  ]
};
