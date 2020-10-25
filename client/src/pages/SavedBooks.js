import React, { useState } from 'react';
import { Jumbotron, Container, CardColumns, Card, Button } from 'react-bootstrap';
import { QUERY_ME } from '../utils/queries.js';
import { REMOVE_BOOK } from '../utils/mutations.js';
import { useMutation, useQuery } from '@apollo/react-hooks';
//import { deleteBook } from '../utils/API';
import Auth from '../utils/auth';
import { removeBookId } from '../utils/localStorage';

const SavedBooks = () => {
  //set up me query for the delete books mutation
  const { loading, data } = useQuery
  (
    QUERY_ME,
    {
      variables: { username: Auth.getProfile().data.username }
    }
  );
  const userData = data?.me || data?.user || {};
  console.log(loading);
  console.log(userData);

  if (loading) {
    return <div>Loading...</div>
  }

  // create function that accepts the book's mongo _id value as param and deletes the book from the database
  const handleDeleteBook = async (bookId) => {
    const token = Auth.loggedIn() ? Auth.getToken() : null;

    if (!token) {
      return false;
    }

    try {

      // upon success, remove book's id from localStorage
      removeBookId(bookId);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <>
      <Jumbotron fluid className='text-light bg-dark'>
        <Container>
          <h1>Viewing saved books!</h1>
        </Container>
      </Jumbotron>
      <Container>
        <h2>
          {
            userData.savedBooks.length
            ? `Viewing ${userData.savedBooks.length} saved 
              ${userData.savedBooks.length === 1 ? 'book' : 'books'}:`
            : 'You have no saved books!'
          }
        </h2>
        <CardColumns>
          {
            userData.savedBooks.map((book, i) => {
              return (
                <Card key={i} border='dark'>
                  {
                    book.image 
                    ?
                    <a
                      href={book.link}
                      rel="noreferrer noopener"
                    >
                      <Card.Img 
                        src={book.image} 
                        alt={`The cover for ${book.title}`} 
                        variant='top' 
                      /> 
                    </a>
                    : null
                  }
                  <Card.Body>
                    <Card.Title>{book.title}</Card.Title>
                    <p className='small'>Authors: {book.authors}</p>
                    <Card.Text>{book.description}</Card.Text>
                    <Button 
                      className='btn-block btn-danger' 
                      onClick={() => handleDeleteBook(book.bookId)}
                    >
                      Delete this Book!
                    </Button>
                  </Card.Body>
                </Card>
              );
            })
          }
        </CardColumns>
      </Container>
    </>
  );
};

export default SavedBooks;
