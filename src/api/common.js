import { createAPI } from 'create-api';
import { fetchOpts, callback, authOpts, __API_URL__ } from './helper';

const api = createAPI();

export default {
    holiday() {
        return api(`${__API_URL__}/api/holidayNotice/holiday`, fetchOpts('GET'))
            .then(res => callback(res))
    }
};
