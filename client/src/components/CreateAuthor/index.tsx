import { useMutation } from "@apollo/react-hooks"
import { Box, Paper } from "@material-ui/core"
import gql from "graphql-tag"
import React, { useState } from "react"

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
  const [createAuthor] = useMutation(CREATE_AUTHOR)

  return (
    <Box>
      <Paper elevation={2}>
        <form
          onSubmit={async (e) => {
            e.preventDefault()

            if (name.trim().length) {
              const result = await createAuthor({ variables: { name } })
              console.log(result)
              if (result?.data?.createAuthor?.id) {
                setName("")
                setUserId(result.data.createAuthor.id)
              }
            }
          }}
        >
          <input
            type="text"
            name="name"
            value={name}
            onChange={(e) => setName(e.currentTarget.value)}
          />
          <input type="submit" value="Set Name" />
        </form>
      </Paper>
    </Box>
  )
}
