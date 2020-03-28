import Vue from 'vue';
import Raven from 'raven-js';
import RavenVue from 'raven-js/plugins/vue';
import config from '~/configs';

export default function({ app, isDev }) {
    if(!isDev){
        Raven
        .config(config.plugins.sentry.dsn)
        .addPlugin(RavenVue, Vue)
        .install();
    }
}
