# app/__init__.py
from flask import Flask
from flask_cors import CORS

def create_app():
    my_app = Flask(__name__)
    CORS(my_app)

    from app.routes.api import api_blueprint
    my_app.register_blueprint(api_blueprint, url_prefix="/api")

    # Auto-import all bots so they're registered
    import app.bots

    return my_app
