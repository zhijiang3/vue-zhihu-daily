<template>
  <p id="refresh">
    <i id="icon">刷</i>
  </p>
</template>

<script>
import {
  setTransform
} from 'common/js/util'

export default {
  data () {
    return {
      $content: '',
      $refresh: '',
      $icon: '',
      start: 0,
      isPullUp: false,
      height: 130,
      refreshValue: 0,
      percent: 0,
      loading: false,
      timer: null
    }
  },
  props: {
    content: {
      type: String
    },
    refresh: {
      type: Function
    }
  },
  methods: {
    touchEvent () {
      this.$refresh = document.getElementById('refresh')
      this.$icon = document.getElementById('icon')
      this.$content = document.querySelector(this.content)
      this.$content.addEventListener('touchstart', this._touchstart)
      this.$content.addEventListener('touchmove', this._touchmove)
      this.$content.addEventListener('touchend', this._touchend)
    },
    removeTouchEvent () {
      this.$content.removeEventListener('touchstart', this._touchstart)
      this.$content.removeEventListener('touchmove', this._touchmove)
      this.$content.removeEventListener('touchend', this._touchend)
    },
    _touchstart (e) {
      cancelAnimationFrame(this.timer)
      this.start = e.touches[0].pageY
    },
    _touchmove (e) {
      const y = e.touches[0].pageY
      const clientHeight = (window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight) - 56
      let distance = this.start - y

      // 向上 并且 是在顶部向上拉的
      if (distance <= 0 && this.$content.scrollTop === 0) {
        if (!this.isPullUp) { // 重置一下位置和距离
          this.start = y
          distance = 0
        }
        this.isPullUp = true
      }

      if (this.isPullUp) {
        this.percent = distance / -clientHeight
        this._moveRefresh()
        e.preventDefault()
      }
    },
    _touchend (e) {
      this.isPullUp = false
      if (this.refreshValue !== 1) { // 刷新归位
        this._resetRefresh()
      } else {
        this.removeTouchEvent()
        this.$icon.classList.add('rotate')
        this.refresh().then(() => {
          this._refreshDone()
        }).catch(() => {
          this._refreshDone()
        })
      }
    },
    _moveRefresh () {
      this.refreshValue = Math.min(this.percent / 0.6, 1)
      setTransform(this.$refresh, `translate3d(0, ${this.percent * this.height}px, 0) rotate(${this.refreshValue * 360}deg)`)
      this.$icon.style['opacity'] = this.refreshValue
    },
    _resetRefresh () {
      const _self = this
      cancelAnimationFrame(this.timer)

      function goBack () {
        if (_self.percent >= 0) {
          _self.percent -= 0.035
          _self._moveRefresh()
          _self.timer = requestAnimationFrame(goBack)
        } else {
          _self.percent = 0
          _self._moveRefresh()
        }
      }

      goBack()
    },
    _refreshDone () {
      setTimeout(() => {
        this.$icon.classList.remove('rotate')
        this.touchEvent()
        this._resetRefresh()
      }, 400)
    }
  },
  mounted () {
    this.touchEvent()
  },
  destroyed () {
    this.removeTouchEvent()
  }
}
</script>

<style lang="scss">
  #refresh {
    position: absolute;
    top: -40px;
    left: 50%;
    z-index: 3;
    background-color: #fff;
    width: 40px;
    height: 40px;
    line-height: 44px;
    margin-left: -20px;
    border-radius: 50%;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.3);
    text-align: center;
  }

  #icon {
    color: #00a1ec;
    font-size: 18px;
    font-family: '宋体';
    font-weight: bold;
    display: inline-block;
  }

  @keyframes rotate {
    0% {
      transform: rotate(0deg) translate3d(0, 0, 0);
    }
    100% {
      transform: rotate(360deg) translate3d(0, 0, 0);
    }
  }

  .rotate {
    transform-origin: 50% 48%;
    animation: rotate 0.8s infinite;
  }
</style>