import { useQuery } from "@apollo/react-hooks"
import gql from "graphql-tag"
import { Author, Conversation, Message } from "../../types"

const GET_AUTHOR = gql`
  query GetAuthor($authorId: String!) {
    author(authorId: $authorId) {
      name
      id
      conversations {
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
        }
      }
    }
  }
`

type GetAuthorData = {
  author:
    | null
    | (Pick<Author, "name" | "id"> & {
        conversations: Array<
          Pick<Conversation, "id" | "name"> & {
            participants: Array<Pick<Author, "id" | "name">>
            messages: Array<
              Pick<Message, "id" | "body" | "createdAt"> & {
                author: Pick<Author, "id" | "name">
              }
            >
          }
        >
      })
}

export function useAuthorQuery(authorId: string | null) {
  return useQuery<GetAuthorData, { authorId: string | null }>(GET_AUTHOR, {
    variables: { authorId },
    fetchPolicy: "network-only",
  })
}
