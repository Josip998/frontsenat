// router.js
import { createRouter, createWebHistory } from 'vue-router';
import store from '/store/store.js'; // Import your Vuex store

// Define a route guard function
const requireAuth = (to, from, next) => {
  if (!store.getters.isAuthenticated) {
    next('/'); // Redirect to the login page if not authenticated
  } else {
    next(); // Continue to the requested route if authenticated
  }
};

const routes = [
  {
    path: '/login',
    name: 'Login',
    component: () => import('../views/Login.vue'),
  },
  {
    path: '/meetings',
    name: 'Meetings',
    component: () => import('../views/MeetingsList.vue'),
    props: true,
    meta: { requiresAuth: true },
  },
  {
    path: '/new-meeting',
    name: 'New Meeting',
    component: () => import('../views/AddMeeting.vue'),
    props: true,
    meta: { requiresAuth: true },
  },
  {
    path: '/meeting/:meetingId',
    name: 'MeetingDetails',
    component: () => import('../views/AddMeetingDetails.vue'),
    props: true,
    meta: { requiresAuth: true },
  },
  {
    path: '/editmeeting/:meetingId',
    name: 'EditMeetingDetails',
    component: () => import('../views/EditMeetingDetails.vue'),
    props: true,
    meta: { requiresAuth: true },
  },
  {
    path: '/editpoint/:pointId',
    name: 'EditPoint',
    component: () => import('../views/EditPoint.vue'),
    props: true,
    meta: { requiresAuth: true },
  },
  {
    path: '/editmaterials/:pointId',
    name: 'EditMaterials',
    component: () => import('../views/EditMaterials.vue'),
    props: true,
    meta: { requiresAuth: true },
  },
  {
    path: '/editmeetinginfo/:meetingId',
    name: 'EditMeetingInfo',
    component: () => import('../views/EditMeetingInfo.vue'),
    props: true,
    meta: { requiresAuth: true },
  },
  {
    path: '/',
    name: 'GuestMeetings',
    component: () => import('../views/MeetingsListForGuests.vue'),
    props: true,
  },
  {
    path: '/meetings/:meetingId',
    name: 'MeetingView',
    component: () => import('../views/MeetingViewForGuests.vue'),
    props: true,
  },

];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach((to, from, next) => {
  if (to.meta.requiresAuth) {
    requireAuth(to, from, next);
  } else {
    next(); // No authentication required for this route
  }
});

export default router;
