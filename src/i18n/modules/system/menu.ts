export default {
  zh: {
    sysMenu: {
      addMenu: '新增菜单',
      editMenu: '修改菜单',
      menuType: '菜单类型',
      N: '导航',
      M: '目录',
      C: '菜单',
      F: '按钮',
      parentId: '上级菜单',
      title: '菜单名称',
      icon: '图标',
      path: '路由地址',
      pathDetails: '访问的路由地址，如：`user`，如外网地址需内链访问则以`http(s)://`开头',
      component: '组件路径',
      componentDetails: '访问的组件路径，如：`sys/menu/index`，默认在`views`目录下',
      frameSrc: '内嵌地址',
      hideMenu: '菜单状态',
      show: '显示',
      hide: '隐藏',
      hideMenuDetails: '选择隐藏则路由将不会出现在侧边栏，但仍然可以访问',
      submenusDelete: '有子菜单不允许删除'
    }
  },
  en: {
    sysMenu: {
      addMenu: 'Add Menu',
      editMenu: 'Edit Menu',
      menuType: 'Menu Type',
      N: 'Navigate',
      M: 'Directory',
      C: 'Menu',
      F: 'Button',
      parentId: 'Parent ID',
      title: 'Menu Name',
      icon: 'Icon',
      path: 'Routing Address',
      pathDetails:
        'The routing address of the visiters, such as `user`. If the external network address requires internal link access, it starts with `http/https`.',
      component: 'Component Path',
      componentDetails: 'Path to the accessed component such as `/sys/menu/index`, is in the `views` directory by default.',
      frameSrc: 'Embedded Address',
      hideMenu: 'Hide Menu',
      show: 'Show',
      hide: 'Hide',
      hideMenuDetails: 'If you choose to hide, the route will not appear in the sidebar, but it will still be accessible',
      submenusDelete: 'There are submenus not allowed to delete'
    }
  }
}
