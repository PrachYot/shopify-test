const tokenGet = (token: string) => {
  return localStorage.getItem(token);
};

const tokenSet = (token: string, value: string) => {
  localStorage.setItem(token, value);
};

export { tokenGet, tokenSet };
