// @flow

import 'isomorphic-fetch';

import { API_KEY, KEY_SESSION, URL_BASE } from 'config/constants';
import { localStorage, sessionStorage } from 'utils';

export const API_VERSION = 'v1';
export const API_BASE = `${URL_BASE}/api/${ API_VERSION }`;

const generateHeader = (...p) => {
  let [ headers, body = undefined, method = 'GET' ] = p;
  let opts = {
    method,
    headers,
    contentType: false,
    processData: false
  };

  if(!!body) opts.body = JSON.stringify(body);

  return opts;
}

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
    "Access-Control-Allow-Origin" : "*",
    'serectkey'     : API_KEY,
    'access-token'  : accessToken()
  };

  return fetch(url, generateHeader(headers))
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
    'serectkey'     : API_KEY,
    'access-token'  : accessToken()
  };
  
  return fetch(url, generateHeader(headers, body, 'POST'))
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
    'serectkey'     : API_KEY,
    'access-token'  : accessToken()
  };

  return fetch(url, generateHeader(headers, body, 'PUT'))
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
    'serectkey'     : API_KEY,
    'access-token'  : accessToken()
  };

  return fetch(url, generateHeader(headers, body, 'PATCH'))
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
    'serectkey'     : API_KEY,
    'access-token'  : accessToken()
  };

  return fetch(url, generateHeader(headers, undefined, 'DELETE'))
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
