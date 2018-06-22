import React from 'react'
import gql from 'graphql-tag'
import { Query } from 'react-apollo'
import { Typography, List } from '@material-ui/core'
import Todo from './Todo'

const GET_TODOS = gql`
  {
    todos {
      id
      text
      complete
    }
  }
`

export default () =>
  <Query query={GET_TODOS}>
    {({ data = {}, loading, err }) => {
      if (err) {
        return <Typography variant='headline'>
          Damnit, something's broken ;-(
        </Typography>
      }

      if (loading) {
        return <Typography variant='headline'>
          Patience, young man...
        </Typography>
      }

      const { todos = [] } = data

      if (!todos.length) {
        return <Typography variant='headline'>
        Nothing to show! :-D
      </Typography>
      }

      return <List>
        {todos.map(todo => (
          <Todo key={todo.id} {...todo} />
        ))}
      </List>
    }}
  </Query>
