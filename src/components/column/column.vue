<template>
  <div class="index flex flex-column">

    <!-- 顶部 -->
    <navigation>
      <i v-if="menu" class="icon icon-menu active-bg" @click.stop.prev="showSidebar"></i>
      <slot name="nav"></slot>
    </navigation>
    <!-- 顶部结束 -->

    <div class="content flex-item">
      <refresh v-if="refreshMethod" content="#app .index .content" :refresh="refreshMethod"></refresh>
      <slot name="content"></slot>
      <p v-if="loadData" id="loadData"></p>
    </div>

    <router-view></router-view>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import navigation from '~/navigation/navigation.vue'
import refresh from '~/refresh/refresh.vue'

export default {
  data () {
    return {
      loading: {
        offline: false
      },
      events: {
        element: {
          loadData: '',
          title: '',
          content: ''
        },
        touch: {
          start: 0,
          isPullUp: false
        },
        click: {
          count: 0,
          timer: ''
        }
      }
    }
  },
  computed: {
    ...mapState([ 'options', 'offline', 'sidebar' ])
  },
  props: {
    refreshMethod: {
      type: Function
    },
    loadData: {
      type: Function
    },
    changeTitle: {
      type: Function
    },
    menu: {
      type: Boolean
    }
  },
  methods: {
    showSidebar () { // 显示侧边栏
      if (this.sidebar.animating) return
      const _self = this
      this.$store.commit('CHANGE_SIDEBAR_SHOW', true)
      this.$store.commit('CHANGE_SIDEBAR_ANIMATING', true)
      cancelAnimationFrame(this.sidebar.timer)

      function slideRight () {
        const percent = _self.sidebar.percent
        if (percent >= 1) {
          _self.$store.commit('CHANGE_SIDEBAR_ANIMATING', false)
          return
        }

        _self.sidebar.percent = Math.min(percent + 0.080, 1)
        _self.$store.commit('CHANGE_SIDEBAR_PERCENT', _self.sidebar.percent)
        _self.sidebar.timer = requestAnimationFrame(slideRight)
      }

      slideRight()
    },
    offlineLoadData () { // 离线下载
      if (this.loading.offline) return

      this.$set(this.loading, 'offline', true)
      this.$store.dispatch('offlineLoadData').then(() => {
        this.$set(this.loading, 'offline', false)
      }).catch(() => {
        this.$set(this.loading, 'offline', false)
      })
    },
    initEvent () { // 初始化DOM事件
      this.loadData && this.$set(this.events.element, 'loadData', document.getElementById('loadData'))
      this.$set(this.events.element, 'title', document.querySelector('.index > .header .title'))
      this.$set(this.events.element, 'content', document.querySelector('#app .index .content'))
      this._scrollEvent()
      this._clickEvent()
    },
    _scrollEvent () {
      this.events.element.content.addEventListener('scroll', (e) => {
        /**
         * 滚到底部时加载数据
         */
        if (this.loadData && window.screen.height + 50 >= this.events.element.loadData.getBoundingClientRect().top) {
          this.loadData()
        }

        /**
         * 滚动到标题时切换标题内容
         */
        this.changeTitle && this.changeTitle()
      })
    },
    _clickEvent () {
      this.events.element.title.addEventListener('click', () => {
        /**
         * 双击标题回到顶部
         */
        this.events.click.count = Math.min(this.events.click.count + 1, 2)

        if (this.events.click.count === 2) {
          this.$set(this.events.click, 'count', 0)
          this.events.element.content.scrollTop = 0
          clearInterval(this.events.click.timer)
        }

        this.events.click.timer = setTimeout(() => {
          this.$set(this.events.click, 'count', 0)
        }, 400)
      }, false)
    }
  },
  mounted () {
    this.refreshMethod && this.refreshMethod()
    this.initEvent()
  },
  components: {
    navigation,
    refresh
  }
}

</script>

<style lang="scss">
  .index {
    height: 100%;
    background-color: #f3f3f3;

    & > .header {
      .icon-menu { margin-left: 5px; }
    }

    & > .content {
      position: relative;
      overflow: auto;
      margin: 0;
    }
  }

  .night {
    .index {
      background-color: #343434;
      transition: background 0.5s;
    }
  }

  .loadData {
    margin: 0;
    height: 0;
    padding: 0;
    overflow: hidden;
    visibility: hidden;
  }
</style>