<template>
  <div class="shoppingCart">
    <!-- head -->
    <div class="cart-header">
      <div class="cart-header-content">
        <p>
          <i class="el-icon-shopping-cart-full" style="color: #ff6700; font-weight: 600"></i>
          我的购物车
        </p>
        <span>温馨提示：产品是否购买成功，以最终下单为准哦，请尽快结算</span>
      </div>
    </div>
    <!-- ed -->

    <!-- main  -->
    <div class="content" v-if="getShoppingCart.length > 0">
      <ul>
        <!-- 购物车表头 -->
        <li class="header">
          <div class="pro-check">
            <el-checkbox v-model="isAllCheck">全选</el-checkbox>
          </div>
          <div class="pro-img"></div>
          <div class="pro-name">商品名称</div>
          <div class="pro-price">单价</div>
          <div class="pro-num">数量</div>
          <div class="pro-total">小计</div>
          <div class="pro-action">操作</div>
        </li>
        <!-- ed -->

        <!-- 购物车列表 -->
        <li class="product-list" v-for="(i, index) in getShoppingCart" :key="i.id">
          <div class="pro-check">
            <el-checkbox :value="i.check" @change="checkChange($event, index)"></el-checkbox>
          </div>
          <div class="pro-img">
            <router-link :to="{ path: '/goods/details', query: { productID: i.productID } }">
              <!-- img -->
              <img :src="i.productImg" />
            </router-link>
          </div>
          <div class="pro-name">
            <router-link :to="{ path: '/goods/details', query: { productID: i.productID } }">{{ i.productName }}</router-link>
          </div>
          <div class="pro-price">{{ i.price }}元</div>
          <div class="pro-num">
            <el-input-number size="small" :value="i.num" :min="1" :max="i.maxNum" @change="handleChange($event, index, i.productID)"></el-input-number>
          </div>
          <div class="pro-total pro-total-in">{{ i.price * i.num }}元</div>
          <div class="pro-action">
            <el-popover placement="right">
              <p>确定删除吗？</p>
              <div style="text-align: right; margin: 10px 0 0">
                <el-button type="primary" size="mini" @click="deleteItem($event, i.id, i.productID)">确定</el-button>
              </div>
              <i class="el-icon-error" slot="reference" style="font-size: 18px"></i>
            </el-popover>
          </div>
        </li>
        <!-- ed -->
      </ul>
      <div style="height: 20px; background-color: #f5f5f5"></div>
      <!-- 购物车底部 -->
      <div class="cart-bar">
        <div class="cart-bar-left">
          <span>
            <router-link to="/goods">继续购物</router-link>
          </span>
          <span class="sep">|</span>
          <span class="cart-total">
            共<span class="cart-total-num">{{ getNum }}</span
            >件商品，已选择 <span class="cart-total-num">{{ getCheckNum }}</span
            >件
          </span>
        </div>
        <div class="cart-bar-right">
          <span>
            <span class="total-price-title">合计：</span>
            <span class="total-price">{{ getTotalPrice }}元</span>
          </span>
          <router-link :to="getCheckNum > 0 ? '/ConfirmOrder' : ''">
            <div :class="getCheckNum > 0 ? 'btn-primary' : 'btn-primary-disabled'">去结算</div>
          </router-link>
        </div>
      </div>
      <!-- ed -->
    </div>
    <!-- main ed -->

    <!-- 购物车为空的时候显示的内容 -->
    <div v-else class="cart-empty">
      <div class="empty">
        <h2>您的购物车还是空的！</h2>
        <p>快去购物吧！</p>
      </div>
    </div>
    <!-- ed -->
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
export default {
  data() {
    return {}
  },
  computed: {
    ...mapGetters('shopCart', ['getShoppingCart', 'getNum', 'getCheckNum', 'getTotalPrice', 'getIsAllCheck']),
    isAllCheck: {
      get() {
        return this.getIsAllCheck
      },
      set(val) {
        this.checkAll(val)
      }
    }
  },
  methods: {
    ...mapActions('shopCart', ['changeCheck', 'checkAll', 'deleteShoppingCart']),
    checkChange(val, key) {
      // 更新vuex中购物车商品是否勾选的状态
      this.changeCheck({ key, prop: 'check', val })
    },
    // 增加数量
    async handleChange(currentValue, key, id) {
      // 当修改数量时，默认勾选
      this.changeCheck({ key: key, prop: 'check', val: true })
      // 发送请求
      const data = {
        user_id: this.$store.state.user.user.user_id,
        product_id: id,
        num: currentValue
      }
      const result = await this.$API.shopCart.reqChangeNum(data)
      if (result.code == '001') {
        this.changeCheck({ key: key, prop: 'num', val: currentValue })
        // 弹出通知框提示登录成功信息
        this.$notify({
          title: '成功',
          message: result.msg,
          type: 'success'
        })
      } else {
        this.$notify.error({
          title: '错误',
          message: result.msg
        })
      }
    },
    // 删除
    async deleteItem(e, id, productID) {
      // 发送请求
      const data = {
        user_id: this.$store.state.user.user.user_id,
        product_id: productID
      }
      const result = await this.$API.shopCart.reqDeleteCart(data)
      if (result.code == '001') {
        // 更新vuex状态
        this.deleteShoppingCart(id)
        // 弹出通知框提示登录成功信息
        this.$notify({
          title: '成功',
          message: result.msg,
          type: 'success'
        })
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
.shoppingCart {
  background-color: #f5f5f5;
  padding-bottom: 20px;
  // 头部
  .cart-header {
    height: 64px;
    border-bottom: 2px solid #ff6700;
    background-color: #fff;
    margin-bottom: 20px;
    .cart-header-content {
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
    span {
      color: #757575;
      font-size: 12px;
      float: left;
      height: 20px;
      line-height: 20px;
      margin-top: 30px;
      margin-left: 15px;
    }
  }
  // ed

  // main
  .content {
    width: 1225px;
    margin: 0 auto;
    background-color: #fff;
    ul {
      background-color: #fff;
      color: #424242;
      line-height: 85px;
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
      .pro-check {
        float: left;
        height: 85px;
        width: 110px;
        .el-checkbox {
          font-size: 16px;
          margin-left: 24px;
        }
      }
      .pro-img {
        float: left;
        height: 85px;
        width: 120px;
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
        width: 140px;
        padding-right: 18px;
        text-align: center;
      }
      .pro-num {
        float: left;
        width: 150px;
        text-align: center;
      }
      .pro-total {
        float: left;
        width: 120px;
        padding-right: 81px;
        text-align: right;
      }
      .pro-total-in {
        color: #ff6700;
      }
      .pro-action {
        float: left;
        width: 80px;
        text-align: center;
        i {
          &:hover {
            color: #ff6700;
          }
        }
      }
    }
  }
  // ed

  // di
  .cart-bar {
    width: 1225px;
    height: 50px;
    line-height: 50px;
    background-color: #fff;
    .cart-bar-left {
      float: left;
      a {
        line-height: 50px;
        margin-left: 32px;
        color: #757575;
        &:hover {
          color: #ff6700;
        }
      }
      .sep {
        color: #eee;
        margin: 0 20px;
      }
      .cart-total {
        color: #757575;
      }
      .cart-total-num {
        color: #ff6700;
      }
    }
    .cart-bar-right {
      float: right;
      .total-price-title {
        color: #ff6700;
        font-size: 14px;
      }
      .total-price {
        color: #ff6700;
        font-size: 30px;
      }
      .btn-primary {
        float: right;
        width: 200px;
        text-align: center;
        font-size: 18px;
        margin-left: 50px;
        background: #ff6700;
        color: #fff;
        &:hover {
          background-color: #f25807;
        }
      }
      .btn-primary-disabled {
        float: right;
        width: 200px;
        text-align: center;
        font-size: 18px;
        margin-left: 50px;
        background: #e0e0e0;
        color: #b0b0b0;
      }
    }
  }
  // ed

  // kong
  .cart-empty {
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
  // ed
}
</style>
