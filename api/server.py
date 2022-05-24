from sqlite3 import Connection as SQLite3Connection
from datetime import datetime
from sqlalchemy import event
from sqlalchemy.engine import Engine
from flask import Flask, request, jsonify
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
from flask_login import (
    LoginManager,
    UserMixin,
    current_user,
    login_required,
    login_user,
    logout_user,
)
from flask_wtf.csrf import CSRFProtect, generate_csrf

app = Flask(__name__)
app.config.from_prefixed_env()
app.config["SECRET_KEY"] 
app.config.update(
    DEBUG=True,
    SESSION_COOKIE_HTTPONLY=True,
    REMEMBER_COOKIE_HTTPONLY=True,
    SESSION_COOKIE_SAMESITE="Lax",
)

login_manager = LoginManager()
login_manager.init_app(app)
login_manager.session_protection = "strong"

csrf = CSRFProtect(app)
cors = CORS(
    app,
    resources={r"*": {"origins": "http://localhost:3000"}},
    expose_headers=["Content-Type", "X-CSRFToken"],
    supports_credentials=True,
)

#Database config
app.config["SQLALCHEMY_DATABASE_URI"] = "sqlite:///sqlitedb.file"
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = 0


#enforce foreign key constraints
@event.listens_for(Engine, "connect")
def _set_sqlite_pragma(dbapi_connection, connection_record):
    if isinstance(dbapi_connection, SQLite3Connection):
        cursor = dbapi_connection.cursor()
        cursor.execute("PRAGMA foreign_keys=ON;")
        cursor.close()


db = SQLAlchemy(app)
db.init_app(app)

class User(db.Model, UserMixin):
    __tablename__ = "user"
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(50))
    password = db.Column(db.String(50))
    user_data = db.relationship('UserData', backref='user', lazy=True)
    user_profile = db.relationship('UserProfile', backref='user', lazy=True)
    authenticated = db.Column(db.Boolean, default=False)

    def is_active(self):
        return True

    def get_id(self):
        return self.id

    def is_authenticated(self):
        return self.authenticated

    def is_anonymous(self):
        return False

class UserData(db.Model):
    __tablename__ = "user_data"
    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(50))
    address = db.Column(db.String(200))
    phone = db.Column(db.String(50))
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)

class UserProfile(db.Model):
    __tablename__ = "user_profile"
    id = db.Column(db.Integer, primary_key=True)
    site = db.Column(db.Text)
    page_name = db.Column(db.String(10))
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)

@login_manager.user_loader
def user_loader(id: int):
    user = User.query.get(id)
    if user:
        return user
    return None


#routes
@app.route("/api/user", methods=["POST"])
def create_user():
    data = request.get_json()
    new_user = User( 
            name = data["name"],
            password = data["password"]
            )
    db.session.add(new_user)
    db.session.commit()
    return jsonify({"message": "User created"}), 200

@app.route("/api/user/profile", methods=["POST"])
@login_required
def create_profile():
    data = request.get_json()
    new_profile = UserProfile( 
            site = data["site"],
            page_name = data["page_name"],
            user_id = current_user.id
            )
    db.session.add(new_profile)
    db.session.commit()
    return jsonify({"message": "Site created"}), 200

@app.route("/users", methods=["GET"])
def get_users():
    users = User.query.all()
    all_users = list()

    for user in users:
        user_data = list()
        user_profile = list()

        for field in user.user_data:
            user_data.append({
                "email": field.email,
                "address": field.address,
                "phone": field.phone
                })
        for profile in user.user_profile:
            user_profile.append({
                "site": profile.site,
                "page_name": profile.page_name
                })

        all_users.append( 
            { 
                "id": user.id,
                "name": user.name,
                "password" : user.password,
                "user_data" : user_data,
                "user_profile" : user_profile
                }
            )
    return jsonify(all_users), 200 



@app.route("/api/ping", methods=["GET"])
def home():
    return jsonify({"ping": "pong!"})


@app.route("/api/getcsrf", methods=["GET"])
def get_csrf():
    token = generate_csrf()
    response = jsonify({"detail": "CSRF cookie set"})
    response.headers.set("X-CSRFToken", token)
    return response


@app.route("/api/login", methods=["POST"])
def login():
    data = request.json
    username = data.get("username")
    password = data.get("password")
    users = User.query.all()
    for user in users:
        if user.name == username and user.password == password:
            login_user(user)
            id = current_user.id
            return jsonify({"login": True, "id":id})

    return jsonify({"login": False, "id":None})


@app.route("/api/data", methods=["GET"])
@login_required
def user_data():
    user = User.query.get(current_user.id)
    user_info = {
            "username":user.name,
            "id": user.id
            }

    user_data = list()
    user_profile_data = list()

    for field in user.user_data:
        user_data.append({
                "email": field.email,
                "address": field.address,
                "phone": field.phone
            })
    for profile in user.user_profile:
        user_profile_data.append({
            "site": profile.site,
            "page_name": profile.page_name
            })
    
    return jsonify({"user": user_info, "data": user_data, "profile": user_profile_data})


@app.route("/api/getsession", methods=["GET"])
def check_session():
    if current_user.is_authenticated:
        return jsonify({"login": True, "id": current_user.id})

    return jsonify({"login": False, "id": None})


@app.route("/api/logout", methods=["GET"])
@login_required
def logout():
    logout_user()
    return jsonify({"logout": True, "id": None})


if __name__ == "__main__":
 app.run(debug=True)
