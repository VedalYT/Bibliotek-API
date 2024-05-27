from flask import Flask, request, jsonify
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
            'title': self.title,
            'author': self.author,
            'isbn': self.isbn,
            'number': self.number
        }

# Flytte opprettelsen av tabellene her
with app.app_context():
    db.create_all()

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
    if Book.query.filter_by(number=new_book_data['number']).first():
        return jsonify({'resultat': 'Boken finnes fra før'}), 400
    new_book = Book(
        title=new_book_data['title'],
        author=new_book_data['author'],
        isbn=new_book_data['isbn'],
        number=new_book_data['number']
    )
    db.session.add(new_book)
    db.session.commit()
    return jsonify({'resultat': f"{new_book.title} ble registrert"})

if __name__ == '__main__':
    app.run(debug=True)
