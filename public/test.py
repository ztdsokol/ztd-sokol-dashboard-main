import sqlite3
import os

os.chdir(os.path.dirname(os.path.abspath(__file__)))
# Connect to the SQLite database
conn = sqlite3.connect('transactions.db')
cursor = conn.cursor()

# Create the transactions table if it doesn't exist
cursor.execute('''
CREATE TABLE IF NOT EXISTS transactions (
    Redni_broj INTEGER PRIMARY KEY,
    Datum_valute TEXT,
    Datum_izvršenja TEXT,
    Opis_plaćanja_tečaj TEXT,
    Broj_računa_platitelja TEXT,
    Isplate REAL,
    Uplate REAL,
    Stanje REAL,
    PNB_platitelja TEXT,
    PNB_primatelja TEXT,
    Platitelj_primatelj TEXT,
    Mjesto TEXT,
    Referenca_plaćanja TEXT
)
''')

# Read data from the text file and insert into the database
with open('data.txt', 'r', encoding='utf-8') as file:
    # Skip the first two lines
    next(file)
    next(file)
    
    # Read and insert the remaining data into the database
    for line in file:
        fields = line.strip().split('\t')
        if len(fields) == 13:  # Ensure all fields are present
            cursor.execute('''
            INSERT INTO transactions 
            (Datum_valute, Datum_izvršenja, Opis_plaćanja_tečaj, Broj_računa_platitelja, 
            Isplate, Uplate, Stanje, PNB_platitelja, PNB_primatelja, Platitelj_primatelj, Mjesto, Referenca_plaćanja)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            ''', fields[1:])  # Exclude the first column which is Redni broj

# Commit changes and close the connection
conn.commit()
conn.close()

print("Data inserted into database successfully.")