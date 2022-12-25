from flask_login import current_user
# from gevent import monkey; monkey.patch_all() # It is used to make python work synchronously(run for ever maintaining its variable values or state) 
from flask import Flask, Response, jsonify, request, make_response
from flask_cors import CORS # It allows us to request data from a 3rd party(i.e server running  on different port or doamin ) server(or website)  
import time 
import datetime

import json #sends response in json
import jwt #for token
from functools import wraps
from flask_sqlalchemy  import SQLAlchemy #sqlite
import uuid
from werkzeug.security import generate_password_hash, check_password_hash

from twilio.rest import Client #for whatsapp not


app = Flask(__name__) # Here a instance of flask is created and the __name__(special variable) tell python the loction where app is defined 
CORS(app) # Here we have wrapped our app in cors making it consumable by 3rd party programs(client/frontend)

@app.route("/listen") # It is telling the program to run the following function when someone(client) comes on 'localhost/listen' route
def listen(): #This is a sse event which runs continuously keeps sending response to the following route (ie 'localhost/listen')

  def respond_to_client():

    prev = datetime.datetime.now().hour 
    while prev == datetime.datetime.now().hour:
        yield f"id: 1\ndata: _data\nevent: online\n\n"
        # prev = datetime.datetime.now().hour``
        time.sleep(10)

  return Response(respond_to_client(), mimetype='text/event-stream')
  
app.config['SECRET_KEY'] = 'thisIsSecret'
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///user.db'

db = SQLAlchemy(app)

class User(db.Model):
    id = db.Column(db.Integer, primary_key = True)
    public_id = db.Column(db.String(50), unique=True)
    name = db.Column(db.String(50))
    email = db.Column(db.String(50))
    password = db.Column(db.String(80))
    phoneno = db.Column(db.Integer)


def token_required(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        token = None

        if 'x-access-token' in request.headers:
            token = request.headers['x-access-token']

        if not token:
            return jsonify({'message':'Token is missing'})

        try:
            data = jwt.decode(token, app.config['SECRET_KEY'],algorithms=["HS256"])
            current_user = User.query.filter_by(public_id=data['public_id']).first()
        except:
            return jsonify({'message':'Token is invalid'})
        
        return f(current_user,*args, **kwargs)
    return decorated


@app.route('/isverified')
@token_required
def isverifyed(current_user):
    return jsonify({'message':'True'})

@app.route('/login',methods=["POST"])
def login():
    data = json.loads(list(request.form)[0])

    if not data or not data['email'] or not data['password']:
        return make_response('Could not verify!', 401, {'WWW-Authenticate':'Basic realm="login Required'})
    
    user = User.query.filter_by(email=data['email']).first()
 
    if not user: 
        return make_response('Could not verify', 401, {'WWW-Authenticate' : 'Basic realm="Login required!"'})

    if check_password_hash(user.password, data['password']):
        token = jwt.encode({'public_id' : user.public_id}, app.config['SECRET_KEY'])

        return jsonify({'token' : token})

    return make_response('Could not verify', 401, {'WWW-Authenticate' : 'Basic realm="Login required!"'})    

@app.route('/register',methods=["POST"])
def register():
    data = json.loads(list(request.form)[0])
    # print('data',data,request.get_json()) 
    print(data) 

    hashed_password = generate_password_hash(data['password'], method='sha256')

    new_user = User(public_id=str(uuid.uuid4()), email=data['email'], password=hashed_password,phoneno=data['phoneno'],name="")
    db.session.add(new_user)
    db.session.commit()

    return jsonify({'message' : 'New user created!'})

@app.route('/sendmsg',methods=["POST"])
@token_required
def sendMsg(current_user):
    data = request.get_json(force=True)
    print(current_user.phoneno,data['message'])
    
    account_sid = 'AC70058f8b7f968199f26051c144f61105' 
    auth_token = 'b8f0cf0d33b1a250f97e98284e91a5bc' 
    client = Client(account_sid, auth_token) 
 
    # message = client.messages.create( 
    #         from_='whatsapp:+14155238886',  
    #         body= "Water Hydration \n" + data['message'],      
    #         to= f'whatsapp:+91{current_user.phoneno}' 
    # )

    return jsonify({'message' : 'True'})
    
@app.route('/getuser',methods=["GET"])
@token_required
def getUser(current_user):
    print(current_user.phoneno,current_user.name)
    return jsonify({'name' : current_user.name,
                    'phone':current_user.phoneno})



if __name__ == "__main__":
  app.run(port=80, debug=True) # .run function starts the flask server 
