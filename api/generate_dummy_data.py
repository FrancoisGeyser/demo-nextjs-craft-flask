from random import randrange
from sqlite3 import Connection as SQLite3Connection
from datetime import datetime
from sqlalchemy import event
from sqlalchemy.engine import Engine
from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from server import User, UserData, UserProfile

# app
app = Flask(__name__)

# config
app.config["SQLALCHEMY_DATABASE_URI"] = "sqlite:///sqlitedb.file"
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = 0

# configure sqlite3 to enforce foreign key contraints
@event.listens_for(Engine, "connect")
def _set_sqlite_pragma(dbapi_connection, connection_record):
    if isinstance(dbapi_connection, SQLite3Connection):
        cursor = dbapi_connection.cursor()
        cursor.execute("PRAGMA foreign_keys=ON;")
        cursor.close()


db = SQLAlchemy(app)
db.init_app(app)



def init():
        name = "username"
        password = "password"
        address = "123 fake avenue, your city, your country"
        phone = "+7123456789"
        email = 'username@email.com'
        site = 'eyJST09UIjp7InR5cGXECHJlc29sdmVkTmFtZSI6IkNvbnRhaW5lciJ9LCJpc0NhbnZhcyI6dHJ1ZSwicHJvcHPENWZsZXhEaXJlY3Rpb24iOiJjb2x1bW4iLCJhbGlnbkl0ZW1zxBZlbnRlciIsImp1c3RpZnnEXGVudMwaZmlsbFNwYWPEe25vIiwicGFkZGluZyI6WyI0MCIszgVdLCJtYXJnaW7EH8QUygRdLCJiYWNrZ3JvdW5k5QDYIjoyNTUsImfHCGLHCGEiOjF9LOQAsm9yxygwxSYwxSQwySJzaGFkb3fFEnJhZGl1c8ULd2lkdGgiOiIxMDAlIiwiaGVpZ2jkANIxMDB2aOQBNGRpc3BsYXnxAU8sImN1c3RvbcR0ziRBcHDEOWhpZGRlbiI6ZmFsc2UsIm5vZGVz5ADoXzRQRXF3cV9QQuQA5WxpbmtlZE7GHXt9fSzMIP8B1/8B1/8B1/8B1/8B1+oB1/EBuP8B0+0B0zc45QGsxAdixgdhIjowLjMy/wHT/wHT5QHTODAzcHjsAdQ2NzJweP8B1OgB1H3kAORy5gEH5QNj+gHRRVljSkg4MmotY/YB0csg+gHRVGV4dO4BzMdn6gHNb250U2l6ZSI6NzYsInRleHRB5AHG7QGnb250V+gA7jcw5AF37AFFOTLlAUY55gFHxAfnAUjpAbIwLMUCXe0BW8RrIjoiSGkgdGhlcmXyAUHlALz3ATzrAs75AULzATZ9'
        page_name = 'Your Page'
        new_user = User(name=name, password=password)
        db.session.add(new_user)
        db.session.commit()
        new_data =  UserData(address=address, phone=phone, email=email, user_id = new_user.id)
        db.session.add(new_data)
        db.session.commit()
        new_profile =  UserProfile(site=site, page_name=page_name, user_id = new_user.id)
        db.session.add(new_profile)
        db.session.commit()

if  __name__ == "__main__":
    init()
