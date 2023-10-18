// router.js
import { createRouter, createWebHistory } from 'vue-router';

const routes = [
  {
    path: '/',
    name: 'Home',
    component: () => import('../views/Home.vue'),
  },
  {
    path: '/meetings',
    name: 'Meetings',
    component: () => import('../views/MeetingsList.vue'),
    props: true,
  },
  {
    path: '/new-meeting',
    name: 'New Meeting',
    component: () => import('../views/AddMeeting.vue'),
    props: true,
  },
  {
    path: '/meeting/:meetingId',
    name: 'MeetingDetails',
    component: () => import('../views/AddMeetingDetails.vue'),
    props: true,
  },
  {
    path: '/editmeeting/:meetingId',
    name: 'EditMeetingDetails',
    component: () => import('../views/EditMeetingDetails.vue'),
    props: true,
  },
  {
    path: '/editpoint/:pointId',
    name: 'EditPoint',
    component: () => import('../views/EditPoint.vue'),
    props: true,
  },
  {
    path: '/editmaterials/:pointId',
    name: 'EditMaterials',
    component: () => import('../views/EditMaterials.vue'),
    props: true,
  },
  {
    path: '/editmeetinginfo/:meetingId',
    name: 'EditMeetingInfo',
    component: () => import('../views/EditMeetingInfo.vue'),
    props: true,
  },

  
  {
    path: '/guest-meetings',
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

export default router;
