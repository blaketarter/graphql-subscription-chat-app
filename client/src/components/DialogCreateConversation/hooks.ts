import { useMutation } from "@apollo/client"
import gql from "graphql-tag"
import type { Conversation } from "../../types"

const CREATE_CONVERSATION = gql`
  mutation CreateConversation($name: String!, $authorId: String!) {
    createConversation(name: $name, authorId: $authorId) {
      name
      id
    }
  }
`

export function useCreateConversationMutation() {
  return useMutation<
    {
      createConversation: Pick<Conversation, "name" | "id">
    },
    { name: string; authorId: string }
  >(CREATE_CONVERSATION)
}
