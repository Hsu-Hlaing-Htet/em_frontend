import { createRouter, createWebHistory } from 'vue-router';
import { useAuthStore } from '@/modules/auth/store';
import { publicRoutes } from '../modules/public/route.js';
import { authRoutes } from '../modules/auth/route.js';
import { adminRoutes } from '../modules/admin/route.js';
// import { userRoutes } from '../modules/user/route.js';

const routes = [
    ...publicRoutes,
    ...adminRoutes,
    // ...userRoutes,
    ...authRoutes,
    {
        path: '/:pathMatch(.*)*',
        redirect: '/',
    },
];

function scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
        return savedPosition;
    }

    if (to.hash) {
        return new Promise((resolve) => {
            window.setTimeout(() => {
                resolve({ el: to.hash, top: 96, behavior: 'smooth' });
            }, 340);
        });
    }

    return { top: 0, behavior: 'smooth' };
}

const router = createRouter({
    history: createWebHistory(),
    routes,
    scrollBehavior,
});

router.beforeEach(async (to, from, next) => {
    const auth = useAuthStore();
    await auth.ensureLoaded();

    // #region agent log
    fetch('http://127.0.0.1:7923/ingest/23465e0c-eb0a-42c6-a1cf-6932802664b7',{method:'POST',headers:{'Content-Type':'application/json','X-Debug-Session-Id':'516e3b'},body:JSON.stringify({sessionId:'516e3b',runId:'post-fix',location:'routes/index.js:beforeEach',message:'guard entry',data:{to:to.fullPath,from:from.fullPath,isAuthenticated:auth.isAuthenticated,role:auth.role,requiresAuth:!!to.meta.requiresAuth},timestamp:Date.now(),hypothesisId:'H1'})}).catch(()=>{});
    // #endregion

    if (to.meta.requiresAuth && !auth.isAuthenticated) {
        // #region agent log
        fetch('http://127.0.0.1:7923/ingest/23465e0c-eb0a-42c6-a1cf-6932802664b7',{method:'POST',headers:{'Content-Type':'application/json','X-Debug-Session-Id':'516e3b'},body:JSON.stringify({sessionId:'516e3b',runId:'post-fix',location:'routes/index.js:requiresAuth',message:'blocked requiresAuth',data:{to:to.fullPath,isAuthenticated:auth.isAuthenticated},timestamp:Date.now(),hypothesisId:'H1'})}).catch(()=>{});
        // #endregion
        return next({ name: 'login' });
    }

    if (to.path.startsWith('/admin') && auth.isAuthenticated) {
        const adminRoles = ['super_admin', 'admin'];

        if (!adminRoles.includes(auth.role)) {
            // #region agent log
            fetch('http://127.0.0.1:7923/ingest/23465e0c-eb0a-42c6-a1cf-6932802664b7',{method:'POST',headers:{'Content-Type':'application/json','X-Debug-Session-Id':'516e3b'},body:JSON.stringify({sessionId:'516e3b',runId:'post-fix',location:'routes/index.js:adminRole',message:'blocked admin role',data:{to:to.fullPath,role:auth.role},timestamp:Date.now(),hypothesisId:'H2'})}).catch(()=>{});
            // #endregion
            return next({ name: 'login' });
        }
    }

    if (to.meta.role && auth.role !== to.meta.role) {
        if (auth.role === 'admin' || auth.role === 'super_admin') {
            return next({ name: 'admin-dashboard' });
        }

        return next({ name: 'login' });
    }

    if (to.meta.guestOnly && auth.isAuthenticated) {
        return next(
            auth.role === 'admin' || auth.role === 'super_admin'
                ? { name: 'admin-dashboard' }
                : { name: 'login' },
        );
    }

    // #region agent log
    fetch('http://127.0.0.1:7923/ingest/23465e0c-eb0a-42c6-a1cf-6932802664b7',{method:'POST',headers:{'Content-Type':'application/json','X-Debug-Session-Id':'516e3b'},body:JSON.stringify({sessionId:'516e3b',runId:'post-fix',location:'routes/index.js:allow',message:'guard allow',data:{to:to.fullPath},timestamp:Date.now(),hypothesisId:'H1'})}).catch(()=>{});
    // #endregion

    return next();
});

export default router;
