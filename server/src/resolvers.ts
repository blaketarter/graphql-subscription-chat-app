import { withFilter } from "apollo-server";
import { v4 as uuidv4 } from "uuid"
import { pubsub, MESSAGE_ADDED } from "./subscriptions";
import { Message, Conversation, Author } from "./types"

const conversations = new Map<string, Conversation>()
const authors = new Map<string, Author>()

export const resolvers = {
  Subscription: {
    messageAdded: {
      subscribe: withFilter(
        () => pubsub.asyncIterator([MESSAGE_ADDED]),
        ({ messageAdded }: { messageAdded: Message }, args: { conversationId: string }) => {
          return messageAdded.conversation.id === args.conversationId
        },
      )
    }
  },
  Query: {
    author(_root: unknown, { authorId }: { authorId: string }, _context: unknown) {
      return authors.get(authorId)
    },
    conversation(_root: unknown, { conversationId }: { conversationId: string }, context: unknown) {
      return conversations.get(conversationId)
    }
  },
  Mutation: {
    createAuthor(_root: unknown, { name }: { name: string }, _context: unknown) {
      const id = uuidv4()
      const now = new Date()

      const author = {
        id,
        name,
        messages: [],
        conversations: [],
        createdAt: now,
        updatedAt: now,
      }

      authors.set(id, author)

      return author
    },
    addMessage(_root: unknown, { authorId, body, conversationId }: { authorId: string, body: string, conversationId: string }, _context: unknown) {
      const conversation = conversations.get(conversationId)

      if (!conversation) {
        throw new Error("No conversation found")
      }

      const author = authors.get(authorId)

      if (!author) {
        throw new Error("No author found")
      }

      const id = uuidv4()
      const now = new Date()

      const message: Message = {
        id,
        author,
        body,
        conversation,
        createdAt: now
      }

      conversation.messages.push(message)
      conversation.updatedAt = now

      if (!conversation.participants.find(participant => participant.id === authorId)) {
        conversation.participants.push(author)
        author.conversations.push(conversation)
        author.updatedAt = now
      }

      pubsub.publish(MESSAGE_ADDED, { messageAdded: message })

      return message
    },
    createConversation(_root: unknown, { name, authorId }: { name: string, authorId: string }, _context: unknown) {
      const author = authors.get(authorId)

      if (!author) {
        throw new Error("No author found")
      }

      const id = uuidv4()
      const now = new Date()

      const conversation: Conversation = {
        id,
        name,
        messages: [],
        participants: [author],
        createdAt: now,
        updatedAt: now
      }

      author.conversations.push(conversation)
      author.updatedAt = now

      conversations.set(id, conversation)

      return conversation
    },
    joinConversation(_root: unknown, { conversationId, authorId }: { conversationId: string, authorId: string }, _context: unknown) {
      const author = authors.get(authorId)

      if (!author) {
        throw new Error("No author found")
      }

      const conversation = conversations.get(conversationId)

      if (!conversation) {
        throw new Error("No conversation found")
      }

      const now = new Date()

      if (!conversation.participants.find(participant => participant.id === authorId)) {
        conversation.participants.push(author)
        author.conversations.push(conversation)
        author.updatedAt = now
        conversation.updatedAt = now
      }

      return conversation
    },
    leaveConversation(_root: unknown, { conversationId, authorId }: { conversationId: string, authorId: string }, _context: unknown) {
      const author = authors.get(authorId)

      if (!author) {
        throw new Error("No author found")
      }

      const conversation = conversations.get(conversationId)

      if (!conversation) {
        throw new Error("No conversation found")
      }

      const now = new Date()

      if (conversation.participants.find(participant => participant.id === authorId)) {
        conversation.participants = conversation.participants.filter(participant => participant.id !== author.id)
        author.conversations = author.conversations.filter(authorConversation => authorConversation.id !== conversation.id)
        author.updatedAt = now
        conversation.updatedAt = now
      }

      if (conversation.participants.length === 0) {
        conversations.delete(conversation.id)
      }

      return conversation
    },
  },
};