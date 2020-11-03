import { Box, ButtonBase, Divider, Typography } from "@material-ui/core"
import React from "react"
import { Link } from "react-router-dom"

interface Props {
  id: string
  name: string
  participants: string[]
  lastMessage?: string
  lastAuthor?: string
  active?: boolean
}

export function ConversationCard({
  id,
  name,
  lastMessage,
  lastAuthor,
  participants,
  active,
}: Props) {
  const truncatedLastMessage =
    (lastMessage?.length ?? 0) > 57
      ? lastMessage?.slice(0, 57) + "..."
      : lastMessage
  return (
    <ButtonBase
      style={{
        backgroundColor: active ? "#0000000f" : "initial",
        display: "block",
        width: "100%",
        textAlign: "left",
      }}
    >
      <Link
        to={id}
        style={{
          textDecoration: "none",
          color: "unset",
        }}
      >
        <Box padding={2}>
          <Box pb={1}>
            <Typography style={{ fontWeight: "bold", textDecoration: "none" }}>
              {name}
            </Typography>
          </Box>
          <Box pb={1}>
            <Typography color="textSecondary" style={{ fontSize: "0.75em" }}>
              with {participants.join(", ")}
            </Typography>
          </Box>
          {truncatedLastMessage && lastAuthor ? (
            <Typography
              variant="body2"
              color="textSecondary"
              style={{ fontSize: "0.75em" }}
            >
              {lastAuthor}: {truncatedLastMessage}
            </Typography>
          ) : (
            <Typography
              variant="body2"
              color="textSecondary"
              style={{ fontSize: "0.75em" }}
            >
              <em>No messages yet</em>
            </Typography>
          )}
        </Box>
        <Divider />
      </Link>
    </ButtonBase>
  )
}
