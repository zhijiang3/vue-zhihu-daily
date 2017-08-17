<template>
  <div class="news-wrapper">
    <h2 class="news-title" v-cloak>{{ formatDate(news.date, 'MM月dd日 星期D') }}</h2>
    <item v-for="item in news.stories" :item="item" :key="item.id"></item>
  </div>
</template>

<script>
import item from '~//item/item.vue'

import {
  formatDate
} from 'common/js/util'

export default {
  props: {
    news: Object
  },
  methods: {
    formatDate
  },
  components: {
    item
  }
}
</script>

<style lang="scss">
  .news-wrapper {
    padding: 0 10px;

    & > .news-title {
      margin: 0;
      padding: 5px 5px 15px;
      color: #6b6b6b;
      font-weight: normal;
      font-size: 14px;
      line-height: 1;
    }
  }

  .night {
    .news-wrapper {
      & > .news-title {
        color: #ccc;
      }
    }
  }
</style>