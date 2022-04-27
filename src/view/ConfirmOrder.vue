<template>
  <div class="confirmOrder">
    <!-- head -->
    <div class="confirmOrder-header">
      <div class="header-content">
        <p>
          <i class="el-icon-s-order"></i>
        </p>
        <p>确认订单</p>
      </div>
    </div>
    <!-- ed -->

    <!-- main -->
    <div class="content">
      <!-- address -->
      <div class="section-address">
        <p class="title">收货地址</p>
        <div class="address-body">
          <ul>
            <li v-for="i in address" :key="i.id" :class="i.id == confirmAddress ? 'in-section' : ''">
              <h2>{{ i.name }}</h2>
              <p class="phone">{{ i.phone }}</p>
              <p class="address">{{ i.address }}</p>
            </li>
            <li class="add-address">
              <i class="el-icon-circle-plus-outline"></i>
              <p>添加新地址</p>
            </li>
          </ul>
        </div>
      </div>
      <!-- ed -->

      <!-- 商品及优惠券 -->
      <div class="section-goods">
        <p class="title">商品及优惠券</p>
        <div class="goods-list">
          <ul>
            <li v-for="i in getCheckGoods" :key="i.id">
              <img :src="i.productImg" />
              <span class="pro-name">{{ i.productName }}</span>
              <span class="pro-price">{{ i.price }}元 x {{ i.num }}</span>
              <span class="pro-status"></span>
              <span class="pro-total">{{ i.price * i.num }}元</span>
            </li>
          </ul>
        </div>
      </div>
      <!-- ed -->

      <!-- 配送方式 -->
      <div class="section-shipment">
        <p class="title">配送方式</p>
        <p class="shipment">包邮</p>
      </div>
      <!-- 配送方式END -->

      <!-- 发票 -->
      <div class="section-invoice">
        <p class="title">发票</p>
        <p class="invoice">电子发票</p>
        <p class="invoice">个人</p>
        <p class="invoice">商品明细</p>
      </div>
      <!-- 发票END -->

      <!-- 结算列表 -->
      <div class="section-count">
        <div class="money-box">
          <ul>
            <li>
              <span class="title">商品件数：</span>
              <span class="value">{{ getCheckNum }}件</span>
            </li>
            <li>
              <span class="title">商品总价：</span>
              <span class="value">{{ getTotalPrice }}元</span>
            </li>
            <li>
              <span class="title">活动优惠：</span>
              <span class="value">-0元</span>
            </li>
            <li>
              <span class="title">优惠券抵扣：</span>
              <span class="value">-0元</span>
            </li>
            <li>
              <span class="title">运费：</span>
              <span class="value">0元</span>
            </li>
            <li class="total">
              <span class="title">应付总额：</span>
              <span class="value">
                <span class="total-price">{{ getTotalPrice }}</span
                >元
              </span>
            </li>
          </ul>
        </div>
      </div>
      <!-- 结算列表END -->

      <!-- 结算导航 -->
      <div class="section-bar">
        <div class="btn">
          <router-link to="/shopCart" class="btn-base btn-return">返回购物车</router-link>
          <a href="javascript:void(0);" @click="addOrder" class="btn-base btn-primary">结算</a>
        </div>
      </div>
      <!-- 结算导航END -->
    </div>
    <!-- 主要内容容器END -->
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
export default {
  data() {
    return {
      // 虚拟数据
      confirmAddress: 1, // 选择的地址id
      // 地址列表
      address: [
        {
          id: 1,
          name: '小王',
          phone: '15211949400',
          address: '湖南 邵阳市 长沙市'
        },
        {
          id: 2,
          name: '小明',
          phone: '15084862300',
          address: '湖南 邵阳市 隆回县'
        }
      ]
    }
  },
  created() {
    // 直接进入购物车
    if (this.getCheckNum < 1) {
      this.$notify.error({
        title: '错误',
        message: '请勾选商品后再结算'
      })
      this.$router.push({ path: '/shopCart' })
    }
  },
  computed: {
    // 获取购物车勾选的商品数量
    ...mapGetters('shopCart', ['getCheckNum', 'getCheckGoods', 'getTotalPrice'])
  },
  methods: {
    ...mapActions('shopCart', ['deleteShoppingCart']),
    // 结算
    async addOrder() {
      const data = {
        user_id: this.$store.state.user.user.user_id,
        products: this.getCheckGoods
      }
      const result = await this.$API.order.reqOrder(data)
      let products = this.getCheckGoods
      if (result.code == '001') {
        products.forEach((i) => {
          this.deleteShoppingCart(i.id)
        })
        // 弹出通知框提示登录成功信息
        this.$notify({
          title: '成功',
          message: result.msg,
          type: 'success'
        })
        // 跳转我的订单页面
        this.$router.push({ path: '/order' })
      } else {
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
.confirmOrder {
  background-color: #f5f5f5;
  padding-bottom: 20px;
  // head
  .confirmOrder-header {
    background-color: #fff;
    border-bottom: 2px solid #ff6700;
    margin-bottom: 20px;
    .header-content {
      width: 1225px;
      margin: 0 auto;
      height: 80px;
      p {
        float: left;
        font-size: 28px;
        line-height: 80px;
        color: #424242;
        margin-right: 20px;
        i {
          font-size: 45px;
          color: #ff6700;
          line-height: 80px;
        }
      }
    }
  }
  // ed

  .content {
    width: 1225px;
    margin: 0 auto;
    padding: 48px 0 0;
    background-color: #fff;
    .section-address {
      margin: 0 48px;
      overflow: hidden;
      .title {
        color: #333;
        font-size: 18px;
        line-height: 20px;
        margin-bottom: 20px;
      }
    }
    .address-body {
      li {
        float: left;
        color: #333;
        width: 220px;
        height: 178px;
        border: 1px solid #e0e0e0;
        padding: 15px 24px 0;
        margin-right: 17px;
        margin-bottom: 24px;
        h2 {
          font-size: 18px;
          font-weight: normal;
          line-height: 30px;
          margin-bottom: 10px;
        }
        p {
          font-size: 14px;
          color: #757575;
        }
        .address {
          padding: 10px 0;
          max-width: 180px;
          max-height: 88px;
          line-height: 22px;
          overflow: hidden;
        }
      }
      .in-section {
        border: 1px solid #ff6700;
      }
      .add-address {
        text-align: center;
        line-height: 30px;
        i {
          font-size: 30px;
          padding-top: 50px;
          text-align: center;
        }
      }
    }

    // 商品
    .section-goods {
      margin: 0 48px;
      p.title {
        color: #333;
        font-size: 18px;
        line-height: 40px;
      }
      .goods-list {
        padding: 5px 0;
        border-top: 1px solid #e0e0e0;
        border-bottom: 1px solid #e0e0e0;
        li {
          padding: 10px 0;
          color: #424242;
          overflow: hidden;
          img {
            float: left;
            width: 30px;
            height: 30px;
            margin-right: 10px;
          }
          .pro-name {
            float: left;
            width: 650px;
            line-height: 30px;
          }
          .pro-price {
            float: left;
            width: 150px;
            text-align: center;
            line-height: 30px;
          }
          .pro-status {
            float: left;
            width: 99px;
            height: 30px;
            text-align: center;
            line-height: 30px;
          }
          .pro-total {
            float: left;
            width: 190px;
            text-align: center;
            color: #ff6700;
            line-height: 30px;
          }
        }
      }
    }

    // 配送

    .section-shipment {
      margin: 0 48px;
      padding: 25px 0;
      border-bottom: 1px solid #e0e0e0;
      overflow: hidden;
      .title {
        float: left;
        width: 150px;
        color: #333;
        font-size: 18px;
        line-height: 38px;
      }
      .shipment {
        float: left;
        line-height: 38px;
        font-size: 14px;
        color: #ff6700;
      }
    }

    // 发票
    .section-invoice {
      margin: 0 48px;
      padding: 25px 0;
      border-bottom: 1px solid #e0e0e0;
      overflow: hidden;
      .title {
        float: left;
        width: 150px;
        color: #333;
        font-size: 18px;
        line-height: 38px;
      }
      .invoice {
        float: left;
        line-height: 38px;
        font-size: 14px;
        margin-right: 20px;
        color: #ff6700;
      }
    }

    // 结算
    .section-count {
      margin: 0 48px;
      padding: 20px 0;
      overflow: hidden;
      .money-box {
        float: right;
        text-align: right;
        .title {
          float: left;
          width: 126px;
          height: 30px;
          display: block;
          line-height: 30px;
          color: #757575;
        }
        .value {
          float: left;
          min-width: 105px;
          height: 30px;
          display: block;
          line-height: 30px;
          color: #ff6700;
        }
        .total {
          .title {
            padding-top: 15px;
          }
          .value {
            padding-top: 10px;
          }
        }
        .total-price {
          font-size: 30px;
        }
      }
    }

    // 结算导航
    .section-bar {
      padding: 20px 48px;
      border-top: 2px solid #f5f5f5;
      overflow: hidden;
      .btn {
        float: right;
        .btn-base {
          float: left;
          margin-left: 30px;
          width: 158px;
          height: 38px;
          border: 1px solid #b0b0b0;
          font-size: 14px;
          line-height: 38px;
          text-align: center;
        }
        .btn-return {
          color: rgba(0, 0, 0, 0.27);
          border-color: rgba(0, 0, 0, 0.27);
        }
        .btn-primary {
          background: #ff6700;
          border-color: #ff6700;
          color: #fff;
        }
      }
    }
  }
}
</style>
