document.addEventListener('DOMContentLoaded', function () {
    let bookIndex = 0; // This tracks which book the next cover should apply to globally
    const addButton = document.getElementById('addBookButton');
    const formContainer = document.getElementById('formContainer'); // For form modal container
    const form = document.getElementById('bookForm');
    const closeFormButton = document.querySelector('.close'); // The close button for the "Add a Book" form
    const booksOnShelf = document.querySelectorAll('.codepenbook');

    // Modal elements for book detail modal
    const modal = document.getElementById("bookModal");
    const closeModalButton = document.getElementsByClassName("close")[1]; // The close button for the book detail modal
    const saveStatusButton = document.getElementById("saveStatus");

    let currentBookIndex = null; // Keep track of which book is currently being edited

    // Load existing books from local storage on page load
    renderBooks();

    // Show "Add a Book" form modal when the Add Book button is clicked
    addButton.addEventListener('click', function () {
        formContainer.style.display = 'block';
    });

    // Close "Add a Book" form modal when close button is clicked
    closeFormButton.addEventListener('click', function () {
        formContainer.style.display = 'none';
    });

    // Close "Add a Book" form modal when clicking outside of it
    window.onclick = function (event) {
        if (event.target === formContainer) {
            formContainer.style.display = 'none';
        }
    };

    // Handle "Add a Book" form submission
    form.addEventListener('submit', function (event) {
        event.preventDefault(); // Prevent the default form submission

        const title = form.querySelector('#bookTitle').value;
        const author = form.querySelector('#author').value;
        const genre = form.querySelector('#genre').value;
        const status = form.querySelector('input[name="bookStatus"]:checked').value;
        const coverInput = form.querySelector('#bookCover');
        let coverURL = '';

        if (coverInput.files && coverInput.files[0] && bookIndex < booksOnShelf.length) {
            const reader = new FileReader();
            reader.onloadend = function () {
                coverURL = reader.result;

                // Clear any previous background image before applying the new one
                booksOnShelf[bookIndex].style.removeProperty('background-image');

                // Set the new book cover
                booksOnShelf[bookIndex].style.setProperty('--bg-image', `url('${coverURL}')`);
                booksOnShelf[bookIndex].style.backgroundImage = `url('${coverURL}')`;
                booksOnShelf[bookIndex].style.backgroundSize = 'cover';
                booksOnShelf[bookIndex].style.backgroundPosition = 'center';
                booksOnShelf[bookIndex].setAttribute('data-status', status); // Set the status attribute

                const book = {
                    title: title,
                    author: author,
                    genre: genre,
                    status: status,
                    cover: coverURL,
                    rating: 0 // Default rating
                };

                saveBookToLocalStorage(book);
                bookIndex++;

                // Reset the form and hide it
                form.reset();
                formContainer.style.display = 'none';
                renderBooks();
            };
            reader.readAsDataURL(coverInput.files[0]);
        } else {
            const book = {
                title: title,
                author: author,
                genre: genre,
                status: status,
                cover: '',
                rating: 0 // Default rating
            };
            saveBookToLocalStorage(book);
            form.reset();
            formContainer.style.display = 'none';
            renderBooks();
        }
    });

    // Save button functionality for modal (book detail modal)
    saveStatusButton.addEventListener('click', function () {
        if (currentBookIndex !== null) {
            let books = JSON.parse(localStorage.getItem('books')) || [];
    
            // Get the selected status from the modal
            const selectedStatus = document.querySelector('input[name="bookStatusModal"]:checked').value;
    
            // Get the selected rating from the modal (assuming the rating input has the name "rate")
            const selectedRating = document.querySelector('input[name="rate"]:checked');
    
            // Update the book's status and rating
            books[currentBookIndex].status = selectedStatus;
    
            // Only update the rating if a rating has been selected
            if (selectedRating) {
                books[currentBookIndex].rating = selectedRating.value;
            }
    
            // Save updated books to localStorage
            localStorage.setItem('books', JSON.stringify(books));
    
            // Close the modal after saving
            modal.style.display = 'none';
    
            // Optionally re-render the book list to show updated statuses and ratings
            renderBooks();
        }
    });

    // Filter books by status
    document.getElementById('filterToRead').addEventListener('click', function() {
        filterBooksByStatus('toRead');
    });
    document.getElementById('filterCurrentlyReading').addEventListener('click', function() {
        filterBooksByStatus('currentlyReading');
    });
    document.getElementById('filterCompleted').addEventListener('click', function () {
        filterBooksByStatus('booksCompleted');
    });
    document.getElementById('filterAll').addEventListener('click', function() {
        showAllBooks();
    });

    // Filter books by status without disturbing the grid layout
    function filterBooksByStatus(status) {
        booksOnShelf.forEach(book => {
            if (book.getAttribute('data-status') === status) {
                book.style.opacity = '1';
                book.style.pointerEvents = 'all'; // Re-enable interaction for filtered books
            } else {
                book.style.opacity = '0'; // Hide content without collapsing the grid
                book.style.pointerEvents = 'none'; // Disable interaction for hidden books
            }
        });
    }

    // Show all books
    function showAllBooks() {
        booksOnShelf.forEach(book => {
            book.style.opacity = '1';
            book.style.pointerEvents = 'all'; // Re-enable interaction
        });
    }

    // Open modal for book details
    booksOnShelf.forEach((bookElement, index) => {
        bookElement.addEventListener('click', function () {
            let books = JSON.parse(localStorage.getItem('books')) || [];
            const book = books[index];

            if (book) {
                currentBookIndex = index; // Track which book is being edited
                document.getElementById("modalTitle").textContent = book.title;
                document.getElementById("modalAuthor").textContent = `Author: ${book.author}`;
                document.getElementById("modalGenre").textContent = `Genre: ${book.genre}`;

                // Set book status in modal
                document.querySelector(`input[name="bookStatusModal"][value="${book.status}"]`).checked = true;

                // Set the rating in modal
                if (book.rating) {
                    document.querySelector(`input[name="rate"][value="${book.rating}"]`).checked = true;
                } else {
                    document.querySelectorAll('input[name="rate"]').forEach(input => input.checked = false);
                }

                modal.style.display = "block";
                updateShareMessage(book);
            }
        });
    });

    function updateShareMessage(book) {
        const pageURL = encodeURIComponent(window.location.href);
        let message = '';

        switch (book.status) {
            case 'Want To Read':
                message = `I added a book to my Bookqueue wishlist: "${book.title}" by ${book.author}. Check it out! (${pageURL})`;
                break;
            case 'Currently Reading':
                message = `I added a book to my Bookqueue currently reading list: "${book.title}" by ${book.author}. Check it out! (${pageURL})`;
                break;
            case 'Books Completed':
                message = `I added a book to my Bookqueue completed reading list: "${book.title}" by ${book.author} with a rating of ${book.rating}. Check it out! (${pageURL})`;
                break;
        }

        const shareInput = document.getElementById('share-message');
        if (shareInput) {
            shareInput.value = message;
        }
    }

    // Close modal (book detail modal)
    closeModalButton.onclick = function () {
        modal.style.display = "none";
    };

    // Close modal when clicking outside (book detail modal)
    window.onclick = function (event) {
        if (event.target == modal) {
            modal.style.display = "none";
        }
        if (event.target == formContainer) {
            formContainer.style.display = "none";
        }
    };

    // Save book to local storage
    function saveBookToLocalStorage(book) {
        let books = JSON.parse(localStorage.getItem('books')) || [];
        books.push(book);
        localStorage.setItem('books', JSON.stringify(books));
    }

    // Render books from local storage
    function renderBooks() {
        let books = JSON.parse(localStorage.getItem('books')) || [];
        booksOnShelf.forEach((bookElement, index) => {
            if (books[index]) {
                const book = books[index];
                // Clear previous background image before setting a new one
                bookElement.style.removeProperty('background-image');
                bookElement.style.setProperty('--bg-image', `url('${book.cover}')`);
                bookElement.style.backgroundSize = 'cover';
                bookElement.style.backgroundPosition = 'center';
                bookElement.setAttribute('data-status', book.status); // Set status for filtering
            } else {
                // Clear background image if no book exists in that slot
                bookElement.style.removeProperty('background-image');
            }
        });
    }
});
