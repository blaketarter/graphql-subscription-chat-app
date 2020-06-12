import { useMutation, useQuery } from "@apollo/react-hooks"
import { Box, Button, TextField, Typography } from "@material-ui/core"
import SendIcon from "@material-ui/icons/Send"
import gql from "graphql-tag"
import React, { useState } from "react"
import { useParams } from "react-router-dom"
import { Message } from "../Message"

interface Props {
  authorId: string
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

export function Conversation({ authorId }: Props) {
  const { conversationId } = useParams()
  const { data } = useQuery(GET_CONVERSATION, { variables: { conversationId } })
  const [addMessage] = useMutation(ADD_MESSAGE)
  const [newMessage, setNewMessage] = useState("")

  return (
    <Box padding={3} style={{ position: "relative", height: "100%" }}>
      <Typography variant="h6" component="h2">
        {data?.conversation?.name}
      </Typography>
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
      </Box>
      <Box
        paddingY={2}
        paddingX={5}
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          backgroundColor: "white",
        }}
      >
        <form
          onSubmit={async (e) => {
            e.preventDefault()

            if (newMessage.trim().length) {
              const result = await addMessage({
                variables: {
                  body: newMessage,
                  authorId,
                  conversationId,
                },
              })

              console.log(result)

              setNewMessage("")
            }
          }}
          style={{
            display: "flex",
          }}
        >
          <TextField
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
