<template>
  <el-dialog
    :title="title"
    :visible.sync="isShow"
    :before-close="closeBtnTapped"
    class="custom-modal"
  >
    <slot>就空弹个窗子？</slot>
    <div slot="footer" class="dialog-footer">
      <el-button @click="closeBtnTapped"> 取 消 </el-button>
      <el-button type="primary" :loading="isLoading" @click="okBtnTapped">
        确认
      </el-button>
    </div>
  </el-dialog>
</template>

<script>
export default {
  name: 'CustomModal',
  props: {
    title: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      isShow: false,
      isLoading: false
    }
  },
  methods: {
    hiddeModal() {
      this.stopLoading()
      this.isShow = false
    },
    showModal() {
      this.isShow = true
    },
    closeBtnTapped() {
      this.$emit('close')
    },
    okBtnTapped() {
      this.$emit('ok')
    },
    startLoading() {
      this.isLoading = true
    },
    stopLoading() {
      this.isLoading = false
    }
  }
}
</script>

<style lang="scss">
.custom-modal {
  width: 500px;
  margin: auto;
  .el-dialog {
    width: 100% !important;
  }
  .el-dialog__header {
    border-bottom: 1px solid lightgray !important;
  }
  .el-dialog__body {
    padding: 20px 20px;
  }
  .el-dialog__footer {
    border-top: 1px solid lightgray;
  }
}
</style>
