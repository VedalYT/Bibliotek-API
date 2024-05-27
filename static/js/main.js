document.addEventListener('DOMContentLoaded', function() {
    fetch('/boker')
        .then(response => response.json())
        .then(books => {
            const booksDiv = document.getElementById('books');
            books.forEach(book => {
                const bookDiv = document.createElement('div');
                bookDiv.className = 'book';
                bookDiv.innerHTML = `
                    <h2>${book.title}</h2>
                    <p>Forfatter: ${book.author}</p>
                    <p>ISBN: ${book.ISBN}</p>
                    <img src="/static/barcode/${book.number}.png" alt="Barcode">
                    <button onclick="deleteBook(${book.number})">Slett</button>
                `;
                booksDiv.appendChild(bookDiv);
            });
        });
});

function deleteBook(number) {
    fetch(`/slettbok/${number}`, {
        method: 'DELETE'
    }).then(response => response.json())
      .then(result => {
          alert(result.resultat);
          location.reload();
      });
}
