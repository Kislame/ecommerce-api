const mongoose = require('mongoose');
const Joi = require('joi');
const jwt = require('jsonwebtoken');
require('dotenv').config();
const { User } = require('../models/User');

const handleRefreshToken = async (req, res) => {
  const cookies = req.cookies;

  if (!cookies?.jwt) return res.sendStatus(401);
  const refreshToken = cookies.jwt;

  let user = await User.findOne({ refreshToken: refreshToken });
  if (!user) return res.sendStatus(403); //forbidden

  try {
    const decodedPayload = jwt.verify(
      refreshToken,
      process.env.JWT_REFRESH_KEY
    );
    const accessToken = user.generateAuthToken();
    res.json({
      accessToken: accessToken,
      user: { username: user.username, isAdmin: user.isAdmin },
    });
  } catch (ex) {
    res.sendStatus(403);
  }
};

module.exports = { handleRefreshToken };
