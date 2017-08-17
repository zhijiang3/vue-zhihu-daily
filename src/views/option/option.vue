<template>
  <div class="option flex flex-column">

    <!-- 顶部 -->
    <navigation>
      <router-link to="/news" class="active-bg"><i class="icon icon-back"></i></router-link>
      <h2 class="title flex-item">设置</h2>
    </navigation>
    <!-- 顶部结束 -->

    <div class="content flex-item">
      <div class="option-wrap">
        <h2 class="title">常规</h2>
        <div class="option-item flex align-center" @click.stop="toggleLoadPic">
          <div class="text flex-item">
            <p class="title">无图模式</p>
            <p class="desc">内容不加载图片</p>
          </div>
          <input type="checkbox" :checked="!options.loadPic">
        </div>
      </div>
      <div class="option-wrap">
        <h2 class="title">反馈</h2>
        <div class="option-item flex align-center">
          <div class="text flex-item">
            <div class="title"><a href="mailto:240897357@qq.com">意见反馈</a></div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import navigation from '~/navigation/navigation.vue'

import {
  saveToLocal
} from 'common/js/store'

export default {
  computed: {
    options () {
      return this.$store.state.options
    }
  },
  methods: {
    toggleLoadPic () { // 切换图片加载
      this.$store.commit('CHANGE_LOAD_PIC')
      saveToLocal('loadPic', this.options.loadPic)
    }
  },
  components: {
    navigation
  }
}
</script>

<style lang="scss">
  .option {
    position: absolute;
    z-index: 5;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: #fff;

    .content {
      padding-top: 10px;

      a { display: block; }

      .option-wrap {
        .option-item + .option-item { border-top: 1px solid #e6e6e6; }

        & > .title {
          padding: 0 15px;
          margin: 5px 0;
          color: #009685;
          font-size: 14px;
        }

        .option-item {
          padding: 15px;

          &:active { background-color: #f0f0f0; }

          .text {
            & > .title {
              color: #000;
              font-size: 16px;
            }

            & > .desc {
              color: #666;
              margin-top: 8px;
              font-size: 14px;
            }
          }
        }
      }
    }
  }

  .night {
    .option {
      background-color: inherit;
      color: #fff;

      .content {
        .option-wrap {
          .option-item + .option-item { border-top: 1px solid #494949; }

          & > .title {
            color: #80cbc4;
          }

          .option-item {
            &:active { background-color: #444; }

            .text {
              & > .title {
                color: #fff;
              }

              & > .desc {
                color: #ccc;
              }
            }
          }
        }
      }
    }
  }
</style>