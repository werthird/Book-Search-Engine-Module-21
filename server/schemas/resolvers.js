const { AuthenticationError } = require('apollo-server-express');
const { User, Book } = require('../models');
const { signToken } = require('../utils/auth');


const resolvers = {
  Query: {
    // Find one user
    me: async (_, _, context) => {
      if (context.user) {
        return User.findOne({ _id: context.user._id });
      }
      throw new AuthenticationError('You need to be logged in!');
    },
  },

  Mutation: {
    // Login
    login: async (_, { email, password }) => {
      const user = await User.findOne({ email });

      if(!user) {
        throw new AuthenticationError('No user found with this email address.');
      };
      const correctPw = await user.isCorrectPassword(password);

      if (!correctPw) {
        throw new AuthenticationError('Incorrect credentials');
      }
      const token = signToken(user);
      return { token, user };
    },
    // Create user
    addUser: async (_, { username, email, password }) => {
      const user = await User.create({ username, email, password });
      const token = signToken(user);
      return { token, user };
    },
    // Save a book
    saveBook: async (_, { author, description, title, bookId, image, link }, context ) => {
      if (context.user) {
        const updatedUser = await User.findOneAndUpdate(
          { _id: ID },
          { $addToSet: { savedBooks: author, description, title, bookId, image, link }},
          { new: true, runValidators: true }
        );
      } 
      throw new AuthenticationError('You need to be logged in!');
    },
    // Remove a book
    removeBook: async (_, { bookId }, context) => {
      if (context.user) {
        const updatedUser = await User.findOneAndUpdate(
          { _id: ID },
          { $pull: { savedBooks: { bookId: params.bookId } } },
          { new: true }
        );
        return updatedUser;
      }
      throw new AuthenticationError('You need to be logged in!');
    }
  }
}