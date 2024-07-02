import axios from 'axios';

//设置请求头 创建实例时配置默认值
const apiRequest = axios.create({
  baseURL: '/api', //注意因为在.umirc.ts当中设置了代理即(proxy),直接写入代理的变量名称即可，无需再写入http://localhost:5000
  timeout: 2000, //所有使用此实例的请求都将等待2秒，然后才会超时
});

// 请求拦截
``;
//设置请求头
apiRequest.interceptors.request.use((config) => {
  return config;
});
// 响应拦截
apiRequest.interceptors.response.use(
  (response) => {
    return response;
  },
  (err) => {
    console.log('访问失败', err);
  },
);
export default apiRequest;
