import axios from 'axios';

const instance = axios.create({
    baseURL: 'https://react-my-burger-460a3.firebaseio.com/'
});

export default instance;