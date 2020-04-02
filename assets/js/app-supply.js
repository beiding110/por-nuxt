import Vue from 'vue'
(function(owner) {
    /**
     * 生成表单校验规则
     * @return {Object} 生成的校验规则
     */
    owner.newRule = function() {
        let arg = [], rules = [];
        arg = Array.prototype.slice.apply(arguments);
        let label = arg.splice(0, 1),
            changeState = false;

        const typeMap = {
            string: '字符串',
            number: '数字',
            boolean: '布尔',
            method: '方法',
            regexp: '正则',
            integer: 'integer',
            float: '浮点数',
            array: '数组',
            object: '对象',
            enum: 'enum',
            date: '日期',
            url: 'url地址',
            hex: '哈希',
            email: '电子邮件'
        }

        arg.forEach(function(item) {
            if(item === 'change') {
                changeState = true;
            }

            if(item === 'required') {
                rules.push.apply(rules, [{
                    required: true,
                    message: '请输入' + label,
                    trigger: ['blur']
                }, {
                    validator(rules, value, callback) {
                        if(typeof value === 'string') {
            				if(!value.replace(/^\s+|\s+$/g,"")) {
            					return callback(new Error('内容不能为空格'))
            				}
            			}
            			callback();
            		},
                    trigger: ['blur']
                }])
            };

            if (/min/.test(item)) {
                let length = item.split('min')[1];
				rules.push({
					min: parseInt(length),
					message: '至少输入' + length + '个字符',
					trigger: 'blur'
				});
			};

            if (/max/.test(item)) {
                let length = item.split('max')[1];
				rules.push({
					max: parseInt(length),
					message: '至多输入' + length + '个字符',
					trigger: ['blur']
				});
			};

            if(item === 'mobile') {
                rules.push({
                    validator(rules, value, callback) {
            			if (!/^[1][0-9]{10}$/.test(value)) {
            				return callback(new Error('手机号格式错误'));
            			}
            			callback();
            		},
                    trigger: ['blur']
                })
            };

            Object.keys(typeMap).forEach(function(key, index) {
                if(item === key) {
                    rules.push({
                        type: key,
                        message: '请输入正确的' + typeMap[key] + '格式',
                        trigger: ['blur']
                    })
                }
            });
        });

        if(changeState) {
            rules.forEach((item) => {
                item.trigger.push('change');
            })
        }

        return rules
    }

    String.prototype.toDate = function() {
        let time = / /.test(this) ? this : (this + ' 00:00:00');
        time = time.replace(/-/g, '/');
        return (new Date(time));
    }

})(Vue.prototype)
