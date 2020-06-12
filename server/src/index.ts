import { ApolloServer } from 'apollo-server';
import { typeDefs } from './typeDefs';
import { resolvers } from './resolvers';
import { subscriptionsConfig } from './subscriptions';

const server = new ApolloServer({ typeDefs, resolvers, subscriptions: subscriptionsConfig, cors: true });

server.listen().then(({ url, subscriptionsUrl }) => {
  console.log(`🚀  Server ready at ${url}`);
  console.log(`🚀 Subscriptions ready at ${subscriptionsUrl}`);
});