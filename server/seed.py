from datetime import datetime
from flask_sqlalchemy import SQLAlchemy
from .models import db, User, Guest, Event,guest_event_association
from .app import app

def create_seed_data():
    # Delete existing data (optional)
    db.session.query(User).delete()
    db.session.query(Guest).delete()
    db.session.query(Event).delete()
    db.session.query(guest_event_association).delete()
    
    db.session.commit()

    # Create users
    users = [
        User(username='user1', _password_hash='password1', email='user1@example.com'),
        User(username='user2', _password_hash='password2', email='user2@example.com')
    ]

    # Create guests
    guests = [
        Guest(name='Guest 1', email='guest1@example.com', status='invited'),
        Guest(name='Guest 2', email='guest2@example.com', status='confirmed'),
        Guest(name='Guest 3', email='guest3@example.com', status='invited'),
        Guest(name='Guest 4', email='guest4@example.com', status='confirmed'),
        Guest(name='Guest 5', email='guest5@example.com', status='invited'),
        Guest(name='Guest 6', email='guest6@example.com', status='confirmed')
    ]

    # Create events
    event = Event(title='Event 1', location='Location 1', date=datetime.now().date(), time=datetime.now().time())

    # Associate users with events and guests with events
    event.user = users[0]  # Assigning the first user to the event for simplicity
    event.guests.extend(guests) 
    
    # Add instances to the session
    db.session.add_all(users)
    db.session.add_all(guests)
    db.session.add(event)

    # Commit the session to persist the data
    db.session.commit()

if __name__ == "__main__":
    with app.app_context():
        create_seed_data()
