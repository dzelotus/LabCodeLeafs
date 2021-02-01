import axios from 'axios';

const instance = axios.create({
	baseURL: 'https://api.leafs.pro',
});

// Никита ip http://172.16.10.106:8080
// Тестовый сервак https://api.dev.lab-code.com
// Боевой сервак https://api.leafs.pro

instance.interceptors.request.use(
	(config) => {
		config.params = {
			isJSONResponse: 1,
		};

		return config;
	},
	(error) => Promise.reject(error),
);

export default instance;
