const jwt = require("jsonwebtoken");

const JwtSecret = "lj4lk5nm4lkflk5nmgm43lş5krds09v8d4s03lş5904po@dvdo5k45l4";

module.exports = (req, res, next) => {
  try {
    const token = req.headers.authorization.split(" ")[1];
    jwt.verify(token, JwtSecret);
    next();
  } catch (err) {
    res.status(401).json({
      message: "Auth failed!",
    });
  }
};
