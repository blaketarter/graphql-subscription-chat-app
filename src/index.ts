import { ApolloServer, gql } from 'apollo-server';

const typeDefs = gql`
  type Message {
    author: String
    body: String
  }

  type Query {
    messages: [Message!]!
  }
`;

const messages = [
  {
    author: 'Jolby Johnson',
    body: 'Hey',
  },
  {
    author: 'Alex Anders',
    body: 'What\'s up?',
  },
];

const resolvers = {
  Query: {
    messages: () => messages,
  },
};

const server = new ApolloServer({ typeDefs, resolvers });

server.listen().then(({ url }) => {
  console.log(`🚀  Server ready at ${url}`);
});