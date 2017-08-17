<template>
  <column :refreshMethod="refreshMethod" :menu="true">
    <template slot="nav">
      <h2 class="title flex-item" v-cloak>{{ length }} 条收藏</h2>
    </template>

    <template slot="content">
      <div class="news-wrapper">
        <item v-for="item in collection" :item="item" :key="item.id"></item>
      </div>
    </template>
  </column>
</template>

<script>
import { getDetail } from 'api/news/news'
import { loadFromLocal } from 'common/js/store'
import column from '~/column/column.vue'
import item from '~/item/item.vue'

export default {
  data () {
    return {
      collection: [],
      length: 0
    }
  },
  methods: {
    refreshMethod () {
      const collection = loadFromLocal('collection')
      const arr = collection.map(getDetail)
      this.length = collection.length
      return this.$axios.all(arr).then(this.$axios.spread((...rest) => {
        this.collection = rest.map(item => item.data)
      }))
    }
  },
  mounted () {
    this.refreshMethod()
  },
  components: { column, item }
}
</script>

<style>
  .news-wrapper {
    padding: 0 10px;
    margin-top: 10px;
  }
</style>