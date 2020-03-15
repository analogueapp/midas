import superagentPromise from 'superagent-promise';
import _superagent from 'superagent';

const superagent = superagentPromise(_superagent, global.Promise);

const API_ROOT = process.env.NODE_ENV === 'production' ? 'https://www.analogue.app/api' : 'http://localhost:3001/api';

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
  post: (url, body) => superagent.post(`${API_ROOT}${url}`, body).use(tokenPlugin).then(responseBody),
};

const Auth = {
  current: () =>
    requests.get('/user'),
}

const limit = (count, p) => `limit=${count}&offset=${p ? p * count : 0}`;
const limitCount = 9;

const Contents = {
  parse: value =>
    requests.post(`/contents/parse?url=${value}`),
}

const Logs = {
  update: (log) =>
    requests.put(`/logs/${log.id}`, { log }),
}

const Knots = {
  create: (knot, log) =>
    requests.post(`/knots`, { knot: knot, log_id: log.id }),
}

export default {
  Logs,
  Knots,
  Contents,
  setToken: _token => { token = _token; }
}
