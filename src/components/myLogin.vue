<template>
  <div class="myLogin">
    <el-dialog title="登录" :visible.sync="isLogin" width="300px" center>
      <el-form :model="Login" :rules="rules" status-icon ref="ruleForm" class="ruleForm">
        <el-form-item prop="name">
          <el-input v-model="Login.name" placeholder="请输入账号" prefix-icon="el-icon-user-solid"></el-input>
        </el-form-item>
        <el-form-item prop="pass">
          <el-input v-model="Login.pass" placeholder="请输入密码" prefix-icon="el-icon-view"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button @click="login" type="primary" size="medium" style="width: 100%">登录</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
import { mapActions, mapState } from 'vuex'
export default {
  data() {
    // 用户名效验
    var Name = (rule, value, callback) => {
      if (!value) {
        return callback(new Error('请输入用户名'))
      }
      // 定义正则，长度5-16，字母开头，允许下划线
      const nameRule = /^[a-zA-Z][a-zA-Z0-9_]{4,15}$/
      if (nameRule.test(value)) {
        this.$refs.ruleForm.validateField('checkPass')
        return callback()
      } else {
        return callback(new Error('字母开头,长度5-16之间,允许字母数字下划线'))
      }
    }
    // 密码效验
    var pass = (rule, value, callback) => {
      if (value === '') {
        return callback(new Error('请输入密码'))
      }
      // 密码以字母开头,长度在6-18之间,允许字母数字和下划线
      const passRule = /^[a-zA-Z]\w{5,17}$/
      if (passRule.test(value)) {
        this.$refs.ruleForm.validateField('checkPass')
        return callback()
      } else {
        return callback(new Error('字母开头,长度6-18之间,允许字母数字和下划线'))
      }
    }
    return {
      Login: {
        name: '',
        pass: ''
      },
      // 用户信息校验规则,validator(校验方法),trigger(触发方式),blur为在组件 Input 失去焦点时触发
      rules: {
        name: [{ validator: Name, trigger: 'blur' }],
        pass: [{ validator: pass, trigger: 'blur' }]
      }
    }
  },
  computed: {
    ...mapState(['user/showLogin']),
    isLogin: {
      get() {
        return this.$store.state.user.showLogin
      },
      set(val) {
        this.$refs['ruleForm'].resetFields()
        this.setShowLogin(val)
      }
    }
  },
  methods: {
    ...mapActions('user', ['setShowLogin','setUser']),
    login() {
      this.$refs['ruleForm'].validate(async (valid) => {
        //  通过登录
        if (valid) {
          const data = {
            userName: this.Login.name,
            password: this.Login.pass
          }
          const result = await this.$API.attr.reqLogin(data)
          // “001”代表登录成功，其他的均为失败
          if (result.code === '001') {
            // 隐藏登录组件
            this.isLogin = false
            // 登录信息存到本地
            let user = JSON.stringify(result.user)
            localStorage.setItem('user', user)
            // 登录信息存到vuex
            this.setUser(result.user)
            // 弹出通知框提示登录成功信息
            this.$notify({
              title: '成功',
              message: result.msg,
              type: 'success'
            })
          } else {
            // 清空输入框的校验状态
            this.$refs['ruleForm'].resetFields()
            // 弹出通知框提示登录失败信息
            this.$notify.error({
              title: '错误',
              message: result.msg
            })
          }
        }
      })
    }
  }
}
</script>
