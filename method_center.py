# 所有操纵函数的集合，用于提高views.py下ControlCenter路由代码的可读性
import crawler
import ConnectMySQL
import weibo_search
import content_analyse


def hot_list(data):
    return crawler.crawler.hot_search()


def insert2db(key_word):
    if ConnectMySQL.con_2_mysql.exist_in_db(key_word):
        return -1
    total = weibo_search.insert2db(key_word)
    return total


def content_list(data):
    return content_analyse.ContentAnalyse.get_info_from_db(data)


def keyword_extract(data):
    return content_analyse.ContentAnalyse.text_segmentation(data)
