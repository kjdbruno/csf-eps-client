import { useAuthStore } from 'src/store/auth-store'
import { useUserStore } from 'src/store/user-store'
const routes = [
  {
    path: '/',
    component: () => import('layouts/BlankLayout.vue'),
    children: [
      { path: '', component: () => import('pages/community/Index.vue') }
    ]
  },
  {
    path: '/workplace',
    component: () => import('layouts/CommunityLayout.vue'),
    beforeEnter: (to, from, next) => {
      if (useUserStore().token && (useUserStore().isCitizen)) {
        next()
      } else {
        next(`/error`)
      }
    },
    children: [
      { path: '', component: () => import('pages/Home.vue') }
    ],
  },
  // {
  //   path: '/admin',
  //   component: () => import('layouts/BlankLayout.vue'),
  //   children: [
  //     { path: '', component: () => import('pages/Index.vue') }
  //   ]
  // },
  {
    path: '/admin/workplace',
    component: () => import('layouts/MainLayout.vue'),
    beforeEnter: (to, from, next) => {
      if (useAuthStore().token && (useAuthStore().isAdmin || useAuthStore().isSup || useAuthStore().isMgmt || useAuthStore().isEncoder)) {
        next()
      } else {
        next(`/error`)
      }
    },
    children: [
      { path: '', component: () => import('pages/Home.vue') }
    ],
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/Error404.vue')
  }
]

export default routes
