import './bootstrap';
import { createApp } from 'vue';
import { createPinia } from 'pinia';

import PrimeVue from 'primevue/config';
import ToastService from 'primevue/toastservice';
import ConfirmationService from 'primevue/confirmationservice';
import ConfirmDialog from 'primevue/confirmdialog';
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
import './assets/styles/app.css';
import './assets/styles/admin.css';
import App from '@/App.vue';
import router from '@/routes';
import { useThemeStore } from '@/modules/admin/themeStore';

const app = createApp(App);
const pinia = createPinia();

app.use(pinia);
useThemeStore().applyTheme();
app.use(router);
app.use(PrimeVue, { ripple: false });
app.use(ToastService);
app.use(ConfirmationService);
app.component('ConfirmDialog', ConfirmDialog);

app.component('Menubar', Menubar);
app.component('DataTable', DataTable);
app.component('Column', Column);
app.component('Card', Card);
app.component('Dialog', Dialog);
app.component('InputText', InputText);
app.component('Dropdown', Dropdown);
app.component('Calendar', Calendar);
app.component('InputNumber', InputNumber);
app.component('Textarea', Textarea);
app.component('Button', Button);
app.component('Badge', Badge);
app.component('Sidebar', Sidebar);
app.component('TabView', TabView);
app.component('TabPanel', TabPanel);
app.component('Toast', Toast);
app.component('Tag', Tag);
app.component('ProgressSpinner', ProgressSpinner);

app.mount('#app');
