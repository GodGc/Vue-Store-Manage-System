<template>
  <div class="login-wrap">
    <el-form
      :rules="rules"
      class="login-form"
      :label-position="labelPosition"
      label-width="80px"
      :model="formLogin">
      <h2>登录页面</h2>
      <el-form-item label="账号" prop="username">
        <el-input v-model="formLogin.username" autofocus></el-input>
      </el-form-item>
      <el-form-item label="密码" prop="password">
        <el-input @keyup.enter.native="handleClick" type="password" v-model="formLogin.password"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button @click.prevent="handleClick" class="login-btn" type="primary">提交</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  name: 'Login',
  data () {
    return {
      rules: {
        username: [
          {required: true, message: '请输入用户名', trigger: 'blur'}
        ],
        password: [
          {required: true, message: '请输入密码', trigger: 'blur'}
        ]
      },
      labelPosition: 'top',
      formLogin: {
        username: '',
        password: ''
      }
    }
  },
  methods: {
    handleClick () {
      const that = this
      if (!this.formLogin.username) {
        return this.$message.error('用户名和密码不允许为空')
      }
      this.$axios
        .post('/login', this.formLogin)
        .then(response => {
          if (response.data.meta.status === 200) {
            this.$message({
              message: '登录成功!',
              type: 'success'
            })
            // 记录token令牌,并且储存在sessionStorage中
            const token = response.data.data.token
            sessionStorage.setItem('token', token)
            that.$router.push('/home')
          } else {
            this.$message.error(response.data.meta.msg)
          }
        })
        .catch(err => console.log(err))
    }
  }
}
</script>

<style scoped>
  .login-wrap {
    width: 100%;
    height: 100%;
    background-color: #15375B;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .login-wrap .login-form {
    width: 500px;
    height: 300px;
    padding: 30px;
    background-color: #fff;
  }

  .login-wrap .login-form .login-btn {
    width: 100%;
  }
</style>
