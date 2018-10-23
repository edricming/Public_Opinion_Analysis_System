from . import app
from flask import render_template

from flask import request

from flask import json

import method_center


@app.route('/')
def main_page():
    return render_template("homepage.html")


@app.route('/ControlCenter', methods=['POST', 'GET'])
def control_center():
    method_name = request.args.get('method_name')
    data = json.loads(request.form.get('data'))
    return getattr(method_center, method_name)(data)

@app.route('/AnalysePage', methods=['POST', 'GET'])
def key_page():
    key_word=request.args.get('key')
    print(key_word)
    print(method_center.insert2db(key_word))
    return render_template("analysepage.html")