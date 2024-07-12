const SESSION_KEY = 'session_token';

export const setSession = (sessionToken: string) => {
  localStorage.setItem(SESSION_KEY, sessionToken);
};

export const getSession = () => {
  return localStorage.getItem(SESSION_KEY);
};

export const clearSession = () => {
  localStorage.removeItem(SESSION_KEY);
};
