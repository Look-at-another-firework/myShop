<template>
  <div class="myList">
    <ul>
      <li v-for="i in list" :key="i.product_id">
        <el-popover placement="top">
          <p>确认删除吗？</p>
          <div style="text-align: right; margin: 10px 0 0">
            <el-button type="primary" size="mini" @click="deleteCollect(i.product_id)"> 确定 </el-button>
          </div>
          <i class="el-icon-close delete" slot="reference" v-show="isDelete"></i>
        </el-popover>
        <router-link :to="{ path: '/goods/details', query: { productID: i.product_id } }">
          <img :src="i.product_picture" alt="" />
          <h2>{{ i.product_name }}</h2>
          <h3>{{ i.product_title }}</h3>
          <p>
            <span>{{ i.product_selling_price }}元</span>
            <span v-show="i.product_price != i.product_selling_price" class="del"> {{ i.product_price }}元 </span>
          </p>
        </router-link>
      </li>
      <li v-show="isMore && list.length >= 1" id="more">
        <router-link :to="{ path: '/goods', query: { categoryID: categoryID } }">
          浏览更多
          <i class="el-icon-d-arrow-right"></i>
        </router-link>
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  // list为父组件传过来的商品列表
  // isMore为是否显示“浏览更多”
  props: ['list', 'isMore', 'isDelete'],
  computed: {
    // 通过list获取当前显示的商品的分类ID，用于“浏览更多”链接的参数
    categoryID() {
      let categoryID = []
      if (this.list != '') {
        for (let i = 0; i < this.list.length; i++) {
          const id = this.list[i].category_id
          if (!categoryID.includes(id)) {
            categoryID.push(id)
          }
        }
      }
      return categoryID
    }
  },
  methods: {
    async deleteCollect(id) {
      const data = {
        user_id: this.$store.state.user.user.user_id,
        product_id: id
      }
      const result = await this.$API.home.reqRemoveInfo(data)
      if (result.code == '001') {
        // 删除成功
        // 删除删除列表中的该商品信息
        for (let i = 0; i < this.list.length; i++) {
          const temp = this.list[i]
          if (temp.product_id == id) {
            // eslint-disable-next-line vue/no-mutating-props
            this.list.splice(i, 1)
            // 提示删除成功信息
            this.$notify({
              title: '成功',
              message: result.msg,
              type: 'success'
            })
          }
        }
      } else {
        return this.$notify.error({
          title: '错误',
          message: result.msg
        })
      }
    }
  }
}
</script>

<style lang="less" scoped>
.myList {
  ul {
    li {
      z-index: 1;
      float: left;
      width: 234px;
      height: 280px;
      padding: 10px 0;
      margin: 0 0 14.5px 13.7px;
      background: #fff;
      -webkit-transition: all 0.2s linear;
      transition: all 0.2s linear;
      position: relative;
      &:hover {
        z-index: 2;
        -webkit-box-shadow: 0 15px 30px rgba(0, 0, 0, 0.1);
        box-shadow: 0 15px 30px rgba(0, 0, 0, 0.1);
        -webkit-transform: translate3d(0, -2px, 0);
        transform: translate3d(0, -2px, 0);
        .delete {
          display: block;
        }
      }
      img {
        display: block;
        width: 160px;
        height: 160px;
        background: url(../assets/imgs/placeholder.png) no-repeat 50%;
        margin: 0 auto;
      }
      h2 {
        margin: 25px 10px 0;
        font-size: 14px;
        font-weight: 400;
        color: #333;
        text-align: center;
        text-overflow: ellipsis;
        word-spacing: nowrap;
        overflow: hidden;
      }
      h3 {
        margin: 5px 10px;
        height: 18px;
        font-size: 12px;
        font-weight: 400;
        color: #b0b0b0;
        text-align: center;
        text-overflow: ellipsis;
        white-space: nowrap;
        overflow: hidden;
      }
      p {
        margin: 10px 10px 10px;
        text-align: center;
        color: #ff6700;
        .del {
          margin-left: 8px;
          color: #b0b0b0;
          text-decoration: line-through;
        }
      }
      .delete {
        position: absolute;
        top: 10px;
        right: 10px;
        display: none;
        &:hover {
          color: #ff6700;
        }
      }
    }
  }
  #more {
    text-align: center;
    line-height: 280px;
    a {
      font-size: 18px;
      color: #333;
      &:hover {
        color: #ff6700;
      }
    }
  }
}
</style>
