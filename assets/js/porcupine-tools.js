export default function(){
    var owner = {};

    /**
     * 获取变量类型
     * @param  {Any} obj 待获取类型变量
     * @return {String}     变量类型
     */
    owner.getType = function (obj) {
        return Object.prototype.toString.call(obj).slice(8, -1).toLowerCase();
    },

    /**
     * 获取请求头中的cookie对应值
     * @param  {String} cname 名称
     * @param  {Object} cookie   cookie
     * @return {String}       对应值
     */
    owner.getCookieByName = function (cname, cookie) {
        let name = cname + "=";
        let decodedCookie;
        if (typeof window === 'undefined') decodedCookie = decodeURIComponent(cookie);
        else decodedCookie = decodeURIComponent(document.cookie);
        let ca = decodedCookie.split(';');
        for (let i = 0; i < ca.length; i++) {
            let c = ca[i];
            while (c.charAt(0) == ' ') {
                c = c.substring(1);
            };
            if (c.indexOf(name) == 0) {
                return c.substring(name.length, c.length);
            }
        };
        return "";
    };
    /**
	 * 设置storage基方法
	 * @param  {string} type sessionStorage或localStorage
	 * @param  {string} key  要取的key
	 * @return {string|Object}      对应存储的数据
	 */
	function getStorage(type, key) {
		var res = !!key ?
			window[type][key] ?
			((/{|}|%7B|%7D|\[|\]|%5B|%5D/.test(window[type][key]) ?
				JSON.parse(unescape(window[type][key])) :
				unescape(window[type][key]))) : undefined :
			window[type];
		return res || false;
	}
	/**
	 * 获取storage基方法
	 * @param {string} type  sessionStorage或localStorage
	 * @param {string|object} key   要设置的key或整个对象
	 * @param {Object} value 已设置的结果
	 */
	function setStorage(type, key, value) {
		if (typeof key === 'string') {
			window[type][key] = (typeof value === 'object') ? escape(JSON.stringify(value)) : escape(value);
		} else if (typeof key === 'object') {
			Object.keys(key).forEach(function (item) {
				window[type][item] = (typeof value === 'object') ? escape(JSON.stringify(key[item])) : escape(key[item]);
			});
		};
		return window[type];
	}

	/**
	 * 获取localStorage里的数据
	 * @param  {string} key 待获取的key
	 * @return {string|Object} 取回的值
	 */
	owner.getLocal = function (key) {
		return getStorage('localStorage', key);
	}

	/**
	 * 将值存入localStorage
	 * @param  {string|Object} key   待存值的key或json对象
	 * @param  {string|object} value 待存值的value
	 * @return {object}       存入后localStorage对象
	 */
	owner.setLocal = function (key, value) {
		return setStorage('localStorage', key, value);
	}

	/**
	 * 获取sessionStorage里的数据
	 * @param  {string} key 待获取的key
	 * @return {string|Object} 取回的值
	 */
	owner.getSession = function (key) {
		return getStorage('sessionStorage', key);
	}

	/**
	 * 将值存入sessionStorage
	 * @param  {string|Object} key   待存值的key或json对象
	 * @param  {string|object} value 待存值的value
	 * @return {object}       存入后sessionStorage对象
	 */
	owner.setSession = function (key, value) {
		return setStorage('sessionStorage', key, value);
	}

    return owner;
}
