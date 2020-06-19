import { Box, Fab, Typography } from "@material-ui/core"
import EditIcon from "@material-ui/icons/Edit"
import ForumIcon from "@material-ui/icons/Forum"
import React, { useEffect, useState } from "react"
import { Route, useHistory } from "react-router-dom"
import { Conversation } from "../Conversation"
import { ConversationCard } from "../ConversationCard"
import { DialogCreateConversation } from "../DialogCreateConversation"
import { DialogJoinConversation } from "../DialogJoinConversation"
import { useAuthorQuery } from "./hooks"

interface Props {
  userId: string | null
  setUserId: (userId: string | null) => unknown
}

export function Conversations({ userId, setUserId }: Props) {
  const history = useHistory()
  const { data, error, refetch, loading } = useAuthorQuery(userId)

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
          {userId ? `${data?.author?.name}'s Conversations` : "Conversations"}
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
        {userId ? (
          <DialogCreateConversation
            open={createOpen}
            authorId={userId}
            refetch={() => {
              setCreateOpen(false)
              refetch({ authorId: userId })
            }}
          />
        ) : null}
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
        {userId ? (
          <DialogJoinConversation
            open={joinOpen}
            authorId={userId}
            refetch={() => {
              setJoinOpen(false)
              refetch({ authorId: userId })
            }}
          />
        ) : null}
      </Box>
      <Box
        minWidth="60%"
        width="100%"
        style={{
          backgroundColor: "rgb(223, 223, 223)",
          position: "relative",
        }}
      >
        <Route
          path="/:conversationId"
          render={(props) => {
            return userId ? (
              <Conversation
                key={props.match.params.conversationId}
                authorId={userId}
                refetch={() => refetch({ authorId: userId })}
              />
            ) : null
          }}
        />
      </Box>
    </Box>
  )
}
