<template>
  <div class="comment-item-wrap flex">
    <div class="avatar-wrap"><img :src="item.avatar" :alt="item.author" onerror="this.src='http://pic1.zhimg.com/da8e974dc_im.jpg'"></div>
    <div class="flex-item">
      <div class="author-wrap flex align-center">
        <h2 class="author flex-item" v-text="item.author"></h2>
        <p class="likes" v-cloak><i class="icon icon-thumbs-up"></i> {{ item.likes }}</p>
      </div>
      <div class="content-wrap">{{ item.content }}</div>

      <template v-if="item.reply_to">
        <div v-if="item.reply_to.status" class="reply-to-error" v-cloak>{{ item.reply_to.error_msg }}</div>

        <div v-else class="reply-to-wrap" @click.stop="toggle($event)">
          <i class="author">//{{ item.reply_to.author }}：</i>{{ item.reply_to.content }}
        </div>
      </template>
      
      <div class="time" v-cloak>{{ formatDate(+(item.time + '000'), 'MM-dd hh:mm', true) }}</div>
    </div>
  </div>
</template>

<script>
import {
  formatDate
} from 'common/js/util'

export default {
  props: {
    item: {
      type: Object
    }
  },
  methods: {
    formatDate,
    toggle (e) {
      let target = e.target

      if (target.className === 'author') {
        target = target.parentNode
      }

      if (target.innerHeight !== 48) {
        target.classList.toggle('show')
      }
    }
  }
}
</script>

<style lang="scss">
  .comment-item-wrap + .comment-item-wrap { border-top: 1px solid #dfdfdf; }

  .comment-item-wrap {
    padding: 15px;
    font-weight: 400;

    &:active { background-color: #f0f0f0; }

    .avatar-wrap {
      width: 44px;
      height: 44px;
      border-radius: 50%;
      overflow: hidden;
      margin-right: 10px;
    }

    .author {
      margin: 10px 0 15px;
      font-weight: bold;
      color: #000;
    }

    .likes {
      color: #b8b8b8;
    }

    .content-wrap,
    .reply-to-wrap,
    .reply-to-error {
      line-height: 1.5;
      font-size: 16px;
    }

    .reply-to-wrap {
      color: #666;
      display: -webkit-box;
      -webkit-box-orient: vertical;
      -webkit-line-clamp: 2;
      overflow: hidden;
    }

    .reply-to-error {
      padding: 5px 10px;
      background-color: #f6f6f6;
      color: #666;
    }

    .show {
      display: block;
    }

    .time {
      margin: 15px 0 5px;
      color: #a9a9a9;
    }
  }

  .night {
    .comment-item-wrap + .comment-item-wrap { border-top: 1px solid #484848; }

    .comment-item-wrap {
      &:active { background-color: #484848; }

      .reply-to-error {
        background-color: #313131;
        color: #5b5b5b;
      }

      .author,
      .likes {
        color: #c5c5c5;
      }

      .content-wrap {
        color: #8a8a8a;
      }

      .time {
        color: #666;
      }
    }
  }
</style>