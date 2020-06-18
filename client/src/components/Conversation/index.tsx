import { useMutation, useQuery, useSubscription } from "@apollo/react-hooks"
import { Box, Button, TextField, Typography } from "@material-ui/core"
import SendIcon from "@material-ui/icons/Send"
import gql from "graphql-tag"
import React, { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import { Message } from "../Message"

interface Props {
  authorId: string
  refetch: () => unknown
}

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
      author {
        id
        name
      }
    }
  }
`

const MESSAGE_ADDED = gql`
  subscription MessageAdded($conversationId: String!) {
    messageAdded(conversationId: $conversationId) {
      id
      body
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

export function Conversation({ authorId }: Props) {
  const { conversationId } = useParams()
  const { data } = useQuery(GET_CONVERSATION, {
    variables: { conversationId },
    fetchPolicy: "network-only",
  })
  const { data: subscriptionData } = useSubscription(MESSAGE_ADDED, {
    variables: { conversationId },
  })

  const [newMessages, setNewMessages] = useState<any[]>([])

  useEffect(() => {
    if (subscriptionData?.messageAdded?.id) {
      setNewMessages([...newMessages, subscriptionData.messageAdded])
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [subscriptionData])

  const [addMessage] = useMutation(ADD_MESSAGE)
  const [newMessage, setNewMessage] = useState("")

  return (
    <Box
      display="flex"
      flexDirection="column"
      style={{ position: "relative", height: "100%" }}
    >
      <Box
        paddingX={3}
        paddingY={2}
        style={{
          backgroundColor: "white",
          boxShadow: "3px 3px 5px rgba(0, 0, 0, 0.1)",
          position: "relative",
          zIndex: 3,
        }}
      >
        <Typography variant="h6" component="h2">
          {data?.conversation?.name}
        </Typography>
      </Box>
      <Box
        flexGrow={1}
        style={{
          overflowY: "auto",
          flexDirection: "column-reverse",
          display: "flex",
        }}
        padding={3}
      >
        <Box>
          {data?.conversation?.messages?.map((message: any) => {
            return (
              <Message
                key={message?.id}
                isMe={message?.author?.id === authorId}
                author={message?.author?.name ?? ""}
                body={message?.body ?? ""}
              />
            )
          })}
          {newMessages.length ? <hr /> : null}
          {newMessages
            ?.filter((newMessage) => {
              return (
                !data?.conversation?.messages?.find(
                  (message: any) => message.id === newMessage.id,
                ) && newMessage.conversation.id === conversationId
              )
            })
            .map((message: any) => {
              return (
                <Message
                  key={message?.id}
                  isMe={message?.author?.id === authorId}
                  author={message?.author?.name ?? ""}
                  body={message?.body ?? ""}
                />
              )
            })}
        </Box>
      </Box>
      <Box
        flexShrink={1}
        paddingY={2}
        paddingX={5}
        style={{
          backgroundColor: "white",
          boxShadow: "3px -3px 5px rgba(0, 0, 0, 0.1)",
          position: "relative",
          zIndex: 3,
        }}
      >
        <form
          onSubmit={async (e) => {
            e.preventDefault()

            if (newMessage.trim().length) {
              await addMessage({
                variables: {
                  body: newMessage,
                  authorId,
                  conversationId,
                },
              })

              setNewMessage("")
            }
          }}
          style={{
            display: "flex",
          }}
        >
          <TextField
            autoFocus
            multiline={true}
            fullWidth
            name="new-message"
            placeholder="Start typing to send a new message..."
            onChange={(e) => setNewMessage(e.currentTarget.value)}
            style={{ marginRight: 15 }}
            value={newMessage}
          />
          <Button color="primary" type="submit" variant="contained">
            <SendIcon />
          </Button>
        </form>
      </Box>
    </Box>
  )
}
