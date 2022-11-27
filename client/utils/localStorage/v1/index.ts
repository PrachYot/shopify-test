const tokenGet = (token: string) => {
  return localStorage.getItem(token);
};

export { tokenGet };
