from flask import Flask, render_template, Response
from screen import get_frame
import sys


ihost="192.168.43.222"
iport="5000"

app = Flask(__name__)
ihost=sys.argv[1]

#iport=sys.argv[2]


@app.route('/')
def index():
    return render_template('index.html')

@app.route('/about')
def about():
    return render_template('about.html')

def gen():
    while True:
        frame = get_frame()
        yield (b'--frame\r\n'
               b'Content-Type: image/jpeg\r\n\r\n' + frame + b'\r\n\r\n')

@app.route('/video_feed')
def video_feed():
    return Response(gen(),
                    mimetype='multipart/x-mixed-replace; boundary=frame')

if __name__ == '__main__':
    app.run(host=str(ihost),port=str(iport),threaded=True)