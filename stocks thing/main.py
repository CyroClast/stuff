import psycopg2
import os

db_host = os.environ.get('DB_HOST', 'localhost')
db_name = os.environ.get('DB_NAME', 'stockdb')
db_user = os.environ.get('DB_USER', 'postgres')
db_password = os.environ.get('DB_PASSWORD', 'password')

conn = psycopg2.connect(
    host=db_host,
    name=db_name,
    user=db_user,
    password=db_password
)

cur = conn.cursor()

cur.execute("""
    CREATE TABLE IF NOT EXISTS products (
            id SERIAL PRIMARY KEY,
            name TEXT NOT NULL,
            quantity INTEGER DEFAULT 0,
            price DECIMAL(10,2)
    )
""")
conn.commit()

cur.execute(
    "INSERT INTO products (name, quantity, price) VALUES (%s, %s, %s)",
    ("teste", 10, 29.54)
)
conn.commit()

cur.execute("SELECT * FROM products")
rows = cur.fetchall()
for row in rows:
    print(row)

cur.close()
conn.close()