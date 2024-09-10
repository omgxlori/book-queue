document.addEventListener('DOMContentLoaded', function () {
    let bookIndex = 0; // This tracks which book the next cover should apply to globally
    const addButton = document.getElementById('addBookButton');
    const formContainer = document.getElementById('formContainer'); // For form modal container
    const form = document.getElementById('bookForm');
    const closeFormButton = document.querySelector('.close'); // The close button for the "Add a Book" form
    const booksOnShelf = document.querySelectorAll('.codepenbook');
    const shareMessageInput = document.getElementById('share-message'); // For copy-to-clipboard box
    const copyButton = document.getElementById('copyToClipboard'); // The copy to clipboard button

    // Modal elements for book detail modal
    const modal = document.getElementById("bookModal");
    const closeModalButton = document.getElementsByClassName("close")[1]; // The close button for the book detail modal
    const saveStatusButton = document.getElementById("saveStatus");

    let currentBook = {}; // Store the current book being edited
    let currentBookIndex = null; // Store the current book index being edited

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

    // Copy to Clipboard functionality
    copyButton.addEventListener('click', function () {
        shareMessageInput.select();
        shareMessageInput.setSelectionRange(0, 99999); // For mobile devices

        // Copy the text inside the input field
        navigator.clipboard.writeText(shareMessageInput.value).then(() => {
            alert("Message copied to clipboard!");
        }).catch(err => {
            console.error("Error copying text: ", err);
        });
    });

    // Function to update the message in the share input field
    function updateShareMessage(book, status, rating = 0) {
        const pageURL = encodeURIComponent(window.location.href);
        let message = '';

        if (status === 'toRead') {
            message = `I added a book to my Book Queue "Books To Read" list: "${book.title}" by ${book.author}. Check it out! https://omgxlori.github.io/book-queue/)`;
        } else if (status === 'currentlyReading') {
            message = `I added a book to my Book Queue "Currently Reading" list: "${book.title}" by ${book.author}. Check it out! https://omgxlori.github.io/book-queue/`;
        } else if (status === 'booksCompleted') {
            message = `I added a book to my Book Queue "Books Completed" list: "${book.title}" by ${book.author} with a rating of ${rating} stars. Check it out! https://omgxlori.github.io/book-queue/`;
        }

        if (shareMessageInput) {
            shareMessageInput.value = message;
        }

        setupShareLinks(book);
    }

    // Function to setup social media share links
    function setupShareLinks(book) {
        const pageURL = encodeURIComponent(window.location.href);
        const title = encodeURIComponent(book.title);
        const author = encodeURIComponent(book.author);

        document.getElementById('facebook-share').href = `https://www.facebook.com/sharer/sharer.php?u=${pageURL}`;
        document.getElementById('twitter-share').href = `https://twitter.com/intent/tweet?text=Check out the book I'm reading: "${title}" by ${author}&url=${pageURL}`;
        document.getElementById('linkedin-share').href = `https://www.linkedin.com/shareArticle?mini=true&url=${pageURL}&title=${title}&summary=${author}`;
    }

    // Attach event listeners to the star ratings inside the modal
    function attachRatingListeners() {
        const ratingInputs = document.querySelectorAll('input[name="rate"]');
        ratingInputs.forEach(ratingInput => {
            ratingInput.addEventListener('change', function () {
                const selectedRating = this.value; // Get the selected rating
                currentBook.rating = selectedRating;
                const status = document.querySelector('input[name="bookStatusModal"]:checked') ? document.querySelector('input[name="bookStatusModal"]:checked').value : currentBook.status;
                updateShareMessage(currentBook, status, selectedRating);
            });
        });
    }

    // Attach an event listener to the radio buttons inside the modal
    function attachModalRadioListeners() {
        const modalRadioButtons = document.querySelectorAll('input[name="bookStatusModal"]');
        modalRadioButtons.forEach(radio => {
            radio.addEventListener('change', function () {
                const status = this.value; // Get the selected status
                const rating = currentBook.rating ? currentBook.rating : 0;
                updateShareMessage(currentBook, status, rating);
            });
        });
    }

    // Handle "Add a Book" form submission
    form.addEventListener('submit', function (event) {
        event.preventDefault(); // Prevent the default form submission

        const title = form.querySelector('#bookTitle').value;
        const author = form.querySelector('#author').value;
        const genre = form.querySelector('#genre').value;
        const status = form.querySelector('input[name="bookStatus"]:checked').value;
        const coverInput = form.querySelector('#bookCover');
        let coverURL = '';

        const book = {
            title: title,
            author: author,
            genre: genre,
            status: status,
            cover: '',
            rating: 0 // Default rating
        };

        currentBook = book; // Set currentBook for real-time updates

        if (coverInput.files && coverInput.files[0] && bookIndex < booksOnShelf.length) {
            const reader = new FileReader();
            reader.onloadend = function () {
                coverURL = reader.result;

                booksOnShelf[bookIndex].style.setProperty('--bg-image', `url('${coverURL}')`);
                booksOnShelf[bookIndex].style.backgroundImage = `url('${coverURL}')`;
                booksOnShelf[bookIndex].style.backgroundSize = 'cover';
                booksOnShelf[bookIndex].style.backgroundPosition = 'center';
                booksOnShelf[bookIndex].setAttribute('data-status', status); 

                book.cover = coverURL;

                saveBookToLocalStorage(book);
                bookIndex++;

                form.reset();
                formContainer.style.display = 'none';
                renderBooks();
            };
            reader.readAsDataURL(coverInput.files[0]);
        } else {
            saveBookToLocalStorage(book);
            form.reset();
            formContainer.style.display = 'none';
            renderBooks();
        }

        updateShareMessage(book, status);
    });

    // Filter functions
    document.getElementById('filterToRead').addEventListener('click', function() {
        filterBooksByStatus('toRead');
    });
    document.getElementById('filterCurrentlyReading').addEventListener('click', function() {
        filterBooksByStatus('currentlyReading');
    });
    document.getElementById('filterCompleted').addEventListener('click', function() {
        filterBooksByStatus('booksCompleted');
    });
    document.getElementById('filterAll').addEventListener('click', function() {
        showAllBooks();
    });

    function filterBooksByStatus(status) {
        booksOnShelf.forEach(book => {
            if (book.getAttribute('data-status') === status) {
                book.style.opacity = '1';
                book.style.pointerEvents = 'all'; 
            } else {
                book.style.opacity = '0'; 
                book.style.pointerEvents = 'none'; 
            }
        });
    }

    function showAllBooks() {
        booksOnShelf.forEach(book => {
            book.style.opacity = '1';
            book.style.pointerEvents = 'all'; 
        });
    }

    // Save button functionality for modal (book detail modal)
    saveStatusButton.addEventListener('click', function () {
        if (currentBookIndex !== null) {
            let books = JSON.parse(localStorage.getItem('books')) || [];

            const selectedStatus = document.querySelector('input[name="bookStatusModal"]:checked').value;
            const selectedRating = document.querySelector('input[name="rate"]:checked') ? document.querySelector('input[name="rate"]:checked').value : currentBook.rating;

            books[currentBookIndex].status = selectedStatus;
            books[currentBookIndex].rating = selectedRating;

            currentBook.rating = selectedRating;

            localStorage.setItem('books', JSON.stringify(books));

            updateShareMessage(currentBook, selectedStatus, selectedRating);

            modal.style.display = 'none';
            renderBooks();
        }
    });

    // Open modal for book details
    booksOnShelf.forEach((bookElement, index) => {
        bookElement.addEventListener('click', function () {
            let books = JSON.parse(localStorage.getItem('books')) || [];
            const book = books[index];

            if (book) {
                currentBookIndex = index;
                document.getElementById("modalTitle").textContent = book.title;
                document.getElementById("modalAuthor").textContent = `Author: ${book.author}`;
                document.getElementById("modalGenre").textContent = `Genre: ${book.genre}`;

                document.querySelector(`input[name="bookStatusModal"][value="${book.status}"]`).checked = true;

                if (book.rating) {
                    document.querySelector(`input[name="rate"][value="${book.rating}"]`).checked = true;
                } else {
                    document.querySelectorAll('input[name="rate"]').forEach(input => input.checked = false);
                }

                modal.style.display = "block";
                currentBook = book;
                updateShareMessage(book, book.status, book.rating);
                attachModalRadioListeners();
                attachRatingListeners();
            }
        });
    });

    // Close modal (book detail modal)
    closeModalButton.onclick = function () {
        modal.style.display = "none";
    };

    // Close modal when clicking outside (book detail modal)
    window.onclick = function (event) {
        if (event.target === modal) {
            modal.style.display = 'none';
        }
        if (event.target === formContainer) {
            formContainer.style.display = 'none';
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
                bookElement.style.removeProperty('background-image');
                bookElement.style.setProperty('--bg-image', `url('${book.cover}')`);
                bookElement.style.backgroundSize = 'cover';
                bookElement.style.backgroundPosition = 'center';
                bookElement.setAttribute('data-status', book.status); 
            } else {
                bookElement.style.removeProperty('background-image');
            }
        });
    }
});
