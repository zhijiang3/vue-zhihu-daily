<template>
  <div id="app" :class="{ 'night': options.isNight }">
    <router-view></router-view>
    <sidebar></sidebar>
  </div>
</template>

<script>
import sidebar from '~/sidebar/sidebar.vue'

import {
  loadFromLocal
} from 'common/js/store'

export default {
  name: 'app',
  computed: {
    options () {
      return this.$store.state.options
    }
  },
  methods: {
    delegateEvent () {
      let $app = document.querySelector('#app')
      let $target, $next

      $app.addEventListener('click', function (e) {
        $target = e.target

        if (!$target) return

        /**
         * 内容点击下载图片事件代理
         */
        if ($target.className === 'none-image-text') { // 开始加载图片
          $target.className = 'none-image-text loading-image'
          $next = $target.nextSibling
          $next.src = $next.getAttribute('data-src')
          $target.innerText = '加载中...'

          $next.addEventListener('load', function () { // 图片加载完成
            $next.style.display = 'block'
            $target.style.display = 'none'
          }, false)
        }
      }, false)
    }
  },
  created () {
    const stories = loadFromLocal('offlineStories')
    const banner = loadFromLocal('offlineBanner')

    this.$store.commit('CHANGE_NIGHT', loadFromLocal('isNight'))
    this.$store.commit('CHANGE_LOAD_PIC', loadFromLocal('loadPic'))
    stories && this.$store.commit('SET_STORIES', stories[0])
    banner && this.$store.commit('SET_BANNER', banner)
  },
  mounted () {
    this.delegateEvent()
  },
  components: {
    sidebar
  }
}
</script>

<style lang="scss">
@import 'common/scss/index.scss';
</style>