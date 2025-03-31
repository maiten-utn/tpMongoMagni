import mysql.connector

def connect_to_db():
    try:
        connection = mysql.connector.connect(
            host='localhost',       # o la dirección IP de tu servidor
            user='root',       # tu nombre de usuario de MySQL
            password='Astr0nomi@', # tu contraseña de MySQL
            database='tpmongomagni',  # el nombre de la base de datos
            port=3307
        )
        if connection.is_connected():
            print('Conexión exitosa a la base de datos.')
            return connection
    except mysql.connector.Error as err:
        print(f'Error de conexión: {err}')
        return None
