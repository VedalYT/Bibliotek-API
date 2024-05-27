import csv
import json
import logging

logging.basicConfig(level=logging.INFO)

books = []

with open('bøker.csv', 'r', encoding='utf-8') as file:
    reader = csv.DictReader(file)
    for row in reader:
        try:
            book = {
                'title': row['Tittel'],
                'author': row['Forfatter'],
                'ISBN': row['ISBN'],
                'number': int(row['Strekkode'])
            }
            books.append(book)
        except KeyError as e:
            logging.error(f"KeyError: {e} is missing in the CSV file. Please check your CSV file.")
        except ValueError as e:
            logging.error(f"ValueError: {e}. Please check the data types in your CSV file.")

with open('books.json', 'w', encoding='utf-8') as file:
    json.dump(books, file, ensure_ascii=False, indent=4)

logging.info('Books have been successfully written to books.json')
