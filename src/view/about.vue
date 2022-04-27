<template>
  <div class="about" id="about" name="about">
    <div class="about-header">
      <div class="about-title">
        <i class="el-icon-tickets" style="color: #ff6700"></i>
        关于我们
      </div>
    </div>
    <div class="about-content">
      <myMarkdown></myMarkdown>
    </div>
  </div>
</template>

<script>
import myMarkdown from '../components/myMarkdown'
export default {
  components: {
    myMarkdown
  }
}
</script>

<style lang="less" scoped>
.about {
  background-color: #f5f5f5;
  .about-header {
    height: 64px;
    background-color: #fff;
    border-bottom: 2px solid #ff6700;
    .about-title {
      width: 1225px;
      margin: 0 auto;
      height: 64px;
      line-height: 64px;
      font-size: 28px;
    }
  }
  .content {
    padding: 20px 0;
    width: 1225px;
    margin: 0 auto;
    .goods-list {
      margin-left: -13.7px;
      overflow: hidden;
    }
  }
  .about-content {
    width: 1225px;
    margin: 0 auto;
    background-color: #fff;
  }
}
</style>
