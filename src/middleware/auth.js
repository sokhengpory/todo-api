const jwt = require('jsonwebtoken');
const User = require('../models/user');

const auth = async (req, res, next) => {
  try {
    const token = req.header('Authorization').split(' ')[1];
    const decoded = jwt.verify(token, 'helloworld');

    const user = await User.findOne(
      { _id: decoded.id, 'tokens.token': token },
      { __v: 0 }
    );

    if (!user) {
      throw new Error();
    }

    req.token = token;
    req.user = user;
    next();
  } catch (err) {
    res.status(401).send({ message: 'Please authenticate' });
  }
};

module.exports = auth;
