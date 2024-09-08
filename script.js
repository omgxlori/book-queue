document.addEventListener('DOMContentLoaded', function () {
    let bookIndex = 0; // This tracks which book the next cover should apply to globally
    const addButton = document.getElementById('addBookButton');
    const form = document.getElementById('bookForm');
    const closeFormButton = document.getElementById('closeFormButton');
    const booksOnShelf = document.querySelectorAll('.codepenbook');
    
    // Modal elements
    const modal = document.getElementById("bookModal");
    const closeModalButton = document.getElementsByClassName("close")[0];
    const saveStatusButton = document.getElementById("saveStatus");

    let currentBookIndex = null; // Keep track of which book is currently being edited

    // Load existing books from local storage on page load
    renderBooks();

    // Toggle form visibility
    addButton.addEventListener('click', function () {
        form.style.display = (form.style.display === 'none' || form.style.display === '') ? 'block' : 'none';
    });

    closeFormButton.addEventListener('click', function () {
        form.style.display = 'none';
    });

    // Handle form submission
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

                form.reset();
                form.style.display = 'none';
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
            form.style.display = 'none';
            renderBooks();
        }
    });

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
            }
        });
    });

    // Save book status and rating from modal to local storage
    saveStatusButton.onclick = function () {
        let books = JSON.parse(localStorage.getItem('books')) || [];
        const selectedStatus = document.querySelector('input[name="bookStatusModal"]:checked').value;
        const selectedRating = document.querySelector('input[name="rate"]:checked').value;

        if (currentBookIndex !== null) {
            // Update the current book's status and rating
            books[currentBookIndex].status = selectedStatus;
            books[currentBookIndex].rating = selectedRating;

            // Save the updated books array to local storage
            localStorage.setItem('books', JSON.stringify(books));

            // Update the bookshelf display
            renderBooks();

            // Close the modal
            modal.style.display = "none";
        }
    };

    // Close modal
    closeModalButton.onclick = function () {
        modal.style.display = "none";
    };

    // Close modal when clicking outside
    window.onclick = function (event) {
        if (event.target == modal) {
            modal.style.display = "none";
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
                bookElement.style.setProperty('--bg-image', `url('${book.cover}')`);
                bookElement.style.backgroundSize = 'cover';
                bookElement.style.backgroundPosition = 'center';
                bookElement.setAttribute('data-status', book.status); // Set status for filtering
            }
        });
    }
});