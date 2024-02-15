import './assets/style.css'
import 'primevue/resources/themes/aura-light-indigo/theme.css';
import { createApp } from 'vue'
import { createPinia } from 'pinia'
import PrimeVue from 'primevue/config';

import "primeflex/primeflex.css"
import 'primeicons/primeicons.css'

import StyleClass from 'primevue/styleclass';
       
import Ripple from 'primevue/ripple';

import Button from "primevue/button"
import InputText from 'primevue/inputtext';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import Textarea from 'primevue/textarea';
import Calendar from 'primevue/calendar';
import Badge from 'primevue/badge';
import Message from 'primevue/message';
import Checkbox from 'primevue/checkbox';
import Divider from 'primevue/divider';
import Carousel from 'primevue/carousel';
import VirtualScroller from 'primevue/virtualscroller';
import Tag from 'primevue/tag';
import Fieldset from 'primevue/fieldset';
import Card from 'primevue/card';





import Toast from 'primevue/toast';
import ToastService from 'primevue/toastservice';
import BadgeDirective from 'primevue/badgedirective';
import App from './App.vue'
import router from './router'

const app = createApp(App)

app.use(ToastService);
app.use(PrimeVue, { ripple: true, style: true });
app.use(createPinia())
app.use(router)

app.directive('badge', BadgeDirective);
app.directive('styleclass', StyleClass);
app.directive('ripple', Ripple);



app.component('InputText', InputText);
app.component('PrimeButton', Button);
app.component('DataTable', DataTable);
app.component('PrimeColumn', Column);
app.component('PrimeTextarea', Textarea);
app.component('PrimeCalendar', Calendar);
app.component('PrimeBadge', Badge);
app.component('PrimeMessage', Message);
app.component('PrimeToast', Toast);
app.component('PrimeCheckbox', Checkbox);
app.component('PrimeDivider', Divider);
app.component('PrimeCarousel', Carousel);
app.component('VirtualScroller', VirtualScroller);
app.component('PrimeTag', Tag);
app.component('PrimeFieldset', Fieldset);
app.component('PrimeCard', Card);

app.config.globalProperties.$filters = {
    currencyGBP(value: number | string) {
        return Intl.NumberFormat("en-GB", {
            style: "currency",
            currency: import.meta.env.VITE_APP_REGION === 'UK' ? 'GBP' : 'EUR',
            currencyDisplay: 'symbol',
        }).format(Number(value))
    },
    formatDate: (value: string) => {
        return new Intl.DateTimeFormat('en-GB').format(new Date(value));
    },
    formatDateTime: (value: string) => {
        const options = {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
        };
        return new Intl.DateTimeFormat('en-GB', options).format(new Date(value));
    },
};

app.mount('#app')
