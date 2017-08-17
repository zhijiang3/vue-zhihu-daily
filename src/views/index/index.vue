<template>
  <column
    :refreshMethod="refreshMethod"
    :loadData="loadData"
    :changeTitle="changeTitle"
    :menu="true"
  >
    <template slot="nav">
      <h2 class="title flex-item" v-cloak>{{ events.titleText }}</h2>
      <div class="bell active-bg"><i class="icon icon-bell"></i></div>
      <menu-list></menu-list>
    </template>

    <template slot="content">
      <p class="index-title news-title">首页</p>

      <!-- 轮播图 -->
      <banner :banner="banner"></banner>
      <!-- 轮播图结束 -->

      <news v-for="news in stories"
            :news="news"
            :key="news.date"
      ></news>
    </template>
  </column>
</template>

<script>
import { mapState } from 'vuex'
import column from '~/column/column.vue'
import menuList from '~/menulist/menulist.vue'
import news from '~/news/news.vue'
import banner from '~/banner/banner.vue'

export default {
  data () {
    return {
      titles: '',
      loading: {
        data: false
      },
      events: {
        titleText: '首页',
        element: {
          title: ''
        },
        scroll: {
          index: 0
        }
      }
    }
  },
  computed: {
    ...mapState([ 'options', 'banner', 'stories' ])
  },
  methods: {
    refreshMethod () { // 刷新
      return this.$store.dispatch('refresh').then(() => {
        this.titles = document.querySelectorAll('.index > .content .news-title')
      })
    },
    loadData () { // 加载更多数据
      if (this.loading.data) return

      this.$set(this.loading, 'data', true)
      this.$store.dispatch('loadData').then(() => {
        this.$set(this.loading, 'data', false)
        this.titles = document.querySelectorAll('.index > .content .news-title')
      }).catch(() => {
        this.$set(this.loading, 'data', false)
      })
    },
    changeTitle () { // 修改顶部的标题
      let prev, curr, next
      let plusIndex, minusIndex

      minusIndex = this.events.scroll.index - 1
      plusIndex = this.events.scroll.index + 1

      prev = this.titles[minusIndex]
      curr = this.titles[this.events.scroll.index]
      next = this.titles[plusIndex]

      if ((prev && prev.getBoundingClientRect().top - 56) > 0) {
        this.$set(this.events, 'titleText', prev.innerText)
        this.$set(this.events.scroll, 'index', minusIndex)
      } else if ((next && next.getBoundingClientRect().top - 56) < 0) {
        this.$set(this.events, 'titleText', next.innerText)
        this.$set(this.events.scroll, 'index', plusIndex)
      } else if ((curr && curr.getBoundingClientRect().top - 56) > 0) {
        this.$set(this.events, 'titleText', prev.innerText)
        this.$set(this.events.scroll, 'index', minusIndex)
      }
    }
  },
  mounted () {
    this.$set(this.events.element, 'title', document.querySelector('.index > .header .title'))
  },
  components: {
    column,
    menuList,
    news,
    banner
  }
}
</script>

<style lang="scss">
  .index {
    & > .header {
      .bell {
        margin-right: 20px;
        color: #fff;
      }
    }

    & > .content {
      .index-title {
        height: 0;
        visibility: hidden;
        display: none;
        overflow: hidden;
      }

      .banner {
        margin-bottom: 10px;
      }
    }
  }
</style>