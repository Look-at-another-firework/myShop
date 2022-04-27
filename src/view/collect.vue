<template>
  <div class="collect">
    <div class="collect-header">
      <div class="collect-title">
        <i class="el-icon-collection-tag" style="color: #ff6700"></i>
        我的收藏
      </div>
    </div>
    <div class="content">
      <!-- 有内容 -->
      <div class="goods-list clearFix" v-if="collectList.length > 0">
        <myList :list="collectList" :isDelete="true"></myList>
      </div>
      <!-- 无内容 -->
      <div v-else class="collect-empty">
        <div class="empty">
          <h2>您的收藏还是空的！</h2>
          <p>快去购物吧！</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      collectList: []
    }
  },
  activated() {
    this.getCollect()
  },
  methods: {
    async getCollect() {
      // 发请求获取数据
      const data = { user_id: this.$store.state.user.user.user_id }
      const result = await this.$API.collect.reqCollectInfo(data)
      if (result.code == '001') {
        this.collectList = result.collectList
      } else {
        return Promise.reject(new Error('获取出错'))
      }
    }
  }
}
</script>

<style lang="less" scoped>
.collect {
  background-color: #f5f5f5;
  .collect-header {
    height: 64px;
    background-color: #fff;
    border-bottom: 2px solid #ff6700;
    .collect-title {
      width: 1225px;
      margin: 0 auto;
      height: 64px;
      line-height: 58px;
      font-size: 28px;
    }
  }
  .content {
    padding: 20px 0;
    width: 1225px;
    margin: 0 auto;
    .goods-list {
      margin-left: -13.7px;
      // overflow: hidden;
    }
    // 清除浮动
    .clearFix {
      zoom: 1;
      &:after {
        content: '';
        display: block;
        visibility: hidden;
        clear: both;
      }
      &:before {
        content: '';
        display: table;
      }
    }
  }

  // kong
  .collect-empty {
    width: 1225px;
    margin: 0 auto;
    .empty {
      height: 300px;
      padding: 0 0 130px 558px;
      margin: 65px 0 0;
      background: url(../assets/imgs/cart-empty.png) no-repeat 124px 0;
      color: #b0b0b0;
      overflow: hidden;
      h2 {
        margin: 70px 0 15px;
      }
      p {
        margin: 0 0 20px;
        font-size: 20px;
      }
    }
  }
}
</style>
