import RoutePath from '../constants/RoutePath';

function fetchWithAuth(input: RequestInfo, init?: RequestInit): Promise<Response> {
  const token = localStorage.getItem('token');

  const headers = new Headers(init?.headers);

  if (token) {
    headers.set('Authorization', `Bearer ${token}`);
  }

  return fetch(input, { ...init, headers }).then((response) => {
    if (response.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('username');
      localStorage.removeItem('displayName');
      window.location.href = RoutePath.LOGIN;
    }
    return response;
  });
}

export default fetchWithAuth;
