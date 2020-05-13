import qs from 'qs';
import _pt from '~/assets/js/porcupine-tools';
import axiosSupply from './axios.supply';
/**
 * 获取setcookie中有效值
 * @param  {String/array} obj set-cookie值
 * @return {string}     抓取到的set-cookie有效值
 */
function getShiro(obj) {
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

export default function ({store, redirect, app: { $axios, $cookies, $message }})  {
    axiosSupply.mixin($axios);

    $axios.defaults.headers['Content-Type'] = 'application/x-www-form-urlencoded;charset=UTF-8';
    $axios.defaults.withCredentials = true;

    //request拦截器
    $axios.interceptors.request.use(config => {
        return new Promise((resolve) => {
            resolve(config);
        });
	}, function (error) {
        // 对请求错误做些什么
        return Promise.reject(error);
    });
	// response拦截器
	$axios.interceptors.response.use(({data, config, headers}) => {
        return axiosSupply.resInterceptors(data, config, headers);
	});
}
