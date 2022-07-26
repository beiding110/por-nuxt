import Vue from 'vue'
import configs from '~/configs'
import { MessageBox } from 'element-ui';
import qs from 'qs';

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

function argsCheck(a, b, c, d) {
    var obj = {
        url: a,
        data: {},
        callback: function () {},
        fztype: false
    };

    var args = [];
    args.push.apply(args, arguments);
    args = args.filter(item => item);

    if (args.length == 2 && typeof b == 'function') {
        obj.callback = b;
    } else if (args.length == 2 && typeof b != 'function') {
        obj.data = b;
    } else if (args.length == 3) {
        if (typeof args[args.length - 1] == 'boolean') {
            obj.data = b;
            obj.fztype = c;
        } else {
            obj.data = b;
            obj.callback = c;
        }
    } else if (args.length == 4) {
        obj.data = b;
        obj.callback = c;
        obj.fztype = d;
    }

    return obj
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

        axios.get(settings.url, {
            params: settings.data
        }).then(([data, res]) => {
            settings.callback.call(this, data, res);
        });
    };

    function $post(a, b, c, d) {
        var settings = argsCheck(a, b, c, d);

        let data = settings.data;
        settings.data = (settings.fztype ? data : qs.stringify(data));

        axios.post(settings.url, settings.data, {
            headers: {
                'Content-Type': (settings.fztype ? 'application/json;charset=UTF-8' : 'application/x-www-form-urlencoded;charset=UTF-8')
            },
        }).then(([data, res]) => {
            settings.callback.call(this, data, res);
        });
    };

    function $ajax(settings) {
        var keyMap = ajaxKeyMap(settings.type),
        axiosSetting = {};

        keyMap.forEach(item => {
            axiosSetting[item[1]] = settings[item[0]];
        });
        axiosSetting.headers = axiosSetting.headers || {};
        axiosSetting.headers['Content-Type'] = (axiosSetting.fztype ? 'application/json;charset=UTF-8' : 'application/x-www-form-urlencoded;charset=UTF-8')
        if(axiosSetting.method === 'post' && !axiosSetting.fztype) {
            axiosSetting.data = qs.stringify(axiosSetting.data);
        };

        axios(axiosSetting).then(([data, res]) => {
            axiosSetting.callback && axiosSetting.callback.call(this, data, res);
        }).catch(e => {
            axiosSetting.error && axiosSetting.error.call(this, data, res);
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
    var redirect = context.redirect;

    const consoleString = JSON.stringify({
        request: config,
        response: data
    });

    var switchObj = {
        v: () => data.tdata,
        pglist: () => data,
        valerror: () => {
            config.error && config.error();

            isNode(() => {
                console.error(consoleString);
            }, () => {
                if(configs.plugins.element) {
                    MessageBox({
                        message: data.msg,
                        type: 'error'
                    });
                } else {
                    alert('valerror:' + data.msg);
                };
            });
            return false;
        },
        'login-index': () => {
            config.error && config.error();

            isNode(() => {
                console.warn(consoleString);
                redirect('/login');
            }, () => {
                if(configs.plugins.element) {
                    MessageBox({
                        message: data.msg,
                        type: 'error',
                        callback: () => {
                            window.location.assign('/login');
                        }
                    });
                } else {
                    window.location.assign('/login');
                };
            });

            return false;
        },
        'redirect': () => {
            config.error && config.error();

            isNode(() => {
                console.warn(`即将redirect：${consoleString}`);

                var redirectfrom = context.route.path,
                    redirectto = data.url;

                redirect({
                    path: redirectto,
                    query: {
                        ...context.route.query,
                        redirectfrom
                    }
                });
            }, () => {
                if(configs.plugins.element) {
                    MessageBox({
                        message: data.msg,
                        type: 'error',
                        callback: () => {
                            window.location.assign(data.url);
                        }
                    });
                } else {
                    window.location.assign(data.url);
                };
            });
            return false;
        },
        error: () => {
            config.error && config.error();
            
            isNode(() => {
                console.error(consoleString);
            }, () => {
                if(configs.plugins.element) {
                    MessageBox({
                        message: data.msg,
                        type: 'error'
                    });
                } else {
                    alert('error:' + data.msg);
                };
                throw new Error(JSON.stringify(consoleString));
            });
            return false;
        }
    };

    var fun = switchObj[data.code],
        res = false;

    if (fun) {
        res = fun();
    } else {
        console.error(data);
    }

    if (data.code === 'v') {
        return [res, data];
    } else if (res !== false) {
        return [res, data];
    } else {
        return false;
    }
}

export default {
    mixin,
    resInterceptors
}
