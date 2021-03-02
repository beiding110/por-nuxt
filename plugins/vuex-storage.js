import createPersistedState from 'vuex-persistedstate';
import * as Cookies from "js-cookie";
import _pt from '~/assets/js/app-node';
import config from '~/configs';

const type = config.plugins.vuexStorage;

let cookieStorage = {
    getItem: function(key) {
        return Cookies.getJSON(key);
    },
    setItem: function(key, value) {
        return Cookies.set(key, value, {expires: 3, secure: false});
    },
    removeItem: function(key) {
        return Cookies.remove(key);
    }
};
let sessionStorageStorage = {
    getItem: function(key) {
        return _pt.getSession(key);
    },
    setItem: function(key, value) {
        return _pt.setSession(key, value);
    },
    removeItem: function(key) {
        return _pt.setSession(key, '');
    }
};

export default (context) => {
    var switchObj = {
        cookie: () => {
            createPersistedState({
                storage: cookieStorage,
                getState: cookieStorage.getItem,
                setState: cookieStorage.setItem
            })(context.store);
        },
        session: () => {
            createPersistedState({
                storage: sessionStorageStorage,
                getState: sessionStorageStorage.getItem,
                setState: sessionStorageStorage.setItem
            })(context.store);
        }
    };
    switchObj[type]();
};
