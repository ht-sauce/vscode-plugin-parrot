import type { RouteRecordRaw } from 'vue-router'

const employeeSys: RouteRecordRaw[] = [
  {
    path: '/employee-management',
    name: '/employee-management',
    component: () => import('@/views/employee-sys/employeeManagement/list/index.vue'),
    meta: { title: '企业员工管理' },
  },
  // src\views\employee-sys\employeeManagement\quotaAllocation\index.vue
  {
    path: '/quota-allocation',
    name: '/quota-allocation',
    component: () => import('@/views/employee-sys/employeeManagement/quotaAllocation/index.vue'),
    meta: { title: '客户合作/客户合作详情' },
  },
  {
    path: '/view-order',
    name: '/view-order',
    component: () => import('@/views/employee-sys/employeeManagement/viewOrder/index.vue'),
    meta: { title: '客户合作申请/客户合作详情' },
  },
  {
    path: '/cooperation-list',
    name: '/cooperation-list',
    component: () => import('@/views/employee-sys/cooperation/list/index.vue'),
    meta: { title: '企业合作列表' },
  },
  {
    path: '/cooperation-detail',
    name: '/cooperation-detail',
    component: () => import('@/views/employee-sys/cooperation/detail/index.vue'),
    meta: { title: '企业合作详情' },
  },
]
export default employeeSys
