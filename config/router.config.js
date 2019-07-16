export default [
  {
    path: '/',
    component: '../layouts/BlankLayout',
    routes: [
      // login
      {
        path: '/login',
        component: './User/Login',
        routes: [
          { path: '/login', name: 'login', }
        ]
      },
      // app
      {
        path: '/',
        component: '../layouts/BasicLayout',
        Routes: ['src/pages/Authorized'],
        routes: [
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
          //   name: 'exception',
          //   icon: 'warning',
          //   path: '/exception',
          //   routes: [
          //     // exception
          //     {
          //       path: '/exception/403',
          //       name: 'not-permission',
          //       component: './Exception/403',
          //     },
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
          //   ],
          // },
        ],
      },
    ]
  }


];
