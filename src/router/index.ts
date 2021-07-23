import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router';
import General from '../views/General.vue';
import CustomAdler from '../views/CustomAdler.vue';
import MainMenu from '../views/MainMenu.vue';
import Verify from '../views/Verify.vue';
import Done from '../views/Done.vue';

const routes: Array<RouteRecordRaw> = [
    {
        path: '/:catchAll(.*)',
        redirect: '/general'
    },
    {
        path: '/general',
        component: General
    },
    {
        path: '/custom_adler',
        component: CustomAdler
    },
    {
        path: '/main_menu',
        component: MainMenu
    },
    {
        path: '/verify',
        component: Verify
    },
    {
        path: '/done',
        component: Done
    }
];

const router = createRouter({
    history: createWebHistory(process.env.BASE_URL),
    routes
});

export default router;
