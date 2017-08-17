<template>
  <div class="header flex align-center">
    <slot></slot>
  </div>
</template>

<style lang="scss">
  .header {
    color: #fff;
    background-color: #00a1ec;
    padding: 16px 10px;
    transition: background 0.5s;

    .icon {
      font-size: 24px;
      display: inline-block;
    }

    .title {
      margin: 0;
      font-weight: normal;
      padding: 0 20px 0 25px;
      font-size: 20px;
    }

    .active-bg {
      position: relative;
      z-index: 1;
    }

    .active-bg:after {
      content: ' ';
      position: absolute;
      z-index: -1;
      top: 50%;
      left: 50%;
      width: 28px;
      height: 28px;
      margin-top: -19px;
      margin-left: -20px;
      padding: 6px;
      display: block;
      border-radius: 50%;
      pointer-events: none;
    }
    
    .active-bg:active:after { background-color: #30b3f1; }
  }

  .night {
    .header {
      background-color: #222;

      .active-bg:active:after { background-color: #4c4c4c; }
    }
  }
</style>