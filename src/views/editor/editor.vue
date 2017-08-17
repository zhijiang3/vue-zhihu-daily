<template>
  <div class="editor-box flex flex-column">

    <!-- 顶部 -->
    <navigation>
      <p class="active-bg" @click.stop.prev="back">
        <i class="icon icon-back"></i>
      </p>
      <h2 class="title flex-item">主编资料</h2>
    </navigation>
    <!-- 顶部结束 -->

    <div class="editor-content flex-item" v-html="html">
    </div>
  </div>
</template>

<script>
import navigation from '~/navigation/navigation.vue'

export default {
  data () {
    return {
      html: ''
    }
  },
  methods: {
    back () {
      this.$router.go(-1)
    }
  },
  mounted () {
    this.$axios.get(`/api/4/editor/${this.$route.params.editorId}/profile-page/android`).then(({ data }) => {
      this.html = data
    })
  },
  components: { navigation }
}
</script>

<style lang="scss">
  .editor-box {
    position: absolute;
    z-index: 11;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: inherit;

    .editor-content {
      padding-bottom: 20px;
      overflow: auto;
    }
  }

  .night {
    main p {
      color: #999 !important;
    }

    nav li {
      .title { color: #eee !important; }
      .content { color: #ccc !important; }

      &.disabled {
        .title { color: #999 !important; }
        .content { color: #666 !important; }
      }

      &.with-link:before { border-left-color: #ccc !important; }
    }
  }
</style>