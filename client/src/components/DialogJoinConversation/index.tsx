import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
} from "@material-ui/core"
import React, { useState } from "react"
import { useJoinConversationMutation } from "./hooks"

interface Props {
  authorId: string
  open: boolean
  refetch: () => unknown
}

export function DialogJoinConversation({ authorId, open, refetch }: Props) {
  const [joinConversation] = useJoinConversationMutation()

  const [id, setId] = useState("")

  return (
    <Dialog open={open} onClose={() => refetch()}>
      <DialogTitle>Join an existing Conversation</DialogTitle>
      <form
        onSubmit={async (e) => {
          e.preventDefault()

          if (id.trim().length) {
            const result = await joinConversation({
              variables: { authorId, conversationId: id },
            })

            if (result?.data?.joinConversation.id) {
              refetch()
              setId("")
            }
          }
        }}
      >
        <DialogContent style={{ width: 500 }}>
          <TextField
            autoFocus
            label="What conversation dp you want to join?"
            name="id"
            onChange={(e) => setId(e.currentTarget.value)}
            fullWidth={true}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={refetch}>Cancel</Button>
          <Button color="primary" type="submit">
            Join
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  )
}
