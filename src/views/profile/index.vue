<template>
  <div class="app-container">
    <div v-if="user">
      <el-row :gutter="20">
        <el-col :span="6" :xs="24">
          <user-card :user="user" />
        </el-col>

        <el-col :span="18" :xs="24">
          <el-card>
            <div slot="header" class="clearfix">
              <span>工作流</span>
              <div style="float: right">
                <el-button
                  style="" type="danger" @click="toRefresh"
                >刷 新</el-button>
                <el-button
                  style="" type="success" @click="toSave"
                >保 存</el-button>
                <el-button
                  style="" type="primary" @click="addNewFlow"
                >新 增</el-button>
              </div>
            </div>
            <drag-kanban-demo ref="kanban" />
          </el-card>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import UserCard from './components/UserCard'
import DragKanbanDemo from '@/views/components-demo/drag-kanban'

export default {
  name: 'Profile',
  components: { UserCard, DragKanbanDemo },
  data() {
    return {
      user: {}
    }
  },
  computed: {
    ...mapGetters(['uid', 'name', 'avatar', 'roles', 'mobile'])
  },
  created() {
    this.getUser()
  },
  beforeRouteLeave(to, from, next) {
    if (this.$refs['kanban'].isListChanged()) {
      this.$confirm('您有未保存的工作流，是否保存？', '确认信息', {
        distinguishCancelAndClose: true,
        confirmButtonText: '是',
        cancelButtonText: '否'
      }).then(() => {
        console.log('hahahahah')
        this.$refs['kanban'].save()
      }).catch(action => {

      }).finally(() => {
        next()
      })
    } else {
      next()
    }
  },
  methods: {
    getUser() {
      this.user = {
        id: this.uid,
        name: this.name,
        role: this.roles.join(' | '),
        avatar: this.avatar,
        mobile: this.mobile
      }
    },
    addNewFlow() {
      this.$prompt('请输入工作流的标题', '', {
        confirmButtonText: '确定',
        cancelButtonText: '取消'
      }).then(({ value }) => {
        this.$refs['kanban'].addList(value)
      })
    },
    toSave() {
      this.$refs['kanban'].save()
    },
    toRefresh() {
      this.$refs['kanban'].refresh()
    }
  }
}
</script>
