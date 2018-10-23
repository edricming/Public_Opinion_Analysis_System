import ConnectMySQL
from flask import json
import jieba
from collections import Counter

class ContentAnalyse:
    @staticmethod
    # 根据关键词从数据库中读取数据
    def get_info_from_db(json_input):
        sql = "SELECT content FROM Teledata.hot_content where hot_name=%s"
        content_json = ConnectMySQL.con_2_mysql.exec_sql(sql, json_input['serachword']).fetchall()
        content_json = json.loads(content_json[0][0])
        mid = []
        text = []
        nickname = []
        gender = []
        sentiment = []
        for i in range(len(content_json)):
            mid.append(content_json[i]['mid'])
            text.append(content_json[i]['text'])
            nickname.append(content_json[i]['username'])
            if content_json[i]['usergender'] == 'f':
                # 女性记为0
                gender.append(0)
            else:
                gender.append(1)
            sentiment.append(content_json[i]['sentiment'])
        return json.jsonify(
            success=True,
            mid=mid,
            text=text,
            nickname=nickname,
            gender=gender,
            sentiment=sentiment
        )

    @staticmethod
    # 中文分词
    def text_segmentation(json_input):
        sql = "select content->>\"$[*].text\" as text from hot_content where hot_name= %s"
        content_json = ConnectMySQL.con_2_mysql.exec_sql(sql, json_input['serachword']).fetchall()
        content_json = json.loads(content_json[0][0])
        text = ''
        for x in content_json:
            text = text + x
        seg_list = jieba.cut(text)
        c = Counter()
        for x in seg_list:
            if len(x) > 1 and x != '\r\n':
                c[x] += 1
        print('常用词频度统计结果')
        rtnjson = []
        for (k, v) in c.most_common(25):
            item = {'name': k, 'value': v}
            rtnjson.append(item)
        return json.jsonify(
            success=True,
            data=rtnjson
        )
