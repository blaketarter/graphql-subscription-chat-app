import { gql } from "apollo-server";

export const typeDefs = gql`
  scalar Date

  type Message {
    id: String!
    author: String!
    body: String!
    conversation: Conversation!
    createdAt: Date!
  }

  type Conversation {
    id: String!
    messages: [Message!]!
    createdAt: Date!
    updatedAt: Date!
  }

  type Subscription {
    messageAdded(conversationId: String!): Message!
  }

  type Query {
    conversations: [Conversation!]!
    conversation(conversationId: String!): Conversation
  }

  type Mutation {
    addMessage(author: String!, body: String!, conversationId: String!): Message!
    createConversation(test: String): Conversation!
  }
`;