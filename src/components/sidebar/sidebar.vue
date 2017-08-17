<template>
  <div class="sidebar-wrap" :class="{ 'show': sidebar.show }">
    <div class="sidebar"
        @click.stop.prev="closeSidebar"
        :style="{
          'webkitTransform': `translate3d(${-(1 - this.sidebar.percent) * 100}%, 0, 0)`,
          'mozTransform': `translate3d(${-(1 - this.sidebar.percent) * 100}%, 0, 0)`,
          'msTransform': `translate3d(${-(1 - this.sidebar.percent) * 100}%, 0, 0)`,
          'transform': `translate3d(${-(1 - this.sidebar.percent) * 100}%, 0, 0)`
        }"
    >
      <div class="top-wrap">
        <!-- 登录 -->
        <div class="login-wrap flex">
          <p class="avatar"><img :src="avatar"></p>
          <h2 class="username flex-item" v-cloak>{{ username }}</h2>
        </div>
        <!-- 登录结束 -->
  
        <!-- 快捷方式 -->
        <div class="shortcut flex align-center text-center">
          <router-link to="/news/star" class="s-item flex align-center flex-item" tag="div">
            <i class="icon icon-star"></i>
            <i class="flex-item">我的收藏</i>
          </router-link>
          <div class="s-item flex align-center flex-item" @click.stop="offlineLoadData">
            <i class="icon icon-download"></i>
            <i class="flex-item" v-cloak>{{ getOfflineText() }}</i>
          </div>
        </div>
        <!-- 快捷方式结束 -->
      </div>

      <div class="themes-wrap">
        <router-link class="home theme" to="/news" tag="div"><i class="icon icon-home"></i>首页</router-link>
        <router-link class="theme flex"
                    v-for="theme in themes"
                    :to="`/theme/${theme.id}`"
                    :key="theme.id"
                    tag="div"
        >
          <i class="name flex-item" v-cloak>{{ theme.name }}</i>
          <i class="icon icon-angle-right"></i>
        </router-link>
      </div>
    </div>
    <div class="sidebar-mask"
        @click.stop.prev="closeSidebar"
        :style="{
          opacity: this.sidebar.percent * 0.6
        }"
    ></div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import { getThemes } from 'api/news/news'
import { saveToLocal, loadFromLocal } from 'common/js/store'

export default {
  data () {
    return {
      username: '请登录',
      avatar: 'http://pic1.zhimg.com/da8e974dc_im.jpg',
      themes: [],
      aniamting: false,
      loading: {
        offline: false
      }
    }
  },
  computed: {
    ...mapState([ 'sidebar', 'offline' ])
  },
  methods: {
    getThemes () { // 获取主题
      const themes = loadFromLocal('themes')
      if (!themes) {
        return getThemes().then(({ data }) => {
          const others = data.others
          this.themes = others
          saveToLocal('themes', others)
        })
      } else {
        this.themes = themes
        return Promise.resolve()
      }
    },
    closeSidebar () { // 关闭侧边栏
      if (this.sidebar.animating) return
      const _self = this
      this.$store.commit('CHANGE_SIDEBAR_ANIMATING', true)
      cancelAnimationFrame(this.sidebar.timer)

      function slideLeft () {
        const percent = _self.sidebar.percent
        if (percent <= 0) {
          _self.$store.commit('CHANGE_SIDEBAR_SHOW', false)
          _self.$store.commit('CHANGE_SIDEBAR_ANIMATING', false)
          return
        }

        _self.sidebar.percent = Math.max(percent - 0.080, 0)
        _self.$store.commit('CHANGE_SIDEBAR_PERCENT', _self.sidebar.percent)
        _self.sidebar.timer = requestAnimationFrame(slideLeft)
      }

      slideLeft()
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
    getOfflineText () { // 获取离线下载文本
      const precent = Math.floor(this.offline.current / this.offline.count * 100)
      if (precent === 100) return '完成'
      if (!this.loading.offline) return '离线下载'

      return precent + '%'
    }
  },
  mounted () {
    this.getThemes()
  }
}
</script>

<style lang="scss">
  $contentPadding: 15px;

  .sidebar-wrap {
    position: absolute;
    z-index: 99;
    top: 0;
    right: 100%;
    width: 100%;
    height: 100%;
    overflow: hidden;

    &.show {
      right: 0;
    }

    .sidebar-mask {
      position: absolute;
      z-index: 1;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: #000;
      opacity: 0.6;
      will-change: opacity;
    }

    .sidebar {
      position: absolute;
      z-index: 2;
      top: 0;
      left: 0;
      color: #000;
      background-color: #fff;
      width: 85%;
      height: 100%;
      box-shadow: 0 0 15px rgba(0, 0, 0, 0.4);
      overflow: auto;

      .icon { margin-left: 10px; }
      .icon-home {
        font-size: 22px;
        margin-left: 0;
        margin-right: 15px;
        vertical-align: -3px;
      }

      .top-wrap {
        background-color: #00a2ed;
        color: #fff;

        .login-wrap {
          padding: 15px $contentPadding 10px;

          .avatar {
            width: 40px;
            height: 40px;
            margin-right: 10px;
            border-radius: 50%;
            overflow: hidden;
          }

          .username {
            font-weight: normal;
          }
        }

        .shortcut {
          .s-item {
            font-size: 14px;
            padding: $contentPadding;
          }
        }
      }

      .themes-wrap {
        .active { background-color: #f0f0f0; }
        .home { color: #00a2ed; }

        .theme {
          font-size: 16px;
          padding: 20px $contentPadding;
        }
      }
    }
  }

  .night .sidebar-wrap {
    .sidebar {
      color: #999;
      background-color: #343434;

      .top-wrap {
        background-color: #252525;
      }

      .themes-wrap {
        .active { background-color: #2c2c2c; }
      }
    }
  }
</style>