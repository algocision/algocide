const isValidPassword = (password: string): boolean => {
  if (password.length < 8) {
    return false;
  } else {
    return true;
  }
};

export default isValidPassword;
