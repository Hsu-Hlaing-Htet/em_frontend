import PublicLayout from '@/public/layouts/PublicLayout.vue';
import LandingPage from './entry/LandingPage.vue';
import AboutPage from './entry/AboutPage.vue';
import PropertiesPage from './entry/PropertiesPage.vue';
import PropertyDetailPage from './entry/PropertyDetailPage.vue';
import BuyPage from './entry/BuyPage.vue';
import RentPage from './entry/RentPage.vue';
import BookingRequestPage from './entry/BookingRequestPage.vue';
import ContactPage from './entry/ContactPage.vue';
import { authRoutes } from '@/modules/auth/authRoute';

export const publicRoutes = [
    {
        path: '/',
        component: PublicLayout,
        children: [
            { path: '', name: 'landing', component: LandingPage },
            { path: 'about', name: 'about', component: AboutPage },
            { path: 'properties', name: 'properties', component: PropertiesPage },
            { path: 'properties/:id', name: 'property-detail', component: PropertyDetailPage, props: true },
            { path: 'buy', name: 'buy', component: BuyPage },
            { path: 'rent', name: 'rent', component: RentPage },
            { path: 'booking', name: 'booking', component: BookingRequestPage },
            { path: 'contact', name: 'contact', component: ContactPage },
            ...authRoutes,
        ],
    },
];
