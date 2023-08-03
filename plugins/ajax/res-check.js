import util from './util';
import configs from '~/configs'
import { MessageBox } from 'element-ui';

const LOGIN_URL = '/';

function isNode(cb1, cb2) {
    if(typeof window === 'undefined') {
        cb1 && cb1();
    } else {
        cb2 && cb2();
    };
};

export default function(obj, settings, callback, context){
    var innerCallback = callback,
        switchObj;

    if (arguments.length === 2) {
        innerCallback = settings;
    }

    const consoleString = JSON.stringify({
        request: settings,
        response: obj
    });

    var switchObj = {
        v: () => {
            innerCallback && innerCallback(obj.data, obj);

            return [obj.tdata, obj];
        },
        pglist: () => {
            innerCallback && innerCallback(obj.data, obj);
            
            return obj;
        },
        valerror: () => {
            settings.error && settings.error();

            isNode(() => {
                console.error(consoleString);
            }, () => {
                if(configs.plugins.element) {
                    MessageBox({
                        message: obj.msg,
                        type: 'error'
                    });
                } else {
                    alert('valerror:' + obj.msg);
                };
            });
            return false;
        },
        'login-index': () => {
            settings.error && settings.error();

            isNode(() => {
                console.warn(consoleString);
                redirect('/login');
            }, () => {
                if(configs.plugins.element) {
                    MessageBox({
                        message: obj.msg,
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
            settings.error && settings.error();

            isNode(() => {
                console.warn(`即将redirect：${consoleString}`);

                var redirectfrom = context.route.path,
                    redirectto = obj.url;

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
                            window.location.assign(obj.url);
                        }
                    });
                } else {
                    window.location.assign(obj.url);
                };
            });
            return false;
        },
        error: () => {
            settings.error && settings.error();
            
            isNode(() => {
                console.error(consoleString);
            }, () => {
                if(configs.plugins.element) {
                    MessageBox({
                        message: obj.msg,
                        type: 'error'
                    });
                } else {
                    alert('error:' + obj.msg);
                };
                throw new Error(JSON.stringify(consoleString));
            });
            return false;
        }
    };

    return switchObj[obj.code]
        ? switchObj[obj.code]()
        : (function() {
            isNode(() => {
                console.error(settings);
            }, () => {
                MessageBox({
                    message: obj.msg,
                    type: 'error',
                });
            });

            util.throwError({
                settings,
                obj,
                msg: 'unexpeted ajaxResCheck code'
            });
        }());
}
