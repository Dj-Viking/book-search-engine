import gql from 'graphql-tag';

export const QUERY_ME = gql `
  {
    me {
      _id
      username
      email
      books {
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