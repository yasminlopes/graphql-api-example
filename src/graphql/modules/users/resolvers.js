import User from '../../../models/User';
import { USER_ADDED } from './channels';

export default {
  User: {
    fullName: (user) => `${user.firstName} ${user.lastName}`,
  },
  Query: {
    users: async () => await User.find(),
    user: async (_, { id }) => await User.findById(id),
  },
  Mutation: {
    createUser: async (_, { data }, { pubsub }) => {
      const user = await User.create(data);

      pubsub.publish(USER_ADDED, {
        userAdded: user
      })

      return user;
    },
    updateUser: async (_, { id, data }) => await User.findOneAndUpdate(id, data, { new: true }),
    deleteUser: async (_, { id }) => !!(await User.findOneAndDelete(id))
  },
  Subscription: {
    userAdded: {
      subscribe: (obj, arg, { pubsub }) => pubsub.asyncIterator(USER_ADDED)
    }
  }
};
