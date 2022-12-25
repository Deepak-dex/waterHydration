from  flask import Flask, jsonify, request, make_response
import jwt
from functools import wraps
from flask_sqlalchemy  import SQLAlchemy
import uuid
from werkzeug.security import generate_password_hash, check_password_hash

app = Flask(__name__)

app.config['SECRET_KEY'] = 'thisIsSecret'
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///user.db'

db = SQLAlchemy(app)

class User(db.Model):
    id = db.Column(db.Integer, primary_key = True)
    public_id = db.Column(db.String(50), unique=True)
    name = db.Column(db.String(50))
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
            data = jwt.decode(token, app.config['SECRET_KEY'])
            current_user = User.query.filter_by(public_id=data['public_id']).first()
        except:
            return jsonify({'message':'Token is invalid'})
        
        return f(*args, **kwargs)
    return decorated


@app.route('/protected')
@token_required
def protected():
    return jsonify({'message':'only for logged in user'})

@app.route('/login',methods=["POST"])
def login():
    data = request.get_json()

    if not data or not data['name'] or not data['password']:
        return make_response('Could not verify!', 401, {'WWW-Authenticate':'Basic realm="login Required'})
    
    user = User.query.filter_by(name=data['name']).first()

    if not user:
        return make_response('Could not verify', 401, {'WWW-Authenticate' : 'Basic realm="Login required!"'})

    if check_password_hash(user.password, data['password']):
        token = jwt.encode({'public_id' : user.public_id}, app.config['SECRET_KEY'])

        return jsonify({'token' : token.decode()})

    return make_response('Could not verify', 401, {'WWW-Authenticate' : 'Basic realm="Login required!"'})    

@app.route('/register',methods=["POST"])
def register():
    data = request.get_json()

    hashed_password = generate_password_hash(data['password'], method='sha256')

    new_user = User(public_id=str(uuid.uuid4()), name=data['name'], password=hashed_password,phoneno=data['phoneno'])
    db.session.add(new_user)
    db.session.commit()

    return jsonify({'message' : 'New user created!'})

# @app.route('/user', methods=['GET'])
# def get_all_users():
#     return ''

# @app.route('/user/<user_id>', methods=['GET'])
# def get_one_user():
#     return ''

# @app.route('/user', methods=['POST'])
# def create_user():
#     return ''

# @app.route('/user/<user_id>', methods=['PUT'])
# def update_user():
#     return ''

# @app.route('/user/<user_id>', methods=['DELETE'])
# def delete_user():
#     return ''

if __name__ == '__main__':
    app.run(debug=True)