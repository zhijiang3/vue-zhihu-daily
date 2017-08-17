<template>
  <div class="menu-list-wrap">
    <div class="menu-list">
      <i class="icon icon-menu-list" @click.stop="changeMenuList"></i>
      <ul class="list" v-show="menuList.isShow">
        <li class="block" v-cloak @click.stop="toggleNight">
          {{ options.isNight ? '日间模式' : '夜间模式' }}
        </li>
        <router-link to="/option" tag="li">
          <i class="block" @click="closeMenuList()">设置选项</i>
        </router-link>
      </ul>
    </div>

    <!-- 菜单栏遮罩 -->
    <div class="menu-list-mask"
        v-show="menuList.mask"
        @touchstart.prevent="changeMenuList(false)"
        @touchend.prevent="changeMenuListMask(false)"
    ></div>
    <!-- 菜单栏遮罩结束 -->
  </div>
</template>

<script>
import { saveToLocal } from 'common/js/store'

export default {
  data () {
    return {
      menuList: {
        isShow: false,
        mask: false
      }
    }
  },
  computed: {
    options () {
      return this.$store.state.options
    }
  },
  methods: {
    closeMenuList () { // 关闭菜单列表
      this.changeMenuList(false)
      this.changeMenuListMask(false)
    },
    changeMenuList (isShow) { // 改变菜单列表的显示隐藏
      this.menuList.isShow = isShow || !this.menuList.isShow

      if (this.menuList.isShow) {
        this.menuList.mask = true
      }
    },
    changeMenuListMask (isShow) { // 改变菜单列表遮罩的显示隐藏
      this.menuList.mask = isShow || !this.menuList.mask
    },
    toggleNight () {
      this.$store.commit('CHANGE_NIGHT')
      saveToLocal('isNight', this.options.isNight)
      this.closeMenuList()
    }
  }
}
</script>

<style lang="scss">
  .menu-list-wrap {
    .menu-list {
      position: relative;
      z-index: 5 !important;

      & > .list {
        position: absolute;
        z-index: 1;
        right: 0;
        top: 0;
        color: #000;
        background-color: #fff;
        border-radius: 3px;
        overflow: hidden;
        box-shadow: 0 5px 5px rgba(0, 0, 0, 0.2);

        .block {
          padding: 15px;
          width: 150px;
          display: block;

          &:active {
            background-color: #f0f0f0;
          }
        }
      }
    }

    .menu-list-mask {
      position: absolute;
      z-index: 4;
      left: 0;
      right: 0;
      top: 0;
      bottom: 0;
      background-color: rgba(0, 0, 0, 0.01);
    }
  }

  .night {
    .menu-list-wrap {
      .menu-list {
        & > .list {
          color: #fff;
          background-color: #303030;

          .block {
            &:active {
              background-color: #535353;
            }
          }
        }
      }
    }
  }
</style>