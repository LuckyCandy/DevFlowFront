<template>
  <div class="login-container">
    <div class="login-form">
      <el-form ref="loginForm" class="login-form-content" :model="loginForm" :rules="loginRules" autocomplete="on" label-position="left">

        <div class="title-container">
          <h3 class="title">ToolKits Admin</h3>
        </div>

        <el-form-item prop="mobile">
          <span class="svg-container">
            <i class="el-icon-phone" />
          </span>
          <el-input
            ref="mobile"
            v-model="loginForm.mobile"
            placeholder="Mobile"
            name="mobile"
            type="text"
            tabindex="1"
            autocomplete="on"
          />
        </el-form-item>

        <el-tooltip v-model="capsTooltip" content="Caps lock is On" placement="right" manual>
          <el-form-item prop="password">
            <span class="svg-container"><svg-icon icon-class="password" /></span>
            <el-input
              :key="passwordType"
              ref="password"
              v-model="loginForm.password"
              :type="passwordType"
              placeholder="Password"
              name="password"
              tabindex="2"
              autocomplete="on"
              @keyup.native="checkCapslock"
              @blur="capsTooltip = false"
              @keyup.enter.native="handleLogin"
            />
            <span class="show-pwd" @click="showPwd">
              <svg-icon :icon-class="passwordType === 'password' ? 'eye' : 'eye-open'" />
            </span>
          </el-form-item>
        </el-tooltip>

        <el-button :loading="loading" type="success" style="width:100%;margin-top:30px;font-size:18px;font-weight:bold" @click.native.prevent="handleLogin">Sign in</el-button>
      </el-form>
    </div>
  </div>
</template>

<script>
import { validMobile, validPassword } from '@/utils/validate'

export default {
  name: 'Login',
  data() {
    const validateMobileRule = (rule, value, callback) => {
      if (!validMobile(value)) {
        callback(new Error('请输入正确的手机号'))
      } else {
        callback()
      }
    }
    const validatePasswordRule = (rule, value, callback) => {
      if (!validPassword(value)) {
        callback(new Error('密码不能低于8位，且必须同时含有数字、字符'))
      } else {
        callback()
      }
    }
    return {
      loginForm: {
        mobile: '',
        password: ''
      },
      loginRules: {
        mobile: [{ required: true, trigger: 'blur', validator: validateMobileRule }],
        password: [{ required: true, trigger: 'blur', validator: validatePasswordRule }]
      },
      passwordType: 'password',
      capsTooltip: false,
      loading: false,
      showDialog: false,
      redirect: undefined,
      otherQuery: {}
    }
  },
  watch: {
    $route: {
      handler: function(route) {
        const query = route.query
        if (query) {
          this.redirect = query.redirect
          this.otherQuery = this.getOtherQuery(query)
        }
      },
      immediate: true
    }
  },
  created() {
    // window.addEventListener('storage', this.afterQRScan)
  },
  mounted() {
    if (this.loginForm.mobile === '') {
      this.$refs.mobile.focus()
    } else if (this.loginForm.password === '') {
      this.$refs.password.focus()
    }
  },
  destroyed() {
    // window.removeEventListener('storage', this.afterQRScan)
  },
  methods: {
    checkCapslock(e) {
      const { key } = e
      this.capsTooltip = key && key.length === 1 && (key >= 'A' && key <= 'Z')
    },
    showPwd() {
      if (this.passwordType === 'password') {
        this.passwordType = ''
      } else {
        this.passwordType = 'password'
      }
      this.$nextTick(() => {
        this.$refs.password.focus()
      })
    },
    handleLogin() {
      this.$refs.loginForm.validate(valid => {
        if (valid) {
          this.loading = true
          this.$store.dispatch('user/login', this.loginForm)
            .then(() => {
              this.$router.push({ path: this.redirect || '/', query: this.otherQuery })
              this.loading = false
            })
            .catch(() => {
              this.loading = false
            })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    getOtherQuery(query) {
      return Object.keys(query).reduce((acc, cur) => {
        if (cur !== 'redirect') {
          acc[cur] = query[cur]
        }
        return acc
      }, {})
    }
  }
}
</script>

<style lang="scss">
/* 修复input 背景不协调 和光标变色 */
/* Detail see https://github.com/PanJiaChen/vue-element-admin/pull/927 */

$light_gray:#000;
$cursor: #000;

/* reset element-ui css */
.login-container {
  .el-input {
    display: inline-block;
    height: 47px;
    width: 85%;

    input {
      font-size: 16px;
      background: white;
      border: 0px;
      -webkit-appearance: none;
      border-radius: 0px;
      padding: 12px 5px 12px 15px;
      color: $light_gray;
      height: 47px;
    }
    input:-webkit-autofill {
      box-shadow: 0 0 0px 1000px #ffffff inset !important;
    }
  }

  .el-form-item {
    border: 1px solid lightgray;
    border-radius: 5px;
    color: #454545;
  }
  .el-form-item__error {
    right: 0 !important;
    left: auto !important;
  }
}
</style>

<style lang="scss" scoped>
$dark_gray:lightgray;
$light_gray:#000;

.login-container {
  min-height: 100%;
  width: 100%;
  background: url('../../../src/assets/login_images/bg.jpg');
  overflow: hidden;

  .login-form {
    position: relative;
    width: 520px;
    max-width: 100%;
    padding: 160px 35px 0;
    margin: 0 auto;
    overflow: hidden;
  }
  .login-form-content {
    padding: 15px;
    background-color: white;
    border-radius: 6px;
  }

  .tips {
    font-size: 14px;
    color: #fff;
    margin-bottom: 10px;

    span {
      &:first-of-type {
        margin-right: 16px;
      }
    }
  }

  .svg-container {
    padding: 6px 15px;
    color: $light_gray;
    vertical-align: middle;
    display: inline-block;
    border-right: 1px solid $dark_gray;
  }

  .title-container {
    position: relative;

    .title {
      font-size: 26px;
      margin: 0px auto 40px auto;
      text-align: center;
      font-weight: bold;
    }
  }

  .show-pwd {
    position: absolute;
    right: 10px;
    top: 7px;
    font-size: 16px;
    color: $dark_gray;
    cursor: pointer;
    user-select: none;
  }
}
</style>
