import { useMutation } from "@apollo/client"
import gql from "graphql-tag"
import type { Conversation } from "../../types"

const LEAVE_CONVERSATION = gql`
  mutation LeaveConversation($conversationId: String!, $authorId: String!) {
    leaveConversation(conversationId: $conversationId, authorId: $authorId) {
      name
      id
    }
  }
`

export function useLeaveConversationMutation() {
  return useMutation<
    {
      leaveConversation: Pick<Conversation, "name" | "id">
    },
    { conversationId: string; authorId: string }
  >(LEAVE_CONVERSATION)
}
