import { gql } from '@apollo/client';

// Registro
export const REGISTER_MUTATION = gql`
  mutation RegisterUser($createUserInput: CreateUserInput!) {
    registerUser(createUserInput: $createUserInput) {
      email
      username
      name
      roles
      registrationDate
      state
    }
  }
`

// Login
export const LOGIN_MUTATION = gql`
  mutation Login($identifier: String!, $password: String!) {
    login(identifier: $identifier, password: $password) {
      access_token
      user {
        name
        username
        email
        roles
      }
    }
  }
`;