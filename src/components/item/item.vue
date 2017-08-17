<template>
  <router-link :to="detail" tag="a" class="item flex">
    <span class="title flex-item" v-html="formatTitle(item.title)"></span>
    <span class="date" v-if="item.date" v-text="item.display_date"></span>
    <span v-if="item.images" class="pic">
      <img :src="item.images[0]">
      <span class="multi" v-show="item.multipic">
        <i class="icon icon-multi-img"></i>多图
      </span>
    </span>
  </router-link>
</template>

<script>
import {
  formatTitle
} from 'common/js/util'

export default {
  data () {
    return {
      detail: {
        path: this.link ? this.link : `/news/${this.item.id}`
      }
    }
  },
  props: {
    item: Object,
    link: String
  },
  methods: {
    formatTitle
  }
}
</script>

<style lang="scss">
  $paddingX: 18px;
  $paddingY: 15px;

  .news-wrapper .item {
    transition: background 0.5s;
    padding: $paddingY $paddingX;
    border-radius: 5px;
    background-color: #fff;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.2);
    margin-bottom: 10px;
    position: relative;
    z-index: 1;

    &:active {
      background-color: #f0f0f0;
    }

    &:visited {
      .title {
        color: #666;
      }

      .date {
        color: #b0b0b0;
      }
    }
  
    & > .title {
      font-weight: normal;
      min-height: 56px;
      line-height: 28px;
      color: #000;
      margin: 0;
      font-size: 1.1rem;
      overflow: hidden;
    }

    & > .date {
      position: absolute;
      z-index: 1;
      left: $paddingX;
      bottom: $paddingY;
    }

    .pic {
      position: relative;
      z-index: 1;
      margin: 0 0 0 10px !important;
      height: 85px;
      width: 95px;
      overflow: hidden;

      img {
        width: 100%;
        display: block;
        margin: 0;
        -webkit-mask-image: none;
      }

      .multi {
        position: absolute;
        z-index: 2;
        bottom: 0;
        right: 0;
        color: #fff;
        background: rgba(0, 0, 0, 0.5);
        font-size: 12px;
        padding: 3px 5px;

        .icon {
          font-size: 13px;
          margin-right: 3px;
        }
      }
    }
  }

  .night {
    .item {
      background-color: #414141;

      &:active {
        background-color: #535353;
      }

      &:visited {
        .title {
          color: #999;
        }

        .date {
          color: #666;
        }
      }

      & > .title {
        color: #fff;
      }

      & > .date {
        color: #fff;
      }
    }
  }
</style>