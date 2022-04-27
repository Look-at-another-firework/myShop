<template>
  <div class="details">
    <!-- 头部 -->
    <div class="page-header">
      <div class="title">
        <p>{{ productDetails.product_name }}</p>
        <div class="list">
          <ul>
            <li>
              <router-link to>概述</router-link>
            </li>
            <li>
              <router-link to>参数</router-link>
            </li>
            <li>
              <router-link to>用户评价</router-link>
            </li>
          </ul>
        </div>
      </div>
    </div>
    <!-- ed -->

    <!-- main -->
    <div class="main">
      <!-- left -->
      <div class="block">
        <el-carousel height="560px">
          <el-carousel-item v-for="i in productPicture" :key="i.id">
            <img style="height: 560px" :src="i.product_picture" :alt="i.intro" />
          </el-carousel-item>
        </el-carousel>
        <div v-if="productPicture.length == 1">
          <img style="height: 560px" :src="productPicture[0].product_picture" :alt="productPicture[0].intro" />
        </div>
      </div>
      <!-- ed -->

      <!-- right -->
      <div class="content">
        <h1 class="name">{{ productDetails.product_name }}</h1>
        <p class="intro">{{ productDetails.product_intro }}</p>
        <p class="store">小米自营</p>
        <div class="price">
          <span>{{ productDetails.product_selling_price }}元</span>
          <span class="del"> {{ productDetails.product_price }}元 </span>
        </div>
        <div class="pro-list">
          <span class="pro-name">{{ productDetails.product_name }}</span>
          <span class="pro-price">
            <span>{{ productDetails.product_selling_price }}元</span>
            <span class="pro-del"> {{ productDetails.product_price }}元 </span>
          </span>
          <p class="price-sum">总计 : {{ productDetails.product_selling_price }}元</p>
        </div>
        <!-- 内容底部 -->
        <div class="button">
          <el-button class="shop-cart" :disabled="dis" @click="addShoppingCart">加入购物车</el-button>
          <el-button class="like" @click="addCollect">喜欢</el-button>
        </div>
        <!-- ed -->
        <div class="pro-policy">
          <ul>
            <li><i class="el-icon-circle-check"></i> 小米自营</li>
            <li><i class="el-icon-circle-check"></i> 小米发货</li>
            <li><i class="el-icon-circle-check"></i> 7天无理由退货</li>
            <li><i class="el-icon-circle-check"></i> 7天价格保护</li>
          </ul>
        </div>
      </div>
      <!-- right-ed -->
    </div>
    <!-- main-ed -->
  </div>
</template>

<script>
import { mapActions } from 'vuex'
export default {
  data() {
    return {
      dis: false, // 控制“加入购物车按钮是否可用”
      productID: '', // 商品id
      productDetails: '', // 商品的详细信息
      productPicture: [] //商品图片信息
    }
  },
  activated() {
    // 通过路由获取商品Id
    if (this.$route.query.productID != undefined) {
      // 保存ID
      this.productID = this.$route.query.productID
    }
  },
  watch: {
    productID(val) {
      // 获取数据
      this.getDetails(val)
      // 获取商品图片
      this.getDetailsImg(val)
    }
  },
  methods: {
    ...mapActions('shopCart', ['addShopCart','addShopCartNum']),
    // 获取数据
    async getDetails(val) {
      const data = { productID: val }
      const result = await this.$API.details.reqGetDetails(data)
      if (result.code == '001') {
        this.productDetails = result.Product[0]
      } else {
        return Promise.reject(new Error('获取出错了'))
      }
    },
    // 获取商品图片
    async getDetailsImg(val) {
      const data = { productID: val }
      const result = await this.$API.details.reqGetDetailsImg(data)
      if (result.code == '001') {
        this.productPicture = result.ProductPicture
      } else {
        return Promise.reject(new Error('获取出错了'))
      }
    },
    async addShoppingCart() {
      // 判断登录
      if (!this.$store.state.user.user.user_id) {
        this.$store.dispatch('setShowLogin', true)
        return
      }
      // 发起请求
      const data = {
        user_id: this.$store.state.user.user.user_id,
        product_id: this.productID
      }
      const result = await this.$API.details.reqShopCart(data)
      if (result.code == '001') {
        // 加入成功
        this.addShopCart(result.shoppingCartData[0])
        this.$notify({
          title: '成功',
          message: result.msg,
          type: 'success'
        })
      } else if (result.code == '002') {
        // 商品已经在购物车里面了，数量加一即可
        this.addShopCartNum(this.productID)
        this.$notify({
          title: '成功',
          message: result.msg,
          type: 'success'
        })
      } else if (result.code == '003') {
        // 商品数量达到限购数量
        this.dis = true
        this.$notify.error({
          title: '错误',
          message: result.msg
        })
      } else {
        this.$notify.error({
          title: '错误',
          message: result.msg
        })
      }
    },
    // 喜欢
    async addCollect() {
      // 判断登录
      if (!this.$store.state.user.user.user_id) {
        this.$store.dispatch('setShowLogin', true)
        return
      }
      // 发起请求
      const data = {
        user_id: this.$store.state.user.user.user_id,
        product_id: this.productID
      }
      const result = await this.$API.details.reqLike(data)
      if (result.code == '001') {
        // 添加收藏成功
        this.$notify({
          title: '成功',
          message: result.msg,
          type: 'success'
        })
      } else {
        // 添加收藏失败
        this.$notify.error({
          title: '错误',
          message: result.msg
        })
      }
    }
  }
}
</script>

