document.addEventListener('DOMContentLoaded', function() {
    fetchBooks();
    setupBarcodeScanner();
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
                if (book.borrower_id) {
                    bookDiv.classList.add('loaned');
                    bookDiv.onclick = () => { showLoanedBookDetails(book); };
                } else {
                    bookDiv.onclick = () => { window.location.href = `/bok.html?number=${book.Nummer}`; };
                }
                bookDiv.innerHTML = `
                    <h2>${book.Tittel}</h2>
                    <p>Forfatter: ${book.Forfatter}</p>
                    <p>ISBN: ${book.ISBN}</p>
                    <img src="/static/barcode/${book.Nummer}.png" alt="Barcode">
                    ${book.borrower_id ? '<p class="loaned-text">UTLÅNT</p>' : ''}
                `;
                booksDiv.appendChild(bookDiv);
            });
        });
}

function showLoanedBookDetails(book) {
    fetch(`/låntaker/${book.borrower_id}`)
        .then(response => response.json())
        .then(borrower => {
            alert(`Bok: ${book.Tittel}\nLånt av: ${borrower.Fornavn} ${borrower.Etternavn}\nLånt dato: ${book.loan_date}`);
        });
}

function setupBarcodeScanner() {
    const barcodeInput = document.getElementById('barcodeInput');
    const searchInput = document.getElementById('search');
    
    barcodeInput.addEventListener('keydown', function(event) {
        if (event.key === 'Enter') {
            const barcode = barcodeInput.value;
            barcodeInput.value = ''; // Tøm input-feltet etter skanning
            
            if (barcode >= 1 && barcode <= 51) {
                // Redirect to book page
                window.location.href = `/bok.html?number=${barcode}`;
            } else if (barcode >= 1000 && barcode <= 1020) {
                // Redirect to borrower page
                window.location.href = `/borrower.html?number=${barcode}`;
            } else {
                alert("Ugyldig strekkode.");
            }
        }
    });

    // Fokuser på det skjulte input-feltet for å fange opp strekkode-inndata, unntatt når søkefeltet eller andre input-felter er fokusert
    document.body.addEventListener('click', function(event) {
        if (event.target !== searchInput && !event.target.closest('input')) {
            barcodeInput.focus();
        }
    });

    // Fokuser på input-feltet når siden lastes, unntatt når søkefeltet eller andre input-felter er fokusert
    if (document.activeElement !== searchInput && !document.activeElement.closest('input')) {
        barcodeInput.focus();
    }
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
                bookDiv.onclick = () => { window.location.href = `/bok.html?number=${book.Nummer}`; };
                bookDiv.innerHTML = `
                    <h2>${book.Tittel}</h2>
                    <p>Forfatter: ${book.Forfatter}</p>
                    <p>ISBN: ${book.ISBN}</p>
                    <img src="/static/barcode/${book.Nummer}.png" alt="Barcode">
                    <button onclick="deleteBook(${book.Nummer}); event.stopPropagation();">Slett</button>
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

function fetchBorrowers() {
    const borrowersDiv = document.getElementById('borrowers');
    
    fetch('/låntakere')
        .then(response => response.json())
        .then(borrowers => {
            borrowersDiv.innerHTML = '';
            borrowers.forEach(borrower => {
                const borrowerDiv = document.createElement('div');
                borrowerDiv.className = 'borrower';
                borrowerDiv.onclick = () => {
                    window.location.href = `/borrower.html?number=${borrower.Nummer}`;
                };
                borrowerDiv.innerHTML = `
                    <h2>${borrower.Fornavn} ${borrower.Etternavn}</h2>
                `;
                borrowersDiv.appendChild(borrowerDiv);
            });
            // Vis listen og oppdater tilstanden
            borrowersDiv.style.display = 'flex';
        });
}

function scrollToBorrowers() {
    fetchBorrowers();
    const borrowersDiv = document.getElementById('borrowers');
    borrowersDiv.scrollIntoView({ behavior: 'instant' });
}

function confirmLoan(bookNumber) {
    const borrowerNumber = getBorrowerNumber(); // Assume this function retrieves the current borrower number

    fetch('/utlån', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ book_number: bookNumber, borrower_number: borrowerNumber })
    })
    .then(response => response.json())
    .then(result => {
        alert(result.resultat);
        fetchBooks(); // Update available books after loan
    });
}

function getBorrowerNumber() {
    // Implement logic to get the current borrower number
    // This could be stored in a variable when the borrower is scanned
}
