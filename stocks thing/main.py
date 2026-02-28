import psycopg2
import tkinter
import os

#db_host = os.environ.get('DB_HOST', 'localhost')
#db_name = os.environ.get('DB_NAME', 'stockdb')
#db_user = os.environ.get('DB_USER', 'postgres')
#db_password = os.environ.get('DB_PASSWORD', 'password')

try:
    print("att to connect")
    conn = psycopg2.connect(
        host="localhost",
        database="stockdb",
        user="postgres",
        password="password"
    )
    print("connected. connection object:", conn)

    cur = conn.cursor()
    cur.execute("SELECT version()")
    version = cur.fetchone()
    print("PostgreSQL version:", version)
except Exception as e:
    print(f"Error: {e}")

cur = conn.cursor()

# products table
cur.execute("""
    CREATE TABLE IF NOT EXISTS products (
            id SERIAL PRIMARY KEY,
            name TEXT NOT NULL,
            quantity INTEGER DEFAULT 0,
            min_stock INTEGER DEFAULT 0,
            price DECIMAL(10,2)
    )
""")
conn.commit()

# flow table
cur.execute("""
    CREATE TABLE IF NOT EXISTS flow (
            id SERIAL PRIMARY KEY,
            product_id INTEGER,
            quantity INTEGER NOT NULL,
            net_gain DECIMAL(10,2) NOT NULL,
            timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP)
            """)
conn.commit()

def register(name, quantity, min_stock, price):
    cur.execute("SELECT id FROM products WHERE name = %s", (name,))
    if cur.fetchone():
        print("Produto já existe.")
    else:
        cur.execute("INSERT INTO products (name, quantity, min_stock, price) VALUES (%s, %s, %s, %s)", (name, quantity, min_stock, price))
        conn.commit()

def add(name, quantity):
    cur.execute("SELECT id, price FROM products WHERE name = %s", (name,))
    result = cur.fetchone()
    if result:
        cur.execute("UPDATE products SET quantity = quantity + %s, price = %s WHERE id = %s", (quantity, result[1], result[0]))
        conn.commit()
        net_gain = quantity * result[1]
        cur.execute("INSERT INTO flow (product_id, quantity, net_gain) VALUES (%s, %s, %s)", (result[0], quantity, -net_gain))
        conn.commit()
    else:
        print("Produto não encontrado.")

def change_price(name, new_price):
    cur.execute("SELECT id FROM products WHERE name = %s", (name,))
    result = cur.fetchone()
    if result:
        cur.execute("UPDATE products SET price = %s WHERE id = %s", (new_price, result[0],))
        conn.commit()
    else:
        print("Produto não encontrado.")

def view_products():
    cur.execute("SELECT * FROM products")
    return cur.fetchall()

def view_flow():
    cur.execute("SELECT * FROM flow")
    return cur.fetchall()

def sell(name, quantity):
    cur.execute("SELECT id, quantity, price FROM products WHERE name = %s", (name,))
    result = cur.fetchone()
    if result:
        # check if enough quantity is available
        if result[1] >= quantity:
            cur.execute("UPDATE products SET quantity = quantity - %s WHERE id = %s", (quantity, result[0],))
            conn.commit()
            net_gain = quantity * result[2]
            print("net_gain:", net_gain)
            print("quantity:", quantity)
            print("result[1]:", result[1])  # assuming selling price is the same as current price
            cur.execute("INSERT INTO flow (product_id, quantity, net_gain) VALUES (%s, %s, %s)", (result[0], -quantity, net_gain))
            conn.commit()
        else:
            print("Não há quantidade suficiente em estoque.")

def delete(name):
    cur.execute("SELECT id FROM products WHERE name = %s", (name,))
    result = cur.fetchone()
    if result:
        cur.execute("DELETE FROM products WHERE name = %s", (name,))
        conn.commit()

        # reassign ids so there are no gaps
        cur.execute("SELECT id FROM products ORDER BY id")
        rows = cur.fetchall()
        for index, (old_id,) in enumerate(rows, start=1):
            if old_id != index:
                cur.execute("UPDATE products SET id = %s WHERE id = %s", (index, old_id))
        # reset sequence to max(id)+1
        cur.execute("SELECT MAX(id) FROM products")
        max_id = cur.fetchone()[0] or 0
        cur.execute("ALTER SEQUENCE products_id_seq RESTART WITH %s", (max_id + 1,))
        conn.commit()
    else:
        print("Produto não encontrado.")

def get_name():
    name = input("Nome do produto: ")
    if name.strip() == "":
        print("Nome do produto não pode ser vazio.")
        return get_name()
    return name

def get_quantity():
    try:
        quantity = int(input("Quantidade: "))
        if quantity < 0:
            print("Quantidade não pode ser negativa.")
            return get_quantity()
        return quantity
    except ValueError:
        print("Quantidade deve ser um número inteiro.")
        return get_quantity()
    
def get_price():
    try:
        price = float(input("Preço: "))
        if price < 0:
            print("Preço não pode ser negativo.")
            return get_price()
        return price
    except ValueError:
        print("Preço deve ser um número.")
        return get_price()

def get_min_stock():
    try:
        min_stock = int(input("Estoque mínimo: "))
        if min_stock < 0:
            print("Estoque mínimo não pode ser negativo.")
            return get_min_stock()
        return min_stock
    except ValueError:
        print("Estoque mínimo deve ser um número inteiro.")
        return get_min_stock()

