# 微博内容检索
import re
import json
import requests
import ConnectMySQL
import time
import tencent_sentiment
from datetime import datetime

# 基于 m.weibo.cn 抓取少量数据，无需登陆验证
url_template = "https://m.weibo.cn/api/container/getIndex?type=wb&queryVal={}&containerid=100103type=2%26q%3D{}&page={}"


def clean_text(text):
    """清除文本中的标签等信息"""
    dr = re.compile(r'(<)[^>]+>', re.S)
    dd = dr.sub('', text)
    dr = re.compile(r'#[^#]+#', re.S)
    dd = dr.sub('', dd)
    dr = re.compile(r'@[^ ]+ ', re.S)
    dd = dr.sub('', dd)
    return dd.strip()


def fetch_data(query_val, page_id):
    """抓取关键词某一页的数据"""
    resp = requests.get(url_template.format(query_val, query_val, page_id))
    card_group = json.loads(resp.text)['data']['cards'][0]['card_group']
    print('url：', resp.url, ' --- 条数:', len(card_group))

    mblogs = []  # 保存处理过的微博
    for card in card_group:
        mblog = card['mblog']
        content=clean_text(mblog['text'])
        # print(content)
        blog = {'mid': mblog['id'],  # 微博id
                'text': str(content),  # 文本
                'username': mblog['user']['screen_name'],  # 用户名
                'usergender': mblog['user']['gender'],  #用户性别
                # 'reposts_count': mblog['reposts_count'],  # 转发
                # 'comments_count': mblog['comments_count'],  # 评论
                # 'attitudes_count': mblog['attitudes_count'],  # 点赞
                'sentiment':tencent_sentiment.tenct_senti(content) #情感倾向
                }
        mblogs.append(blog)
    return mblogs


def remove_duplication(mblogs):
    """根据微博的id对微博进行去重"""
    mid_set = {mblogs[0]['mid']}
    new_blogs = []
    for blog in mblogs[1:]:
        if blog['mid'] not in mid_set:
            new_blogs.append(blog)
            mid_set.add(blog['mid'])
    return new_blogs


def fetch_pages(query_val, page_num):
    """抓取关键词多页的数据"""
    mblogs = []
    for page_id in range(1 + page_num + 1):
        try:
            mblogs.extend(fetch_data(query_val, page_id))
        except Exception as e:
            print(e)

    print("去重前：", len(mblogs))
    mblogs = remove_duplication(mblogs)
    print("去重后：", len(mblogs))
    now = time.time()
    # 向数据库保存
    nowTime = datetime.fromtimestamp(now).strftime('%Y-%m-%d %H:%M:%S')
    sql = "INSERT INTO `Teledata`.`hot_content` (`hot_name`, `fresh_time` ,`content`) VALUES (%s, %s, %s);"
    # print(json.dumps(mblogs))
    ConnectMySQL.con_2_mysql.exec_sql(sql, (query_val, nowTime, json.dumps(mblogs)))
    return len(mblogs)

def insert2db(key_word):
    return fetch_pages(key_word, 1)
