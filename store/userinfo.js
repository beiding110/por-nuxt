export const state = () => ({
    user: {}
})

export const mutations = {
    update(state, n) {
        state.user = n;
    }
}
