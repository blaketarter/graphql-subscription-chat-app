import { Box, Card, Typography } from "@material-ui/core"
import React from "react"
import { Link } from "react-router-dom"

interface Props {
  id: string
  name: string
  participants: string[]
  lastMessage?: string
  lastAuthor?: string
}

export function ConversationCard({
  id,
  name,
  participants,
  lastMessage,
  lastAuthor,
}: Props) {
  const truncatedLastMessage =
    (lastMessage?.length ?? 0) > 57
      ? lastMessage?.slice(0, 57) + "..."
      : lastMessage

  return (
    <Box mt={3}>
      <Card>
        <Link
          to={id}
          style={{
            textDecoration: "none",
            color: "unset",
          }}
        >
          <Box padding={2}>
            <Box pb={1}>
              <Typography
                style={{ fontWeight: "bold", textDecoration: "none" }}
              >
                {name}
              </Typography>
            </Box>
            {truncatedLastMessage && lastAuthor ? (
              <Typography variant="body2">
                {lastAuthor}: {truncatedLastMessage}
              </Typography>
            ) : null}
            <Typography
              variant="subtitle2"
              style={{ opacity: 0.6, textDecoration: "none" }}
            >
              <em>Participants: {participants.join(", ")}</em>
            </Typography>
          </Box>
        </Link>
      </Card>
    </Box>
  )
}
