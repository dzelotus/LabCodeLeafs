import axios from 'axios';

const instance = axios.create({
  baseURL: 'http://172.16.10.122:8080',
});

//Никита ip 172.16.10.125
//Сервак ip 172.16.0.6, https://leafs-app.lab-code.com/
//Мой ip http://172.16.10.122:8080

instance.interceptors.request.use(
  function (config) {
    config.params = {
      isJSONResponse: 1,
    };
    config.headers = {
      Accept: 'application/json',
      'Content-Type': 'multipart/form-data',
    };

    return config;
  },
  function (error) {
    return Promise.reject(error);
  },
);

export default instance;
