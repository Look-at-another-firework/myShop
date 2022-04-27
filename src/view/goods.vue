<template>
  <div class="goods" name="goods">
    <!-- 面包屑 -->
    <div class="breadcrumb">
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item to="/">首页</el-breadcrumb-item>
        <el-breadcrumb-item>全部商品</el-breadcrumb-item>
        <el-breadcrumb-item v-if="search">搜索</el-breadcrumb-item>
        <el-breadcrumb-item v-else>分类</el-breadcrumb-item>
        <el-breadcrumb-item v-if="search">{{ search }}</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <!-- 面包屑结束 -->

    <!-- 分类标签 -->
    <div class="nav">
      <div class="product-nav">
        <div class="title">分类</div>
        <el-tabs v-model="activeName" type="card">
          <el-tab-pane v-for="i in category" :key="i.category_id" :label="i.category_name" :name="'' + i.category_id"></el-tab-pane>
        </el-tabs>
      </div>
    </div>
    <!-- 分类结束 -->

    <!-- 主要区域 -->
    <div class="main">
      <div class="list">
        <myList :list="product" v-if="product.length > 0"></myList>
        <div v-else class="none-product">抱歉没有找到相关的商品，请看看其他的商品</div>
      </div>
      <!-- 分页 -->
      <div class="pagination">
        <el-pagination background layout="prev, pager, next" :page-size="pageSize" :total="total" @current-change="currentChange"> </el-pagination>
      </div>
      <!-- 分页结束 -->
    </div>
    <!-- main结束 -->
  </div>
</template>

<script>
export default {
  data() {
    return {
      search: '', // 搜索条件
      activeName: '-1', //分类列表当中选中的id
      category: [], //分类列表
      Page: 1, //当前页码
      total: 0, // 总数
      categoryID: [], // 分类id
      pageSize: 15, // 每页显示的商品数量
      product: [] // 商品列表
    }
  },
  mounted() {
    // 获取分类列表数据
    this.getCategory()
  },
  methods: {
    async getCategory() {
      const result = await this.$API.goods.reqGetCategory()
      if (result.code == '001') {
        const val = {
          category_id: 0,
          category_name: '全部'
        }
        const cate = result.category
        cate.unshift(val)
        this.category = cate
      }
    },
    currentChange(page) {
      this.Page = page
      if (this.search != '') {
        this.getProductBySearch()
      } else {
        this.getData()
      }
      this.backtop()
    },
    // 通过搜索条件向后端请求商品数据
    async getProductBySearch() {
      const data = {
        search: this.search,
        currentPage: this.Page,
        pageSize: this.pageSize
      }
      const result = await this.$API.goods.reqSearchCategory(data)
      if (result.code == '001') {
        this.product = result.Product
        this.total = result.total
      } else {
        return Promise.reject(new Error('搜索出错'))
      }
    },
    // 向后端请求全部商品或分类商品数据
    async getData() {
      // 如果分类列表为空则请求全部商品数据，否则请求分类商品数据
      const api = this.categoryID.length == 0 ? '/product/getAllProduct' : '/product/getProductByCategory'
      const data = {
        categoryID: this.categoryID,
        currentPage: this.Page,
        pageSize: this.pageSize
      }
      const result = await this.$API.goods.reqEveryCategory(api, data)
      if (result.code == '001') {
        this.product = result.Product
        this.total = result.total
      } else {
        return new Promise.reject(new Error('请求出错了'))
      }
    },
    // 回顶部的函数
    backtop() {
      const timer = setInterval(() => {
        const top = document.documentElement.scrollTop || document.body.scrollTop
        const speed = Math.floor(-top / 5)
        document.documentElement.scrollTop = document.body.scrollTop = top + speed
        if (top === 0) {
          clearInterval(timer)
        }
      }, 20)
    }
  },
  activated() {
    this.activeName = '-1' //初始化分类列表选中为-1
    this.total = 0 // 初始化商品总量为0
    this.Page = 1 //初始化当前页码为1
    // 没有传参为显示全部
    if (Object.keys(this.$route.query).length == 0) {
      this.categoryID = []
      this.activeName = '0'
      return
    }
    // 传递了categoryID
    if (this.$route.query.categoryID !== undefined) {
      this.categoryID = this.$route.query.categoryID
      if (this.categoryID.length == 1) {
        this.activeName = '' + this.categoryID[0]
      }
      return
    }
    // 路由传递了搜索
    if (this.$route.query.search != undefined) {
      this.search = this.$route.query.search
    }
  },
  watch: {
    // 监听点击了哪个分类标签，通过修改分类id，响应相应的商品
    activeName(val) {
      if (val == 0) {
        this.categoryID = []
      }
      if (val > 0) {
        this.categoryID = [Number(val)]
      }
      // 初始化商品总量和当前页码
      this.total = 0
      this.page = 1
      // 更新地址栏链接，方便刷新页面可以回到原来的页面
      this.$router.push({
        path: '/goods',
        query: { categoryID: this.categoryID }
      })
    },
    // 监听搜索条件，响应相应的商品
    search(val) {
      if (val != '') {
        this.search = val
        this.getProductBySearch()
      }
    },
    // 监听分类id，响应相应的商品
    categoryID() {
      this.getData()
      this.search = ''
    },
    // 监听路由变化
    $route(val) {
      if (val.path == '/goods') {
        if (val.query.search != undefined) {
          this.activeName = '-1'
          this.Page = 1
          this.total = 0
          this.search = val.query.search
        }
      }
    }
  }
}
</script>

<style lang="less" scoped>
.goods {
  background-color: #f5f5f5;
  // 面包屑
  .breadcrumb {
    height: 50px;
    background-color: #fff;
    .el-breadcrumb {
      width: 1225px;
      line-height: 30px;
      font-size: 16px;
      margin: 0 auto;
    }
  }

  .el-tabs--card {
    border-bottom: none;
  }
  .el-tabs__header {
    border-bottom: none;
  }
  // ed
  // 分类
  .nav {
    background-color: #fff;
    .product-nav {
      width: 1225px;
      height: 40px;
      line-height: 40px;
      margin: 0 auto;
      .title {
        width: 50px;
        font-size: 16px;
        font-weight: 700;
        float: left;
      }
    }
  }
  // ed
  // 主内容
  .main {
    margin: 0 auto;
    max-width: 1225px;
    .list {
      min-height: 650px;
      padding-top: 14.5px;
      margin-left: -13.7px;
      overflow: hidden;
      .none-product {
        color: #333;
        margin-left: 13.7px;
      }
    }
    .pagination {
      height: 50px;
      text-align: center;
    }
  }
  // ed
}
</style>
