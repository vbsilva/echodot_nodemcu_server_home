import axios from 'axios';

export default axios.create({
    baseURL: 'http://192.168.25.83:80/',
    timeout: 1000
});