const { JWT_SECRET } = require("../config/index");
const jwt = require("jsonwebtoken");

const verifyToken = (req, res, next) => {
  // ++++++++++++++++++++++++++++++++++++
  // NEW METHOD FOR REACT JS APP
  // ++++++++++++++++++++++++++++++++++++
  // try {
  //   let token = req.headers["x-access-token"];
  //   console.log("Auth Token", req);
  //   if (!token) {
  //     return res
  //       .status(401)
  //       .json({ success: false, message: "Un Authorized user" });
  //   }
  //   const verified = jwt.verify(token, JWT_SECRET);
  //   if (!verified) {
  //     return res.status(401).json({
  //       success: false,
  //       message: "Token Verification failed Authorization denied",
  //     });
  //   }
  //   req.userID = verified.userID;
  //   next();
  // } catch (err) {
  //   console.log("** Error in JWT Verification ***", err.message);
  //   res.status(500).json({ error: err.message });
  // }

  // *************************************
  // OLD METHOD
  // *************************************
  if (!req.headers.authorization) {
    res.status(401).json({ success: false, message: "Un Authorized Access" });
  }
  let token = req.headers.authorization.split(" ")[1];
  if (token === "null") {
    res.status(401).json({ success: false, message: "Un Authorized Access" });
  }
  let payload = jwt.verify(token, JWT_SECRET);
  if (!payload) {
    res.status(401).json({ success: false, message: "Un Authorized Access" });
  }
  req.userID = payload.userID;
  // console.log("Auth req.userID ====", req.userID);
  // console.log("Payload ", payload);
  // console.log('Payload User ID', payload.userID);
  // console.log('verify ID', req.userID);
  next();
};

module.exports = verifyToken;
