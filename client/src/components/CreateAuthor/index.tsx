import { useMutation } from "@apollo/react-hooks"
import { Box, Button, Paper, TextField, Typography } from "@material-ui/core"
import gql from "graphql-tag"
import React, { useState } from "react"
import { Author } from "../../types"

interface Props {
  setUserId: (userId: string) => unknown
}

const CREATE_AUTHOR = gql`
  mutation CreateAuthor($name: String!) {
    createAuthor(name: $name) {
      name
      id
    }
  }
`

export function CreateAuthor({ setUserId }: Props) {
  const [name, setName] = useState("")
  const [createAuthor] = useMutation<
    { createAuthor: Pick<Author, "name" | "id"> },
    { name: string }
  >(CREATE_AUTHOR)

  return (
    <Box
      display="flex"
      alignItems="center"
      justifyContent="center"
      height="100vh"
    >
      <Paper elevation={2} style={{ width: 300 }}>
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
              Set Name
            </Button>
          </form>
        </Box>
      </Paper>
    </Box>
  )
}
