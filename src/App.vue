<template>
  <div id="app" name="app">
    <el-container>
      <!-- 顶部导航栏 -->
      <div class="topBar">
        <div class="nav">
          <ul>
            <li v-if="!this.$store.state.user.user">
              <el-button type="text" @click="login">登录</el-button>
              <span class="sep">|</span>
              <el-button type="text" @click="showReg = true">注册</el-button>
            </li>
            <li v-else>
              欢迎
              <el-popover placement="top" width="180" v-model="visible">
                <!--  -->
                <p>确定退出登录吗?</p>
                <div style="text-align: right; margin: 10px 0 0">
                  <el-button type="text" size="mini" @click="visible = false">取消</el-button>
                  <el-button type="primary" size="mini" @click="logout">确定</el-button>
                </div>
                <el-button type="text" slot="reference">{{ user.user.userName }}</el-button>
              </el-popover>
            </li>
            <li>
              <router-link to="/order">我的订单</router-link>
            </li>
            <li>
              <router-link to="/collect">我的收藏</router-link>
            </li>
            <li :class="getNum > 0 ? 'shopCart-full' : 'shopCart'">
              <router-link to="/shopCart">
                <i class="el-icon-shopping-cart-full Cart"></i>购物车
                <span class="num">({{ getNum }})</span>
              </router-link>
            </li>
          </ul>
        </div>
      </div>
      <!-- 顶部导航栏底部 -->

      <!-- 顶栏 -->
      <el-header>
        <el-menu :default-active="activeIndex" class="el-menu-demo" mode="horizontal" active-text-color="#409eff" router>
          <div class="logo">
            <router-link to="/">
              <img src="./assets/imgs/logo.png" alt="" />
            </router-link>
          </div>
          <el-menu-item index="/">首页</el-menu-item>
          <el-menu-item index="/goods">全部商品</el-menu-item>
          <el-menu-item index="/about">关于我们</el-menu-item>
          <div class="search">
            <el-input v-model="search" placeholder="请输入搜索内容">
              <el-button slot="append" icon="el-icon-search" @click="searchClick"></el-button>
            </el-input>
          </div>
        </el-menu>
      </el-header>
      <!-- 顶栏结束 -->

      <!-- 登录 -->
      <myLogin></myLogin>
      <!-- 注册 -->
      <myRegister :showReg="showReg" @changeVal="isRegister"></myRegister>

      <!-- 主要区域容器 -->
      <el-main>
        <keep-alive>
          <router-view></router-view>
        </keep-alive>
      </el-main>
      <!-- 主要区域结束 -->

      <!-- 底部 -->
      <el-footer>
        <div class="footer">
          <div class="np-promise-box">
            <div class="ng-promise">
              <p>
                <a href="javascript:;">7天无理由退换货</a>
                <a href="javascript:;">满99元全场免邮</a>
                <a style="margin-right: 0" href="javascript:;">100%品质保证</a>
              </p>
            </div>
          </div>
          <div class="github">
            <a href="http://www.baidu.com" target="_blank">
              <!--  -->
              <div class="github-but"></div>
            </a>
          </div>
          <div class="mod_help">
            <p>
              <router-link to="/home">首页</router-link>
              <span>|</span>
              <router-link to="/goods">全部商品</router-link>
              <span>|</span>
              <router-link to="/about">关于我们</router-link>
            </p>
            <p class="copyRight">商城版权所有 &copy; 2012-2021</p>
          </div>
        </div>
      </el-footer>
      <!-- 底部结束 -->
    </el-container>
  </div>
</template>

