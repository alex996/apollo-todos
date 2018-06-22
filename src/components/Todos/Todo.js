import React from 'react'
import gql from 'graphql-tag'
import { Mutation } from 'react-apollo'
import {
  Checkbox,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton
} from '@material-ui/core'
import { Delete } from '@material-ui/icons'

const GET_TODOS = gql`
  {
    todos {
      id
    }
  }
`

const UPDATE_TODO = gql`
  mutation updateTodo($id: ID!, $complete: Boolean!) {
    updateTodo(id: $id, complete: $complete) {
      id
      complete
    }
  }
`

const DELETE_TODO = gql`
  mutation deleteTodo($id: ID!) {
    deleteTodo(id: $id)
  }
`

export default ({ id, text, complete }) =>
  <ListItem key={id}>
    <Mutation mutation={UPDATE_TODO}>
      {updateTodo =>
        <Checkbox
          checked={complete}
          onClick={({ target: { checked: complete } }) =>
            updateTodo({
              variables: { id, complete }
            })
          }
        />
      }
    </Mutation>
    <ListItemText primary={text} />
    <ListItemSecondaryAction>
      <Mutation
        mutation={DELETE_TODO}
        update={(cache, { data: { deleteTodo } }) => {
          const { todos } = cache.readQuery({ query: GET_TODOS })
          cache.writeQuery({
            query: GET_TODOS,
            data: {
              todos: todos.filter(({ id }) => id !== deleteTodo)
            }
          });
        }}
      >
        {deleteTodo =>
          <IconButton
            color='secondary'
            onClick={() =>
              deleteTodo({
                variables: { id }
              })
            }
          >
            <Delete />
          </IconButton>
        }
      </Mutation>
    </ListItemSecondaryAction>
  </ListItem>
