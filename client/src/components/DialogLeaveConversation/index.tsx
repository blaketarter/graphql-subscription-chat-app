import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Typography,
} from "@material-ui/core"
import React from "react"
import { useLeaveConversationMutation } from "./hooks"

interface Props {
  authorId: string
  conversationId: string
  open: boolean
  onSubmit: () => unknown
  onClose: () => unknown
}

export function DialogLeaveConversation({
  authorId,
  open,
  onSubmit,
  onClose,
  conversationId,
}: Props) {
  const [leaveConversation] = useLeaveConversationMutation()

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Leave the Conversation</DialogTitle>
      <form
        onSubmit={async (e) => {
          e.preventDefault()

          const result = await leaveConversation({
            variables: { authorId, conversationId },
          })

          if (result?.data?.leaveConversation.id) {
            onSubmit()
          }
        }}
      >
        <DialogContent style={{ width: 500 }}>
          <Typography>
            Are you sure you want to leave the conversation?
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>Cancel</Button>
          <Button color="primary" variant="contained" type="submit">
            Leave
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  )
}
