export const isAdmin = (role) => {
  if (role === "ADMIN") {
    return true;
  }

  return false;
};
