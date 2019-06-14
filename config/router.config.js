export default [
  // user
  {
    path: '/login',
    component: '../layouts/UserLayout',
    routes: [
      { path: '/login', name: 'login', component: './User/Login' },
    ],
  },
  // app
  {
    path: '/',
    component: '../layouts/BasicLayout',
    Routes: ['src/pages/Authorized'],
    routes: [
      // dashboard
      // { path: '/', redirect: '/dashboard/analysis' },
      // {
      //   path: '/dashboard',
      //   name: 'dashboard',
      //   icon: 'dashboard',
      //   routes: [
      //     {
      //       path: '/dashboard/analysis',
      //       name: 'analysis',
      //       component: './Dashboard/Analysis',
      //     },
      //     {
      //       path: '/dashboard/monitor',
      //       name: 'monitor',
      //       component: './Dashboard/Monitor',
      //     },
      //     {
      //       path: '/dashboard/workplace',
      //       name: 'workplace',
      //       component: './Dashboard/Workplace',
      //     },
      //   ],
      // },
      { path: '/' },
      {
        path: '/system',
        icon: 'project',
        name: 'system',
        authority: ['auth:system:view'],
        routes: [
          {
            path: '/system/system-list',
            name: 'systemList',
            component: './System/SystemList',
            authority: ['auth:system:view'],
          },
          {
            path: '/system/system-form',
            name: 'systemForm',
            component: './System/SystemForm',
            authority: ['auth:system:add'],
            hideInMenu: true,
          },
          {
            path: '/system/system-form/:id',
            name: 'systemForm',
            component: './System/SystemForm',
            authority: ['auth:system:edit'],
            hideInMenu: true,
          },
          {
            path: '/system/system-form/:duplicate/:id',
            name: 'systemForm',
            component: './System/SystemForm',
            authority: ['auth:system:duplicate'],
            hideInMenu: true,
          },
          {
            path: '/system/system-profile/:id',
            name: 'systemProfile',
            component: './System/SystemProfile',
            authority: ['auth:system:profile'],
            hideInMenu: true,
          },
        ]
      },
      {
        path: '/menu',
        icon: 'menu',
        name: 'menu',
        authority: ['auth:menu:view'],
        routes: [
          {
            path: '/menu/menu-list',
            name: 'menuList',
            component: './Menu/MenuList',
            authority: ['auth:menu:view'],
          },
          {
            path: '/menu/menu-form',
            name: 'menuForm',
            component: './Menu/MenuForm',
            authority: ['auth:menu:add'],
            hideInMenu: true,
          },
          {
            path: '/menu/menu-form/:id',
            name: 'menuForm',
            component: './Menu/MenuForm',
            authority: ['auth:menu:edit'],
            hideInMenu: true,
          },
          {
            path: '/menu/menu-form/:duplicate/:id',
            name: 'menuForm',
            component: './Menu/MenuForm',
            authority: ['auth:menu:duplicate'],
            hideInMenu: true,
          },
          {
            path: '/menu/menu-profile/:id',
            name: 'menuProfile',
            component: './Menu/MenuProfile',
            authority: ['auth:menu:profile'],
            hideInMenu: true,
          },
        ]
      },
      {
        path: '/menuResource',
        icon: 'tags',
        name: 'menuResource',
        authority: ['auth:menuResource:view'],
        routes: [
          {
            path: '/menuResource/menuResource-list',
            name: 'menuResourceList',
            component: './MenuResource/MenuResourceList',
            authority: ['auth:menuResource:view'],
          },
          {
            path: '/menuResource/menuResource-form',
            name: 'menuResourceForm',
            component: './MenuResource/MenuResourceForm',
            authority: ['auth:menuResource:add'],
            hideInMenu: true,
          },
          {
            path: '/menuResource/menuResource-form/:id',
            name: 'menuResourceForm',
            component: './MenuResource/MenuResourceForm',
            authority: ['auth:menuResource:edit'],
            hideInMenu: true,
          },
          {
            path: '/menuResource/menuResource-form/:duplicate/:id',
            name: 'menuResourceForm',
            component: './MenuResource/MenuResourceForm',
            authority: ['auth:menuResource:duplicate'],
            hideInMenu: true,
          },
          {
            path: '/menuResource/menuResource-profile/:id',
            name: 'menuResourceProfile',
            component: './MenuResource/MenuResourceProfile',
            authority: ['auth:menuResource:profile'],
            hideInMenu: true,
          },
        ]
      },
      {
        path: '/role',
        icon: 'team',
        name: 'role',
        authority: ['auth:role:view'],
        routes: [
          {
            path: '/role/role-list',
            name: 'roleList',
            component: './Role/RoleList',
            authority: ['auth:role:view'],
          },
          {
            path: '/role/role-form',
            name: 'roleForm',
            component: './Role/RoleForm',
            authority: ['auth:role:add'],
            hideInMenu: true,
          },
          {
            path: '/role/role-form/:id',
            name: 'roleForm',
            component: './Role/RoleForm',
            authority: ['auth:role:edit'],
            hideInMenu: true,
          },
          {
            path: '/role/role-form/:duplicate/:id',
            name: 'roleForm',
            component: './Role/RoleForm',
            authority: ['auth:role:duplicate'],
            hideInMenu: true,
          },
          {
            path: '/role/role-profile/:id',
            name: 'roleProfile',
            component: './Role/RoleProfile',
            authority: ['auth:role:profile'],
            hideInMenu: true,
          },
          {
            path: '/role/role-assignPermission/:roleId',
            name: 'roleAssignPermission',
            component: './Role/AssignPermission',
            authority: ['auth:role:assignPermission'],
            hideInMenu: true,
          },
        ],
      },
      {
        path: '/user',
        icon: 'user',
        name: 'user',
        authority: ['auth:user:view'],
        routes: [
          {
            path: '/user/user-list',
            name: 'userList',
            component: './User/UserList',
            authority: ['auth:user:view'],
          },
          {
            path: '/user/user-form',
            name: 'userForm',
            component: './User/UserForm',
            authority: ['auth:user:add'],
            hideInMenu: true,
          },
          {
            path: '/user/user-form/:id',
            name: 'userForm',
            component: './User/UserForm',
            authority: ['auth:user:edit'],
            hideInMenu: true,
          },
          {
            path: '/user/user-form/:duplicate/:id',
            name: 'userForm',
            component: './User/UserForm',
            authority: ['auth:user:duplicate'],
            hideInMenu: true,
          },
          {
            path: '/user/user-profile/:id',
            name: 'userProfile',
            component: './User/UserProfile',
            authority: ['auth:user:profile'],
            hideInMenu: true,
          },
        ],
      },
      // {
      //   path: '/generator',
      //   icon: 'export',
      //   name: 'generator',
      //   routes: [
      //     {
      //       path: '/generator/generator-list',
      //       name: 'generatorList',
      //       component: './Generator/GeneratorList',
      //     },
      //     {
      //       path: '/generator/generator-ds-form',
      //       name: 'generatorDsForm',
      //       component: './Generator/GeneratorDsForm',
      //     },
      //     {
      //       path: '/generator/generator-form',
      //       name: 'generatorForm',
      //       component: './Generator/GeneratorForm',
      //     },
      //   ],
      // },
      // {
      //   path: '/config',
      //   icon: 'environment',
      //   name: 'config',
      //   routes: [
      //     {
      //       path: '/config/config-list',
      //       name: 'configList',
      //       component: './Config/ConfigList',
      //     },
      //     {
      //       path: '/config/config-form',
      //       name: 'configForm',
      //       component: './Config/ConfigForm',
      //       hideInMenu: true,
      //     },
      //     {
      //       path: '/config/config-form/:id',
      //       name: 'configForm',
      //       component: './Config/ConfigForm',
      //       hideInMenu: true,
      //     },
      //     {
      //       path: '/config/config-form/:duplicate/:id',
      //       name: 'configForm',
      //       component: './Config/ConfigForm',
      //       hideInMenu: true,
      //     },
      //     {
      //       path: '/config/config-profile/:id',
      //       name: 'configProfile',
      //       component: './Config/ConfigProfile',
      //       hideInMenu: true,
      //     },
      //   ],
      // },
      // {
      //   path: '/template',
      //   icon: 'copy',
      //   name: 'template',
      //   routes: [
      //     {
      //       path: '/template/template-list',
      //       name: 'templateList',
      //       component: './Template/TemplateList',
      //     },
      //     {
      //       path: '/template/template-form',
      //       name: 'templateForm',
      //       component: './Template/TemplateForm',
      //       hideInMenu: true,
      //     },
      //     {
      //       path: '/template/template-form/:id',
      //       name: 'templateForm',
      //       component: './Template/TemplateForm',
      //       hideInMenu: true,
      //     },
      //     {
      //       path: '/template/template-form/:duplicate/:id',
      //       name: 'templateForm',
      //       component: './Template/TemplateForm',
      //       hideInMenu: true,
      //     },
      //     {
      //       path: '/template/template-profile/:id',
      //       name: 'templateProfile',
      //       component: './Template/TemplateProfile',
      //       hideInMenu: true,
      //     },
      //   ],
      // },
      // // forms
      // {
      //   path: '/form',
      //   icon: 'form',
      //   name: 'form',
      //   routes: [
      //     {
      //       path: '/form/basic-form',
      //       name: 'basicform',
      //       component: './Forms/BasicForm',
      //     },
      //     {
      //       path: '/form/step-form',
      //       name: 'stepform',
      //       component: './Forms/StepForm',
      //       hideChildrenInMenu: true,
      //       routes: [
      //         {
      //           path: '/form/step-form',
      //           redirect: '/form/step-form/info',
      //         },
      //         {
      //           path: '/form/step-form/info',
      //           name: 'info',
      //           component: './Forms/StepForm/Step1',
      //         },
      //         {
      //           path: '/form/step-form/confirm',
      //           name: 'confirm',
      //           component: './Forms/StepForm/Step2',
      //         },
      //         {
      //           path: '/form/step-form/result',
      //           name: 'result',
      //           component: './Forms/StepForm/Step3',
      //         },
      //       ],
      //     },
      //     {
      //       path: '/form/advanced-form',
      //       name: 'advancedform',
      //       component: './Forms/AdvancedForm',
      //     },
      //   ],
      // },
      // // list
      // {
      //   path: '/list',
      //   icon: 'table',
      //   name: 'list',
      //   routes: [
      //     {
      //       path: '/list/table-list',
      //       name: 'searchtable',
      //       component: './List/TableList',
      //     },
      //     {
      //       path: '/list/basic-list',
      //       name: 'basiclist',
      //       component: './List/BasicList',
      //     },
      //     {
      //       path: '/list/card-list',
      //       name: 'cardlist',
      //       component: './List/CardList',
      //     },
      //     {
      //       path: '/list/search',
      //       name: 'searchlist',
      //       component: './List/List',
      //       routes: [
      //         {
      //           path: '/list/search',
      //           redirect: '/list/search/articles',
      //         },
      //         {
      //           path: '/list/search/articles',
      //           name: 'articles',
      //           component: './List/Articles',
      //         },
      //         {
      //           path: '/list/search/projects',
      //           name: 'projects',
      //           component: './List/Projects',
      //         },
      //         {
      //           path: '/list/search/applications',
      //           name: 'applications',
      //           component: './List/Applications',
      //         },
      //       ],
      //     },
      //   ],
      // },
      // {
      //   path: '/profile',
      //   name: 'profile',
      //   icon: 'profile',
      //   routes: [
      //     // profile
      //     {
      //       path: '/profile/basic',
      //       name: 'basic',
      //       component: './Profile/BasicProfile',
      //     },
      //     {
      //       path: '/profile/basic/:id',
      //       name: 'basic',
      //       hideInMenu: true,
      //       component: './Profile/BasicProfile',
      //     },
      //     {
      //       path: '/profile/advanced',
      //       name: 'advanced',
      //       authority: ['admin'],
      //       component: './Profile/AdvancedProfile',
      //     },
      //   ],
      // },
      // {
      //   name: 'result',
      //   icon: 'check-circle-o',
      //   path: '/result',
      //   routes: [
      //     // result
      //     {
      //       path: '/result/success',
      //       name: 'success',
      //       component: './Result/Success',
      //     },
      //     { path: '/result/fail', name: 'fail', component: './Result/Error' },
      //   ],
      // },
      // {
      //   name: 'exception',
      //   icon: 'warning',
      //   path: '/exception',
      //   routes: [
      //     // exception
      //     // {
      //     //   path: '/exception/403',
      //     //   name: 'not-permission',
      //     //   component: './Exception/403',
      //     // },
      //     {
      //       path: '/exception/404',
      //       name: 'not-find',
      //       component: './Exception/404',
      //     },
      //     {
      //       path: '/exception/500',
      //       name: 'server-error',
      //       component: './Exception/500',
      //     },
      //     {
      //       path: '/exception/trigger',
      //       name: 'trigger',
      //       hideInMenu: true,
      //       component: './Exception/TriggerException',
      //     },
      //   ],
      // },
      // {
      //   name: 'account',
      //   icon: 'user',
      //   path: '/account',
      //   routes: [
      //     {
      //       path: '/account/center',
      //       name: 'center',
      //       component: './Account/Center/Center',
      //       routes: [
      //         {
      //           path: '/account/center',
      //           redirect: '/account/center/articles',
      //         },
      //         {
      //           path: '/account/center/articles',
      //           component: './Account/Center/Articles',
      //         },
      //         {
      //           path: '/account/center/applications',
      //           component: './Account/Center/Applications',
      //         },
      //         {
      //           path: '/account/center/projects',
      //           component: './Account/Center/Projects',
      //         },
      //       ],
      //     },
      //     {
      //       path: '/account/settings',
      //       name: 'settings',
      //       component: './Account/Settings/Info',
      //       routes: [
      //         {
      //           path: '/account/settings',
      //           redirect: '/account/settings/base',
      //         },
      //         {
      //           path: '/account/settings/base',
      //           component: './Account/Settings/BaseView',
      //         },
      //         {
      //           path: '/account/settings/security',
      //           component: './Account/Settings/SecurityView',
      //         },
      //         {
      //           path: '/account/settings/binding',
      //           component: './Account/Settings/BindingView',
      //         },
      //         {
      //           path: '/account/settings/notification',
      //           component: './Account/Settings/NotificationView',
      //         },
      //       ],
      //     },
      //   ],
      // },
      // //  editor
      // {
      //   name: 'editor',
      //   icon: 'highlight',
      //   path: '/editor',
      //   routes: [
      //     {
      //       path: '/editor/flow',
      //       name: 'flow',
      //       component: './Editor/GGEditor/Flow',
      //     },
      //     {
      //       path: '/editor/mind',
      //       name: 'mind',
      //       component: './Editor/GGEditor/Mind',
      //     },
      //     {
      //       path: '/editor/koni',
      //       name: 'koni',
      //       component: './Editor/GGEditor/Koni',
      //     },
      //   ],
      // },
      // {
      //   component: '404',
      // },
    ],
  },
];
