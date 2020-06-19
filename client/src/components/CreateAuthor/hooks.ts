import { useMutation } from "@apollo/react-hooks"
import gql from "graphql-tag"
import { Author } from "../../types"

const CREATE_AUTHOR = gql`
  mutation CreateAuthor($name: String!) {
    createAuthor(name: $name) {
      name
      id
    }
  }
`

export function useCreateAuthorMutation() {
  return useMutation<
    { createAuthor: Pick<Author, "name" | "id"> },
    { name: string }
  >(CREATE_AUTHOR)
}
