const jwt = require("jsonwebtoken");
const { secret_key } = require("../config/variable");

const generateJWT = (user) => {
  const data = {
    id: user.id,
    name: user.name,
    email: user.email,
  };
  const signarture = secret_key;
  const exp = "1h";

  return jwt.sign({ data }, signarture, { expiresIn: exp });
};

module.exports = { generateJWT };
