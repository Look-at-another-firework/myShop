<template>
  <div class="myMenu">
    <ul>
      <li v-for="i in val" :key="i" :class="active == i ? 'active' : ''" @mouseover="mouseover(i)">
        <router-link to>
          <slot :name="i"></slot>
        </router-link>
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  props: ['val'],
  data() {
    return {
      active: 1
    }
  },
  methods: {
    mouseover(val) {
      this.active = val
    }
  },
  watch: {
    active(val) {
      this.$emit('changeVal', val)
    }
  }
}
</script>

<style lang="less" scoped>
.myMenu {
  box-sizing: border-box;
  li {
    float: left;
    margin-left: 30px;
  }
  a {
    &:hover {
      color: #ff6700;
      border-bottom: 2px solid #ff6700;
    }
  }
  .active {
    a {
      color: #ff6700;
      border-bottom: 2px solid #ff6700;
    }
  }
}
</style>
