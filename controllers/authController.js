const bcrypt = require('bcrypt');
const { User } = require('../models/User');
const Joi = require('joi');
const validate = require('../middleware/validate');

exports.login_post = [
  validate(validateData),
  async (req, res, next) => {
    const user = await User.findOne({ email: req.body.email }).select(
      'username password isAdmin'
    );
    if (!user) return res.status(401).send('Unauthorized');

    const validpassword = await bcrypt.compare(
      req.body.password,
      user.password
    );

    if (!validpassword) return res.status(401).send('Unauthorized');

    const accessToken = user.generateAuthToken();
    const refreshToken = user.generateRefrechToken();
    //store refrch token inside db within user

    const result = await User.updateOne(
      { _id: user._id },
      {
        $set: {
          refreshToken: refreshToken,
        },
      }
    );

    res.cookie('jwt', refreshToken, {
      httpOnly: true,
      sameSite: 'None',
      secure: true,
      maxAge: 24 * 60 * 60 * 1000,
    });
    res.status(200).json({
      accessToken: accessToken,
      user: { username: user.username, isAdmin: user.isAdmin },
    });
  },
];

function validateData(data) {
  const schema = Joi.object({
    email: Joi.string().email().required().max(255),
    password: Joi.string()
      .pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%]).{8,24}$/)
      .required()
      .max(255),
  });

  return schema.validate(data);
}
