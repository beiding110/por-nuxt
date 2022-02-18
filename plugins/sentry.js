import Vue from 'vue';
import config from '~/configs';

import * as Sentry from "@sentry/vue";
import { BrowserTracing } from "@sentry/tracing";


export default function({ app, isDev }) {
    if(!isDev && config.plugins.sentry){
        Sentry.init({
            Vue,
            dsn: config.plugins.sentry.dsn,
            integrations: [
                new BrowserTracing(),
            ],
            // Set tracesSampleRate to 1.0 to capture 100%
            // of transactions for performance monitoring.
            // We recommend adjusting this value in production
            tracesSampleRate: 1.0,
            logErrors: true,
        });
    }
}
