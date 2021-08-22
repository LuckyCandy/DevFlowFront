<template>
  <div style="height: calc(100vh - 85px);">
    <mavon-editor v-model="content" :default-open="defaultShow" :toolbars-flag="canEdit" :subfield="canEdit" :editable="canEdit" style="height: 100%" @save="save" />
  </div>
</template>

<script>
import { devSubmitDuration, tstSubmitDuration, durationDetail } from '@/api/iteration-duration'
export default {
  name: 'IterationDuration',
  components: { },
  data() {
    return {
      id: 0,
      role: 0,
      content: '',
      canEdit: false,
      defaultShow: 'preview'
    }
  },
  created() {
    this.id = this.$route.query.id
    this.role = this.$route.query.role
    durationDetail({ id: this.id, role: this.role }).then(res => {
      this.canEdit = res.data.can_edit
      if (this.canEdit) {
        this.defaultShow = 'edit'
      }
      if (this.role === 'developer') {
        if (res.data.dev_content !== '') {
          this.content = res.data.dev_content
        } else {
          this.content = '## ' + this.$route.query.project + ' V' + this.$route.query.version + '开发估时'
        }
      } else {
        if (res.data.tst_content !== '') {
          this.content = res.data.tst_content
        } else {
          this.content = '## ' + this.$route.query.project + ' V' + this.$route.query.version + '测试估时'
        }
      }
    })
  },
  methods: {
    save() {
      const data = { id: this.id, publish: false }
      if (this.role === 'developer') {
        data.dev_content = this.content
        this.$confirm('是否将此次更新告知群里其他小伙伴？', 'Hey', {
          confirmButtonText: '必须~须~~的',
          cancelButtonText: '先不通知，后面还改呢',
          type: 'warning'
        }).then(() => {
          data.publish = true
        }).catch(() => {}).finally(() => {
          devSubmitDuration(data).then(() => {
            this.$message({
              message: '提交成功',
              type: 'success'
            })
          })
        })
      } else {
        data.tst_content = this.content
        this.$confirm('是否将此次更新告知群里其他小伙伴？', 'Hey', {
          confirmButtonText: '必须~须~~的',
          cancelButtonText: '先不通知，后面还改呢',
          type: 'warning'
        }).then(() => {
          data.publish = true
        }).catch(() => {}).finally(() => {
          tstSubmitDuration(data).then(() => {
            this.$message({
              message: '提交成功',
              type: 'success'
            })
          })
        })
      }
    }
  }
}
</script>
