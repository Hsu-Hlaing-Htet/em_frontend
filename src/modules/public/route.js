import PublicLayout from '@/layouts/public/PublicLayout.vue';
// Public Pages
import HomePage from './home/Home.vue';
import AboutPage from './aboutus/AboutPage.vue';
import PropertyDetailPage from './propertyDetailPage/PropertyDetailPage.vue';
import BuyPage from './sale/Sale.vue';
import RentPage from './rent/Rent.vue';
import Service from './services/Service.vue';
import ContactPage from './contact/ContactPage.vue';
// Auth Routes
import { authRoutes } from '@/routes/authRoute';

export const publicRoutes = [
    {
        path: '/',
        component: PublicLayout,
        children: [
            {
                path: '',
                name: 'home',
                component: HomePage,
            },
            {
                path: 'aboutus',
                name: 'aboutus',
                component: AboutPage,
            },
            {
                path: 'properties/:id',
                name: 'property-detail',
                component: PropertyDetailPage,
                props: true,
            },
            {
                path: 'buy',
                name: 'buy',
                component: BuyPage,
            },
            {
                path: 'rent',
                name: 'rent',
                component: RentPage,
            },
            {
                path: 'services',
                name: 'services',
                component: Service,
            },
            {
                path: 'contact',
                name: 'contact',
                component: ContactPage,
            },

            // Authentication Routes
            ...authRoutes,
        ],
    },
];