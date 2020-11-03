import {
  Box,
  Button,
  Divider,
  Menu,
  MenuItem,
  TextField,
  Typography,
} from "@material-ui/core"
import MoreVertIcon from "@material-ui/icons/MoreVert"
import SendIcon from "@material-ui/icons/Send"
import React, { useEffect, useState } from "react"
import { useHistory, useParams } from "react-router-dom"
import type {
  Author,
  Conversation as ConversationType,
  Message as MessageType,
} from "../../types"
import { DialogAddToConversation } from "../DialogAddToConversation"
import { DialogLeaveConversation } from "../DialogLeaveConversation"
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

export function Conversation({ authorId, refetch }: Props) {
  const { conversationId } = useParams<{ conversationId: string }>()
  const history = useHistory()

  const { data, refetch: refetchConversation } = useConversationQuery(
    conversationId,
  )
  const [addMessage] = useAddMessageMutation()
  const { data: subscriptionData } = useMessageAddedSubscription(conversationId)

  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null)
  const [newMessageBody, setNewMessageBody] = useState("")
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isLeaveDialogOpen, setIsLeaveDialogOpen] = useState(false)
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
        paddingX={2}
        paddingY={2}
        style={{
          height: 68,
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
        <Box display="flex" alignItems="center" mr={1}>
          <Typography variant="subtitle2" color="textSecondary">
            with{" "}
            {data?.conversation?.participants
              .map((participant) =>
                participant.id === authorId ? "me" : participant.name,
              )
              .join(", ")}
          </Typography>
        </Box>
        <Button onClick={(e) => setAnchorEl(e.currentTarget)}>
          <MoreVertIcon />
        </Button>
        <Menu
          anchorEl={anchorEl}
          keepMounted
          open={Boolean(anchorEl)}
          onClose={() => setAnchorEl(null)}
        >
          <MenuItem
            onClick={() => {
              setIsAddDialogOpen(true)
              setAnchorEl(null)
            }}
          >
            Add a participant
          </MenuItem>
          <MenuItem
            onClick={() => {
              setIsLeaveDialogOpen(true)
              setAnchorEl(null)
            }}
          >
            Leave the conversation
          </MenuItem>
          <MenuItem
            onClick={async () => {
              setAnchorEl(null)
              await refetchConversation()
              setNewMessages([])
            }}
          >
            Refresh
          </MenuItem>
        </Menu>
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
          {newMessages.length ? <Divider /> : null}
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
      <DialogLeaveConversation
        open={isLeaveDialogOpen}
        conversationId={conversationId}
        authorId={authorId}
        onClose={() => setIsLeaveDialogOpen(false)}
        onSubmit={() => {
          setIsLeaveDialogOpen(false)
          history.push("/")
          refetch()
        }}
      />
    </Box>
  )
}