<script>
import { mapActions, mapState, mapGetters } from 'vuex'
export default {
  name: 'App',
  data() {
    return {
      activeIndex: '/', // 头部导航栏选中的标签
      search: '', // 搜索内容
      showReg: false, // 是否显示注册组件
      visible: false // 是否显示关闭退出登录
    }
  },
  created() {
    // 获取本地数据判断是否登录
    if (localStorage.getItem('user')) {
      this.setUser(JSON.parse(localStorage.getItem('user')))
    }
  },
  methods: {
    ...mapActions('user', ['setShowLogin', 'setUser']),
    ...mapActions('shopCart', ['setShoppingCart']),
    login() {
      // 点击登录按钮, 通过更改vuex的showLogin值显示登录组件
      this.setShowLogin(true)
    },
    isRegister(val) {
      this.showReg = val
    },
    logout() {
      this.visible = false
      // 清除本地缓存
      localStorage.setItem('user', '')
      // 清除vuex的信息
      this.setUser('')
      // 提示
      this.$notify({
        title: '成功',
        message: '成功退出登录',
        type: 'success'
      })
    },
    searchClick() {
      if (this.search !== '') {
        // 跳转路由
        this.$router.push({
          path: '/goods',
          query: { search: this.search }
        })
        this.search = ''
      }
    }
  },
  beforeUpdate() {
    this.activeIndex = this.$router.path
  },
  watch: {
    // 获取登录状态
    async getUser(val) {
      if (val == '') {
        // 没有登录
        this.setShoppingCart([])
      } else {
        // 登录了
        const data = { user_id: val.user_id }
        const result = await this.$API.home.reqGetShopCart(data)
        if (result.code == '001') {
          this.setShoppingCart(result.shoppingCartData)
        } else {
          this.$notify.error({
            title: '错误',
            message: result.msg
          })
        }
      }
    }
  },
  computed: {
    ...mapState(['user']),
    ...mapGetters('shopCart', ['getNum']),
    getUser() {
      return this.user.user
    }
  }
}
</script>

<style lang="less">
// 全局样式
* {
  margin: 0;
  padding: 0;
  border: 0;
  list-style: none;
}
a,
a:hover {
  text-decoration: none;
}
#app {
  .el-header {
    padding: 0;
  }
  .el-main {
    min-height: 300px;
    padding: 20px 0;
  }
  .el-footer {
    padding: 0;
  }
}
// 顶部
.topBar {
  height: 40px;
  background-color: #3d3d3d;
  margin-bottom: 20px;
  .nav {
    width: 1225px;
    margin: 0 auto;
    ul {
      float: right;
    }
    li {
      float: left;
      height: 40px;
      color: #b0b0b0;
      font-size: 14px;
      text-align: center;
      line-height: 40px;
      margin-left: 20px;
      .el-button {
        color: #b0b0b0;
      }
      a {
        color: #b0b0b0;
        &:hover {
          color: #fff;
        }
      }
    }
    .sep {
      color: #b0b0b0;
      font-size: 12px;
      margin: 0 5px;
    }
    .el-button:hover {
      color: #fff;
    }
    .shopCart {
      width: 120px;
      background-color: #424242;
      &:hover {
        background-color: #fff;
      }
      &:hover a {
        color: #ff6700;
      }
    }
    .shopCart-full {
      width: 120px;
      background-color: #ff6700;
      a {
        color: #fff;
      }
    }
    .Cart {
      margin-right: 8px;
      font-size: 16px;
    }
  }
}
// 顶部结束
// 顶栏
.el-header {
  .el-menu {
    max-width: 1225px;
    margin: 0 auto;
  }
  .logo {
    height: 60px;
    width: 189px;
    float: left;
    margin-right: 100px;
  }
  .search {
    margin-top: 10px;
    width: 300px;
    float: right;
  }
}
// 顶栏结束
// 底部
.footer {
  width: 100%;
  text-align: center;
  background: #2f2f2f;
  padding-bottom: 20px;
  .np-promise-box {
    border-bottom: 1px solid #3d3d3d;
    line-height: 145px;
    margin: 0 auto;
    .ng-promise {
      display: flex;
      justify-content: space-around;
      align-items: center;
      p a {
        color: #fff;
        font-size: 20px;
        margin-right: 210px;
        padding-left: 44px;
        height: 40px;
        display: inline-block;
        line-height: 40px;
        text-decoration: none;
        background: url('./assets/imgs/us-icon.png') no-repeat left 0;
      }
    }
  }
  .github {
    height: 50px;
    line-height: 50px;
    margin-top: 20px;
    .github-but {
      width: 50px;
      height: 50px;
      margin: 0 auto;
      background: url('./assets/imgs/github.png') no-repeat;
    }
  }
  .mod_help {
    text-align: center;
    color: #888888;
    p {
      margin: 20px 0 16px 0;
      a {
        color: #888;
        text-decoration: none;
        &:hover {
          color: #fff;
        }
      }
      span {
        padding: 0 22px;
      }
    }
  }
}
// 结束
</style>
