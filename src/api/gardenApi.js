import axios from 'axios';

const instance = axios.create({
	baseURL: 'https://leafs-app.lab-code.com:8443/',
});

// Никита ip 172.16.10.125
// Сервак ip 172.16.0.6, https://leafs-app.lab-code.com/
// Мой ip http://172.16.10.122:8080

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
