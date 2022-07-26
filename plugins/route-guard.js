// 导航守卫插件，滚动效果不好，未使用

export default function({app}) {
    app.router.beforeEach((to, from , next) => {
        next();
    });

    app.router.afterEach((to, from) => {
        var nuxtCon = document.querySelector('#__nuxt');

        nuxtCon.scrollTo(0, 0);
    });
}