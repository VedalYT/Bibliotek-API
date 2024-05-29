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



document.addEventListener('DOMContentLoaded', function() {
    fetchBooks();
    setupBarcodeScanner();
});


function fetchBorrowers() {
    fetch('/låntakere')
        .then(response => response.json())
        .then(borrowers => {
            const borrowersDiv = document.getElementById('borrowers');
            borrowersDiv.innerHTML = '';
            borrowers.forEach(borrower => {
                const borrowerDiv = document.createElement('div');
                borrowerDiv.className = 'borrower';
                borrowerDiv.onclick = () => { window.location.href = `/låntaker.html?number=${borrower.Nummer}`; };
                borrowerDiv.innerHTML = `
                    <h2>${borrower.Fornavn} ${borrower.Etternavn}</h2>
                    <p>Nummer: ${borrower.Nummer}</p>
                `;
                borrowersDiv.appendChild(borrowerDiv);
            });
        });
}
let borrowersListVisible = false;

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
            borrowersListVisible = true;
        });
}

function scrollToBorrowers() {
    fetchBorrowers();
    const borrowersDiv = document.getElementById('borrowers');
    borrowersDiv.scrollIntoView({ behavior: 'instant' });
}
