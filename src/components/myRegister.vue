<template>
  <div class="reg">
    <el-dialog title="注册" :visible.sync="isRegister" width="300px" center>
      <el-form :model="RegisterUser" status-icon :rules="rules" ref="ruleForm">
        <el-form-item prop="name">
          <el-input v-model="RegisterUser.name" prefix-icon="el-icon-user-solid" placeholder="请输入账号"></el-input>
        </el-form-item>
        <el-form-item prop="pass">
          <el-input v-model="RegisterUser.pass" prefix-icon="el-icon-view" type="password" placeholder="请输入密码"></el-input>
        </el-form-item>
        <el-form-item prop="confirmPass">
          <el-input v-model="RegisterUser.confirmPass" prefix-icon="el-icon-view" type="password" placeholder="请再次输入密码"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button @click="Register" type="primary" size="medium" style="width: 100%">注册</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
export default {
  props: ['showReg'],
  data() {
    // 用户名的校验方法
    let validateName = async (rule, value, callback) => {
      if (!value) {
        return callback(new Error('请输入用户名'))
      }
      // 用户名以字母开头,长度在5-16之间,允许字母数字下划线
      const userNameRule = /^[a-zA-Z][a-zA-Z0-9_]{4,15}$/
      if (userNameRule.test(value)) {
        //判断数据库中是否已经存在该用户名
        const result = await this.$API.attr.findUserName(this.RegisterUser.name)
        if (result.code == '001') {
          this.$refs.ruleForm.validateField('checkPass')
          return callback()
        } else {
          return callback(new Error(result.msg))
        }
      } else {
        return callback(new Error('字母开头,长度5-16之间,允许字母数字下划线'))
      }
    }
    // 密码的校验方法
    let validatePass = (rule, value, callback) => {
      if (value === '') {
        return callback(new Error('请输入密码'))
      }
      // 密码以字母开头,长度在6-18之间,允许字母数字和下划线
      const passwordRule = /^[a-zA-Z]\w{5,17}$/
      if (passwordRule.test(value)) {
        this.$refs.ruleForm.validateField('checkPass')
        return callback()
      } else {
        return callback(new Error('字母开头,长度6-18之间,允许字母数字和下划线'))
      }
    }
    // 确认密码的校验方法
    let validateConfirmPass = (rule, value, callback) => {
      if (value === '') {
        return callback(new Error('请输入确认密码'))
      }
      // 校验是否以密码一致
      if (this.RegisterUser.pass != '' && value === this.RegisterUser.pass) {
        this.$refs.ruleForm.validateField('checkPass')
        return callback()
      } else {
        return callback(new Error('两次输入的密码不一致'))
      }
    }
    return {
      isRegister: false, // 控制注册组件是否显示
      RegisterUser: {
        name: '', // 账号
        pass: '', // 密码
        confirmPass: '' // 确认密码
      },
      rules: {
        name: [{ validator: validateName, trigger: 'blur' }],
        pass: [{ validator: validatePass, trigger: 'blur' }],
        confirmPass: [{ validator: validateConfirmPass, trigger: 'blur' }]
      }
    }
  },
  methods: {
    Register() {
      this.$refs['ruleForm'].validate(async (valid) => {
        //如果通过校验开始注册
        if (valid) {
          const data = {
            userName: this.RegisterUser.name,
            password: this.RegisterUser.pass
          }
          const result = await this.$API.attr.reqRegister(data)
          if (result.code === '001') {
            // 隐藏注册组件
            this.isRegister = false
            // 弹出通知框提示注册成功信息
            this.$notify({
              title: '成功',
              message: result.msg,
              type: 'success'
            })
          } else {
            // 弹出通知框提示注册失败信息
            this.$notify.error({
              title: '错误',
              message: result.msg
            })
          }
        } else {
          return false
        }
      })
    }
  },
  watch: {
    showReg(val) {
      if (val) {
        this.isRegister = val
      }
    },
    isRegister(val) {
      if (!val) {
        this.$refs['ruleForm'].resetFields()
        this.$emit('changeVal', val)
      }
    }
  }
}
</script>

<style></style>
