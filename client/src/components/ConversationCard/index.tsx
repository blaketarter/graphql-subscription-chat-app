import { Box, Card, Typography } from "@material-ui/core"
import React from "react"
import { Link } from "react-router-dom"

interface Props {
  id: string
  name: string
  participants: string[]
  lastMessage?: string
}

export function ConversationCard({ id, name, participants }: Props) {
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
            <Typography style={{ fontWeight: "bold", textDecoration: "none" }}>
              {name}
            </Typography>
            {/* <Typography variant="body2">
            {lastMessage ?? <em>No messages</em>}
          </Typography> */}
            <Typography
              variant="subtitle2"
              style={{ opacity: 0.6, textDecoration: "none" }}
            >
              <em>Participants: {participants}</em>
            </Typography>
          </Box>
        </Link>
      </Card>
    </Box>
  )
}
