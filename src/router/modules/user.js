/** When your routing table is too long, you can split it into small modules**/

import Layout from '@/layout'

const usersRouter = {
  path: '/users',
  component: Layout,
  redirect: 'noRedirect',
  name: 'Users',
  meta: {
    icon: 'peoples',
    roles: ['admin']
  },
  children: [
    {
      path: 'index',
      component: () => import('@/views/user/user-table'),
      name: 'UserManager',
      meta: { title: '用户管理', noCache: true }
    }
  ]
}

export default usersRouter
