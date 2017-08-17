<template>
  <column :loadData="loadData"
          :refreshMethod="getTheme"
          :menu="true"
  >
    <template slot="nav">
      <h2 class="title flex-item" v-cloak>{{ theme.name }}</h2>
      <menu-list></menu-list>
    </template>

    <template slot="content">
      <div class="top-wrap">
        <div class="pic"><img :src="theme.background"></div>
        <div class="desc" v-cloak>{{ theme.description }}</div>
      </div>

      <router-link to="editors" class="editors-box flex align-center" tag="div" append>
        <h2 class="title">主编</h2>
        <p class="editors-wrap flex-item">
          <span v-for="editor in theme.editors" :key="editor.id">
            <img :src="editor.avatar" onerror="this.src='http://pic1.zhimg.com/da8e974dc_im.jpg'">
          </span>
        </p>
      </router-link>

      <div class="news-wrapper">
        <item v-for="item in theme.stories"
              :item="item"
              :key="item.id"
        ></item>
      </div>
    </template>
  </column>
</template>

<script>
import { mapState } from 'vuex'
import column from '~/column/column.vue'
import menuList from '~/menulist/menulist.vue'
import item from '~/item/item.vue'
import { loadThemeData } from 'api/news/news'

export default {
  data () {
    return {
      $content: '',
      loadDataing: false
    }
  },
  computed: {
    ...mapState([ 'theme', 'options' ])
  },
  methods: {
    getTheme () { // 刷新 / 获取最新数据
      return this.$store.dispatch('getTheme', this.$route.params.themeId)
    },
    loadData () { // 加载更多数据
      if (this.loadDataing) return

      this.loadDataing = true
      return loadThemeData(this.$route.params.themeId, this.theme.lastNewsId).then(({ data }) => {
        const stories = data.stories
        this.$store.commit('PUSH_THEME_STORIES', stories)
        this.$store.commit('SET_THEME_LASTNEWS_ID', stories[stories.length - 1].id)
        this.loadDataing = false
      }).catch(() => {
        this.loadDataing = false
      })
    }
  },
  watch: {
    '$route': function (to, from) {
      const reg = new RegExp('editors', 'g')
      if (reg.test(to.path) || reg.test(from.path)) return

      this.$content.scrollTop = 0
      this.$store.commit('CHANGE_THEME', {
        name: '主题日报',
        stories: [],
        lastNewsId: 0,
        background: '',
        description: '',
        editors: []
      })
      this.$store.commit('SET_THEME_LASTNEWS_ID', 0)
      this.getTheme()
    }
  },
  mounted () {
    this.$content = document.querySelector('.content')
  },
  components: { column, item, menuList }
}
</script>

<style lang="scss">
  .top-wrap {
    position: relative;
    z-index: 2;

    .pic {
      position: relative;
      z-index: 1;
      width: 100%;
      height: 220px;
      overflow: hidden;

      img {
        position: absolute;
        z-index: 1;
        left: 50%;
        top: 50%;
        width: 140%;
        max-width: 140%;
        transform: translate(-50%, -50%);
      }
    }

    .desc {
      position: absolute;
      z-index: 2;
      left: 0;
      right: 0;
      bottom: 0;
      margin: 0;
      color: #fff;
      font-size: 1.3rem;
      line-height: 1.3;
      font-weight: normal;
      padding: 10px 20px;
    }
  }

  .editors-box {
    margin-top: 10px;
    padding: 0 10px;

    .title {
      font-weight: normal;
      margin: 0;
      color: #777;
      font-size: 14px;
    }

    > .editors-wrap {
      > span {
        width: 30px;
        height: 30px;
        border-radius: 50%;
        overflow: hidden;
        display: inline-block;
        margin-left: 12px;

        img {
          max-width: 100%;
        }
      }
    }
  }

  .news-wrapper {
    padding: 0 10px;
    margin-top: 10px;
  }

  .night {
    .editors-box {
      .title {
        color: #bcbcbc;
      }
    }
  }
</style>