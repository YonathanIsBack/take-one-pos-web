import RoutePath from '../constants/RoutePath';

function getMenuUrl(): string {
  const basePath = import.meta.env.BASE_URL;
  const pathname = window.location.pathname;

  if (basePath && basePath !== '/' && pathname.startsWith(basePath)) {
    return `/${pathname.slice(basePath.length)}`.replace(/\/+$/, '') || '/';
  }

  return pathname;
}

function fetchWithAuth(input: RequestInfo, init?: RequestInit): Promise<Response> {
  const token = localStorage.getItem('token');

  const headers = new Headers(init?.headers);

  headers.set('X-Menu-Url', getMenuUrl());

  if (token) {
    headers.set('Authorization', `Bearer ${token}`);
  }

  return fetch(input, { ...init, headers }).then((response) => {
    if (response.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('username');
      localStorage.removeItem('displayName');
      window.location.href = `${import.meta.env.BASE_URL}${RoutePath.LOGIN.replace(/^\//, '')}`;
    }
    return response;
  });
}

export default fetchWithAuth;
