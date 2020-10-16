import { Box, Button, TextField, Typography } from "@material-ui/core"
import AddIcon from "@material-ui/icons/Add"
import SendIcon from "@material-ui/icons/Send"
import React, { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import {
  Author,
  Conversation as ConversationType,
  Message as MessageType,
} from "../../types"
import { DialogAddToConversation } from "../DialogAddToConversation"
import { Message } from "../Message"
import {
  useAddMessageMutation,
  useConversationQuery,
  useMessageAddedSubscription,
} from "./hooks"

interface Props {
  authorId: string
  refetch: () => unknown
}

type MessageResponse = Pick<MessageType, "id" | "body" | "createdAt"> & {
  author: Pick<Author, "id" | "name">
  conversation: Pick<ConversationType, "id">
}

export function Conversation({ authorId }: Props) {
  const { conversationId } = useParams<{ conversationId: string }>()

  const { data } = useConversationQuery(conversationId)
  const [addMessage] = useAddMessageMutation()
  const { data: subscriptionData } = useMessageAddedSubscription(conversationId)

  const [newMessageBody, setNewMessageBody] = useState("")
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [newMessages, setNewMessages] = useState<Array<MessageResponse>>([])

  useEffect(() => {
    if (subscriptionData?.messageAdded?.id) {
      setNewMessages((state) => [...state, subscriptionData.messageAdded])
    }
  }, [subscriptionData])

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
        display="flex"
        alignItems="space-between"
      >
        <Box flexGrow={1}>
          <Typography variant="h6" component="h2">
            {data?.conversation?.name}
          </Typography>
        </Box>
        <Button onClick={() => setIsAddDialogOpen(true)}>
          <AddIcon />
        </Button>
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
          {data?.conversation?.messages.map((message) => {
            return (
              <Message
                key={message.id}
                isMe={message.author.id === authorId}
                author={message.author.name}
                body={message.body}
              />
            )
          })}
          {newMessages.length ? <hr /> : null}
          {newMessages
            ?.filter((newMessage) => {
              return (
                !data?.conversation?.messages.find(
                  (message) => message.id === newMessage.id,
                ) && newMessage.conversation.id === conversationId
              )
            })
            .map((message) => {
              return (
                <Message
                  key={message.id}
                  isMe={message.author.id === authorId}
                  author={message.author.name}
                  body={message.body}
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

            if (newMessageBody.trim().length) {
              await addMessage({
                variables: {
                  body: newMessageBody,
                  authorId,
                  conversationId,
                },
              })

              setNewMessageBody("")
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
            onChange={(e) => setNewMessageBody(e.currentTarget.value)}
            style={{ marginRight: 15 }}
            value={newMessageBody}
          />
          <Button color="primary" type="submit" variant="contained">
            <SendIcon />
          </Button>
        </form>
      </Box>
      <DialogAddToConversation
        open={isAddDialogOpen}
        onClose={() => setIsAddDialogOpen(false)}
        conversationId={conversationId}
      />
    </Box>
  )
}
