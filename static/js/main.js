document.addEventListener('DOMContentLoaded', function() {
    fetchBooks();
});

function fetchBooks() {
    fetch('/bøker')
        .then(response => response.json())
        .then(books => {
            const booksDiv = document.getElementById('books');
            booksDiv.innerHTML = '';
            books.forEach(book => {
                const bookDiv = document.createElement('div');
                bookDiv.className = 'book';
                bookDiv.innerHTML = `
                    <h2>${book.Tittel}</h2>
                    <p>Forfatter: ${book.Forfatter}</p>
                    <p>ISBN: ${book.ISBN}</p>
                    <img src="/static/barcode/${book.Nummer}.png" alt="Barcode">
                    <button onclick="deleteBook(${book.Nummer})">Slett</button>
                `;
                booksDiv.appendChild(bookDiv);
            });
        });
}

function searchBooks() {
    const query = document.getElementById('search').value;
    fetch(`/filter/${query}`)
        .then(response => response.json())
        .then(books => {
            const booksDiv = document.getElementById('books');
            booksDiv.innerHTML = '';
            books.forEach(book => {
                const bookDiv = document.createElement('div');
                bookDiv.className = 'book';
                bookDiv.innerHTML = `
                    <h2>${book.Tittel}</h2>
                    <p>Forfatter: ${book.Forfatter}</p>
                    <p>ISBN: ${book.ISBN}</p>
                    <img src="/static/barcode/${book.Nummer}.png" alt="Barcode">
                    <button onclick="deleteBook(${book.Nummer})">Slett</button>
                `;
                booksDiv.appendChild(bookDiv);
            });
        });
}

function showAddBookForm() {
    document.getElementById('addBookForm').style.display = 'block';
}

function hideAddBookForm() {
    document.getElementById('addBookForm').style.display = 'none';
}

function addBook() {
    const title = document.getElementById('newTitle').value;
    const author = document.getElementById('newAuthor').value;
    const isbn = document.getElementById('newISBN').value;
    const number = document.getElementById('newNumber').value;

    const newBook = {
        Tittel: title,
        Forfatter: author,
        ISBN: isbn,
        Nummer: parseInt(number)
    };

    fetch('/leggtilbok', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(newBook)
    })
    .then(response => response.json())
    .then(result => {
        alert(result.resultat);
        hideAddBookForm();
        fetchBooks();
    });
}

function deleteBook(number) {
    fetch(`/slettbok/${number}`, {
        method: 'DELETE'
    })
    .then(response => response.json())
    .then(result => {
        alert(result.resultat);
        fetchBooks();
    });
}
