import { useMutation, useQuery, useSubscription } from "@apollo/react-hooks"
import gql from "graphql-tag"
import { Author, Conversation, Message } from "../../types"

const GET_CONVERSATION = gql`
  query GetConversation($conversationId: String!) {
    conversation(conversationId: $conversationId) {
      id
      name
      participants {
        id
        name
      }
      messages {
        id
        body
        createdAt
        author {
          id
          name
        }
        conversation {
          id
        }
      }
    }
  }
`

type GetConversationData = {
  conversation:
    | null
    | (Pick<Conversation, "id" | "name"> & {
        participants: Array<Pick<Author, "id" | "name">>
        messages: Array<
          Pick<Message, "id" | "body" | "createdAt"> & {
            author: Pick<Author, "id" | "name">
            conversation: Pick<Conversation, "id">
          }
        >
      })
}

export function useConversationQuery(conversationId: string) {
  return useQuery<GetConversationData, { conversationId: string }>(
    GET_CONVERSATION,
    {
      variables: { conversationId },
      fetchPolicy: "network-only",
    },
  )
}

const ADD_MESSAGE = gql`
  mutation AddMessage(
    $body: String!
    $authorId: String!
    $conversationId: String!
  ) {
    addMessage(
      body: $body
      authorId: $authorId
      conversationId: $conversationId
    ) {
      id
      body
      createdAt
      author {
        id
        name
      }
    }
  }
`
type AddMessageData = {
  addMessage: Pick<Message, "id" | "body" | "createdAt"> & {
    author: Pick<Author, "id" | "name">
  }
}

export function useAddMessageMutation() {
  return useMutation<
    AddMessageData,
    { body: string; authorId: string; conversationId: string }
  >(ADD_MESSAGE)
}

const MESSAGE_ADDED = gql`
  subscription MessageAdded($conversationId: String!) {
    messageAdded(conversationId: $conversationId) {
      id
      body
      createdAt
      author {
        id
        name
      }
      conversation {
        id
      }
    }
  }
`
type MessageAddedData = {
  messageAdded: Pick<Message, "id" | "body" | "createdAt"> & {
    author: Pick<Author, "id" | "name">
    conversation: Pick<Conversation, "id">
  }
}

export function useMessageAddedSubscription(conversationId: string) {
  return useSubscription<MessageAddedData, { conversationId: string }>(
    MESSAGE_ADDED,
    {
      variables: { conversationId },
    },
  )
}
