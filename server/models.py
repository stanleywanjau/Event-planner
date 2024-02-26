from datetime import datetime
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy_serializer import SerializerMixin
from sqlalchemy.ext.hybrid import hybrid_property
from sqlalchemy.orm import validates
from .config import db, bcrypt



guest_event_association = db.Table('guest_event_association',
    db.Column('guest_id', db.Integer, db.ForeignKey('guest.id')),
    db.Column('event_id', db.Integer, db.ForeignKey('event.id'))
)


class User(db.Model, SerializerMixin):
    __tablename__ = "user"
  
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String,unique=True)
    _password_hash = db.Column(db.String)
    email = db.Column(db.String ,unique=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, onupdate=datetime.utcnow)
  
    events = db.relationship("Event", backref='user')
    
    
    
    @hybrid_property
    def password_hash(self):
        raise Exception('Password hashes may not be viewed.')

    @password_hash.setter
    def password_hash(self, password):
        password_hash = bcrypt.generate_password_hash(
            password.encode('utf-8'))
        self._password_hash = password_hash.decode('utf-8')

    def authenticate(self, password):
        return bcrypt.check_password_hash(
            self._password_hash, password.encode('utf-8'))
    @validates('email')
    def validate_email(self, key, email):
        if not email:
            raise ValueError('Email is required.')
        if '@' not in email:
            raise ValueError('Email must contain "@" symbol.')
        
        return email

    

class Guest(db.Model, SerializerMixin):
    __tablename__ = "guest"
  
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String)
    email = db.Column(db.String)
    status = db.Column(db.String)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, onupdate=datetime.utcnow)
  
    events = db.relationship("Event", secondary=guest_event_association, backref="guests")
    
    @validates('email')
    def validate_email(self, key, email):
        if not email:
            raise ValueError('Email is required.')
        if '@' not in email:
            raise ValueError('Email must contain "@" symbol.')
        
        return email

class Event(db.Model, SerializerMixin):
    __tablename__ = "event"
  
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String)
    location=db.Column(db.String)
    date = db.Column(db.Date)
    time = db.Column(db.Time)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'))
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, onupdate=datetime.utcnow)
    
    

