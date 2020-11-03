import { Box, Divider, Fab, Typography } from "@material-ui/core"
import EditIcon from "@material-ui/icons/Edit"
import ForumIcon from "@material-ui/icons/Forum"
import React, { useEffect, useState } from "react"
import { Route, Switch, useHistory, useParams } from "react-router-dom"
import { Conversation } from "../Conversation"
import { ConversationCard } from "../ConversationCard"
import { DialogCreateConversation } from "../DialogCreateConversation"
import { DialogJoinConversation } from "../DialogJoinConversation"
import { useAuthorQuery } from "./hooks"

interface Props {
  userId: string
  setUserId: (userId: string | null) => unknown
}

export function Conversations({ userId, setUserId }: Props) {
  const history = useHistory()
  const { data, error, refetch, loading } = useAuthorQuery(userId)
  const { conversationId: activeConversationId } = useParams<{
    conversationId: string
  }>()

  const [createOpen, setCreateOpen] = useState(false)
  const [joinOpen, setJoinOpen] = useState(false)

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
        maxWidth={450}
        padding={2}
        height={"100%"}
        style={{
          backgroundColor: "rgb(236, 236, 236)",
          boxShadow: "5px 5px 10px rgba(0, 0, 0, 0.14)",
          position: "relative",
          zIndex: 5,
        }}
      >
        <Box style={{ height: 52 }}>
          <Typography variant="h6" component="h1">
            {data?.author?.name}'s Conversations
          </Typography>
        </Box>
        <Divider />
        {data?.author?.conversations.map((conversation) => {
          const lastMessage =
            conversation.messages[conversation.messages.length - 1]
          return (
            <ConversationCard
              key={conversation.id}
              id={conversation.id}
              name={conversation.name}
              lastMessage={lastMessage?.body}
              lastAuthor={
                lastMessage?.author?.id === userId
                  ? "me"
                  : lastMessage?.author?.name
              }
              participants={conversation.participants.map((p) =>
                p.id === userId ? "me" : p.name,
              )}
              active={conversation.id === activeConversationId}
            />
          )
        })}
        <Box
          display="flex"
          flexDirection="row"
          alignItems="center"
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
          <Typography variant="subtitle1" color="textSecondary">
            Start
          </Typography>
          <Fab
            color="primary"
            aria-label="new conversation"
            style={{ marginLeft: 8 }}
          >
            <EditIcon />
          </Fab>
        </Box>
        <DialogCreateConversation
          open={createOpen}
          authorId={userId}
          onClose={() => {
            setCreateOpen(false)
          }}
          onSubmit={(conversationId) => {
            setCreateOpen(false)
            refetch({ authorId: userId })
            history.push(conversationId)
          }}
        />
        <Box
          display="flex"
          flexDirection="row"
          alignItems="center"
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
          <Typography variant="subtitle1" color="textSecondary">
            Join
          </Typography>
          <Fab
            color="primary"
            aria-label="join conversation"
            style={{ marginLeft: 8 }}
          >
            <ForumIcon />
          </Fab>
        </Box>
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
        minWidth="60%"
        width="100%"
        style={{
          backgroundColor: "rgb(223, 223, 223)",
          position: "relative",
        }}
      >
        <Switch>
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
          <Route
            path="/"
            render={() => {
              return (
                <Box
                  height="100%"
                  width="100%"
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                >
                  <Typography variant="subtitle1" color="textSecondary">
                    Create or Join a Conversation to get started.
                  </Typography>
                </Box>
              )
            }}
          />
        </Switch>
      </Box>
    </Box>
  )
}
