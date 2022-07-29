import qs from 'qs';

const API = '';

/**
 * 请求拦截器
 * @param {Object} config 请求参数
 * @returns
 */
export default function request(config, app) {
    const TOKEN = app.getToken();

    var { url, fztype, data, callback, complete, type } = config,
        ts = new Date().getTime(),
        headers = {
            'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
            'Authorization': 'Basic YmlkZGluZzpseXhfc2VjcmV0',
            'bidding-auth': TOKEN,
        };

    if (API.globalUrl) {
        url = api.globalUrl + url;
    }

    url = /\?/.test(url) ? url + '&random=' + ts : url + '?random=' + ts;

    if (fztype) {
        headers['Content-Type'] = 'application/json;charset=UTF-8';
        data = JSON.stringify(data);
    } else {
        data = qs.stringify(data);
    }

    callback = callback || function () {};
    complete = complete || function () {};

    type = type || 'get';

    return {
        ...config,
        url,
        data,
        headers,
        type,
        fztype,
        callback,
        complete,
    };
}
