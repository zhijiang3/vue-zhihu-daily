import Vue from 'vue'
import Vuex from 'vuex'
import * as newsApi from '@/api/news/news'

import {
  saveToLocal
} from 'common/js/store'

Vue.use(Vuex)

const state = {
  banner: [],
  stories: [],
  detailId: '',
  newsInfo: {},
  detail: {},
  lastDate: '',
  options: {
    isNight: true,
    loadPic: false
  },
  offline: {
    current: 0,
    count: 1
  },
  section: {
    name: '知乎日报',
    sectionId: 0,
    stories: []
  },
  sidebar: {
    show: false,
    percent: 0,
    timer: null,
    animating: false
  },
  theme: {
    name: '主题日报',
    stories: [],
    lastNewsId: 0,
    background: '',
    description: '',
    editors: []
  }
}

const actions = {
  refresh ({ commit }) { // 刷新
    return newsApi.refresh().then(({ data }) => {
      commit('SET_STORIES', data)
      commit('SET_BANNER', data['top_stories'])
    })
  },
  loadData ({ state, commit }) { // 加载更多数据
    return newsApi.loadData(state.lastDate).then(({ data }) => {
      commit('PUSH_NEWS', data)
    })
  },
  getNewsInfo ({ state, commit }) { // 获取某文章的点赞和评论数量
    return newsApi.getNewsInfo(state.detailId).then(({ data }) => {
      commit('SET_NEWS_INFO', data)
    })
  },
  getDetail ({ state, commit }) { // 获取文章的详情
    return newsApi.getDetail(state.detailId).then(({ data }) => {
      commit('SET_DETAIL', data)
    })
  },
  offlineLoadData ({ state, commit }) { // 离线下载功能
    return new Promise((resolve, reject) => {
      let detail = []
      let topStories, stories
      Vue.set(state.offline, 'current', 0)

      newsApi.offlineLoadData(function (data) { // 最新消息的内容回调函数
        topStories = data.topStories
        stories = data.stories

        Vue.set(state.offline, 'count', data.count)
      }, function (data, count) { // 每一个内容的回调函数
        const current = parseInt(state.offline.current)

        detail.push(data)
        Vue.set(state.offline, 'current', current + 1)

        if (current === count - 1) { // 全部加载完成
          saveToLocal('offlineBanner', topStories)
          saveToLocal('offlineStories', stories)
          saveToLocal('offlineDetail', detail)
          resolve()
        }
      })
    })
  },
  getSection ({ state, commit }) {
    return newsApi.getSection(state.section.sectionId).then(({ data }) => {
      commit('SET_SECTION', data)
    })
  },
  getTheme ({ commit }, themeId) {
    return newsApi.getTheme(themeId).then(({ data }) => {
      const stories = data.stories
      commit('CHANGE_THEME', data)
      commit('SET_THEME_LASTNEWS_ID', stories[stories.length - 1].id)
    })
  }
}

const mutations = {
  SET_STORIES (state, data) {
    const { date, stories } = data

    state.lastDate = date
    state.stories = [{
      date,
      stories
    }]
  },
  PUSH_NEWS (state, data) {
    state.stories.push(data)
    state.lastDate = data.date
  },
  SET_BANNER (state, banner) {
    state.banner = banner
  },
  SET_DETAIL_ID (state, id) {
    state.detailId = id
  },
  SET_NEWS_INFO (state, info) {
    state.newsInfo = info
  },
  SET_DETAIL (state, detail) {
    state.detail = detail
  },
  SET_SECTION_ID (state, id) {
    Vue.set(state.section, 'sectionId', id)
  },
  SET_SECTION (state, data) {
    Vue.set(state.section, 'name', data.name)
    Vue.set(state.section, 'stories', data.stories)
  },
  CHANGE_NIGHT (state, isShow) {
    Vue.set(state.options, 'isNight', (isShow !== undefined ? isShow : !state.options.isNight))
  },
  CHANGE_LOAD_PIC (state, isLoad) {
    Vue.set(state.options, 'loadPic', (isLoad !== undefined ? isLoad : !state.options.loadPic))
  },
  CHANGE_SIDEBAR_SHOW (state, show) {
    Vue.set(state.sidebar, 'show', (show !== undefined ? show : !state.sidebar.show))
  },
  CHANGE_SIDEBAR_PERCENT (state, percent) {
    let result = 0

    if (percent !== undefined) result = percent
    else if (state.sidebar.show) result = 1

    Vue.set(state.sidebar, 'percent', result)
  },
  CHANGE_SIDEBAR_ANIMATING (state, animating) {
    Vue.set(state.sidebar, 'animating', (animating !== undefined ? animating : !state.sidebar.animating))
  },
  CHANGE_THEME (state, data) {
    Vue.set(state, 'theme', data)
  },
  SET_THEME_LASTNEWS_ID (state, id) {
    Vue.set(state.theme, 'lastNewsId', id)
  },
  PUSH_THEME_STORIES (state, stories) {
    Vue.set(state.theme, 'stories', state.theme.stories.concat(stories))
  }
}

export default new Vuex.Store({
  state,
  actions,
  mutations
})
