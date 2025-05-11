import axios from 'axios'

const instance = axios.create({
    baseURL: 'https://api.noventer.uz/api/v1/',
    headers: {
        'Content-Type': undefined,
    },
})


instance.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('accessToken')
        if (token) {
            config.headers.Authorization = `Bearer ${token}`
        }
        return config
    })

export default instance
