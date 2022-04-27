<template>
  <div class="home" id="home" name="home">
    <!-- 轮播图 -->
    <div class="block">
      <el-carousel height="460px">
        <el-carousel-item v-for="i in carousel" :key="i.carousel_id">
          <img style="height:460px'" :src="i.imgPath" :alt="i.describes" />
        </el-carousel-item>
      </el-carousel>
    </div>
    <!-- 轮播图结束 -->

    <div class="main-box">
      <div class="main">
        <!-- 手机 -->
        <div class="phone">
          <div class="box-hd">
            <div class="title">手机</div>
          </div>
          <div class="box-bd">
            <div class="promo-list">
              <router-link to="">
                <img src="public/imgs/phone/phone.png" alt="" />
              </router-link>
            </div>
            <div class="list">
              <myList :list="phoneList" :isMore="true" :isDelete="false"></myList>
            </div>
          </div>
        </div>
        <!-- 手机结束 -->

        <!-- 家电 -->
        <div class="appliance" id="promo-menu">
          <div class="box-hd">
            <div class="title">家电</div>
            <div class="more" id="more">
              <myMenu :val="2" @changeVal="getChildMsg">
                <span slot="1">热门</span>
                <span slot="2">电视影音</span>
              </myMenu>
            </div>
          </div>
          <div class="box-bd">
            <div class="promo-list">
              <ul>
                <li>
                  <img src="public/imgs/appliance/appliance-promo1.png" alt="" />
                </li>
                <li>
                  <img src="public/imgs/appliance/appliance-promo2.png" alt="" />
                </li>
              </ul>
            </div>
            <div class="list">
              <myList :list="applianceList" :isMore="true" :isDelete="false"></myList>
            </div>
          </div>
        </div>
        <!-- 家电结束 -->

        <!-- 配件 -->
        <div class="accessory" id="promo-menu">
          <div class="box-hd">
            <div class="title">配件</div>
            <div class="more" id="more">
              <myMenu :val="3" @changeVal="getChildMsg2">
                <span slot="1">热门</span>
                <span slot="2">保护套</span>
                <span slot="3">充电器</span>
              </myMenu>
            </div>
          </div>
          <div class="box-bd">
            <div class="promo-list">
              <ul>
                <li>
                  <img src="public/imgs/accessory/accessory-promo1.png" alt="" />
                </li>
                <li>
                  <img src="public/imgs/accessory/accessory-promo2.png" alt="" />
                </li>
              </ul>
            </div>
            <div class="list">
              <myList :list="accessoryList" :isMore="true" :isDelete="false"></myList>
            </div>
          </div>
        </div>
        <!-- 配件结束 -->
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      carousel: [], // 轮播
      phoneList: [], // 手机
      miTvList: [], //电视机

      applianceList: [], // 家电
      applianceHotList: '', //热门家电商品列表

      accessoryList: [], // 配件
      accessoryHotList: '', //热门配件商品列表

      protectingShellList: [], // 保护套
      chargerList: [], // 充电器

      applianceActive: 1, // 家电当前选中的商品分类
      accessoryActive: 1 // 配件当前选中的商品分类
    }
  },
  methods: {
    async getCarousel() {
      // 获取轮播图
      const result = await this.$API.home.reqCarousel()
      if (result.code == '001') {
        this.carousel = result.carousel
      } else {
        return console.log(new Error('轮播图出错'))
      }
    },
    // 封装其他部分的请求函数
    async getPromos(categoryName, val, api) {
      const result = await this.$API.home.getPromo(categoryName, api)
      if (result.code == '001') {
        this[val] = result.Product
      } else {
        return console.log(new Error('出错'))
      }
    },
    getChildMsg(val) {
      // 获取家电模块子组件传过来的数据
      this.applianceActive = val
    },
    getChildMsg2(val) {
      // 获取配件模块子组件传过来的数据
      this.accessoryActive = val
    }
  },
  mounted() {
    this.getCarousel()
    // 获取各类数据
    this.getPromos({ categoryName: '手机' }, 'phoneList')
    this.getPromos({ categoryName: '电视机' }, 'miTvList')
    this.getPromos({ categoryName: '保护套' }, 'protectingShellList')
    this.getPromos({ categoryName: '充电器' }, 'chargerList')
    this.getPromos({ categoryName: ['电视机', '空调', '洗衣机'] }, 'applianceList', '/product/getHotProduct')
    this.getPromos({ categoryName: ['保护套', '保护膜', '充电器', '充电宝'] }, 'accessoryList', '/product/getHotProduct')
  },
  watch: {
    // 家电当前选中的商品分类，响应不同的商品数据
    applianceActive(val) {
      // 页面初始化的时候把applianceHotList(热门家电商品列表)直接赋值给applianceList(家电商品列表)
      // 所以在切换商品列表时判断applianceHotList是否为空,为空则是第一次切换,把applianceList赋值给applianceHotList
      if (this.applianceHotList == '') {
        this.applianceHotList = this.applianceList
      }
      if (val == 1) {
        // 热门
        this.applianceList = this.applianceHotList
        return
      }
      if (val == 2) {
        // 电视
        this.applianceList = this.miTvList
        return
      }
    },
    accessoryActive(val) {
      if (this.accessoryHotList == '') {
        this.accessoryHotList = this.accessoryList
      }
      if (val == 1) {
        // 1为热门商品
        this.accessoryList = this.accessoryHotList
        return
      }
      if (val == 2) {
        // 2为保护套商品
        this.accessoryList = this.protectingShellList
        return
      }
      if (val == 3) {
        //3 为充电器商品
        this.accessoryList = this.chargerList
        return
      }
    }
  }
}
</script>

<style lang="less" scoped>
// 轮播图
.block {
  margin: 0 auto;
  max-width: 1225px;
}

// main
.main-box {
  background: #f5f5f5;
  padding-bottom: 20px;
  .main {
    margin: 0 auto;
    max-width: 1225px;

    // 公共
    .box-hd {
      height: 58px;
      margin: 20px 0 0 0;
      .title {
        float: left;
        font-size: 22px;
        font-weight: 200;
        line-height: 58px;
        color: #333;
      }
      .more {
        float: right;
        a {
          font-size: 16px;
          line-height: 58px;
          color: #424242;
          &:hover {
            color: #ff6700;
          }
        }
      }
    }

    .box-bd {
      height: 615px;
      .promo-list {
        float: left;
        height: 100%;
        width: 234px;
        li {
          z-index: 1;
          width: 100%;
          height: 300px;
          margin-bottom: 14.5px;
          -webkit-transition: all 0.2s linear;
          transition: all 0.2s linear;
          &:hover {
            z-index: 2;
            -webkit-box-shadow: 0 15px 30px rgba(0, 0, 0, 0.1);
            box-shadow: 0 15px 30px rgba(0, 0, 0, 0.1);
            -webkit-transform: translate3d(0, -2px, 0);
            transform: translate3d(0, -2px, 0);
          }
          img {
            width: 100%;
            height: 100%;
          }
        }
        img {
          width: 234px;
        }
      }
      .list {
        float: left;
        height: 615px;
        width: 991px;
      }
    }
  }
}
</style>
