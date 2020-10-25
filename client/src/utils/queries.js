import gql from 'graphql-tag';

export const QUERY_ME = gql `
  {
    me {
      _id
      username
      email
      savedBooks {
        authors
        bookId
        title
        description
        image
        link
      }
    }
  }
`;