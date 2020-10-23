## User Story

* AS AN avid reader
* I WANT to search for new books to read
* SO THAT I can keep a list of books to purchase

## Acceptance Criteria

* [x] GIVEN a book search engine
* [x] WHEN I load the search engine
* [x] THEN I am presented with a menu with the options Search for Books and Login/Signup and an input field to search for books and a submit button
* [x] WHEN I click on the Search for Books menu option
* [x] THEN I am presented with an input field to search for books and a submit button
* [x] WHEN I am not logged in and enter a search term in the input field and click the submit button
* [x] THEN I am presented with several search results, each featuring a book’s title, author, description, image, and a link to that book on the Google Books site
* [x] WHEN I click on the Login/Signup menu option
* [x] THEN a modal appears on the screen with a toggle between the option to log in or sign up
* [x] WHEN the toggle is set to Signup
* [x] THEN I am presented with three inputs for a username, an email address, and a password, and a signup button
* [x] WHEN the toggle is set to Login
* [x] THEN I am presented with two inputs for an email address and a password and login button
* [x] WHEN I enter a valid email address and create a password and click on the signup button
* [x] THEN my user account is created and I am logged in to the site
* [x] WHEN I enter my account’s email address and password and click on the login button
* [x] THEN I the modal closes and I am logged in to the site
* [x] WHEN I am logged in to the site
* [x] THEN the menu options change to Search for Books, an option to see my saved books, and Logout
* [x] WHEN I am logged in and enter a search term in the input field and click the submit button
* [x] THEN I am presented with several search results, each featuring a book’s title, author, description, image, and a link to that book on the Google Books site and a button to save a book to my account
* [x] WHEN I click on the Save button on a book
* [x] THEN that book’s information is saved to my account
* [x] WHEN I click on the option to see my saved books
* [x] THEN I am presented with all of the books I have saved to my account, each featuring the book’s title, author, description, image, and a link to that book on the Google Books site and a button to remove a book from my account
* [x] WHEN I click on the Remove button on a book
* [x] THEN that book is deleted from my saved books list
* [x] WHEN I click on the Logout button
* [x] THEN I am logged out of the site and presented with a menu with the options Search for Books and Login/Signup and an input field to search for books and a submit button  

## Convert from REST API to GraphQL API

### backend

* [] in server.js implement the apollo server and apply it to the express server as middleware
* [] in auth.js update the auth middleware function to work with the graphql api
* [] in schemas directory
  - [] index.js: export typedefs and resolvers
  - [] resolvers.js: define the query and mutation functionality to work with the mongoose models
* [] typedefs.js: define necessary query and mutation types: 
  - [] Query types: ```me``` which returns a ```User``` type
  - [] Mutation types:
    * [] ```login``` accepts an email and password as parameters, returns ```Auth``` type
    * [] ```addUser``` accepts a username, email, password as parameters; returns ```Auth``` type
    * [] ```saveBook``` accepts book parameters: 
      - [] author's array, 
      - [] description, 
      - [] title, 
      - [] bookId,
      - [] image,
      - [] link
    * [] ```removeBook``` accepts a ```bookId``` as a parameter and returns a ```User``` type
  - [] User type:
    * [] _id
    * [] username
    * [] email
    * [] bookCount
    * [] savedBooks ([Book]) array of the book type
  - [] Book type: 
    * [] bookId (not the _id but the id returned from the google books api)
    * [] authors - an array of strings may be more than one author
    * [] description
    * [] title
    * [] image
    * [] link
  - [] Auth type:
    * [] token
    * [] [User] references user type

### frontend

* [] queries.js - holds query ```GET_ME``` which executes me query set up using apollo server
* [] mutations.js: 
  - [] ```LOGIN_USER``` will execute the ```loginUser``` mutation set up using apollo server
  - [] ```ADD_USER``` will execute the addUser mutation
  - [] ```SAVE_BOOK``` will execute the saveBook mutation
  - [] ```REMOVE_BOOK``` executes removeBook mutation

* [] App.js: create Apollo Provider to make every request work with apollo server
* [] SearchBooks.js: 
  - [] use apollo ```useMutation()``` Hook to execute the ```SAVE_BOOK``` mutation in the ```handleSaveBook()``` function instead of the ```saveBook()``` function imported from the api file
  - [] keep logic for saving book's ID to the state in the try catch block
* [] SavedBooks.js
  - [] Remove the ```useEffect()``` hook that sets the state for ```UserData```
  - [] use ```useQuery()``` hook to execute the ```GET_ME``` query on load and save it to a variable named ```userData```
  - [] use ```useMutation()``` hook to execute the ```REMOVE_BOOK``` mutation in ```handleDeleteBook()``` function instead of ```deleteBook()``` imported from the api file
  - [] keep ```removeBookId()``` in place though
* [] SignupForm.js:
  - [] replace the ```addUser()``` functionality imported and use ```ADD_USER``` mutation instead
* [] LoginForm.js:
  - [] replace ```loginUser()``` functionality from the api file and use ```LOGIN_USER``` mutation instead