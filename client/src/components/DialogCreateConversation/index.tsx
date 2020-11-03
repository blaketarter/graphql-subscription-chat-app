import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
} from "@material-ui/core"
import React, { useState } from "react"
import { useCreateConversationMutation } from "./hooks"

interface Props {
  authorId: string
  open: boolean
  onClose: () => unknown
  onSubmit: (conversationId: string) => unknown
}

export function DialogCreateConversation({
  authorId,
  open,
  onClose,
  onSubmit,
}: Props) {
  const [createConversation] = useCreateConversationMutation()

  const [name, setName] = useState("")

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Start a new Conversation</DialogTitle>
      <form
        onSubmit={async (e) => {
          e.preventDefault()

          if (name.trim().length) {
            const result = await createConversation({
              variables: { authorId, name },
            })

            if (result?.data?.createConversation.id) {
              setName("")
              onSubmit(result.data.createConversation.id)
            }
          }
        }}
      >
        <DialogContent style={{ width: 500 }}>
          <TextField
            autoFocus
            label="What do you want to call it?"
            name="name"
            onChange={(e) => setName(e.currentTarget.value)}
            fullWidth={true}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>Cancel</Button>
          <Button variant="contained" color="primary" type="submit">
            Start
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  )
}
