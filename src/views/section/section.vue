<template>
  <div class="section flex flex-column">

    <!-- 顶部 -->
    <navigation>
      <p class="active-bg" @click.stop.prev="back">
        <i class="icon icon-back"></i>
      </p>
      <h2 class="title flex-item" v-text="section.name"></h2>
    </navigation>
    <!-- 顶部结束 -->

    <div class="content flex-item">
      <div class="news-wrapper">
        <item v-for="item in section.stories" :item="item" :key="item.id"></item>
      </div>
    </div>
  </div>
</template>

<script>
import navigation from '~/navigation/navigation.vue'
import item from '~/item/item.vue'

export default {
  computed: {
    section () {
      return this.$store.state.section
    }
  },
  methods: {
    back () {
      this.$router.go(-1)
    }
  },
  created () {
    const id = +this.$route.params.sectionId
    if (id !== this.section.sectionId) {
      this.$store.commit('SET_SECTION', {
        name: '知乎日报',
        stories: []
      })
    }
    this.$store.commit('SET_SECTION_ID', id)
    this.$store.dispatch('getSection')
  },
  components: {
    navigation,
    item
  }
}
</script>

<style lang="scss">
  .section {
    position: absolute;
    z-index: 11;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: inherit;

    .content {
      margin-top: 10px;
      overflow: auto;
    }
  }
</style>