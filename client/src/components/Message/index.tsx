import { Box, Card, Typography } from "@material-ui/core"
import React from "react"

interface Props {
  isMe: boolean
  author: string
  body: string
}

export function Message({ isMe, author, body }: Props) {
  return (
    <Box
      mt={3}
      style={{
        position: "relative",
        width: "100%",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <Box
        style={{
          position: "relative",
          display: "flex",
          flexDirection: "column",
          maxWidth: "60%",
          alignSelf: isMe ? "flex-end" : "flex-start",
          alignItems: isMe ? "flex-end" : "flex-start",
        }}
      >
        <Box
          style={{
            height: 20,
            width: 20,
            borderRadius: "100%",
            background: "white",
            color: "black",
            textAlign: "center",
          }}
          mb={1}
        >
          {author[0]}
        </Box>
        <Card>
          <Box padding={2}>
            <Typography>{body}</Typography>
          </Box>
        </Card>
      </Box>
    </Box>
  )
}
