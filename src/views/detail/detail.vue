<template>
  <div class="detail">

    <!-- 顶部 -->
    <navigation>
      <div class="left flex-item">
        <p class="back active-bg" @click.stop.prev="back">
          <i class="icon icon-back"></i>
        </p>
      </div>

      <div class="right flex align-center">
        <span class="share active-bg"><i class="icon icon-share"></i></span>
        <span class="star active-bg" :class="{ 'active': hasStar }" @click.stop.prev="collection"><i class="icon icon-star"></i></span>
        <router-link to="comment" append class="comment" tag="span">
          <i class="icon icon-comment"></i>
          {{ formatNumber(newsInfo.comments) }}
        </router-link>
        <span class="thumbs-up">
          <i class="icon icon-thumbs-up"></i>
          {{ formatNumber(newsInfo.popularity) }}
        </span>
      </div>
    </navigation>
    <!-- 顶部结束 -->

    <div class="content-wrapper">
      <!-- 内容头部 -->
      <div class="top-wrapper" :class="{ 'no-image': !detail.image }">
        <h2 class="title" v-text="detail.title"></h2>
        <div class="image">
          <img :src="detail.image">
          <span class="image-source" v-text="detail.image_source"></span>
        </div>
      </div>
      <!-- 内容头部结束 -->
    
      <!-- 内容 -->
      <div id="main-wrap"></div>
      <!-- 内容结束 -->

      <!-- 栏目信息 -->
      <router-link class="section-wrap flex align-center" v-if="detail.section" :to="`/section/${detail.section.id}`" tag="div">
       <img :src="detail.section.thumbnail" class="pic">
       <i class="name flex-item" v-cloak>本文来自：{{ detail.section.name }} · 合集</i>
       <i class="icon icon-angle-right"></i>
      </router-link>
      <!-- 栏目信息结束 -->
    </div>

    <router-view></router-view>
  </div>
</template>

<script>
import navigation from '~/navigation/navigation.vue'

import {
  saveToLocal,
  loadFromLocal
} from 'common/js/store'

import {
  setTransform
} from 'common/js/util'

export default {
  data () {
    return {
      $content: '',
      $mainWrap: '',
      $topWrap: '',
      $header: '',
      hasStar: false
    }
  },
  computed: {
    newsInfo () {
      return this.$store.state.newsInfo
    },
    detail () {
      return this.$store.state.detail
    },
    loadPic () {
      return this.$store.state.options.loadPic
    },
    detailId () {
      return this.$store.state.detailId
    }
  },
  methods: {
    back () {
      this.$router.go(-1)
    },
    collection () { // 收藏
      const star = loadFromLocal('collection') || []

      if (this.hasStar) { // 收藏过, 需要取消
        const index = star.indexOf(+this.detailId)
        if (index > -1) star.splice(index, 1)
        saveToLocal('collection', star)
      } else { // 没有收藏，添加到本地存储
        star.push(this.detail.id)
        saveToLocal('collection', star)
      }

      this.hasStar = !this.hasStar
    },
    formatNumber (number) {
      if (number == null) return '...'
      return (number >= 1000 ? Math.floor(number / 1000 * 10) / 10 + 'k' : number)
    },
    initDetail () {
      this.$store.commit('SET_DETAIL_ID', this.$route.params.id)

      // 设置是否收藏
      const star = loadFromLocal('collection') || []
      this.hasStar = star.some(item => item === +this.detailId)

      this.$store.dispatch('getDetail').then(() => {
        /**
         * 判断是否不加载图片
         * 如果不加载则做一些处理避免请求
         * 在过度完成后再添加数据
         */
        const body = this.detail.body
        document.getElementById('main-wrap').outerHTML = this.loadPic ? body : formatPic(body)

        const mainWrap = document.querySelectorAll('.main-wrap')
        this.$mainWrap = mainWrap[mainWrap.length - 1]
        if (this.$mainWrap) {
          this.$content = this.$mainWrap.parentNode
          this.$topWrap = this.$content.querySelector('.top-wrapper')
          if (!this.detail.image) this.$mainWrap.classList.add('no-image')
          this.$mainWrap.removeChild(this.$mainWrap.querySelector('.headline'))
        }

        if (this.detail.section) {
          const sectionWrap = document.querySelectorAll('.section-wrap')
          this.$mainWrap.appendChild(sectionWrap[sectionWrap.length - 1])
        }

        this.scrollEvent()
      })
      this.$store.dispatch('getNewsInfo')
    },
    destroyDetail () {
      this.$store.commit('SET_NEWS_INFO', {})
      this.$store.commit('SET_DETAIL', {})
    },
    scrollEvent () {
      let scrollTop = 0
      let beforeTop = 0
      let percent
      const header = document.querySelectorAll('.detail .header')
      const height = this.$topWrap && this.$topWrap.offsetHeight || 1
      this.$header = header[header.length - 1]

      this.$content && this.$content.addEventListener('scroll', (e) => {
        scrollTop = this.$content.scrollTop
        if (scrollTop >= height) {
          if (beforeTop > scrollTop) { // 向上
            this.$header.classList.remove('hide')
            this.$header.style.opacity = 1
          } else { // 向下
            this.$header.classList.add('hide')
            this.$header.style.opacity = 0
          }
        } else {
          /**
           * 顶部导航的淡入淡出
           */
          percent = Math.max(1 - scrollTop / height, 0)

          this.$header.style.opacity = percent
          this.detail.image && setTransform(this.$topWrap, `translate3d(0, ${56 * percent}px, 0)`)

          if (percent) {
            this.$header.classList.remove('hide')
          } else {
            this.$header.classList.add('hide')
          }
        }

        setTimeout(function () {
          beforeTop = scrollTop
        }, 0)
      }, false)
    }
  },
  mounted () {
    this.initDetail()
  },
  destroyed () {
    this.destroyDetail()
  },
  components: {
    navigation
  }
}

