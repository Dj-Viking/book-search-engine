const { User } = require('../models');
const { AuthenticationError } = require('apollo-server-express');
const { signToken } = require('../utils/auth.js');

const resolvers = {
  Query: {
    me: async (parent, args, context) => {
      if (context.user) {
        const userData = await User.findOne
        (
          {
            _id: context.user._id
          }
        )
        .select('-__v -password')
        .select('books');
        return userData;
      } else {
        throw new AuthenticationError('Not logged in.')
      }
    }
  },
  Mutation: {
    addUser: async (parent, args) => {
      const user = await User.create(args);
      const token = signToken(user);
      return { token, user };
    },
    login: async (parent, args) => {
      const user = await User.findOne
      (
        {
          email: args.email
        }
      );
      if (!user) {
        throw new AuthenticationError('Incorrect Credentials.');
      }
      const correctPw = await user.isCorrectPassword(args.password);
      if (!correctPw) {
        throw new AuthenticationError('Incorrect Credentials.');
      }
      const token = signToken(user);
      console.log(token);
      return { token, user };
    },
    saveBook: async (parent, args, context) => {
      console.log(args);
      if (context.user) {
        const updatedUser = await User.findOneAndUpdate
        (
          {_id: context.user._id},
          {
            $push: {
              savedBooks: {
                authors: args.authors,
                bookId: args.bookId,
                title: args.title,
                description: args.description,
                image: args.image,
                link: args.link
              }
            }
          },
          { new: true }
        );
        console.log(updatedUser);
        return updatedUser;
      } else {
        throw new AuthenticationError('Must be logged in to do that.');
      }
    },
    removeBook: async (parent, args, context) => {
      if (context.user) {
        const updatedUser = await User.findOneAndUpdate
        (
          {_id: context.user._id},
          {
            $pull: {
              savedBooks: {
                bookId: args.bookId,
              }
            }
          },
          { new: true }
        );
        return updatedUser;
      } else {
        throw new AuthenticationError('Must be logged in to do that.');
      }
    }
  }
};

module.exports = resolvers;