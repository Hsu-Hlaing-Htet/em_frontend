import PublicLayout from '@/layouts/public/PublicLayout.vue';
// Public Pages
import LandingPage from '@/modules/public/pages/LandingPage.vue';
import AboutPage from '@/modules/public/pages/AboutPage.vue';
import PropertiesPage from '@/modules/public/pages/PropertiesPage.vue';
import PropertyDetailPage from '@/modules/public/pages/PropertyDetailPage.vue';
import BuyPage from '@/modules/public/pages/BuyPage.vue';
import RentPage from '@/modules/public/pages/RentPage.vue';
import BookingRequestPage from '@/modules/public/pages/BookingRequestPage.vue';
import ContactPage from '@/modules/public/pages/ContactPage.vue';
// Auth Routes
import { authRoutes } from '@/routes/authRoute';

export const publicRoutes = [
    {
        path: '/',
        component: PublicLayout,
        children: [
            {
                path: '',
                name: 'landing',
                component: LandingPage,
            },
            {
                path: 'about',
                name: 'about',
                component: AboutPage,
            },
            {
                path: 'properties',
                name: 'properties',
                component: PropertiesPage,
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
                path: 'booking',
                name: 'booking',
                component: BookingRequestPage,
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