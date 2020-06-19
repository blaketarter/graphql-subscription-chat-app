import { useMutation } from "@apollo/react-hooks"
import gql from "graphql-tag"
import { Conversation } from "../../types"

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
