import axios from 'axios'
import { store } from '../redux/store'

axios.defaults.baseURL = 'http://localhost:8000'//配置好后可以直接用相对路径，不用每次输入url

// axios.defaults.headers
// axios.interceptors.request.use
// axios.interceptors.response.use

//添加请求拦截器
axios.interceptors.request.use(function (config) {
    //在发送请求之前执行某些操作
    //显示loading
    store.dispatch({
        type: 'change_spinning',
        payload: true
    })
    return config;
}, function (error) {
    //处理请求错误
    return Promise.reject(error);
});

// 添加响应拦截器
axios.interceptors.response.use(function (response) {
    //2xx范围内的任何状态代码都会触发此功能
    //处理响应数据
    store.dispatch({
        type: 'change_spinning',
        payload: false
    })
    return response;
}, function (error) {
    //任何超出2xx范围的状态代码都会触发此功能
    //处理响应错误
    return Promise.reject(error);
});