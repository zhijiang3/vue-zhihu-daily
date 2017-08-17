<template>
  <div class="comment-wrap flex flex-column">
    <!-- 顶部 -->
    <navigation>
      <p class="back active-bg" @click.stop.prev="back">
        <i class="icon icon-back"></i>
      </p>
      <h2 class="title flex-item" v-cloak>{{ newsInfo.comments || 0 }} 条点评</h2>
      <div class="comment active-bg"><i class="icon icon-write-comment"></i></div>
    </navigation>
    <!-- 顶部结束 -->

    <div class="content flex-item">
      <div class="title" v-cloak>{{ newsInfo.long_comments }} 长评论</div>
      <template v-if="longComments.length">
        <comment-item v-for="item in longComments" :item="item" :key="item.id"></comment-item>
      </template>
      <p v-else class="no-long-comments">
        <i>深度长评论虚位以待</i>
      </p>

      <div class="title flex align-center" v-cloak @click.stop="toggleShortComments($event)">
        <i class="flex-item">{{ newsInfo.short_comments }} 短评论</i>
        <i class="icon icon-angle-right" :class="{ 'show': show.short }"></i>
      </div>
      <div class="short-comments-wrap" v-show="show.short">
        <comment-item v-for="item in shortComments" :item="item" :key="item.id"></comment-item>
      </div>
    </div>
  </div>
</template>

<script>
import navigation from '~/navigation/navigation.vue'
import commentItem from '~/commentitem/commentitem.vue'

export default {
  data () {
    return {
      longComments: [],
      shortComments: [],
      $content: '',
      show: {
        short: false
      }
    }
  },
  computed: {
    newsInfo () {
      return this.$store.state.newsInfo
    }
  },
  methods: {
    back () {
      this.$router.go(-1)
    },
    getShortComment () {
      if (!this.shortComments.length) {
        return this.$axios.get(`/api/4/story/${this.$route.params.id}/short-comments`).then(({ data }) => {
          this.shortComments = data.comments
        })
      }

      return Promise.resolve()
    },
    toggleShortComments (e) {
      this.getShortComment().then(() => {
        this.$set(this.show, 'short', !this.show.short)
        if (this.show.short) this.scrollToShortComments(e)
      })
    },
    scrollToShortComments (e) {
      const target = e.target
      let top = target.offsetTop - 56
      top = target.nodeName === 'DIV' ? top : top - 17

      setTimeout(() => {
        this.$content.scrollTop = top
      }, 10)
    }
  },
  mounted () {
    this.$content = document.querySelector('.comment-wrap .content')
    this.$axios.get(`/api/4/story/${this.$route.params.id}/long-comments`).then(({ data }) => {
      this.longComments = data.comments
    })
  },
  components: {
    navigation,
    commentItem
  }
}
</script>

<style lang="scss">
  .comment-wrap {
    width: 100%;
    height: 100%;
    overflow: auto;
    position: absolute;
    z-index: 11;
    top: 0;
    left: 0;
    background-color: inherit;

    .no-long-comments {
      $paddingTop: 48px * 2;
      position: relative;
      z-index: 0;
      height: 100%;
      padding-top: $paddingTop;
      margin-top: -$paddingTop;
      box-sizing: border-box;

      i {
        position: absolute;
        z-index: 0;
        top: 50%;
        left: 50%;
        margin-top: -7px;
        margin-left: -63px;
        color: #666;
      }
    }

    & > .header {
      padding: 14px 10px;

      .title {
        margin-top: 2px;
      }
    }

    .comment { margin-right: 5px; }
    .icon-back { font-size: 28px; }
    .icon-write-comment { font-size: 18px; }

    .content {
      overflow: auto;

      & > .title {
        color: #666;
        padding: 15px;
        border: 1px solid #dfdfdf;
        border-left: 0;
        border-right: 0;

        .icon-angle-right {
          transform: rotate(90deg);

          &.show {
            transform: rotate(-90deg);
          }
        }
      }
    }

  }

  .night {
    .comment-wrap {
      .no-long-comments {
        i {
          color: #ccc;
        }
      }

      .content {
        & > .title {
          border-color: #484848;
          color: #ccc;
        }
      }
    }
  }
</style>