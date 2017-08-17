import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

/**
 * 此处不使用懒加载
 * 原因: 离线时需要加载过一次才可以使用该组件
 */
const Index = require('views/index/index.vue')
const Detail = require('views/detail/detail.vue')
const Section = require('views/section/section.vue')
const Option = require('views/option/option.vue')
const Comment = require('views/comment/comment.vue')
const Collection = require('views/collection/collection.vue')
const Theme = require('views/theme/theme.vue')
const Editors = require('views/editors/editors.vue')
const Editor = require('views/editor/editor.vue')

const detail = {
  path: '/news/:id(\\d+)',
  component: Detail,
  children: [{
    path: 'comment',
    component: Comment
  }]
}

const section = {
  path: '/section/:sectionId(\\d+)',
  component: Section
}

export default new Router({
  mode: 'history',
  linkActiveClass: 'active',
  routes: [
    { path: '/', redirect: 'news' },
    {
      name: 'Home',
      path: '/news',
      component: Index,
      children: [
        detail,
        section,
        { name: 'Option', path: '/option', component: Option }
      ]
    },
    {
      name: 'Collection',
      path: '/news/star',
      component: Collection,
      children: [
        detail,
        section
      ]
    },
    {
      name: 'Theme',
      path: '/theme/:themeId(\\d+)',
      component: Theme,
      children: [
        {
          path: 'editors',
          component: Editors,
          children: [
            { path: ':editorId(\\d+)', component: Editor }
          ]
        }
      ]
    }
  ]
})
