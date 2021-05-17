from flask import Flask, redirect, url_for, request,jsonify,render_template,send_from_directory
from flask_sqlalchemy import SQLAlchemy



app = Flask(__name__,static_folder="static",template_folder="templates")
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///test.db'
db = SQLAlchemy(app)
import app as a
a.run()
