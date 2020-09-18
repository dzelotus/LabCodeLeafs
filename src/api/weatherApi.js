import axios from 'axios';

const instance = axios.create({
	baseURL: 'https://api.openweathermap.org/data/2.5/weather',
});

// Никита ip 172.16.10.125
// Сервак ip 172.16.0.6, https://leafs-app.lab-code.com/

export default instance;
