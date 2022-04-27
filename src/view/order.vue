<template>
  <div class="order">
    <!-- header -->
    <div class="order-header">
      <div class="order-header-content">
        <p>
          <i class="el-icon-s-order" style="font-size: 30px; color: #ff6700"></i>
          我的订单
        </p>
      </div>
    </div>
    <!-- ed -->

    <!-- main -->
    <div class="order-content" v-if="orders.length > 0">
      <div class="content" v-for="(i, index) in orders" :key="index">
        <ul>
          <!-- 我的订单表头 -->
          <li class="order-info">
            <div class="order-id">订单编号: {{ i[0].order_id }}</div>
            <div class="order-time">订单时间: {{ i[0].order_time | timer }}</div>
          </li>
          <li class="header">
            <div class="pro-img"></div>
            <div class="pro-name">商品名称</div>
            <div class="pro-price">单价</div>
            <div class="pro-num">数量</div>
            <div class="pro-total">小计</div>
          </li>
          <!-- 我的订单表头END -->

          <!-- 订单列表 -->
          <li class="product-list" v-for="(q, index2) in i" :key="index2">
            <div class="pro-img">
              <router-link :to="{ path: '/goods/details', query: { productID: q.product_id } }">
                <img :src="q.product_picture" />
              </router-link>
            </div>
            <div class="pro-name">
              <router-link :to="{ path: '/goods/details', query: { productID: q.product_id } }"></router-link>
            </div>
            <div class="pro-price">{{ q.product_name }}元</div>
            <div class="pro-num">{{ q.product_price }}</div>
            <div class="pro-total pro-total-in">{{ q.product_price * q.product_num }}元</div>
          </li>
        </ul>
        <div class="order-bar">
          <div class="order-bar-left">
            <span class="order-total">
              共
              <span class="order-total-num">{{ total[index].totalNum }}</span> 件商品
            </span>
          </div>
          <div class="order-bar-right">
            <span>
              <span class="total-price-title">合计：</span>
              <span class="total-price">{{ total[index].totalPrice }}元</span>
            </span>
          </div>
          <!-- 订单列表END -->
        </div>
      </div>
      <div style="margin-top: -40px"></div>
    </div>
    <!-- ed -->

    <!-- 订单为空的时候显示的内容 -->
    <div v-else class="order-empty">
      <div class="empty">
        <h2>您的订单还是空的！</h2>
        <p>快去购物吧！</p>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      orders: [], // 订单列表
      total: [] //每个订单的商品数量和总价列表
    }
  },
  activated() {
    this.getUserInfo()
  },
  methods: {
    async getUserInfo() {
      const data = {
        user_id: this.$store.state.user.user.user_id
      }
      const result = await this.$API.order.reqGetOrder(data)
      if (result.code == '001') {
        this.orders = result.orders
      } else {
        this.$notify.error({
          title: '错误',
          message: result.msg
        })
      }
    }
  },
  watch: {
    // 监听数组的变化
    orders(val) {
      let total = []
      for (let i = 0; i < val.length; i++) {
        const ele = val[i]
        let totalNum = 0
        let totalPrice = 0
        for (let j = 0; j < ele.length; j++) {
          const temp = ele[j]
          totalNum += temp.product_num
          totalPrice += temp.product_num * temp.product_price
        }
        total.push({ totalNum, totalPrice })
      }
      this.total = total
    }
  }
}
</script>

<style lang="less" scoped>
.order {
  background-color: #f5f5f5;
  padding-bottom: 20px;
  // header
  .order-header {
    height: 64px;
    border-bottom: 2px solid #ff6700;
    background-color: #fff;
    margin-bottom: 20px;
    .order-header-content {
      width: 1225px;
      margin: 0 auto;
    }
    p {
      font-size: 28px;
      line-height: 58px;
      float: left;
      font-weight: normal;
      color: #424242;
    }
  }
  // ed

  .content {
    width: 1225px;
    margin: 0 auto;
    background-color: #fff;
    margin-bottom: 50px;
    ul {
      background-color: #fff;
      color: #424242;
      line-height: 85px;
      .order-info {
        height: 60px;
        line-height: 60px;
        padding: 0 26px;
        color: #424242;
        border-bottom: 1px solid #ff6700;
        .order-id {
          float: left;
          color: #ff6700;
        }
        .order-time {
          float: right;
        }
      }
      .header {
        height: 85px;
        padding-right: 26px;
        color: #424242;
      }

      .product-list {
        height: 85px;
        padding: 15px 26px 15px 0;
        border-top: 1px solid #e0e0e0;
      }
      .pro-img {
        float: left;
        height: 85px;
        width: 120px;
        padding-left: 80px;
        img {
          height: 80px;
          width: 80px;
        }
      }
      .pro-name {
        float: left;
        width: 380px;
        a {
          color: #424242;
          &:hover {
            color: #ff6700;
          }
        }
      }
      .pro-price {
        float: left;
        width: 160px;
        padding-right: 18px;
        text-align: center;
      }
      .pro-num {
        float: left;
        width: 190px;
        text-align: center;
      }
      .pro-total {
        float: left;
        width: 160px;
        padding-right: 81px;
        text-align: right;
      }
      .pro-total-in {
        color: #ff6700;
      }
    }
  }

  .order-bar {
    width: 1185px;
    padding: 0 20px;
    border-top: 1px solid #ff6700;
    height: 50px;
    line-height: 50px;
    background-color: #fff;
    .order-bar-left {
      float: left;
      .order-total {
        color: #757575;
      }
      .order-total-num {
        color: #ff6700;
      }
    }
    .order-bar-right {
      float: right;
      .total-price-title {
        color: #ff6700;
        font-size: 14px;
      }
      .total-price {
        color: #ff6700;
        font-size: 30px;
      }
    }
  }

  // 空
  .order-empty {
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
        font-size: 36px;
      }
      p {
        margin: 0 0 20px;
        font-size: 20px;
      }
    }
  }
}
</style>
