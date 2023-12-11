```
let router: any = [
  {
    component: 'Layout',
    frameSrc: null,
    hideMenu: '1',
    icon: 'CaretRight',
    menuId: 1,
    menuType: 'M',
    parentMenuId: null,
    path: '/details',
    title: '详情测试',
    children: [
      {
        component: '/list/list/index',
        frameSrc: null,
        hideMenu: '1',
        icon: 'CaretRight',
        menuId: 2,
        menuType: 'C',
        parentMenuId: 1,
        path: 'list',
        title: '列表',
        children: [
          {
            component: '/list/list/details',
            frameSrc: null,
            hideMenu: '0',
            icon: '',
            menuId: 3,
            menuType: 'C',
            parentMenuId: 2,
            path: 'listDetails',
            title: '详情'
          }
        ]
      }
    ]
  },
  {
    component: 'Layout',
    frameSrc: null,
    hideMenu: '1',
    icon: 'CaretRight',
    menuId: 4,
    menuType: 'M',
    parentMenuId: null,
    path: '/list',
    title: '层级1',
    children: [
      {
        component: 'ParentLayout',
        frameSrc: null,
        hideMenu: '1',
        icon: '',
        menuId: 5,
        menuType: 'M',
        parentMenuId: 4,
        path: 'list1',
        title: '层级2',
        children: [
          {
            component: 'ParentLayout',
            frameSrc: null,
            hideMenu: '1',
            icon: '',
            menuId: 6,
            menuType: 'M',
            parentMenuId: 5,
            path: 'list2',
            title: '层级3',
            children: [
              {
                component: '/list/list/aa',
                frameSrc: null,
                hideMenu: '1',
                icon: '',
                menuId: 7,
                menuType: 'C',
                parentMenuId: 6,
                path: 'list3',
                title: '详情',
                children: [
                  {
                    component: '/list/list/index',
                    frameSrc: null,
                    hideMenu: '0',
                    icon: '',
                    menuId: 12,
                    menuType: 'C',
                    parentMenuId: 7,
                    path: 'list31',
                    title: '详情22'
                  }
                ]
              },
              {
                component: '',
                frameSrc: null,
                hideMenu: '1',
                icon: '',
                menuId: 11,
                menuType: 'C',
                parentMenuId: 6,
                path: 'https://www.naiveui.com/zh-CN/os-theme/docs/community',
                title: '外部链接'
              }
            ]
          }
        ]
      }
    ]
  },
  {
    component: '/list/list/details',
    frameSrc: null,
    hideMenu: '1',
    icon: 'CaretRight',
    menuId: 9,
    menuType: 'C',
    parentMenuId: null,
    path: 'listDetails',
    title: '单独页面'
  },
  {
    component: '',
    frameSrc: null,
    hideMenu: '1',
    icon: 'CaretRight',
    menuId: 10,
    menuType: 'C',
    parentMenuId: null,
    path: 'https://www.naiveui.com/zh-CN/os-theme/docs/community',
    title: '外部链接'
  }
]
```

