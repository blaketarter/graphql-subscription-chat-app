import { withFilter } from "apollo-server";
import { v4 as uuidv4 } from "uuid"
import { pubsub, MESSAGE_ADDED } from "./subscriptions";
import { Message, Conversation } from "./types"

const conversations = new Map<string, Conversation>()


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
    conversations() {
      return conversations.values()
    },
    conversation(_root: unknown, { conversationId }: { conversationId: string }, context: unknown) {
      return conversations.get(conversationId)
    }
  },
  Mutation: {
    addMessage(_root: unknown, { author, body, conversationId }: { author: string, body: string, conversationId: string }, _context: unknown) {
      const conversation = conversations.get(conversationId)

      if (!conversation) {
        throw new Error("No conversation found")
      }

      const id = uuidv4()

      const message: Message = {
        id,
        author,
        body,
        conversation,
        createdAt: new Date()
      }

      conversation.messages.push(message)
      conversation.updatedAt = new Date()

      pubsub.publish(MESSAGE_ADDED, { messageAdded: message })

      return message
    },
    createConversation(_root: unknown, _args: {}, _context: unknown) {
      const id = uuidv4()
      const now = new Date()

      const conversation: Conversation = {
        id,
        messages: [],
        createdAt: now,
        updatedAt: now
      }

      conversations.set(id, conversation)

      return conversation
    },
  },
};