function formatPic (str) {
  return str.replace(/<img class="content-image" src|<img src/g, '<i class="none-image-text">点击下载图片</i><img class="content-image none-image" data-src')
}
</script>

<style lang="scss">
  .detail,
  .detail .content-wrapper .main-wrap {
    background-color: #f8f8f8;
  }

  .detail {
    width: 100%;
    height: 100%;
    overflow: auto;
    position: absolute;
    z-index: 5;
    top: 0;
    left: 0;

    & > .header {
      padding: 14px 10px;
      position: absolute;
      z-index: 11;
      left: 0;
      right: 0;
      font-weight: 400;

      &.hide {
        display: none;
      }

      .back {
        display: inline-block;
      }

      .icon {
        font-size: 20px;
      }

      .icon-back {
        font-size: 28px;
      }

      .star.active .icon-star {
        color: #ffe553;
      }

      .right {
        span {
          margin-left: 20px;
          display: inline-block;
          font-size: 14px;

          i {
            margin-right: 3px;
          }

          .icon-star {
            margin-right: 0;
          }

          .icon-comment:before {
            vertical-align: -1px;
          }
        }
      }
    }

    .top-wrapper {
      transform: translate3d(0, 56px, 0);
      line-height: 1.3;
      border-bottom: 4px solid #f6f6f6;

      &.no-image {
        position: static !important;

        .title {
          position: static;
          padding: 15px;
          margin-bottom: 0;
          color: #000;
        }

        .image {
          height: 0;
          opacity: 0;
        }
      }

      & > .title {
        position: absolute;
        z-index: 2;
        left: 0;
        right: 0;
        bottom: 0;
        padding: 0 10px;
        margin: 0 0 25px;
        font-weight: normal;
        font-size: 22px;
        color: #fff;
      }

      .image {
        width: 100%;
        height: 220px;
        overflow: hidden;
        position: relative;
        z-index: 1;

        &:before {
          content: ' ';
          position: absolute;
          z-index: 1;
          left: 0;
          right: 0;
          bottom: 0;
          top: 0;
          background: linear-gradient(to bottom, rgba(0, 0, 0, 0) 30%, rgba(0, 0, 0, 0.5) 100%)
        }

        img {
          width: 100%;
          display: block;
          position: absolute;
          top: 50%;
          transform: translateY(-50%);
        }

        .image-source {
          color: #ccc;
          position: absolute;
          z-index: 2;
          right: 10px;
          bottom: 7px;
          font-size: 14px;
        }
      }
    }

    .content-wrapper {
      overflow: auto;
      position: absolute;
      z-index: 10;
      top: 0;
      width: 100%;
      bottom: 0;
      font-weight: 400;

      .top-wrapper,
      .main-wrap {
        width: 100%;
      }

      .top-wrapper {
        position: fixed;
        z-index: 2;
      }

      .main-wrap {
        position: absolute;
        top: 280px;
        z-index: 3;

        &.no-image {
          position: static;
          margin-top: 56px;
        }
      }
    }

    .section-wrap {
      margin: 0 20px 25px;
      background-color: #f0f0f0;
      color: #222;

      .name {
        padding-left: 10px;
        font-size: 1rem;
      }

      .icon {
        padding-right: 10px;
        font-size: 22px;
      }

      .pic {
        width: 56px;
        height: 56px;
      }
    }

    .question + .question {
      border-top: 5px solid #f6f6f6;
    }

    .question {
      overflow: hidden;
      padding: 0 20px;

      .question-title {
        line-height: 1.4em;
        color: #494b4d;
        font-weight: 700;
        font-size: 18px;
        margin: 20px 0;
      }

      .answer {
        
        h1, h2, h3, h4, h5 {
          font-size: 19px;
        }

        a {
          color: #003989;
        }

        .meta {
          white-space: nowrap;
          text-overflow: ellipsis;
          overflow: hidden;
          font-size: 16px;
          color: #b8b8b8;

          span,
          .source {
            vertical-align: middle;
          }

          .author {
            color: #444;
            font-weight: 700;
          }

          .avatar {
            width: 20px;
            height: 20px;
            border-radius: 2px;
            margin-right: 5px;
          }
        }

        .content {
          line-height: 1.6em;
          font-size: 17px;
          margin: 10px 0 20px;
          color: #616464;

          blockquote {
            color: #9da3a6;
            border-left: 3px solid #Dfe3e6;
          }

          img {
            max-width: 100%;
            display: block;
            margin: 30px auto;
          }

          p {
            margin: 20px 0;
          }

          ul,
          ol {
            padding-left: 15px;
          }

          ul {
            list-style: disc outside none;
          }

          ol {
            list-style: decimal outside none;
          }

          .highlight {
            width: auto;
            overflow: auto;
            word-wrap: normal;
            margin-top: 20px;
            padding: 10px;
            background: #fff;
          }

          .highlight::-webkit-scrollbar {
            width: 6px;
            height: 6px;
          }

          .highlight code {
            overflow: auto;
          }

          .highlight::-webkit-scrollbar-thumb:horizontal {
            border-radius: 6px;
            background-color: rgba(0,0,0,.5);
          }

          .highlight::-webkit-scrollbar-thumb:horizontal:hover {
            background-color: rgba(0,0,0,.6);
          }

          .highlight pre {
            margin: 0;
            white-space: pre;
          }

          .highlight .hll {
            background-color: #ffc;
          }

          .highlight .err {
            color: #a61717;
            background-color: #e3d2d2;
          }

          .highlight .cp {
            color: #999;
            font-weight: 700;
          }

          .highlight .cs {
            color: #999;
            font-weight: 700;
            font-style: italic;
          }

          .highlight .gd {
            color: #000;
            background-color: #fdd;
          }

          .highlight .gi {
            color: #000;
            background-color: #dfd;
          }

          .highlight .gu {
            color: #aaa;
          }

          .highlight .ni {
            color: purple;
          }

          .highlight .nt {
            color: navy;
          }

          .highlight .w {
            color: #bbb;
          }

          .highlight .sr {
            color: olive;
          }

          [hidden],
          .button span {
            display: none;
          }

          b,
          strong,
          .highlight .k,
          .highlight .o,
          .highlight .gs,
          .highlight .kc,
          .highlight .kd,
          .highlight .kn,
          .highlight .kp,
          .highlight .kr,
          .highlight .ow {
            font-weight: 700;
          }

          .highlight .c,
          .highlight .cm,
          .highlight .c1 {
            color: #998;
            font-style: italic;
          }

          .highlight .gr,
          .highlight .gt {
            color: #a00;
          }

          .highlight .gp,
          .highlight .nn {
            color: #555;
          }

          .highlight .kt,
          .highlight .nc {
            color: #458;
            font-weight: 700;
          }

          .highlight .m,
          .highlight .mf,
          .highlight .mh,
          .highlight .mi,
          .highlight .mo,
          .highlight .il {
            color: #099;
          }

          .highlight .s,
          .highlight .sb,
          .highlight .sc,
          .highlight .sd,
          .highlight .s2,
          .highlight .se,
          .highlight .sh,
          .highlight .si,
          .highlight .sx,
          .highlight .s1,
          .highlight .ss {
            color: #d32;
          }

          .highlight .na,
          .highlight .nb,
          .highlight .no,
          .highlight .nv,
          .highlight .vc,
          .highlight .vg,
          .highlight .vi {
            color: teal;
          }

          .highlight .ne,
          .highlight .nf {
            color: #900;
            font-weight: 700;
          }
        }
      }

      .view-more {
        margin-bottom: 25px;
        text-align: center;

        a {
          width: 100%;
          display: block;
          font-size: 16px;
          height: 30px;
          line-height: 30px;
          background: #f0f0f0;
          color: #B8B8B8;
          text-decoration: none;
        }
      }
    }
  }

  .night {
    .detail,
    .detail .content-wrapper .main-wrap {
      background-color: #343434;
    }

    .detail{
      .top-wrapper {
        border-bottom: 4px solid #303030;

        .title {
          color: #fff;
        }
      }

      .content-wrapper {
        .none-image-text {
          color: #666;
          background-color: #ccc;
        }
      }

      .section-wrap {
        background-color: #292929;
        color: #666;
      }

      .question + .question {
        border-top: 4px solid #303030;
      }

      .question {
        .question-title {
          color: #B8B8B8;
        }

        .answer {
          a {
            color: #729cd6;
          }

          .meta {
            .author {
              color: #888;
            }
          }

          .content {
            color: #888;

            blockquote {
              border-left: 3px solid #666;
            }
          }
        }

        .view-more {
          a {
            background: #292929;
            color: #666;
          }
        }
      }
    }
  }
</style>