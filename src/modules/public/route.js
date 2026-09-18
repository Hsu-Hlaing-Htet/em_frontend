import PublicLayout from '@/layouts/public/PublicLayout.vue';
import HomePage from './home/Home.vue';
import AboutPage from './aboutus/AboutPage.vue';
import PropertyDetailPage from './propertyDetailPage/PropertyDetailPage.vue';
import PropertiesPage from './properties/PropertiesPage.vue';
import BuyPage from './sale/Sale.vue';
import RentPage from './rent/Rent.vue';
import Service from './services/Service.vue';
import ContactPage from './contact/ContactPage.vue';
import PrivacyPolicy from './legal/PrivacyPolicy.vue';
import TermsConditions from './legal/TermsConditions.vue';
import PublicNotFound from './NotFound.vue';

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
                path: 'about',
                name: 'about',
                component: AboutPage,
            },
            {
                path: 'aboutus',
                redirect: { name: 'about' },
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
                path: 'services',
                name: 'services',
                component: Service,
            },
            {
                path: 'contact',
                name: 'contact',
                component: ContactPage,
            },
            {
                path: 'privacy',
                name: 'privacy',
                component: PrivacyPolicy,
            },
            {
                path: 'terms',
                name: 'terms',
                component: TermsConditions,
            },
            {
                path: ':pathMatch(.*)*',
                name: 'public-not-found',
                component: PublicNotFound,
            },
        ],
    },
];
