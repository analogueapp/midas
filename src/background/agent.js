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
  current: () =>
    requests.get('/user'),
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

const Profile = {
  follow: username =>
    requests.post(`/profiles/${username}/follow`),
  unfollow: username =>
    requests.del(`/profiles/${username}/follow`),
}

const Knots = {
  all: log =>
    requests.get(`/knots?log_id=${log.id}`),
  create: (knot, log) =>
    requests.post(`/knots`, { knot: knot, log_id: log.id }),
  update: knot =>
    requests.put(`/knots/${knot.id}`, { knot }),
  del: id =>
    requests.del(`/knots/${id}`),
  unlike: (id, like_id)  =>
    requests.del(`/knots/${id}/likes/${like_id}`),
  like: id  =>
    requests.post(`/knots/${id}/likes`),
}

const Responses = {
  create: (id, response) =>
    requests.post(`/knots/${id}/responses`, response),
  update: response =>
    requests.put(`/knots/${response.respondableId}/responses/${response.id}`, response),
  del: response =>
    requests.del(`/knots/${response.respondableId}/responses/${response.id}`),
  unlike: (response, like_id)  =>
    requests.del(`/responses/${response.id}/likes/${like_id}`),
  like: response  =>
    requests.post(`/responses/${response.id}/likes`),
}

const Primers = {
  create: primer =>
    requests.post("/primers", { primer }),
  update: (primer) =>
    requests.put(`/primers/${primer.slug}`, { primer }),
  updateLogs: (slug, log_id, remove) => remove
    ? requests.del(`/primers/${slug}/remove/${log_id}`)
    : requests.put(`/primers/${slug}/add/${log_id}`)
}

const Activity = {
  notify: (activities) =>
    requests.post("/activity/notify", { activities }),
  notifications: () =>
    requests.get("/activity/notifications"),
  read: (activityId) =>
    requests.post("/activity/read", { activityId: activityId })
}

export default {
  Auth,
  Logs,
  Knots,
  Profile,
  Primers,
  Contents,
  Activity,
  Responses,
  setToken: _token => { token = _token; }
}
