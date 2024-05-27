from flask import Flask, request, jsonify
import json

app = Flask(__name__)

with open('books.json', 'r', encoding='utf-8') as file:
    bøker = json.load(file)

@app.route('/bøker', methods=['GET'])
def get_books():
    return jsonify(bøker)

@app.route('/bok/<int:number>', methods=['GET'])
def get_book(number):
    for book in bøker:
        if book['number'] == number:
            return jsonify(book)
    return jsonify({'error': 'Bok ikke funnet'}), 404

@app.route('/filter/<string:query>', methods=['GET'])
def filter_books(query):
    filtered_books = [book for book in bøker if query.lower() in book['title'].lower() or query.lower() in book['author'].lower()]
    return jsonify(filtered_books)

@app.route('/slettbok/<int:number>', methods=['DELETE'])
def delete_book(number):
    global bøker
    bøker = [book for book in bøker if book['number'] != number]
    return jsonify({'resultat': 'Boken ble slettet fra databasen'})

@app.route('/leggtilbok', methods=['POST'])
def add_book():
    new_book = request.get_json()
    for book in bøker:
        if book['number'] == new_book['number']:
            return jsonify({'resultat': 'Boken finnes fra før'}), 400
    bøker.append(new_book)
    return jsonify({'resultat': f"{new_book['title']} ble registrert"})

if __name__ == '__main__':
    app.run(debug=True)
