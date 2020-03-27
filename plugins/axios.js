import qs from 'qs';
import _pt from '~/assets/js/porcupine-tools';

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

/**
 * 获取setcookie中有效值
 * @param  {String/array} obj set-cookie值
 * @return {string}     抓取到的set-cookie有效值
 */
function getShiro(obj) {
    // const matchReg = /shiroSessionId=.+?; /;
    // var cookieAdd = '',
    //     switchObj = {
    //     string: function() {
    //         cookieAdd = matchReg.exec(obj)[0];
    //     },
    //     array: function() {
    //         obj.forEach(item => {
    //             cookieAdd = ((matchReg.exec(item) || [])[0] || cookieAdd);
    //         });
    //     },
    //     undefined: function() {}
    // };
    // switchObj[_pt.getType(obj)]();
    //
    // return cookieAdd;
    //
    //
    var cookieAdd = '',
        switchObj = {
        string: function() {
            cookieAdd = _pt.getCookieByName('shiroSessionId', obj);
        },
        array: function() {
            obj.forEach(item => {
                cookieAdd = (_pt.getCookieByName('shiroSessionId', obj) || cookieAdd);
            });
        },
        undefined: function() {}
    };
    switchObj[_pt.getType(obj)]();

    return cookieAdd;
};

export default function ({store, redirect, app: { $axios, $cookies }})  {
    $axios.defaults.headers['Content-Type'] = 'application/x-www-form-urlencoded;charset=UTF-8';
    $axios.defaults.withCredentials = true;

	$axios.onRequest(config => {
        return new Promise((resolve) => {
            var switchObj = {
                post: () => {
                    let data = config.data;
                    config.data = qs.stringify(data);
                },
                get: () => {
                    let data = config.params;
                    config.data = qs.stringify(data);
                }
            };
            switchObj[config.method]();

            resolve(config);
        });
	});
    $axios.onResponse(res => {

    });
	$axios.onError(error => {

	});

    //request拦截器
    $axios.interceptors.request.use(function (request) {
        // var shiroSessionId = _pt.getCookieByName('shiroSessionId', request.headers.common.cookie),
        //     shiroSessionId_cookie = $cookies.get('shiroSessionId');
        // if(shiroSessionId && !shiroSessionId_cookie) {
        //     $cookies.set('shiroSessionId', setCookie);
        //     store.commit('cookie/updateShiro', setCookie);
        // };

        return request;
    }, function (error) {
        // 对请求错误做些什么
        return Promise.reject(error);
    });
	// response拦截器
	$axios.interceptors.response.use(({data, config, headers}) => {
        const consoleString = JSON.stringify({
            request: config,
            response: data
        });

        var switchObj = {
            v: () => data,
            pglist: () => data,
            valerror: () => {
                isNode(() => {
                    console.error(consoleString);
                }, () => {
                    alert('valerror:' + data.msg)
                });
                return data;
            },
            'login-index': () => {
                isNode(() => {
                    console.warn(consoleString);
                }, () => {
                    // redirect('/');
                });
                return data;
            },
            error: () => {
                isNode(() => {
                    console.error(consoleString);
                }, () => {
                    alert('error:' + data.msg);
                });
                return data;
            }
        };

        console.log(headers)
        // var shiroSessionId = getShiro(headers['set-cookie']),
        //     shiroSessionId_cookie = $cookies.get('shiroSessionId');
        // if(shiroSessionId && !shiroSessionId_cookie) {
        //     $cookies.set('shiroSessionId', setCookie);
        //     store.commit('cookie/updateShiro', setCookie);
        // };

        return switchObj[data.code]();
	});

    // $axios.interceptors.response.use(response => {
    //     console.log(JSON.stringify(response))
    // })
}