def check_min_stock():
    cur.execute("SELECT name, quantity, min_stock FROM products WHERE quantity < min_stock")
    low_stock = cur.fetchall()
    if low_stock:
        print("Aviso: Produtos com estoque abaixo do mínimo:")
        for product in low_stock:
            print(f"Produto: {product[0]}, Estoque: {product[1]}, Mínimo: {product[2]}")
        print("\n")

def generate_report():
    print("\n")
    print("-- Relatório de Vendas --")
    cur.execute("""
        SELECT 
            p.name,
            SUM(CASE WHEN f.quantity < 0 THEN -f.quantity ELSE 0 END) AS total_sold,
            SUM(CASE WHEN f.quantity > 0 THEN f.quantity ELSE 0 END) AS total_bought,
            SUM(f.net_gain)
        FROM flow f
        JOIN products p ON f.product_id = p.id
            GROUP BY p.id, p.name
        ORDER BY p.id
    """)
    report = cur.fetchall()
    print("Produto | Quantidade Comprada | Quantidade Vendida | Ganho Total")
    for record in report:
        print(record)

    # percentage of which item were sold the most
    total_sold = sum(record[1] for record in report)
    print("\n")
    print("Percentual de vendas por produto:")
    for record in report:
        percentage = (record[1] / total_sold * 100) if total_sold > 0 else 0
        print(f"{record[0]}: {percentage:.2f}%")
        
    # percentage of which item were bought the most
    total_bought = sum(-record[2] for record in report)  # total bought is negative in net_gain
    print("\n")
    print("Percentual de compras por produto:")
    for record in report:
        percentage = (record[2] / total_bought * 100) if total_bought > 0 else 0
        print(f"{record[0]}: {percentage:.2f}%")


    # percentage of which item generated the most gain
    total_gain = sum(record[3] for record in report)
    print("\n")
    print("Percentual de ganho por produto:")
    for record in report:
        if record[3] > 0:
            percentage = (record[3] / total_gain * 100) if total_gain > 0 else 0
            print(f"{record[0]}: {percentage:.2f}%")

    # percentage of which items generated the most loss
    total_loss = sum(-record[3] for record in report if record[3] < 0)  # total loss is negative in net_gain
    print("\n")
    print("Percentual de perda por produto:")
    for record in report:
        if record[3] < 0:
            percentage = (-record[3] / total_loss * 100) if total_loss > 0 else 0
            print(f"{record[0]}: {percentage:.2f}%")
        else:
            print(f"{record[0]}: 0.00%")

def wait():
    input("Pressione Enter para continuar...")

# main loop (cmd line interface)
while True:

    print("Escolha uma opção:")
    print("\n")

    print("1. Registrar produto  2. Adicionar estoque     3. Atualizar preço")
    print("4. Ver produtos       5. Ver fluxo de estoque  6. Vender produto")
    print("7. Deletar produto    8. Sair                  9. Fazer Relatório")

    print("\n")
    check_min_stock()

    choice = input()
    if choice == "1": # register product
        print("\n")
        print("-- Registrar Produto --")
        name = get_name()
        quantity = get_quantity()
        price = get_price()
        min_stock = get_min_stock()
        register(name, quantity, min_stock, price)
        print("\n")

    elif choice == "2": # add stock
        print("\n")
        print("-- Adicionar Estoque --")
        name = get_name()
        quantity = get_quantity()
        add(name, quantity)
        print("\n")

    elif choice == "3": # change price
        print("\n")
        print("-- Atualizar Preço --")
        name = get_name()
        new_price = get_price()
        change_price(name, new_price)
        print("\n")

    elif choice == "4": # view products
        print("\n")
        print("-- Produtos em Estoque --")
        products = view_products()
        print("ID | Nome | Quantidade | Preço")
        for product in products:
            print(product)
        wait()
        print("\n")

    elif choice == "5": # view flow
        print("\n")
        print("-- Fluxo de Estoque --")
        flow = view_flow()
        print("ID | Produto ID | Quantidade | Ganho/Loss | Timestamp")
        for record in flow:
            print(record)
        wait()
        print("\n")

    elif choice == "6": # sell product
        print("\n")
        print("-- Vender Produto --")
        name = get_name()
        quantity = get_quantity()
        sell(name, quantity)
        print("\n")

    elif choice == "7": # delete product
        print("\n")
        print("-- Deletar Produto --")
        name = get_name()
        choice = input(f"Tem certeza que deseja deletar o produto '{name}'? (s/n): ")
        if choice.lower() != 's':
            print("Operação cancelada.")
            continue
        delete(name)
        print("\n")

    elif choice == "8": # exit
        break

    elif choice == "9": # generate report
        generate_report()
        wait()
        print("\n")

    elif choice == "secret": # secret option to reset database (for testing purposes)
        confirm = input("Tem certeza que deseja resetar o banco de dados? Todos os dados serão perdidos. (s/n): ")
        if confirm.lower() == 's':
            cur.execute("TRUNCATE TABLE products, flow RESTART IDENTITY CASCADE")
            conn.commit()
            print("Banco de dados resetado.")
        else:
            print("Operação cancelada.")
            print("\n")

    else:
        print("Opção inválida.")
        print("\n")