export default{
    install: function(Vue){
        // Vue.component('echarts', function(){return import(/*webpackChunkName: 'coms'*/ './echarts')});
        // Vue.component('time-line', function(){return import(/*webpackChunkName: 'coms'*/ './time-line')});

        Vue.component('my-nav-menu', function(){return import(/*webpackChunkName: 'coms'*/ './nav-menu')});

        Vue.component('my-pagination', function(){return import(/*webpackChunkName: 'coms'*/ './pagination')});
        Vue.component('my-table', function(){return import(/*webpackChunkName: 'coms'*/ './table')});
        Vue.component('tree-table', function(){return import(/*webpackChunkName: 'coms'*/ './tree-table')});
        Vue.component('my-search', function(){return import(/*webpackChunkName: 'coms'*/ './search')});

        Vue.component('my-form', function(){return import(/*webpackChunkName: 'coms'*/ './form')});
        Vue.component('my-form-item-group', function(){return import(/*webpackChunkName: 'coms'*/ './form-item-group')});
        Vue.component('my-checkbox', function(){return import(/*webpackChunkName: 'coms'*/ './checkbox')});
        Vue.component('my-radio', function(){return import(/*webpackChunkName: 'coms'*/ './radio')});
        Vue.component('my-select', function(){return import(/*webpackChunkName: 'coms'*/ './select')});
        Vue.component('my-cascader', function(){return import(/*webpackChunkName: 'coms'*/ './cascader')});
        Vue.component('my-transfer', function(){return import(/*webpackChunkName: 'coms'*/ './transfer')});
        Vue.component('my-upload', function(){return import(/*webpackChunkName: 'coms'*/ './upload')});

        Vue.component('my-dialog', function(){return import(/*webpackChunkName: 'coms'*/ './dialog')});
        Vue.component('my-tree', function(){return import(/*webpackChunkName: 'coms'*/ './tree')});

        Vue.component('cnzz', function(){return import(/*webpackChunkName: 'coms'*/ './cnzz')});

        Vue.component('ueditor', function(){return import(/*webpackChunkName: 'coms'*/ './ueditor')});
        Vue.component('tinymce', function(){return import(/*webpackChunkName: 'coms'*/ './tinymce');});

        Vue.component('my-frame', function(){return import(/*webpackChunkName: 'coms'*/ './frame')});
        Vue.component('my-img', function(){return import(/*webpackChunkName: 'coms'*/ './img')});
        Vue.component('pdf', function(){return import(/*webpackChunkName: 'coms'*/ './pdf-js')});
        // Vue.component('word', function(){return import(/*webpackChunkName: 'coms'*/ './word')});
        Vue.component('photo', function(){return import(/*webpackChunkName: 'coms'*/ './picture-view')});
        Vue.component('word-view', function(){return import(/*webpackChunkName: 'coms'*/ './word-view')});
        Vue.component('file-preview', function(){return import(/*webpackChunkName: 'coms'*/ './file-preview');});

        Vue.component('upload-s', function(){return import(/*webpackChunkName: 'coms'*/ './upload-s/index')});
    }
}
