import './bootstrap';
import { createApp } from 'vue';
import PrimeVue from 'primevue/config';
import ToastService from 'primevue/toastservice';
import Menubar from 'primevue/menubar';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import Card from 'primevue/card';
import Dialog from 'primevue/dialog';
import InputText from 'primevue/inputtext';
import Dropdown from 'primevue/dropdown';
import Calendar from 'primevue/calendar';
import InputNumber from 'primevue/inputnumber';
import Textarea from 'primevue/textarea';
import Button from 'primevue/button';
import Badge from 'primevue/badge';
import Sidebar from 'primevue/sidebar';
import TabView from 'primevue/tabview';
import TabPanel from 'primevue/tabpanel';
import Toast from 'primevue/toast';
import Tag from 'primevue/tag';
import ProgressSpinner from 'primevue/progressspinner';

import 'primevue/resources/themes/aura-light-noir/theme.css';
import 'primevue/resources/primevue.min.css';
import 'primeicons/primeicons.css';
import 'primeflex/primeflex.css';

import './assets/styles/app.css';
import App from '@/App.vue';
import router from '@/routes';

const app = createApp(App);

app.use(router);
app.use(PrimeVue, { ripple: false });
app.use(ToastService);

app.component('PvMenubar', Menubar);
app.component('PvDataTable', DataTable);
app.component('PvColumn', Column);
app.component('PvCard', Card);
app.component('PvDialog', Dialog);
app.component('PvInputText', InputText);
app.component('PvDropdown', Dropdown);
app.component('PvCalendar', Calendar);
app.component('PvInputNumber', InputNumber);
app.component('PvTextarea', Textarea);
app.component('PvButton', Button);
app.component('PvBadge', Badge);
app.component('PvSidebar', Sidebar);
app.component('PvTabView', TabView);
app.component('PvTabPanel', TabPanel);
app.component('PvToast', Toast);
app.component('PvTag', Tag);
app.component('PvProgressSpinner', ProgressSpinner);

app.mount('#app');
