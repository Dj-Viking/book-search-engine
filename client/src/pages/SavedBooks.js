import React from 'react';
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
  //set up remove_book mutation
  const [removeBook] = useMutation
  (
    REMOVE_BOOK,
    {
      update(cache, { data: { removeBook }})
      {
        try {
          //read what's currently in cache 
          //could potentially not exist yet, so wrap in trycatch
          const { me } = cache.readQuery({ query: QUERY_ME });
          console.log(me);          
          //update the me object's cache, showing new set of saved books
          cache.writeQuery
          (
            {
              query: QUERY_ME,
              data: {
                me: {...me}
              }
            }
          );
        } catch(error) {
          console.error(error);
        }
      }
    }
  );
  const userData = data?.me || data?.user || {};
  console.log("loading", loading);
  //console.log(userData);

  if (loading) {
    return <h1>Loading...</h1>
  }

  // create function that accepts the book's mongo _id value as param and deletes the book from the database
  const handleDeleteBook = async (bookId) => {
    console.log(bookId);
    const token = Auth.loggedIn() ? Auth.getToken() : null;

    if (!token) {
      return false;
    }

    try {
      const updatedUser = await removeBook
      (
        {
          variables: {bookId}
        }
      );
      console.log(updatedUser);
      // upon success, remove book's id from localStorage
      if (updatedUser) {
        removeBookId(bookId);
      }
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
                      target="_blank"
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
                    {'\n'}
                    <Card.Title>
                      For more info on this book click this
                      <a
                        href={book.link}
                        rel="noreferrer noopener"
                        target="_blank"
                      > 
                        {' '} link
                      </a>
                    </Card.Title>
                    <p className='medium'>Authors: {book.authors.join(', ')}</p>
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
