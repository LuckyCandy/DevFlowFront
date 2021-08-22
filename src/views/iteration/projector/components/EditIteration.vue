<template>
  <custom-modal ref="modal" title="更新迭代" @close="close" @ok="tappedOk">
    <el-form ref="dataForm" :rules="rules" :model="temp" label-position="left" label-width="110px">
      <el-form-item label="项目" prop="project" style="text-align:right">
        <el-input v-model="temp.project" />
      </el-form-item>
      <el-form-item label="版本号" prop="version">
        <el-input v-model="temp.version" />
      </el-form-item>
      <el-form-item label="需求地址" prop="vcs_address">
        <el-input v-model="temp.vcs_address" />
      </el-form-item>
      <el-form-item label="评审时间" prop="judge_time">
        <el-date-picker v-model="temp.judge_time" :disabled="temp.status !== 1" format="yyyy-MM-dd HH:mm" value-format="yyyy-MM-dd HH:mm" type="datetime" placeholder="选择时间" />
      </el-form-item>
      <el-form-item label="版本功能简述" prop="description">
        <el-input v-model="temp.description" type="textarea" :row="3" />
      </el-form-item>
    </el-form>
  </custom-modal>
</template>

<script>
import CustomModal from '@/components/Modal'
import { editIteration } from '@/api/iteration'

export default {
  name: 'EditIteration',
  components: { CustomModal },
  data() {
    return {
      rules: {
        project: [{ required: true, message: '项目名必填', trigger: 'blur' }],
        version: [{ required: true, message: '版本号必填', trigger: 'blur' }],
        vcs_address: [{ required: true, message: '口头需求不接受的', trigger: 'blur' }],
        judge_time: [{ required: true, message: '不评审的么？', trigger: 'blur' }],
        description: [{ required: true, message: '总得让兄弟知道干了个啥吧！', trigger: 'blur' }]
      },
      temp: {
        id: 0,
        status: 0,
        project: '',
        version: '',
        vcs_address: '',
        judge_time: '',
        description: ''
      }
    }
  },
  methods: {
    close() {
      this.reset()
      this.$refs['modal'].hiddeModal()
    },
    open(data) {
      this.temp = {
        id: data.id,
        status: data.status,
        project: data.project,
        version: data.version,
        vcs_address: data.vcs_address,
        judge_time: data.judge_time.substring(0, 16),
        description: data.description
      }
      this.$refs['modal'].showModal()
    },
    tappedOk() {
      editIteration(this.temp).then(() => {
        this.$notify({
          title: '操作成功',
          message: '需求更新成功，你自己在群里吆喝下吧，我累了！',
          type: 'warning',
          duration: 3000
        })
        this.reset()
        this.$refs['modal'].hiddeModal()
        this.$emit('edit-success')
      })
    },
    reset() {
      this.temp = {
        id: 0,
        status: 0,
        project: '',
        version: '',
        vcs_address: '',
        judge_time: '',
        description: ''
      }
    }
  }
}
</script>
