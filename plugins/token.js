import Vue from 'vue';

const TOKEN_NAME = 'bidding-auth';

export default function({ app, isDev }) {
    function getToken() {
        return app.$cookies.get(TOKEN_NAME);
    }

    function setToken(token) {
        return app.$cookies.set(TOKEN_NAME, `bearer ${token}`);
    }

    function removeToken() {
        return app.$cookies.remove(TOKEN_NAME);
    }

    Vue.prototype.getToken = getToken;
    Vue.prototype.setToken = setToken;
    Vue.prototype.removeToken = removeToken;

    app.getToken = getToken;
    app.setToken = setToken;
    app.removeToken = removeToken;
}