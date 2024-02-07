import { createRouter, createWebHistory } from "vue-router";
import HomeComponent from '@/components/HomeComponent.vue';
import LoginComponent from '@/views/LoginComponent.vue';
// export default인 경우에는 {} 필요없고, 여러개 요소가 있을 경우 {} 필요
import { memberRoutes } from "./memberRouter.js";
import { orderRoutes } from "./orderRouter.js";

const routes = [
    {
        path: '/', // url 경로 지정
        name: 'HOME', // 라우터의 이름
        component: HomeComponent,
    },
    {
        path: '/login',
        name: 'Login',
        component: LoginComponent
    },
    // ...은 스프레드 연산자로 불리며, 주로 배열 요소를 다른 배열 요소에 합할 때 사용
    // memberRoutes의 요소를 가져와서 넣음
    ...memberRoutes,
    ...orderRoutes,
];

const router = createRouter({
    // vue router는 내부적으로 두 가지 방식의 히스토리 관리를 제공
    // 1) createWebHistory, createHashHistory
    history: createWebHistory(),
    routes
});

export default router; // export: 다른 곳에서 갖다 쓰라는 뜻