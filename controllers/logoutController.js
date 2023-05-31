const { User } = require('../models/User');
const auth = require('../middleware/auth');

const handleLogout = [
  async (req, res) => {
    //on client side remove acess token from state
    const cookies = req.cookies;
    if (!cookies?.jwt) return res.sendStatus(204); // no content to send back and sucess.

    const refreshToken = cookies.jwt;

    //is refreshtoken in db ?
    let user = await User.findOne({ refreshToken: refreshToken });
    if (!user) {
      res.clearCookie('jwt', {
        httpOnly: true,
        sameSite: 'None',
        secure: true,
      });
      return res.sendStatus(204); //forbidden
    }
    //delete refresh token in db :
    const result = await User.updateOne(
      { _id: user._id },
      {
        $set: {
          refreshToken: '',
        },
      }
    );

    res.clearCookie('jwt', { httpOnly: true, sameSite: 'None', secure: true }); //on prod add {secure:true}
    res.sendStatus(204);
  },
];

module.exports = { handleLogout };
