# main.py

import sys
import pandas as pd
import numpy as np
# import logging
from flask import Flask, Response, request
from flask_cors import CORS
from flask_jsonpify import jsonpify



app = Flask(__name__)
cors = CORS(app, resources={r"/api/*": {"origins": "*"}})


def Calc_Values(dataset, nCol, impact):
    k = 0
    p_sln = dataset.max().values[0:]
    n_sln = dataset.min().values[0:]
    for i in range(1, nCol):
        if impact[k] == '-':
            p_sln[i], n_sln[i] = n_sln[i], p_sln[i]
        k = k + 2
    return p_sln, n_sln


@app.route("/", methods=['POST'])
def top_score():
    if request.method == 'POST':
        data = request.files['file']
        # return data
        weights = request.form.get('weight',False)
        impacts = request.form['impact']
        # return '''
        #               <h1>The framework value is: {}</h1>
        #               <h1>The website value is: {}'''.format(weights, impacts)
        # content_type = request.headers.get('Content-Type')
        # if (content_type == 'application/json'):
        #     json = request.json
        # else:
        #     return 'Content-Type not supported!'
        #
        # data = json['file']
        # weights = json['weight']
        # impacts = json['impact']
    # data = request.args.get('file')
    # weights = request.args.get('weight')
    # impacts = request.args.get('impact')
    #     return '''
    #           <h1>The language value is: {}</h1>
    #           <h1>The framework value is: {}</h1>
    #           <h1>The website value is: {}'''.format(data, weights, impacts)
        topsis = pd.read_csv(data)
        print(topsis)
        # return topsis
        top_cop = topsis.copy()
        shape = topsis.shape
        cols = topsis.columns.values.tolist()

        sol = pd.DataFrame(columns=topsis.iloc[:, 0])

        impact_size = 0
        i = 0
        while i in range(0, len(impacts)):
            impact_size = impact_size + 1
            i = i + 2

        while i in range(1, len(impacts)):
            i = i + 2
        k = 0
        for i in range(1, shape[1]):
            topsis.iloc[:, i] = topsis.iloc[:, i] / np.linalg.norm(topsis.iloc[:, i])
            weight = int(weights[k])
            k = k + 2
            topsis.iloc[:, i] = topsis.iloc[:, i] * weight
        p_sln, n_sln = Calc_Values(topsis, shape[1], impacts)
        score = []
        pp = []
        nn = []
        for i in range(shape[0]):
            temp_p, temp_n = 0, 0
            for j in range(1, shape[1]):
                temp_p = temp_p + (p_sln[j] - topsis.iloc[i, j]) ** 2
                temp_n = temp_n + (n_sln[j] - topsis.iloc[i, j]) ** 2
            temp_p, temp_n = temp_p * 0.5, temp_n * 0.5
            score.append(temp_n / (temp_p + temp_n))
            nn.append(temp_n)
            pp.append(temp_p)
        topsis['distance positive'] = pp
        topsis['distance negative'] = nn
        topsis['Topsis Score'] = score

        topsis['Rank'] = (topsis['Topsis Score'].rank(method='max', ascending=False))
        topsis = topsis.astype({"Rank": int})
        top_cop['Topsis Score'] = topsis['Topsis Score']
        top_cop['Rank'] = topsis['Rank']
        print(top_cop)
        df_list = top_cop.values.tolist()
        print(df_list)
        df_list = [top_cop.columns.tolist(), df_list]
        print(df_list)
        JSONP_data = jsonpify(df_list)
        return JSONP_data
        # return Response(top_cop, mimetype='type/csv',  headers={'Content-Disposition': 'attachment; filename="result.csv"'})
        # return Response(top_cop, mimetype='text/csv')
        # return Response(top_cop)


if __name__ == '__main__':
    app.run(host='127.0.0.1', port=8080, debug=True)
    # top_score(sys.argv[1], sys.argv[2], sys.argv[3], sys.argv[4])
