const basePath = '/applet-operate/'

export default [
  {
    path: basePath + 'manage-home-icon',
    name: basePath + 'manage-home-icon',
    component: () => import('@/views/appletOperate/manageHomeIcon'),
    meta: { title: '首页ICON配置' },
  },
  {
    path: basePath + 'advertise-config',
    name: basePath + 'advertise-config',
    component: () => import('@/views/appletOperate/advertiseConfig'),
    meta: { title: '广告位配置' },
  },
  {
    path: basePath + 'maintain-hot-label',
    name: basePath + 'maintain-hot-label',
    component: () => import('@/views/appletOperate/maintainHotLabel'),
    meta: { title: '热门推荐标签维护' },
  },
  {
    path: basePath + 'maintain-hot-product',
    name: basePath + 'maintain-hot-product',
    component: () => import('@/views/appletOperate/maintainHotProduct'),
    meta: { title: '热门推荐产品维护' },
  },
  {
    path: basePath + 'channel-selection',
    name: basePath + 'channel-selection',
    component: () => import('@/views/appletOperate/channelSelection/index.vue'),
    meta: { title: '渠道选品' },
  },
  {
    path: basePath + 'maintain-pc-product',
    name: basePath + 'maintain-pc-product',
    component: () => import('@/views/appletOperate/maintainPcProduct'),
    meta: { title: 'PC主推产品维护' },
  },
  {
    path: basePath + 'maintain-pc-product-list',
    name: basePath + 'maintain-pc-product-list',
    component: () => import('@/views/appletOperate/maintainHotProduct'),
  },
  {
    path: basePath + 'maintain-product-list',
    name: basePath + 'maintain-product-list',
    component: () => import('@/views/appletOperate/maintainHotProducts'),
  },
]
