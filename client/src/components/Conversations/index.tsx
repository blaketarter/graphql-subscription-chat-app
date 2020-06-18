import { useQuery } from "@apollo/react-hooks"
import { Box, Fab, Typography } from "@material-ui/core"
import EditIcon from "@material-ui/icons/Edit"
import ForumIcon from "@material-ui/icons/Forum"
import gql from "graphql-tag"
import React, { useEffect, useState } from "react"
import { Route, useHistory } from "react-router-dom"
import { Author, Conversation as ConversationType, Message } from "../../types"
import { Conversation } from "../Conversation"
import { ConversationCard } from "../ConversationCard"
import { DialogCreateConversation } from "../DialogCreateConversation"
import { DialogJoinConversation } from "../DialogJoinConversation"

interface Props {
  userId: string
  setUserId: (userId: string | null) => unknown
}

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
          Pick<ConversationType, "id" | "name"> & {
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

export function Conversations({ userId, setUserId }: Props) {
  const [createOpen, setCreateOpen] = useState(false)
  const [joinOpen, setJoinOpen] = useState(false)
  const { data, error, refetch, loading } = useQuery<
    GetAuthorData,
    { authorId: string }
  >(GET_AUTHOR, {
    variables: { authorId: userId },
    fetchPolicy: "network-only",
  })
  const history = useHistory()

  useEffect(() => {
    if (error || (!loading && !data?.author)) {
      history.push("/")
      setUserId(null)
    }
  }, [error, loading, data, setUserId, history])

  return (
    <Box
      display="flex"
      justifyContent="stretch"
      style={{ height: "100%", width: "100%" }}
    >
      <Box
        width="40%"
        padding={3}
        height={"100%"}
        style={{
          backgroundColor: "rgb(236, 236, 236)",
          boxShadow: "5px 5px 10px rgba(0, 0, 0, 0.14)",
          position: "relative",
          zIndex: 5,
        }}
      >
        <Typography variant="h6" component="h1">
          {data?.author?.name}'s Conversations
        </Typography>
        {data?.author?.conversations.map((conversation) => {
          const lastMessage =
            conversation.messages[conversation.messages.length - 1]
          return (
            <ConversationCard
              key={conversation.id}
              id={conversation.id}
              name={conversation.name}
              lastMessage={lastMessage?.body}
              lastAuthor={lastMessage?.author?.name}
              participants={conversation.participants.map((p) => p.name)}
            />
          )
        })}
        <Fab
          color="primary"
          aria-label="new conversation"
          style={{
            position: "absolute",
            bottom: 95,
            right: 0,
            transform: "translateX(25px)",
            zIndex: 10,
          }}
          onClick={() => {
            setCreateOpen(true)
          }}
        >
          <EditIcon />
        </Fab>
        <DialogCreateConversation
          open={createOpen}
          authorId={userId}
          refetch={() => {
            setCreateOpen(false)
            refetch({ authorId: userId })
          }}
        />
        <Fab
          color="primary"
          aria-label="join conversation"
          style={{
            position: "absolute",
            bottom: 25,
            right: 0,
            transform: "translateX(25px)",
            zIndex: 10,
          }}
          onClick={() => {
            setJoinOpen(true)
          }}
        >
          <ForumIcon />
        </Fab>
        <DialogJoinConversation
          open={joinOpen}
          authorId={userId}
          refetch={() => {
            setJoinOpen(false)
            refetch({ authorId: userId })
          }}
        />
      </Box>
      <Box
        width="60%"
        style={{
          backgroundColor: "rgb(223, 223, 223)",
          position: "relative",
        }}
      >
        <Route
          path="/:conversationId"
          render={(props) => {
            return (
              <Conversation
                key={props.match.params.conversationId}
                authorId={userId}
                refetch={() => refetch({ authorId: userId })}
              />
            )
          }}
        />
      </Box>
    </Box>
  )
}
