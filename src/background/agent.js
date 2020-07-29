import superagentPromise from 'superagent-promise';
import _superagent from 'superagent';

const superagent = superagentPromise(_superagent, global.Promise);

const API_ROOT = process.env.NODE_ENV === 'production' ? 'https://www.analogue.app/api' : 'http://localhost:3000/api';

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
  primers: () =>
    requests.get("/user/primers"),
  login: user =>
    requests.post('/users/login', { user }),
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
  delete: id =>
    requests.del(`/logs/${id}`),
}

const Knots = {
  all: log =>
    requests.get(`/knots?log_id=${log.id}&preview=true`),
  create: (knot, log) =>
    requests.post(`/knots`, { knot: knot, log_id: log.id }),
  update: knot =>
    requests.put(`/knots/${knot.id}`, { knot }),
  del: id =>
    requests.del(`/knots/${id}`),
}

const Primers = {
  create: primer =>
    requests.post("/primers", { primer }),
  updateLogs: (slug, log_id, remove) => remove
    ? requests.del(`/primers/${slug}/remove/${log_id}`)
    : requests.put(`/primers/${slug}/add/${log_id}`)
}

const Activity = {
  notify: (activities) =>
    requests.post("/activity/notify", { activities }),
}

export default {
  Auth,
  Logs,
  Knots,
  Primers,
  Contents,
  Activity,
  setToken: _token => { token = _token; }
}
