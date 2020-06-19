import {
  Box,
  Button,
  Dialog,
  Paper,
  TextField,
  Typography,
} from "@material-ui/core"
import React, { useState } from "react"
import { useCreateAuthorMutation } from "./hooks"

interface Props {
  open: boolean
  setUserId: (userId: string) => unknown
}

export function CreateAuthor({ setUserId, open }: Props) {
  const [createAuthor] = useCreateAuthorMutation()

  const [name, setName] = useState("")

  return (
    <Dialog open={open}>
      <Paper elevation={2} style={{ width: 500 }}>
        <Box padding={5}>
          <Typography variant="h4">Let's start chatting,</Typography>
          <form
            onSubmit={async (e) => {
              e.preventDefault()

              if (name.trim().length) {
                const result = await createAuthor({ variables: { name } })
                if (result.data?.createAuthor?.id) {
                  setName("")
                  setUserId(result.data.createAuthor.id)
                }
              }
            }}
          >
            <TextField
              type="text"
              name="name"
              label="What is your name?"
              fullWidth
              value={name}
              onChange={(e) => setName(e.currentTarget.value)}
              style={{ marginBottom: 16 }}
            />
            <Button fullWidth variant="contained" color="primary" type="submit">
              Start Chatting
            </Button>
          </form>
        </Box>
      </Paper>
    </Dialog>
  )
}
