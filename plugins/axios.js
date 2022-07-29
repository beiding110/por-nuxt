import _pt from '~/assets/js/app-node';
import axiosSupply from './axios.supply';

export default function (context)  {
    var app = context.app;

    axiosSupply.mixin(app.$axios, app);
    
    app.$axios.defaults.withCredentials = true;

    //request拦截器
    app.$axios.interceptors.request.use(config => {
        return new Promise((resolve) => {
            resolve(config);
        });
	}, function (error) {
        // 对请求错误做些什么
        return Promise.reject(error);
    });

	// response拦截器
	app.$axios.interceptors.response.use(({data, config, headers}) => {
        return axiosSupply.resInterceptors(data, config, headers, context);
	});
}
