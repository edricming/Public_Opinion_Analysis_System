# 关键词爬取模块
import requests
import re
from flask import json

class crawler:
    @staticmethod
    def hot_search():
        headers = {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/69.0.3497.100 Safari/537.36'
        }
        data = {
            'cate': 'realtimehot'
        }
        try:
            r = requests.get('http://s.weibo.com/top/summary?cate=realtimehot', params=data, headers=headers)
            if r.status_code == 200:
                html = r.text
        except:
            html = ""
        # 微博有两套前端html代码，不定时更换，因此使用两套正则表达式进行尝试
        hot_name = re.findall(
            r'(?<=Refer=top" target="_blank">).*?(?=<)|(?<=realtimehot_ad" word=").*?(?=" url_show)', html)
        hot_temper = re.findall(r'(?<=<span>)[0-9]{5,7}(?=<)', html)
        if len(hot_name) == 0:
            hot_name = re.findall(
                r'(?<=list_realtimehot\\">)[\w ]*\\.*?(?=<\\/a>\\n)|(?<=realtime_\d{5}\\"\\n>)[\w ]*\\.*?(?=<\\/a>\\n)',
                html)
            hot_temper = re.findall(r'(?<=<span>)[0-9]{5,7}(?=<)', html)
        if len(hot_name)==0 or len(hot_temper)==0:
            return json.jsonify(
                success=False
            )
        else:
            return json.jsonify(
                success=True,
                namelist=hot_name,
                hot_temper=hot_temper
            )
