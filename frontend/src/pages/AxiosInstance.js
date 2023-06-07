import Axios from 'axios';

const axiosInstance = Axios.create({
    baseURL: 'http://localhost:8900',
    headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}` // Include the token in the Authorization header
    }
});

export default axiosInstance;
