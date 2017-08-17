import axios from 'axios'

import {
  loadFromLocal
} from 'common/js/store'

export function refresh () {
  return axios.get('/api/4/news/latest')
}

export function loadData (lastDate) {
  return axios.get(`/api/4/news/before/${lastDate}`)
}

export function getNewsInfo (newsId) {
  return axios.get(`/api/4/story-extra/${newsId}`)
}

export function getDetail (newsId) {
  let i, len, item
  const detail = loadFromLocal('offlineDetail') || []

  for (i = 0, len = detail.length; i < len; i++) {
    item = detail[i]

    if (item.id === newsId) {
      console.log('从本地存储找到一个内容')
      return Promise.resolve({ data: item })
    }
  }
  return axios.get(`/api/4/news/${newsId}`)
}

export function offlineLoadData (latestCb, detailCb) {
  refresh().then(({ data }) => {
    const topStories = data['top_stories']
    const { date, stories } = data
    const count = parseInt(topStories.length + stories.length)

    latestCb({
      topStories,
      stories: [{ date, stories }],
      count
    })

    /**
     * 加载数据
     */
    Array.prototype.slice.call(topStories).concat(stories).map((item) => {
      /**
       * 根据 文章的id 获取该文章的内容
       */
      getDetail(item.id).then(({ data }) => {
        let images = data.body.match(/<img class="content-image" src="([\S]*)"/g)

        loadImages(images, function () {
          detailCb(data, count)
        })
      })
    })
  })
}

export function getSection (sectionId) {
  return axios.get(`/api/4/section/${sectionId}`)
}

function loadImages (arr, cb) {
  if (arr == null) return cb()

  let count = 0

  for (let i = 0, len = arr.length; i < len; i++) {
    let url = arr[i].slice(32, -1)

    loadImage(url).then(() => {
      count++

      if (count === len) cb()
    })
  }
}

function loadImage (url, cb) {
  return axios.get(url)
}