<style lang="less" scoped>
.details {
  overflow: hidden;
  // 头
  .page-header {
    height: 64px;
    margin-top: -20px;
    z-index: 4;
    background-color: #fff;
    border-bottom: 1px solid #e0e0e0;
    -webkit-box-shadow: 0px 5px 5px rgba(0, 0, 0, 0.07);
    box-shadow: 0px 5px 5px rgba(0, 0, 0, 0.07);
    .title {
      width: 1225px;
      height: 64px;
      line-height: 64px;
      font-size: 18px;
      font-weight: 400;
      color: #212121;
      margin: 0 auto;
      p {
        float: left;
      }
      .list {
        height: 64px;
        float: right;
        li {
          float: left;
          margin-left: 20px;
          a {
            font-size: 14px;
            color: #616161;
            &:hover {
              font-size: 14px;
              color: #ff6700;
            }
          }
        }
      }
    }
  }
  // ed
  // main
  .main {
    width: 1225px;
    height: 560px;
    padding-top: 30px;
    margin: 0 auto;
    .block {
      float: left;
      width: 560px;
      height: 560px;
    }
    .content {
      float: left;
      margin-left: 25px;
      width: 640px;
      .name {
        height: 30px;
        line-height: 30px;
        font-size: 24px;
        font-weight: normal;
        color: #212121;
      }
      .intro {
        color: #b0b0b0;
        padding-top: 10px;
      }
      .store {
        color: #ff6700;
        padding-top: 10px;
      }
      .price {
        display: block;
        font-size: 18px;
        color: #ff6700;
        border-bottom: 1px solid #e0e0e0;
        padding: 25px 0 25px;
        .del {
          font-size: 14px;
          margin-left: 10px;
          color: #b0b0b0;
          text-decoration: line-through;
        }
      }
      .pro-list {
        background: #f9f9fa;
        padding: 30px 60px;
        margin: 50px 0 50px;
        span {
          line-height: 30px;
          color: #616161;
        }
        .pro-price {
          float: right;
          .pro-del {
            margin-left: 10px;
            text-decoration: line-through;
          }
        }
        .price-sum {
          color: #ff6700;
          font-size: 24px;
          padding-top: 20px;
        }
      }
      .button {
        height: 55px;
        margin: 10px 0 20px 0;
        .el-button {
          float: left;
          height: 55px;
          font-size: 16px;
          color: #fff;
          border: none;
          text-align: center;
        }
        .shop-cart {
          width: 340px;
          background-color: #ff6700;
          &:hover {
            background-color: #f25807;
          }
        }
        .like {
          width: 260px;
          margin-left: 40px;
          background-color: #b0b0b0;
          &:hover {
            background-color: #757575;
          }
        }
      }
      .pro-policy {
        li {
          float: left;
          margin-right: 20px;
          color: #b0b0b0;
        }
      }
    }
  }
  .el-carousel {
    background-color: rgba(163, 163, 163, 0.8);
  }
  .el-carousel__indicator {
    background-color: rgba(163, 163, 163, 0.8);
  }
  .el-carousel__button {
    background-color: rgba(163, 163, 163, 0.8);
  }
}
</style>
