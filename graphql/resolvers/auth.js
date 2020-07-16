const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../../models/user');

module.exports = {
  createUser: async (args) => {
    try {
      const existingUser = await User.findOne({ email: args.userInput.email });
      if (existingUser) {
        throw new Error('User exists already');
      }
      const hashedPassword = await bcrypt.hash(args.userInput.password, 12);
      const user = new User({
        email: args.userInput.email,
        password: hashedPassword,
      });
      const result = await user.save();

      return { ...result._doc, password: null, _id: result.id };
    } catch (err) {
      throw err;
    }
  },

  login: async ({ email, password }) => {
      const existedUser = await User.findOne({email: email});
      if(!existedUser) {
          throw new Error('User does not exist!');
      }
      const isEqual = await bcrypt.compare(password, existedUser.password);
      if (!isEqual) {
          throw new Error('Password is incorrect!');
      }
      const token = jwt.sign({userId:  existedUser.id, email: existedUser.email}, 'somesupersecretkey', {
          expiresIn: '1h'
      });
      return {userId: existedUser.id, token, tokenExpiration: 1}
  },
};
