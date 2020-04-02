export default{
    install: function(Vue){
        Vue.component('my-nav-menu', function(){return import(/*webpackChunkName: 'my-coms'*/ './my-nav-menu')});

        Vue.component('my-pagination', function(){return import(/*webpackChunkName: 'my-coms'*/ './my-pagination')});
        Vue.component('my-table', function(){return import(/*webpackChunkName: 'my-coms'*/ './my-table')});
        Vue.component('my-search', function(){return import(/*webpackChunkName: 'my-coms'*/ './my-search')});

        Vue.component('my-form', function(){return import(/*webpackChunkName: 'my-coms'*/ './my-form')});
        Vue.component('my-checkbox', function(){return import(/*webpackChunkName: 'my-coms'*/ './my-checkbox')});
        Vue.component('my-radio', function(){return import(/*webpackChunkName: 'my-coms'*/ './my-radio')});
        Vue.component('my-select', function(){return import(/*webpackChunkName: 'my-coms'*/ './my-select')});
        Vue.component('my-upload', function(){return import(/*webpackChunkName: 'my-coms'*/ './my-upload')});

        Vue.component('my-dialog', function(){return import(/*webpackChunkName: 'my-coms'*/ './my-dialog')});
        Vue.component('my-tree', function(){return import(/*webpackChunkName: 'my-coms'*/ './my-tree')});

        Vue.component('cnzz', function(){return import(/*webpackChunkName: 'my-coms'*/ './cnzz')});
    }
}
