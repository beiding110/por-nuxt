export const state = () => ({
    cookie: '',
    shiro: ''
})

export const mutations = {
    updateCookie(state, n) {
        state.cookie = n;
    },
    updateShiro(state, n) {
        state.shiro = n;
    }
}

export const getters = {

}
