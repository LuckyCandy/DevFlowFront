/** When your routing table is too long, you can split it into small modules**/

import Layout from '@/layout'

const iterarionRouter = {
  path: '/iteration',
  component: Layout,
  redirect: 'noRedirect',
  name: 'Iteration',
  children: [
    {
      path: 'index',
      component: () => import('@/views/iteration/index'),
      name: 'IterationIndex',
      meta: { title: '迭代', icon: 'iteration', affix: true }
    },
    {
      path: 'duration',
      hidden: true,
      component: () => import('@/views/iteration/developer/duration'),
      name: 'IterationDuration',
      meta: { title: '迭代估时', noCache: true, roles: ['developer'] }
    }
  ]
}

export default iterarionRouter
