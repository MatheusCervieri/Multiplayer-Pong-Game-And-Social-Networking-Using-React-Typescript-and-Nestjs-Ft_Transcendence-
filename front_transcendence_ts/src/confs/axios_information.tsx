import axios from 'axios';

export const serverurl = 'http://localhost:3001';

const instance = axios.create({
    baseURL: serverurl,
    headers: { 'Content-Type': 'application/json' },
});

export default instance;