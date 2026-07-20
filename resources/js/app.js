import Vue from 'vue';
import BootstrapVue from 'bootstrap-vue';
import VeeValidate, { Validator } from 'vee-validate';
import moment from 'moment-timezone';
import VueMoment from 'vue-moment';
import Toasted from 'vue-toasted';
import GetTextPlugin from 'vue-gettext';
import AppComponent from './components/app.vue';
import VueRouter from './router';
import VuexStore from './stores';
import Component from './component';
import {
  http,
  IsAlphanumSpaceHyphenUnderscore,
  IsFloat,
  IsLatitude,
  IsLongitude,
} from './services';
import translations from '../../languages/translations.json';
import '../sass/app.scss';

Validator.extend('alpha_num_space', IsAlphanumSpaceHyphenUnderscore);
Validator.extend('float', IsFloat);
Validator.extend('latitude', IsLatitude);
Validator.extend('longitude', IsLongitude);

// Loaded from Sentry's prebuilt CDN bundle rather than the npm package: this
// project's 2019-era Babel/webpack 4 toolchain can't parse the npm SDK's
// modern syntax, and the CDN bundle is a self-contained, pre-transpiled
// build made for exactly this case - it never touches webpack at all.
if (process.env.SENTRY_DSN) {
  const sentryScript = document.createElement('script');
  sentryScript.src = 'https://browser.sentry-cdn.com/10.66.0/bundle.tracing.replay.min.js';
  sentryScript.crossOrigin = 'anonymous';
  sentryScript.onload = () => {
    window.Sentry.init({
      dsn: process.env.SENTRY_DSN,
      environment: process.env.SENTRY_ENVIRONMENT,
      tracesSampleRate: 0.2,
      replaysSessionSampleRate: 0.05,
      replaysOnErrorSampleRate: 1.0,
      sendDefaultPii: false,
    });
  };
  document.head.appendChild(sentryScript);
}

Vue.config.errorHandler = (err, vm, info) => {
  if (window.Sentry) {
    window.Sentry.captureException(err, {
      contexts: { vue: { componentName: vm && vm.$options && vm.$options.name, info } },
    });
  }
  // eslint-disable-next-line no-console
  console.error(err);
};

Vue.use(Component);
Vue.use(BootstrapVue);
Vue.use(VeeValidate);
Vue.use(VueMoment, { moment });
Vue.use(Toasted, {
  theme: 'bubble',
  position: 'bottom-center',
  duration: 1500,
});

Vue.use(GetTextPlugin, {
  availableLanguages: {
    en_GB: 'British English',
    id_ID: 'Bahasa Indonesia',
    hu_HU: 'Magyar Nyelv',
    pt_BR: 'Brazilian Portuguese',
  },
  defaultLanguage: 'en_GB',
  translations,
  silent: false,
});

const App = () => new Vue({
  el: '#app',
  router: VueRouter,
  store: VuexStore,
  created() {
    http.init();
  },
  render: h => h(AppComponent),
});

App();
