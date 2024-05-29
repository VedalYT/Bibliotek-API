from flask import Flask, request, jsonify, render_template
from flask_sqlalchemy import SQLAlchemy
import os

app = Flask(__name__)
basedir = os.path.abspath(os.path.dirname(__file__))
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///' + os.path.join(basedir, 'books.db')
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db = SQLAlchemy(app)

class Book(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(150), nullable=False)
    author = db.Column(db.String(100), nullable=False)
    isbn = db.Column(db.String(13), nullable=False)
    number = db.Column(db.Integer, unique=True, nullable=False)

    def to_dict(self):
        return {
            'id': self.id,
            'Tittel': self.title,
            'Forfatter': self.author,
            'ISBN': self.isbn,
            'Nummer': self.number
        }

class Borrower(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    first_name = db.Column(db.String(100), nullable=False)
    last_name = db.Column(db.String(100), nullable=False)
    number = db.Column(db.Integer, unique=True, nullable=False)

    def to_dict(self):
        return {
            'id': self.id,
            'Fornavn': self.first_name,
            'Etternavn': self.last_name,
            'Nummer': self.number
        }

with app.app_context():
    db.create_all()

@app.route('/')
def serve_index():
    return render_template('index.html')

@app.route('/bok.html')
def serve_book():
    return render_template('bok.html')

@app.route('/bøker', methods=['GET'])
def get_books():
    books = Book.query.all()
    return jsonify([book.to_dict() for book in books])

@app.route('/bok/<int:number>', methods=['GET'])
def get_book(number):
    book = Book.query.filter_by(number=number).first()
    if book:
        return jsonify(book.to_dict())
    return jsonify({'error': 'Bok ikke funnet'}), 404

@app.route('/filter/<string:query>', methods=['GET'])
def filter_books(query):
    books = Book.query.filter(
        (Book.title.ilike(f'%{query}%')) | (Book.author.ilike(f'%{query}%'))
    ).all()
    return jsonify([book.to_dict() for book in books])

@app.route('/slettbok/<int:number>', methods=['DELETE'])
def delete_book(number):
    book = Book.query.filter_by(number=number).first()
    if book is None:
        return jsonify({'resultat': 'Boken finnes ikke i databasen'}), 404
    db.session.delete(book)
    db.session.commit()
    return jsonify({'resultat': 'Boken ble slettet fra databasen'})

@app.route('/leggtilbok', methods=['POST'])
def add_book():
    new_book_data = request.get_json()
    print(f"Received new book data: {new_book_data}")
    existing_book = Book.query.filter_by(number=new_book_data['Nummer']).first()
    if existing_book:
        print(f"Book with number {new_book_data['Nummer']} already exists: {existing_book.to_dict()}")
        return jsonify({'resultat': 'Boken finnes fra før'}), 400
    new_book = Book(
        title=new_book_data['Tittel'],
        author=new_book_data['Forfatter'],
        isbn=new_book_data['ISBN'],
        number=new_book_data['Nummer']
    )
    db.session.add(new_book)
    db.session.commit()
    return jsonify({'resultat': f"{new_book.title} ble registrert"})

@app.route('/låntakere', methods=['GET'])
def get_borrowers():
    borrowers = Borrower.query.all()
    return jsonify([borrower.to_dict() for borrower in borrowers])

@app.route('/låntaker/<int:number>', methods=['GET'])
def get_borrower(number):
    borrower = Borrower.query.filter_by(number=number).first()
    if borrower:
        return jsonify(borrower.to_dict())
    return jsonify({'error': 'Låntaker ikke funnet'}), 404

@app.route('/borrower.html')
def serve_borrower():
    return render_template('borrower.html')

if __name__ == '__main__':
    app.run(debug=True)
