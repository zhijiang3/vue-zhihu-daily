export function saveToLocal (key, value) {
  let news = window.localStorage.__vue_zhihu_daily__
  if (!news) {
    news = {}
  } else {
    news = JSON.parse(news)
  }

  news[key] = value
  window.localStorage.__vue_zhihu_daily__ = JSON.stringify(news)
}

export function loadFromLocal (key, def) {
  let news = window.localStorage.__vue_zhihu_daily__
  if (!news) {
    return def
  }

  news = JSON.parse(news)
  if (!news) {
    return def
  }

  let ret = news[key]
  return (ret != null ? ret : def)
}
