// @flow

import 'isomorphic-fetch';
import $ from 'jquery';

import { API_KEY, KEY_SESSION } from 'config/constants';
import { localStorage, sessionStorage } from 'utils';

export const API_VERSION = 'v1';
export const API_BASE = `http://localhost:5000/api/${ API_VERSION }`;

const accessToken = () => {
  let session = localStorage.loadState(KEY_SESSION);
  if(undefined === session.session) session = sessionStorage.loadState(KEY_SESSION);
  if(undefined !== session.session && undefined !== session.session.token) return session.session.token;
  return '';
};
export const get = (url: string, status: number, hdr: any): Promise<*> => {
  let headers: any = hdr || {
    'Accept'        : 'application/json',
    'Content-Type'  : 'application/json',
    'apikey'        : API_KEY,
    'access-token'  : accessToken()
  };

  let opts = {
    method: 'GET',
    headers,
    contentType: false,
    processData: false,
  };
  accessToken();
  return fetch(url, opts)
    .then(resp => {
      if (resp.status !== status) {
        return Promise.reject(`Expect code ${ status } but got ${ resp.status }`);
      }

      return resp.json();
    });
};

export const post = (url: string, body: any, status: number, hdr: any): Promise<*> => {
  let headers: any = hdr || {
    'Accept'        : 'application/json',
    'Content-Type'  : 'application/json',
    'apikey'        : API_KEY,
    'access-token'  : accessToken()
  };
  let opts = {
    method: 'POST',
    headers,
    contentType: false,
    processData: false,
    body: JSON.stringify(body)
  };

  return fetch(url, opts)
    .then(resp => {
      if (resp.status !== status) {
        return Promise.reject(`Expect code ${ status } but got ${ resp.status }`);
      }
      return resp.json();
    });
}

export const put = (url: string, body: any, status: number, hdr: any): Promise<*> => {
  let headers: any = hdr || {
    'Accept'        : 'application/json',
    'Content-Type'  : 'application/json',
    'apikey'        : API_KEY,
    'access-token'  : accessToken()
  };

  let opts = {
    method: 'PUT',
    headers,
    contentType: false,
    processData: false,
    body: JSON.stringify(body)
  };

  return fetch(url, opts)
    .then(resp => {
      if (resp.status !== status) {
        return Promise.reject(`Expect code ${ status } but got ${ resp.status }`);
      }

      return resp.json();
    });
}

export const patch = (url: string, body: any, status: number, hdr: any): Promise<*> => {
  let headers: any = hdr || {
    'Accept'        : 'application/json',
    'Content-Type'  : 'application/json',
    'apikey'        : API_KEY,
    'access-token'  : accessToken()
  };

  let opts = {
    method: 'PATCH',
    headers,
    contentType: false,
    processData: false,
    body: JSON.stringify(body)
  };

  return fetch(url, opts)
    .then(resp => {
      if (resp.status !== status) {
        return Promise.reject(`Expect code ${ status } but got ${ resp.status }`);
      }

      return resp.json();
    });
}

export const del = (url: string, status: number, hdr: any): Promise<*> => {
  let headers: any = hdr || {
    'Accept'        : 'application/json',
    'Content-Type'  : 'application/json',
    'apikey'        : API_KEY,
    'access-token'  : accessToken()
  };

  let opts = {
    method: 'DELETE',
    headers,
    contentType: false,
    processData: false,
  };

  return fetch(url, opts)
    .then(resp => {
      if (resp.status !== status) {
        return Promise.reject(`Expect code ${ status } but got ${ resp.status }`);
      }
      let rs = resp.json();
        return rs;
    })
    .catch(e => {
        return e;
    })
}


export const upload = (url: string, body: any, status: number, hdr: any): Promise<*> => {
  let headers: any = hdr || {
    'apikey'        : API_KEY,
    'access-token'  : accessToken()
  };
  let opts = {
    method: 'POST',
    headers,
    data: body,
    url,
    contentType: false,
    processData: false,
  };

  return $.ajax({
    ...opts,
    success: (res) => res,
    error: err => err
  });

}

