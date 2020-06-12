import { ApolloServer, gql } from 'apollo-server';
import { PubSub } from 'graphql-subscriptions';

export const pubsub = new PubSub();

const typeDefs = gql`
  type Message {
    author: String!
    body: String!
  }

  type Subscription {
    messageAdded: Message!
  }

  type Query {
    messages: [Message!]!
  }

  type Mutation {
    addMessage(author: String!, body: String!): Message!
  }
`;

interface Message {
  author: string
  body: string
}

const messages: Message[] = [
  {
    author: 'Jolby Johnson',
    body: 'Hey',
  },
  {
    author: 'Alex Anders',
    body: 'What\'s up?',
  },
];

const MESSAGE_ADDED = 'MESSAGE_ADDED'

const resolvers = {
  Subscription: {
    messageAdded: {
      subscribe() {
        return pubsub.asyncIterator([MESSAGE_ADDED])
      },
    }
  },
  Query: {
    messages() {
      return messages
    },
  },
  Mutation: {
    addMessage(_root: unknown, args: Message, _context: unknown) {
      messages.push(args)
      pubsub.publish(MESSAGE_ADDED, { messageAdded: args })

      return args
    }
  }
};

const server = new ApolloServer({ typeDefs, resolvers });

server.listen().then(({ url, subscriptionsUrl }) => {
  console.log(`🚀  Server ready at ${url}`);
  console.log(`🚀 Subscriptions ready at ${subscriptionsUrl}`);
});