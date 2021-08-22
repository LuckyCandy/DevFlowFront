<template>
  <el-card style="margin-bottom:20px;">
    <div slot="header" class="clearfix">
      <span>关于我</span>
    </div>

    <div class="user-profile">
      <div class="box-center">
        <pan-thumb :image="user.avatar" :height="'100px'" :width="'100px'" :hoverable="false">
          <div>Hello</div>
          {{ user.role }}
        </pan-thumb>
      </div>
      <div class="box-center">
        <div class="user-name text-center">{{ user.name }}</div>
        <div class="user-role text-center text-muted">{{ user.role | uppercaseFirst }}</div>
      </div>
    </div>

    <div class="user-bio">
      <div class="user-education user-bio-section">
        <div class="user-bio-section-header"><svg-icon icon-class="education" /><span>其他信息</span></div>
        <div class="user-bio-section-body">
          <div class="text-muted" style="padding-left: 5px">
            <i class="el-icon-phone-outline" />：{{ user.mobile }}
          </div>
        </div>
      </div>

      <div class="user-skills user-bio-section">
        <div class="user-bio-section-header"><svg-icon icon-class="skill" /><span>其他操作</span></div>
        <div class="user-bio-section-body">
          <el-button style="width: 100%" size="medium" type="primary" @click="openChangeModal">
            <svg-icon icon-class="password" /> 修改密码
          </el-button>
        </div>
      </div>
    </div>
    <!-- 修改密码弹框 -->
    <CustomModal
      ref="passwdChangeModal"
      title="修改密码"
      @ok="doUpdatePassword"
      @close="closeChangeModal"
    >
      <el-form
        ref="dataForm"
        :rules="rules"
        :model="temp"
        label-position="left"
        label-width="70px"
      >
        <el-form-item label="原密码" prop="pass" style="margin: 20px 0">
          <el-input v-model="temp.pass" type="password" />
        </el-form-item>
        <el-form-item label="新密码" prop="new_pass">
          <el-input v-model="temp.new_pass" type="password" />
        </el-form-item>
      </el-form>
    </CustomModal>
  </el-card>
</template>

<script>
import {
  changePassword
} from '@/api/user'
import PanThumb from '@/components/PanThumb'
import CustomModal from '@/components/Modal'
import store from '@/store'

export default {
  components: { PanThumb, CustomModal },
  props: {
    user: {
      type: Object,
      default: () => {
        return {
          name: '',
          email: '',
          avatar: '',
          role: ''
        }
      }
    }
  },
  data() {
    return {
      temp: {
        pass: '', new_pass: ''
      },
      rules: {
        pass: [{ required: true, message: '原密码必填哦', trigger: 'blur' }],
        new_pass: [{ required: true, message: '新密码必填哦', trigger: 'blur' }]
      }
    }
  },
  methods: {
    openChangeModal() {
      this.$refs['passwdChangeModal'].showModal()
    },
    closeChangeModal() {
      this.$refs['passwdChangeModal'].hiddeModal()
    },
    doUpdatePassword() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          changePassword(this.temp).then(() => {
            this.closeChangeModal()
            this.$confirm('您的密码已修改成功！请重新登陆', '修改成功', {
              showCancelButton: false,
              showClose: false,
              center: false,
              confirmButtonText: '重新登陆'
            }).then(() => {
              store.dispatch('user/logout').then(() => {
                this.$router.replace({ path: '/login', query: { redirect: this.$route.path }})
              })
            })
          })
        } else {
          this.$refs['passwdChangeModal'].stopLoading()
        }
      })
    },
    reset() {
      this.temp = {
        pass: '', new_pass: ''
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.box-center {
  margin: 0 auto;
  display: table;
}

.text-muted {
  color: #777;
}

.user-profile {
  .user-name {
    font-weight: bold;
  }

  .box-center {
    padding-top: 10px;
  }

  .user-role {
    padding-top: 10px;
    font-weight: 400;
    font-size: 14px;
  }

  .box-social {
    padding-top: 30px;

    .el-table {
      border-top: 1px solid #dfe6ec;
    }
  }

  .user-follow {
    padding-top: 20px;
  }
}

.user-bio {
  margin-top: 20px;
  color: #606266;

  span {
    padding-left: 4px;
  }

  .user-bio-section {
    font-size: 14px;
    padding: 15px 0;

    .user-bio-section-header {
      border-bottom: 1px solid #dfe6ec;
      padding-bottom: 10px;
      margin-bottom: 10px;
      font-weight: bold;
    }
  }
}
</style>
