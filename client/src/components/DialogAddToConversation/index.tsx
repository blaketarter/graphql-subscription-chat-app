import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Typography,
} from "@material-ui/core"
import React from "react"

interface Props {
  open: boolean
  onClose: () => unknown
  conversationId: string
}

export function DialogAddToConversation({
  onClose,
  open,
  conversationId,
}: Props) {
  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Add someone to the conversation</DialogTitle>

      <DialogContent style={{ width: 500 }}>
        <Box mb={2}>
          <Typography>
            All you need to do is copy this and give it to someone else and they
            can join in on the conversation!
          </Typography>
        </Box>
        <Typography>
          <strong>{conversationId}</strong>
        </Typography>
      </DialogContent>
      <DialogActions>
        <Button variant="contained" color="primary" onClick={onClose}>
          Got it
        </Button>
      </DialogActions>
    </Dialog>
  )
}
