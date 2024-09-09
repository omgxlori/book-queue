# Book Queue

Book Queue is a web application created by Lori Morra, Talon Barkie, and Vitor Silva, designed to help users manage their reading list. Users can track the books they want to read, are currently reading, or have completed reading. The platform provides features for organizing books into different categories, viewing details, and sharing updates on social media.

## Features
**Add New Books:** Users can add books with title, author, genre, and cover image.

**Organize Books:** Sort books into different statuses: 'Books To Read', 'Currently Reading', and 'Books Completed'.

**Responsive Design:** The site is fully responsive, ensuring an optimal experience across devices (iPhone, iPad, and desktop).

**Social Sharing:** Share book details and reading status on social media platforms like Facebook, Twitter, and LinkedIn.

**Star Rating System:** Rate completed books with a star rating system.

**Copy to Clipboard:** Easily copy book-related messages to share with others.

## User Story
```
AS A User
I WANT to add a book to my queue,
SO THAT I can distinguish whether I plan to read it, am currently reading it, or have already finished it.
I WANT to filter books and be able to update the status of a logged book
SO THAT I can track my reading progress.
When a book is completed, I WANT to rate my overall experience with a book
SO THAT I can share it on social media.
```

## Acceptance Criteria
```
GIVEN I want to log a book that I Want To Read, am Currently Reading, or Completed Reading,
WHEN I click on the "Add A Book" button,
THEN I am presented with a modal with fields to fill in the book's Title, Author, Genre, Book Cover, and Book Status
WHEN I submit the "Add A Book" form on modal,
THEN the submitted book is added to the bookshelf and can be filtered according to 3 categories: Books To Read, Currently Reading, and Books Completed
WHEN I click on the Books To Read List
THEN I will see all the books submitted with the category "Books To Read"
WHEN I click on the Currently Reading List
THEN I will see all the books submitted with the category "Currently Reading"
WHEN I click on the Books Completed List
THEN I will see all the books submitted with the category "Books Completed"
WHEN I click on any book submitted
THEN I am presented with a modal that displays the book's Title, Author, and Genre. User is also presented a star-rating scale of 1-5 stars with 1 being the lowest score and 5 being the highest, a Share Message textbox, and social media icons that link directly to the social media website.
WHEN I click on the Copy To Clipboard button underneath the Share Message,
THEN I can click on a social media icon to be redirected to an open post to paste the message that displays the message according to the book status and a link to the Book Queue webpage.
```

## Technologies Used

**HTML5:** Structure and content of the web pages.

**CSS3:** Styling, including responsiveness for various screen sizes.

**JavaScript:** Interactivity, such as adding books, changing statuses, and filtering books.

**Local Storage:** Saving book data locally on the user's browser.


## How to Use

**Add a Book:** Click on the 'Add a Book' button to open the form and enter details about a new book.

**Categorize Books:** After adding a book, it will appear on the virtual bookshelf. Use the available filters in the navigation to organize books by their current status.

**View & Update Book Details:** Click on a book to open a modal that allows you to change the book's status, update the star rating, and share the book on social media.

**Copy & Share:** Use the 'Copy to Clipboard' feature to easily share your reading status, and click on the social media icons to share on platforms like Facebook, Twitter, and LinkedIn.

## Responsive Layout
The website is designed to be fully responsive:

**iPhone:** The header spans the full width, and navigation stacks below the header. Book elements are arranged in two rows to fit the screen size.

**iPad Pro:** Book elements are slightly shifted to the left to align with the virtual bookshelf.

**Desktop:** The full layout includes all navigation and book elements displayed in rows on the virtual shelf.

## Favicon

A custom favicon has been added to represent the website visually in the browser tab. This helps users quickly recognize the site when multiple tabs are open.

## Future Enhancements

**User Authentication:** Allow users to sign in and save their book lists to the cloud.

**Recommendations:** Provide book recommendations based on reading history.

**Book Reviews:** Enable users to write and share reviews on completed books.

## Special Thanks

Lori Morra, Talon Barkie, and Vitor Silva – for their dedication, creativity, and teamwork in developing Book Queue.

Our mentors, instructors, and peers – for their invaluable guidance, feedback, and support throughout the project.

The users – for their enthusiasm and feedback, helping us improve and refine Book Queue to make it the best tool for managing your reading journey.

Thank you all for being a part of this exciting journey!