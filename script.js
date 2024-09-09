document.addEventListener('DOMContentLoaded', function () {
    let bookIndex = 0; 
    const addButton = document.getElementById('addBookButton');
    const formContainer = document.getElementById('formContainer'); 
    const form = document.getElementById('bookForm');
    const closeFormButton = document.querySelector('.close');
    const booksOnShelf = document.querySelectorAll('.codepenbook');
    const shareMessageInput = document.getElementById('share-message');
    const copyButton = document.getElementById('copyToClipboard');

    const modal = document.getElementById("bookModal");
    const closeModalButton = document.getElementsByClassName("close")[1];
    const saveStatusButton = document.getElementById("saveStatus");

    let currentBook = {}; 
    let currentBookIndex = null;

    renderBooks();

    copyButton.addEventListener('click', function () {
        shareMessageInput.select();
        shareMessageInput.setSelectionRange(0, 99999);
        navigator.clipboard.writeText(shareMessageInput.value).then(() => {
            alert("Message copied to clipboard!");
        }).catch(err => {
            console.error("Error copying text: ", err);
        });
    });

    function updateShareMessage(book, status, rating = 0) {
        const pageURL = encodeURIComponent(window.location.href);
        let message = '';

        if (status === 'toRead') {
            message = `I added a book to my Book Queue "Books To Read" list: "${book.title}" by ${book.author}. Check it out! (${pageURL})`;
        } else if (status === 'currentlyReading') {
            message = `I added a book to my Book Queue "Currently Reading" list: "${book.title}" by ${book.author}. Check it out! (${pageURL})`;
        } else if (status === 'booksCompleted') {
            message = `I added a book to my Book Queue "Books Completed" list: "${book.title}" by ${book.author} with a rating of ${rating} stars. Check it out! (${pageURL})`;
        }

        if (shareMessageInput) {
            shareMessageInput.value = message;
        }

        setupShareLinks(book);
    }

    function setupShareLinks(book) {
        const pageURL = encodeURIComponent(window.location.href);
        const title = encodeURIComponent(book.title);
        const author = encodeURIComponent(book.author);

        document.getElementById('facebook-share').href = `https://www.facebook.com/sharer/sharer.php?u=${pageURL}`;
        document.getElementById('twitter-share').href = `https://twitter.com/intent/tweet?text=Check out the book I'm reading: "${title}" by ${author}&url=${pageURL}`;
        document.getElementById('linkedin-share').href = `https://www.linkedin.com/shareArticle?mini=true&url=${pageURL}&title=${title}&summary=${author}`;
    }

    function attachModalRadioListeners() {
        const modalRadioButtons = document.querySelectorAll('input[name="bookStatusModal"]');
        modalRadioButtons.forEach(radio => {
            radio.addEventListener('change', function () {
                const status = this.value;
                const rating = document.querySelector('input[name="rate"]:checked') ? document.querySelector('input[name="rate"]:checked').value : 0;
                if (currentBook.title) {
                    updateShareMessage(currentBook, status, rating);
                }
            });
        });
    }

    function attachRatingListeners() {
        const ratingInputs = document.querySelectorAll('input[name="rate"]');
        ratingInputs.forEach(ratingInput => {
            ratingInput.addEventListener('change', function () {
                const selectedRating = this.value;
                currentBook.rating = selectedRating;
                const status = document.querySelector('input[name="bookStatusModal"]:checked') ? document.querySelector('input[name="bookStatusModal"]:checked').value : currentBook.status;
                if (currentBook.title) {
                    updateShareMessage(currentBook, status, selectedRating);
                }
            });
        });
    }

    saveStatusButton.addEventListener('click', function () {
        if (currentBookIndex !== null) {
            let books = JSON.parse(localStorage.getItem('books')) || [];

            const selectedStatus = document.querySelector('input[name="bookStatusModal"]:checked').value;
            const selectedRating = document.querySelector('input[name="rate"]:checked') ? document.querySelector('input[name="rate"]:checked').value : currentBook.rating;

            books[currentBookIndex].status = selectedStatus;
            books[currentBookIndex].rating = selectedRating;

            // Update currentBook with the correct rating before updating the message
            currentBook.rating = selectedRating;

            localStorage.setItem('books', JSON.stringify(books));

            // Update the message with the correct rating
            updateShareMessage(currentBook, selectedStatus, selectedRating);

            modal.style.display = 'none';
            renderBooks();
        }
    });

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

    closeModalButton.onclick = function () {
        modal.style.display = 'none';
    };

    window.onclick = function (event) {
        if (event.target === modal) {
            modal.style.display = 'none';
        }
        if (event.target === formContainer) {
            formContainer.style.display = 'none';
        }
    };

    function saveBookToLocalStorage(book) {
        let books = JSON.parse(localStorage.getItem('books')) || [];
        books.push(book);
        localStorage.setItem('books', JSON.stringify(books));
    }

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
