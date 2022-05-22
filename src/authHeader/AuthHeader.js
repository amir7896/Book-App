const authHeader = () => {
  const token = `Bearer ${localStorage.getItem("x-access-token")}`;
  // const bearerToken = `Bearer ${token}`;
  if (token) {
    // return { Authorization: 'Bearer ' + token }; // for Spring Boot back-end
    return token; // for Node.js Express back-end
  }
};

export default authHeader;
