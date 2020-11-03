import { gql } from "apollo-server";

export const typeDefs = gql`
  scalar Date

  type Author {
    id: String!
    name: String!
    createdAt: Date!
    updatedAt: Date!
    conversations: [Conversation!]!
  }

  type Message {
    id: String!
    author: Author!
    body: String!
    conversation: Conversation!
    createdAt: Date!
  }

  type Conversation {
    id: String!
    name: String!
    participants: [Author!]!
    messages: [Message!]!
    createdAt: Date!
    updatedAt: Date!
  }

  type Subscription {
    messageAdded(conversationId: String!): Message!
  }

  type Query {
    author(authorId: String!): Author
    conversation(conversationId: String!): Conversation
  }

  type Mutation {
    createAuthor(name: String!): Author!
    addMessage(body: String!, authorId: String!, conversationId: String!): Message!
    createConversation(name: String!, authorId: String!): Conversation!
    joinConversation(conversationId: String!, authorId: String!): Conversation!
    leaveConversation(conversationId: String!, authorId: String!): Conversation!
  }
`;