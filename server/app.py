from flask import  jsonify, request, make_response,session
from flask_restful import  Resource
from datetime import datetime

from models import User,Event,Guest
from config import db,api,app




class ClearSession(Resource):

    def delete(self):
    
        session['page_views'] = None
        session['user_id'] = None

        return {}, 204

class Signup(Resource):
    
    def post(self):

        username = request.get_json()['username']
        email = request.get_json()['email']
        password = request.get_json()['password']

        if username and password:

            new_user = User(username=username,email=email)
            new_user.password_hash = password
            db.session.add(new_user)
            db.session.commit()

            session['user_id'] = new_user.id

            return new_user.to_dict(), 201
        return {'error': '422: Unprocessable Entity'}, 422

class CheckSession(Resource):
    def get(self):
        if session.get('user_id'):
            user=User.query.filter(User.id == session['user_id']).first()

            return user.to_dict(), 200
        return {}, 404
        
class Login(Resource):
    def post(self):
        username = request.get_json()['username']
        password = request.get_json()['password']

        user = User.query.filter(User.username == username).first()

        if user.authenticate(password):
            session['user_id'] = user.id
            return user.to_dict(), 200

        return {'error': '401: Unauthorized'}, 401

class Logout(Resource):
        def delete(self):

            session['user_id'] = None
            

class Events(Resource):
    def get(self):
        event=[{'id':event.id,"title":event.title,"location":event.location} for event in Event.query.all()]
        
        return make_response(jsonify(event),200)
    def post(self):
        data=request.json
        title = data['title']
        location=data['location']
        date = data['date']
        time =data['time']  
        user_id=data['user_id'] 
        
        
        # Validate required fields
        if not (title and location and date and time and user_id):
            return {"message": "Missing required fields"}, 400

        # Parse date and time strings into datetime objects
        try:
            date = datetime.strptime(date, '%Y-%m-%d').date()
            time = datetime.strptime(time, '%H:%M').time()
        except ValueError:
            return {"message": "Invalid date or time format"}, 400

        # Check if the user exists
        user = User.query.get(user_id)
        if not user:
            return {"message": "User not found"}, 404

        # Create the event object
        event = Event(title=title, location=location, date=date, time=time, user=user)

        # Add the event to the database session and commit
        db.session.add(event)
        db.session.commit()


        return {"message": "Event created successfully", "title": event.title}, 201


class EventsById(Resource):
    def get(self,id):
        event=Event.query.filter_by(id=id).first()
        
        if not event:
            return make_response(jsonify({"message":"Event not found"}),404)
        event_data={
            "id":event.id,
            "title":event.title,
            "location":event.location,
            "date": str(event.date),  
            "time": str(event.time), 
            "users":event.user.username,
            "guests":[]
        }
        
        
        for guest in event.guests:
            guest_data={
                "id":guest.id,
                "username":guest.name
            }
            event_data["guests"].append(guest_data)
        
        return make_response(jsonify(event_data),200)
    def delete(self,id):
        event=Event.query.filter_by(id=id).first()
        if not event:
            return {"message": "Event not found"}, 404

        
            # Delete all guests associated with the event
        for guest in event.guests:
            db.session.delete(guest)

            # Delete the event
            
        db.session.delete(event)
            

            # Commit the changes to the database
        db.session.commit()


        return {"message": "Event and associated guests deleted successfully"}, 200
    def patch(self,id):
            event=Event.query.filter_by(id=id).first()
            if not event:
                return {"message": "Event not found"}, 404

        
            
            data = request.json

            # Check which fields to update
            if 'location' in data:
                event.location = data['location']
            if 'time' in data:
                event.time = datetime.strptime(data['time'], '%H:%M').time()
            if 'date' in data:
                event.date = datetime.strptime(data['date'], '%Y-%m-%d').date()

            # Commit the changes to the database
            db.session.commit()

            return {"message": "Event updated successfully"}, 200




class Guests(Resource):
    def get(self):
        guests =[ {"id":guest.id,"name":guest.name,"email":guest.email,"status":guest.status}for guest in Guest.query.all()]
        return make_response(jsonify(guests),200)
    def post(self):
        
        data = request.json
        name = data.get('name')
        email = data.get('email')
        status = data.get('status', 'invited')  # Default status to 'invited' if not provided

        if not (name and email):
            return {"message": "Name and email are required fields"}, 400

        guest = Guest(name=name, email=email, status=status)

        db.session.add(guest)
        db.session.commit()

        return {"message": "Guest created successfully", "guest_id": guest.id}, 201
        
class GuestById(Resource):
    def get(self,id):
        guest=Guest.query.filter_by(id=id).first()
        
        if not guest:
            return make_response(jsonify({"message":"Guest not found"}),404)
        guest_data={
            "id":guest.id,
            "name":guest.name,
            "status":guest.status,
            "events":[]
        }
        if guest.events:
            for event in guest.events:
                event_data={
                    "id":event.id,
                    "title":event.title,
                    "location":event.location
                }
                guest_data["events"].append(event_data)
        else:
            guest_data["message"] = "This guest is not invited in any events."
        
        return make_response(jsonify(guest_data),200)
    def patch(self, id):
        data = request.json
        new_status = data.get('status')

        if new_status != 'confirmed':
            return {"message": "Only 'confirmed' status is allowed for accepting invites"}, 400

        guest = Guest.query.get(id)

        if not guest:
            return {"message": "Guest not found"}, 404

        if guest.status != 'invited':
            return {"message": "Guest has already confirmed the invite"}, 400

        guest.status = new_status
        db.session.commit()

        return {"message": "Guest has accepted the invite", "guest_id": guest.id}, 200
    def delete(self,id):
        guest=Guest.query.filter_by(id=id).first()
        
        if not guest:
            return make_response(jsonify({"message":"Guest not found"}),404)
        
        db.session.delete(guest)
        db.session.commit()
        
        return make_response(jsonify({}),200)
class EventGuest(Resource):
    def post(self, event_id, guest_id):
        event = Event.query.get(event_id)
        guest = Guest.query.get(guest_id)

        if not event:
            return {"message": "Event not found"}, 404
        if not guest:
            return {"message": "Guest not found"}, 404

        # Check if the guest is already associated with the event
        if guest in event.guests:
            return {"message": "Guest is already associated with the event"}, 400

        event.guests.append(guest)
        db.session.commit()

        return {"message": "Guest added to the event successfully"}, 200
        
            
api.add_resource(ClearSession, '/clear', endpoint='clear')
api.add_resource(Signup, '/signup', endpoint='signup')
api.add_resource(CheckSession, '/check_session',endpoint='check_session')
api.add_resource(Login, '/login', endpoint='login')
api.add_resource(Logout, '/logout', endpoint='logout')
api.add_resource(Events,'/events')
api.add_resource(EventsById,'/event/<int:id>')
api.add_resource(Guests,"/guests")
api.add_resource(GuestById,"/guest/<int:id>")
api.add_resource(EventGuest, "/event/<int:event_id>/guest/<int:guest_id>")




if __name__ == "__main__":
    app.run(port=5555,debug=True)