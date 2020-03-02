import superagentPromise from 'superagent-promise';
import _superagent from 'superagent';

const superagent = superagentPromise(_superagent, global.Promise);

const API_ROOT = 'http://localhost:3001/api';

const encode = encodeURIComponent;
const responseBody = res => res.body;

let token = null;
const tokenPlugin = req => {
  if (token) {
    req.set('authorization', `Token ${token}`);
  }
}

const requests = {
  del: url =>
    superagent.del(`${API_ROOT}${url}`).use(tokenPlugin).then(responseBody),
  get: url =>
    superagent.get(`${API_ROOT}${url}`).use(tokenPlugin).then(responseBody),
  put: (url, body) =>
    superagent.put(`${API_ROOT}${url}`, body).use(tokenPlugin).then(responseBody),
  post: (url, body) => superagent.post(`${API_ROOT}${url}`, body).use(tokenPlugin).then((res) => {
    console.log("RESPONSE in agent", res)
    responseBody(res)
  })
};

const Auth = {
  current: () =>
    requests.get('/user'),
}

const limit = (count, p) => `limit=${count}&offset=${p ? p * count : 0}`;
const limitCount = 9;
// const omitSlug = content => Object.assign({}, content, { slug: undefined })

const Contents = {
  parse: value =>
    requests.post(`/contents/parse?url=${value}`),
}

export default {
  Contents,
  setToken: _token => { token = _token; }
};
