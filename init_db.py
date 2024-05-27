import csv
from app import db, Book, app

def import_books_from_csv(file_path):
    with open(file_path, 'r', encoding='utf-8') as file:
        reader = csv.DictReader(file)
        for row in reader:
            if not Book.query.filter_by(number=int(row['Strekkode'])).first():
                book = Book(
                    title=row['Tittel'],
                    author=row['Forfatter'],
                    isbn=row['ISBN'],
                    number=int(row['Strekkode'])
                )
                db.session.add(book)
        db.session.commit()

if __name__ == '__main__':
    with app.app_context():
        db.drop_all()  # Slett alle eksisterende tabeller
        db.create_all()  # Opprett tabellene på nytt
        import_books_from_csv('bøker.csv')  # Importer bøker fra boker.csv
