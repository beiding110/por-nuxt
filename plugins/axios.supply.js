import Vue from 'vue'
import resError from './ajax/res-error';
import intercptorsReq from './ajax/interceptors-req';
import argsCheck from './ajax/args-check';

import configs from '~/configs'
import { MessageBox } from 'element-ui';

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
