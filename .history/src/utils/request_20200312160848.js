import axios from "axios";

const BASEURL = process.env.NODE_ENV === 'production' ? '' : '/devApi';
// 创建axios，赋给变量service
const service = axios.create({
    baseURL: BASEURL,  // http://192.168.0.106:8080/devApi/  == http://www.web-jshtml.cn/productapi/productapi
    timeout: 15000,   // 超时
    // 网络请求接口，假设 5000
    // 1000 2000，
});