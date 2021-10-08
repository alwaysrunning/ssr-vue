import { ls } from 'vue'
import { createAPI } from 'create-api';

export const fetchAPI = (uri, method) => createAPI()(uri, method).then(res => callback(res))

export function fetchOpts(method, body = null, userIdentity = null) {
  return Object.assign({}, {
    method,
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      ...(userIdentity ? { 'user-identity': userIdentity } : {})
    },
    credentials: 'same-origin'
  }, body ? { body: JSON.stringify(body) } : {});
}

// api that needed header token
export function authOpts(method, body = null) {
  return Object.assign({}, {
    method,
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      'Authorization': `JWT ${ls.get('token', '')}`
    }
  }, body ? { body: JSON.stringify(body) } : {})
}

export function callback(res) {
  if (res.status >= 400) {
    return Promise.reject(res.json())
  }
  return Promise.resolve(res.json())
}

export const __API_URL__ = process.env.FRONT_URL || '';

export default createAPI;