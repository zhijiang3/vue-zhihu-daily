<template>
  <div class="banner">
    <div class="banner-wrapper flex">
      <router-link :to="`news/${item.id}`" class="banner-item" v-for="item in banner" :key="item.id" tag="div"c append>
        <h2 class="title" v-html="formatTitle(item.title)"></h2>
        <div class="pic-wrapper"><img :src="item.image"></div>
      </router-link>
    </div>
    <ul class="banner-list flex align-center content-center">
      <li class="item" v-for="(item, i) in banner" :key="i" :class="{ 'active': index === i }"></li>
    </ul>
  </div>
</template>

<script>
import {
  formatTitle,
  setTransform
} from 'common/js/util'

export default {
  data () {
    return {
      index: 0
    }
  },
  props: {
    banner: Array
  },
  methods: {
    formatTitle,
    carousel () {
      const _self = this
      const len = 5
      const $banner = document.querySelector('.banner')
      const $bannerWrap = $banner.children[0]
      const wrapWidth = $bannerWrap.offsetWidth
      let count = 0
      let timer, moveDistance, autoPlayTimer
      let start = { x: 0, y: 0 }
      let canMove = { x: true, y: true }
      let move = { x: 0, start: 0, end: 0, distance: 0 }

      $banner.addEventListener('touchstart', function (e) {
        stopPlay()

        if (count > 0) { // 动画还没结束
          count = 0
          cancelAnimationFrame(timer)
        }

        /**
         * 记录起始坐标 x 和 y, 用以判断是水平还是垂直移动
         * 记录 banner 滚动偏移量, 用以设置内容的位置
         */
        start.x = e.touches[0].pageX
        start.y = e.touches[0].pageY
        move.start = parseInt($banner.scrollLeft)
      }, false)

      $banner.addEventListener('touchmove', function (e) {
        /**
         * 如果垂直方向移动了, 则不能水平方向移动, 反之亦然
         */
        if (canMove.y && Math.abs(start.y - e.touches[0].pageY) > 7) { // 垂直方向移动
          canMove.x = false
        }

        if (canMove.x) { // 水平方向移动
          // 这次移动的距离
          move.distance = start.x - e.touches[0].pageX

          /**
           * -(move.start + move.distance) + move.end 这次移动的最终位置
           * Math.max 和 Math.min 用于不让内容溢出
           */
          move.x = Math.max(Math.min(-(move.start + move.distance) + move.end, 0), -(wrapWidth - $banner.offsetWidth))
          setTransform($bannerWrap, `translate3d(${move.x}px, 0, 0)`)
          e.preventDefault()
          e.stopPropagation()
          canMove.y = false
        }
      }, false)

      $banner.addEventListener('touchend', function (e) {
        touchend()
        autoPlay()
      }, false)

      autoPlay()

      /**
       * 自动播放
       */
      function autoPlay () {
        stopPlay()
        function play () {
          autoPlayTimer = setTimeout(() => {
            let add = _self.index + 1
            canMove.x = false
            _self.index = add >= len ? 0 : add
            touchend()
            play()
          }, 3500)
        }

        play()
      }

      /**
       * 停止播放
       */
      function stopPlay () {
        clearInterval(autoPlayTimer)
      }

      function touchend () {
        if (canMove.x) {
          /**
           * 如果可以水平移动
           * 则修改index来实现移动
           */
          if (move.distance >= 100) _self.index++
          if (move.distance <= -100) _self.index--
        }

        /**
         * 根据index来修改需要移动的位置
         */
        _self.index = Math.min(Math.max(_self.index, 0), len - 1)
        moveDistance = (-_self.index * $banner.offsetWidth - move.x) / 10
        timer = requestAnimationFrame(bannerGo)

        canMove.x = true
        canMove.y = true
      }

      function bannerGo () {
        if (count > 9) {
          count = 0
          return
        }

        count++
        move.x = move.x + moveDistance
        /**
         * move.end 是记录移动结束后的位置, 用以在下一次移动时不会重置位置
         */
        move.end = move.x
        setTransform($bannerWrap, `translate3d(${move.x}px, 0, 0)`)
        timer = requestAnimationFrame(bannerGo)
      }
    }
  },
  mounted () {
    this.carousel()
  }
}
</script>

<style lang="scss">
  $bannerLength: 5;

  img {
    max-width: 100%;
  }

  .banner {
    position: relative;
    z-index: 2;
    width: 100%;
    overflow: hidden;
    line-height: 1;

    .banner-wrapper {
      width: 100% * $bannerLength;
    }

    .banner-list {
      position: absolute;
      z-index: 2;
      bottom: 10px;
      left: 0;
      right: 0;

      .item {
        width: 7px;
        height: 7px;
        margin-right: 4px;
        border-radius: 50%;
        background: #888;

        &.active {
          background: #fff;
        }
      }
    }

    .banner-item {
      width: 100% / $bannerLength;
      position: relative;
      z-index: 1;
      height: 250px;
      overflow: hidden;

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

      .title {
        position: absolute;
        z-index: 2;
        left: 0;
        right: 0;
        bottom: 20px;
        margin: 0;
        color: #fff;
        font-size: 1.6rem;
        line-height: 1.3;
        font-weight: normal;
        padding: 10px 15px;
      }
    }

    .pic-wrapper {
      position: absolute;
      z-index: 0;
      width: 100%;
      height: 100%;

      img {
        position: absolute;
        min-width: 100%;
        z-index: 0;
        top: 50%;
        transform: translateY(-50%);
        margin: 0;
        -webkit-mask-image: none;
      }
    }
  }
</style>