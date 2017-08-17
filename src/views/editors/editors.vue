<template>
  <div class="editors flex flex-column">

    <!-- 顶部 -->
    <navigation>
      <p class="active-bg" @click.stop.prev="back">
        <i class="icon icon-back"></i>
      </p>
      <h2 class="title flex-item">主编</h2>
    </navigation>
    <!-- 顶部结束 -->

    <div class="content-wrap flex-item">
      <router-link :to="`${editor.id}`" class="editor flex" v-for="editor in editors" :key="editor.id" tag="div" append>
        <div class="avatar"><img :src="editor.avatar"></div>
        <div class="info flex-item">
          <p class="name">{{ editor.name }}</p>
          <p class="bio">{{ editor.bio }}</p>
        </div>
      </router-link>
    </div>

    <router-view></router-view>
  </div>
</template>

<script>
import navigation from '~/navigation/navigation.vue'

export default {
  computed: {
    editors () {
      return this.$store.state.theme.editors
    }
  },
  methods: {
    back () {
      this.$router.go(-1)
    }
  },
  components: { navigation }
}
</script>

<style lang="scss">
  .editors {
    position: absolute;
    z-index: 11;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: inherit;

    .content-wrap {
      padding-top: 15px;
      padding-bottom: 15px;
      overflow: auto;
      
      .editor + .editor { margin-top: 20px; }
      .editor {
        padding: 0 15px;

        .avatar {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          margin: 0 10px 5px 0;
          overflow: hidden;

          img {
            max-width: 100%;
          }
        }

        .name {
          font-size: 16px;
          color: #000;
        }

        .bio {
          font-size: 14px;
          margin-top: 15px;
          color: #aeaeae;
          height: 14px;
          overflow: hidden;
        }
      }
    }
  }

  .night {
    .editors .content-wrap .editor {
      .name { color: #c8c8c8; }
      .bio { color: #696969; }
    }
  }
</style>