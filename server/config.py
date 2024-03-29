from flask import Flask, jsonify, request, make_response,session
from flask_migrate import Migrate
from flask_bcrypt import Bcrypt
from flask_sqlalchemy import SQLAlchemy
from flask_restful import Api
from flask_cors import CORS
import os
from flask_jwt_extended import create_access_token,get_jwt,get_jwt_identity,unset_jwt_cookies, jwt_required, JWTManager
from datetime import  timedelta

db = SQLAlchemy()
app = Flask(__name__)
app.secret_key=b'\xae\xf15\xb5\xfa\x8b\xafz%%\x19\xe8\xb4\xc5\x06\x8f'
app.config['SQLALCHEMY_DATABASE_URI'] = os.environ.get('DATABASE_URI')
# app.config['SQLALCHEMY_DATABASE_URI'] = "sqlite:///Eventplanner.db"
app.config['SQLALCHEMY_TRACK_MODIFICATIONS']=False
app.config["JWT_SECRET_KEY"] = "please-remember-to-change-me"
app.config["JWT_ACCESS_TOKEN_EXPIRES"] = timedelta(hours=1)
jwt = JWTManager(app)

migrate=Migrate(app,db)
db.init_app(app)
CORS(app)
bcrypt=Bcrypt(app)
api = Api(app)