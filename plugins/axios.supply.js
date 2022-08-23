import Vue from 'vue'
import resError from './ajax/res-error';
import intercptorsReq from './ajax/interceptors-req';
import argsCheck from './ajax/args-check';
import resCheck from './ajax/res-check';

/**
* 判断是否为服务器端
* @param  {Function}  cb1 服务器端回调函数
* @param  {Function}  cb2 非服务器端回调函数
* @return {null}     无返回值
*/
function isNode(cb1, cb2) {
    if(typeof window === 'undefined') {
        cb1 && cb1();
    } else {
        cb2 && cb2();
    };
};

var ajaxKeyMap = function(type) {
    return [
        ['type', 'method'],
        ['url', 'url'],
        ['data', (type === 'post' ? 'data' : 'params')],
        ['callback', 'callback'],
        ['error', 'error'],
        ['complete', 'complete'],
        ['fztype', 'fztype'],
        ['headers', 'headers']
    ]
}

var mixin = (axios, app) => {
    function $get(a, b, c, d) {
        var settings = argsCheck(a, b, c, d);

        settings.type = 'get';
        settings = intercptorsReq(settings, app);

        axios.get(settings.url, {
            params: settings.data,
            headers: settings.headers,
        }).then(([data, res]) => {
            settings.callback.call(this, data, res);
        }).catch(err => {
            if (err.response) {
                resError(err.response, settings, app);
            } else {
                console.error({
                    err,
                    settings,
                });
            }
        });
    };

    function $post(a, b, c, d) {
        var settings = argsCheck(a, b, c, d);

        settings.type = 'post';
        settings = intercptorsReq(settings, app);

        axios.post(settings.url, settings.data, {
            headers: settings.headers,
        }).then(([data, res]) => {
            settings.callback.call(this, data, res);
        }).catch(err => {
            if (err.response) {
                resError(err.response, settings, app);
            } else {
                console.error({
                    err,
                    settings,
                });
            }
        });
    };

    function $ajax(settings) {
        var keyMap = ajaxKeyMap(settings.type),
        axiosSetting = {};

        keyMap.forEach(item => {
            axiosSetting[item[1]] = settings[item[0]];
        });
        
        axiosSetting = intercptorsReq(axiosSetting, app);

        axios(axiosSetting).then(([data, res]) => {
            axiosSetting.callback && axiosSetting.callback.call(this, data, res);
        }).catch(err => {
            if (err.response) {
                resError(err.response, axiosSetting, app);
            } else {
                console.error({
                    err,
                    settings,
                });
            }
        }).finally(() => {
            axiosSetting.complete && axiosSetting.complete.call(this);
        });
    };

    Vue.prototype.$get = $get;
    Vue.prototype.$post = $post;
    Vue.prototype.$ajax = $ajax;

    app.$get = $get;
    app.$post = $post;
    app.$ajax = $ajax;
};

var resInterceptors = (data, config, header, context) => {
    return resCheck(data, config, (data, res) => {
        return [data, res];
    }, context);
}

export default {
    mixin,
    resInterceptors
}
