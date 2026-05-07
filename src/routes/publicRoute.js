import PublicLayout from '@/layouts/PublicLayout.vue';
import LandingPage from '@/pages/public/LandingPage.vue';
import AboutPage from '@/pages/public/AboutPage.vue';
import PropertiesPage from '@/pages/public/PropertiesPage.vue';
import PropertyDetailPage from '@/pages/public/PropertyDetailPage.vue';
import BuyPage from '@/pages/public/BuyPage.vue';
import RentPage from '@/pages/public/RentPage.vue';
import BookingRequestPage from '@/pages/public/BookingRequestPage.vue';
import ContactPage from '@/pages/public/ContactPage.vue';
import { authRoutes } from '@/routes/authRoute';

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
