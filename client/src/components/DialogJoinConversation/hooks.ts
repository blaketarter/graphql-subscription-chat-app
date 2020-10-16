import { useMutation } from "@apollo/client"
import gql from "graphql-tag"
import type { Conversation } from "../../types"

const JOIN_CONVERSATION = gql`
  mutation JoinConversation($conversationId: String!, $authorId: String!) {
    joinConversation(conversationId: $conversationId, authorId: $authorId) {
      name
      id
    }
  }
`

export function useJoinConversationMutation() {
  return useMutation<
    {
      joinConversation: Pick<Conversation, "name" | "id">
    },
    { conversationId: string; authorId: string }
  >(JOIN_CONVERSATION)
}
