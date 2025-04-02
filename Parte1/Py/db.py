import mysql.connector

def connect_to_db():
    try:
        connection = mysql.connector.connect(
            host='localhost',
            user='root', 
            password='',
            database='tpmongomagni', 
            port=3307
        )
        if connection.is_connected():
            print('Conexión exitosa a la base de datos.')
            return connection
    except mysql.connector.Error as err:
        print(f'Error de conexión: {err}')
        return None
