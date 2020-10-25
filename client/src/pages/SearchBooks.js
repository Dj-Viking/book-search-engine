import React, { useState, useEffect } from 'react';
import { Jumbotron, Container, Col, Form, Button, Card, CardColumns } from 'react-bootstrap';
import { SAVE_BOOK } from '../utils/mutations.js';
import { useMutation } from '@apollo/react-hooks';
import Auth from '../utils/auth';
import { searchGoogleBooks } from '../utils/API';
import { saveBookIds, getSavedBookIds } from '../utils/localStorage';

const SearchBooks = () => {
  // create state for holding returned google api data
  const [searchedBooksState, setsearchedBooksState] = useState([]);
  // create state for holding our search field data
  const [searchInputState, setsearchInputState] = useState('');
  //saved book mutation set up
  const [saveBook] = useMutation(SAVE_BOOK);
  // create state to hold saved bookId values
  const [savedBookIds, setSavedBookIds] = useState(getSavedBookIds());

  // set up useEffect hook to save `savedBookIds` list to localStorage on component unmount
  // learn more here: https://reactjs.org/docs/hooks-effect.html#effects-with-cleanup
  useEffect(() => {
    return () => saveBookIds(savedBookIds);
  });

  // create method to search for books and set state on form submit
  const handleFormSubmit = async (event) => {
    event.preventDefault();

    if (!searchInputState) {
      return false;
    }

    try {
      const response = await searchGoogleBooks(searchInputState);

      if (!response.ok) {
        throw new Error('something went wrong!');
      }

      const { items } = await response.json();

      const bookData = items.map((book) => ({
        bookId: book.id,
        authors: book.volumeInfo.authors || ['No author to display'],
        title: book.volumeInfo.title,
        description: book.volumeInfo.description,
        image: book.volumeInfo.imageLinks?.thumbnail.replace(/http/, 'https') || '',
        link: book.volumeInfo.canonicalVolumeLink
      }));
      console.log(bookData);
      setsearchedBooksState(bookData);
      setsearchInputState('');
    } catch (err) {
      console.error(err);
    }
  };



  // create function to handle saving a book to our database
  const handleSaveBook = async (bookId) => {
    // find the book in `searchedBooksState` state by the matching id
    const bookToSave = searchedBooksState.find((book) => book.bookId === bookId);
    console.log(bookToSave);
    // get token
    const token = Auth.loggedIn() ? Auth.getToken() : null;
    console.log(token);
    if (!token) {
      return false;
    }

    try {
      const userData = await saveBook
      (
        {
          variables: {
            // bookId: bookToSave.bookId,
            // authors: bookToSave.authors,
            // description: bookToSave.description,
            // image: bookToSave.image,
            // link: bookToSave.link,
            // title: bookToSave.title
            ...bookToSave
          }
        }
      );
      console.log(userData);
      // if book successfully saves to user's account, save book id to state
        if (userData) {
          setSavedBookIds([...savedBookIds, bookToSave.bookId]);
        }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <>
      <Jumbotron fluid className='text-light bg-dark'>
        <Container>
          <h1>Search for Books!</h1>
          <Form onSubmit={handleFormSubmit}>
            <Form.Row>
              <Col xs={12} md={8}>
                <Form.Control
                  name='searchInputState'
                  value={searchInputState}
                  onChange={(e) => setsearchInputState(e.target.value)}
                  type='text'
                  size='lg'
                  placeholder='Search for a book'
                />
              </Col>
              <Col xs={12} md={4}>
                <Button type='submit' variant='success' size='lg'>
                  Submit Search
                </Button>
              </Col>
            </Form.Row>
          </Form>
        </Container>
      </Jumbotron>

      <Container>
        <h2>
          {
            searchedBooksState.length
            ? `Viewing ${searchedBooksState.length} results:`
            : 'Search for a book to begin'
          }
        </h2>
        <CardColumns>
          {
            searchedBooksState.map((book) => {
              return (
                <Card 
                  key={book.bookId} 
                  border='dark'
                >
                  {
                    book.image 
                    ? 
                    (
                      <Card.Img src={book.image} alt={`The cover for ${book.title}`} variant='top' />
                    ) 
                    : null
                  }
                  <Card.Body>
                    <Card.Title>{book.title}</Card.Title>
                    <p className='small'>Authors: {book.authors}</p>
                    <Card.Text>{book.description}</Card.Text>
                    {
                      Auth.loggedIn() && 
                      (
                        <Button
                          disabled={
                            savedBookIds?.some(
                              (savedBookId) => savedBookId === book.bookId
                            )
                          }
                          className='btn-block btn-info'
                          onClick={() => handleSaveBook(book.bookId)}>
                          {
                            savedBookIds?.some((savedBookId) => savedBookId === book.bookId)
                            ? 'This book has already been saved!'
                            : 'Save this Book!'
                          }
                        </Button>
                      )
                    }
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

export default SearchBooks;
