export default (function(){
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

    /**
	 * 责任链类
	 * @constructor
	 */
	owner.Chain = function () {
		this.chain_arr = [];
	}
	owner.Chain.prototype = {
		/**
		 * 链的内容
		 * @param  {function} fun 待执行函数，包含两个参数：通用参数及执行下一环节的函数
		 * @return {this}     返回自身，可链式调用
		 */
		link: function (fun) {
			var that = this;
			if (typeof (fun) == 'function') {
				this.chain_arr.push(fun);
			};
			return this;
		},
		/**
		 * 执行责任链
		 * @param  {Object} obj 责任链中的通用参数
		 * @return {null}     [description]
		 */
		run: function (obj) {
			var that = this,
				index = 0,
				obj = obj;

			var loop = function () {
				var this_node = that.chain_arr[index];
				index++;
				if (!!this_node) {
					return this_node(obj, loop)
				}
			};

			loop();
		}
	};

    //对象深拷贝
	owner.clone = function (obj) {
		// Handle the 3 simple types, and null or undefined
		if (null == obj || "object" != typeof obj) return obj;

		// Handle Date
		if (obj instanceof Date) {
			var copy = new Date();
			copy.setTime(obj.getTime());
			return copy;
		}

		// Handle Array
		if (obj instanceof Array) {
			var copy = [];
			for (var i = 0, len = obj.length; i < len; ++i) {
				copy[i] = clone(obj[i]);
			}
			return copy;
		}

		// Handle Object
		if (obj instanceof Object) {
			var copy = {};
			for (var attr in obj) {
				if (obj.hasOwnProperty(attr)) copy[attr] = clone(obj[attr]);
			}
			return copy;
		}

		throw new Error("Unable to copy obj! Its type isn't supported.");
	}

    /********
	接收地址栏参数
	key:参数名称
	**********/
	owner.getSearch = function (key) {
		var hash = [];
		try {
			hash = window.location.search.split('?')[1].split("&");
		} catch (e) {}
		var hashObj = {};
		hash.forEach(function (item) {
			hashObj[item.split("=")[0]] = item.split("=")[1];
		});
		if (!!key)
			return /%u/.test(hashObj[key]) ? decodeURIComponent(hashObj[key]) : hashObj[key];
		else
			return hashObj;
	}

	/**
	 * 将对象转化成search字符串
	 * @param  {Object} obj  对象或数组
	 * @param  {boolean} flag 是否携带'?'
	 * @return {string}      返回的格式化后字符串
	 */
	owner.toSearch = function (obj, flag) {
		var res = '?'
		if (typeof obj == 'object' && Array.isArray(obj)) {
			obj.forEach(function (item, index) {
				res += ('[' + index + ']=' + owner.toSearch(item, true) + '&');
			});
		} else if (typeof obj == 'object') {
			Object.keys(obj).forEach(function (key) {
				if (typeof obj[key] == 'object' && Array.isArray(obj[key])) {
					obj[key].forEach(function (item, index) {
						res += (key + '[' + index + ']=' + owner.toSearch(item, true) + '&')
					});
				} else if (typeof obj[key] == 'object' && obj[key] != null) {
					res += (owner.toSearch(obj[key], true) + '&');
				} else {
					var item = /[\u3220-\uFA29]/.test(obj[key]) ? encodeURIComponent(obj[key]) : obj[key];
					res += (key + '=' + (item || '') + '&');
				}

			});
		} else {
			return obj;
		}
		return !!flag ? res.slice(1, -1) : res.slice(0, -1);
	};

    /**
	 * 下载功能
	 * @param  {string} path 附件服务器完整地址
	 * @return {Boolean}      结果
	 */
	owner.downloader = function (path) {
		var eleA = document.createElement('a');
		if ('download' in eleA) {
			eleA.setAttribute('download', path);
			eleA.setAttribute('href', path);

			eleA.innerHTML = 'downloading';

			document.body.appendChild(eleA);

			setTimeout(function () {
				eleA.click();
				document.body.removeChild(eleA);
			}, 1000 / 24);
			return true;
		};

		try {
			var elemIF = document.createElement("iframe");
			elemIF.style.display = "none";
			document.body.appendChild(elemIF);
			elemIF.src = path;
			setTimeout(function () {
				document.body.removeChild(elemIF);
			}, 333);
			return true;
		} catch (e) {
			var form = document.createElement('form');
			form.setAttribute('method', 'get');
			form.setAttribute('action', path);
			document.body.appendChild(form);
			setTimeout(function () {
				form.submit();
				document.body.removeChild(form);
			}, 1000 / 24);
			return true;
		}

		if (!window.open(url)) { // popup blocked, offer direct download:
			if (confirm("请使用右键-另存为进行下载，完成后点击后退返回当前页面")) {
				location.href = url;
			}
		}
		return true;
	}

    /**
	 * 遍历型对象混入，将obj混入target
	 * @param  {Object} obj    待混入的对象
	 * @param  {Object} target 混入目标对象
	 * @param  {Boolean} state  是否覆盖混入
	 * @return {object}        混入后的对象
	 */
	owner.mixin = function (obj, target, state) {
        obj = obj || {};
		Object.keys(obj).forEach(function (key) {
			if (state) {
				target[key] = obj[key];
			} else {
				if (!target[key])
					target[key] = obj[key];
			}
		});
		return target;
	}

    return owner;
}())
