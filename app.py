from math import floor
import re
from flask import Flask, redirect, url_for, request,jsonify,render_template,send_from_directory,make_response
from flask_sqlalchemy import SQLAlchemy
from datetime import date,datetime
import game 


app = Flask(__name__,static_folder="static",template_folder="templates")
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///test.db'
db = SQLAlchemy(app)



from string import ascii_lowercase,ascii_uppercase
from random import sample
import hashlib
def generate_token():
    N = 12
    samples = ascii_uppercase+ascii_lowercase+"012345689"
    raw_token = "".join(sample(samples,N))
    hashed_token = hashlib.sha256()
    hashed_token.update(raw_token.encode("utf-8"))
    return hashed_token.hexdigest()
def check_token(token):
    active_user = Active_Users.query.filter_by(token=token).first()
    return active_user != None
    pass
def add_active_user(token,ip):
    active_user = Active_Users(token=token,ip_address = ip)
    db.session.add(active_user)
    db.session.commit()

def delete_token(token):
    try:
        Active_Users.query.filter_by(token=token).delete()
        db.session.commit()
    except Exception:
        print("[-] Something went wrong :(")



class Active_Users(db.Model):
    id = db.Column(db.Integer,primary_key=True)
    token = db.Column(db.String(256),nullable=False)
    ip_address = db.Column(db.String(16),nullable=False)
    def __repr__(self) -> str:
        return "<{} - {}>".format(self.ip_address,self.token)

##MODELS
class Feedbacks(db.Model):
    id = db.Column(db.Integer,primary_key=True)
    rate = db.Column(db.Integer,nullable=True)
    name = db.Column(db.String(200),nullable=False)
    subject = db.Column(db.String(1024),nullable=True)
    details = db.Column(db.String(4294000000),nullable=True)
    last_feedback_date = db.Column(db.DateTime,nullable=False)
    sender_ip = db.Column(db.String(32),nullable=False)
    def __repr__(self):
        return "<{} - {}\t{} <- {}>".format(self.name, self.subject,self.last_feedback_date,self.sender_ip)
        pass

class Guest(db.Model):
    id = db.Column(db.Integer,primary_key=True)
    guest_id = db.Column(db.String(120),nullable=False)
    game_time = db.Column(db.Integer,nullable=False)
    
    ip_address = db.Column(db.String(16),nullable=False)
    difficulty = db.Column(db.String(60),nullable=False)
    def __repr__(self):
        return "<Guest {}>".format(self.guest_id)
"""db.create_all()
exit(1)"""

def get_avgs():
    avgs = []
    for d in ["easy","medium","hard"]:
        plays = Guest.query.filter_by(difficulty=d).all()
        avg = (sum(player.game_time for player in plays)/(len(plays))) if len(plays) > 0 else 0
        avgs.append(int(avg))
    return avgs
def get_games_counts():
    counts = []
    for d in ["easy","medium","hard"]:
        c = len(Guest.query.filter_by(difficulty=d).all())
        counts.append(c)
    return counts
def get_overall_rate():
    rates = Feedbacks.query.all()
    rates_avg = sum([row.rate for row in rates])/len(rates)
    return rates_avg
def create_index_response():
    avg_time = get_avgs()
    asc_by_time = Guest.query.order_by(Guest.game_time).limit(5).all()
    all_games = get_games_counts()
    token = generate_token()
    overall_rate = get_overall_rate()
    stars_count = floor(overall_rate)
    response = make_response(render_template("index.html",top10_players = asc_by_time, easy_avgs=avg_time[0],medium_avgs = avg_time[1],hard_avgs = avg_time[2],all_games=all_games,token=token,overall_rate=overall_rate
            ,stars_count=stars_count))
    response.headers.set('Strict-Transport-Security', 'max-age=31536000; includeSubDomains')
    response.headers.set('X-Content-Type-Options','nosniff')
    response.headers.set('X-Frame-Options', 'SAMEORIGIN')
    response.headers.set('X-XSS-Protection', '1; mode=block')

    return response,token

@app.route("/delete",methods=["POST"])
def delete_active_user():
    if request.form["token"]:
        token = request.form["token"]
        Active_Users.query.filter_by(token=token).delete()
        db.session.commit()
        return "200"
    pass
@app.route("/give_feedback",methods=["POST"])
def give_feedback():
    
    try:
        #request.form["fname"] and request.form["subject"] and request.form["feedback_detail"] and request.form["rates"] and request.form["token"]:
        token = request.form["token"]
        fname,subject,feedback,rates = request.form["fname"] , request.form["subject"] , request.form["feedback_detail"],request.form["rates"]
        sender_ip = request.remote_addr
        current_date = datetime.now()

        ##get the latest feedback
        latest_date = Feedbacks.query.filter_by(sender_ip=sender_ip).order_by(Feedbacks.id.desc()).limit(1).first()
        delta_time = (current_date-latest_date.last_feedback_date) if latest_date else 0
        delta_time = datetime.strptime(str(delta_time),"%H:%M:%S.%f") if delta_time != 0 else 0
        if delta_time:
            if delta_time.second < 2:
                return "403",403
                pass
        if not check_token(token):
            return "403",403
        feedback_obj = Feedbacks(rate=rates,name=fname,subject=subject,details=feedback,last_feedback_date=current_date,sender_ip=sender_ip)
        db.session.add(feedback_obj)
        db.session.commit()
        
        return create_index_response()[0]
    except:
        return "403",403


@app.route("/get_leaderboard",methods=["GET"])
def get_leaderboard():
    if request.args.get("diff"):
        all_data = Guest.query.filter_by(difficulty=request.args.get("diff")[:-1]).order_by(Guest.game_time).limit(10).all()
        dict_data = {}
        for player in all_data:
            dict_data[player.guest_id] = player.game_time
        return str(dict_data).replace("'",'"')
    pass
@app.route("/add-winner",methods=["POST"])
def addWinner():
    try:
        print(request.form)
        token = request.form["token"]
        
        if not check_token(token):
            
            return "403",403
        guest_id,game_time,diff = request.form["guest_id"],request.form["time"],request.form["diff"]
        ip_addr = request.remote_addr
        winner_guest = Guest(guest_id=guest_id,game_time=game_time,ip_address=ip_addr,difficulty=diff)
        all_players = Guest.query.all()
        for player in all_players:
            if player.guest_id == guest_id and player.difficulty == diff:
                if int(game_time) < int(player.game_time):
                    player.game_time = game_time
                    db.session.commit()
                return "200",200
        db.session.add(winner_guest)
        db.session.commit()
        return "200",200
    except:
        return "403",403
    pass


@app.route("/maze-data")
def getMaze():
    if request.args.get("w") and request.args.get("h") and request.args.get("token"):
        token = request.args.get("token")
        if not check_token(token):
            return "403",403
        w = int(request.args.get("w"))
        h = int(request.args.get("h"))
        maze_data = game.make_maze(w,h)
        return jsonify(maze_data)
    maze_data = game.make_maze()
    return jsonify(maze_data)

@app.route("/")
def index():
    ##calculate avg time
    response = create_index_response()
    token = response[1]
    #add user
    add_active_user(token,request.remote_addr)
    return response[0]
@app.route("/test")
def test():
    return render_template("test.html")

if __name__ == "__main__":
    generate_token()
    #get_overall_rate()
    app.run(host="localhost",port=80,debug=True)