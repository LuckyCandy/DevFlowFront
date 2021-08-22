<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input v-model="listQuery.mobile" placeholder="手机号" style="width: 200px; margin-right: 10px" class="filter-item" />
      <el-select v-model="listQuery.role" placeholder="角色" clearable style="width: 120px; margin-right: 10px" class="filter-item">
        <el-option v-for="item in roleOptions" :key="item.value" :label="item.key" :value="item.value" />
      </el-select>
      <el-select v-model="listQuery.status" placeholder="状态" clearable style="width: 90px; margin-right: 10px" class="filter-item">
        <el-option v-for="item in statusOptions" :key="item.key" :label="item.display_name" :value="item.key" />
      </el-select>
      <el-button v-waves class="filter-item" type="primary" icon="el-icon-search" @click="getList">
        查 询
      </el-button>
      <el-button v-waves class="filter-item" type="info" icon="el-icon-search" @click="resetQueryCondition">
        重 置
      </el-button>

      <div style="float: right">
        <el-button class="filter-item" style="margin-left: 10px" type="success" icon="el-icon-plus" @click="openCreateModel">
          增 加
        </el-button>
        <el-button v-waves :loading="downloadLoading" class="filter-item" type="danger" icon="el-icon-download" @click="handleDownload">
          导 出
        </el-button>
      </div>
    </div>

    <el-table :key="tableKey" v-loading="listLoading" :data="list" border fit highlight-current-row style="width: 100%" class="user-table" :default-sort="listQuery.sort" @sort-change="sortChange">
      <el-table-column label="ID" prop="id" align="center" width="80" sortable="custom">
        <template slot-scope="{ row }">
          <span>{{ row.id }}</span>
        </template>
      </el-table-column>

      <el-table-column label="昵称" min-width="100" show-overflow-tooltip>
        <template slot-scope="{ row }">
          <el-input v-if="row.edit" v-model="row.name" size="small" />
          <span v-else class="user-table-cell">{{ row.name }}</span>
        </template>
      </el-table-column>

      <el-table-column label="手机" width="160px" align="center">
        <template slot-scope="{ row }">
          <el-input v-if="row.edit" v-model="row.mobile" size="small" />
          <span v-else>{{ row.mobile }}</span>
        </template>
      </el-table-column>

      <el-table-column label="创建时间" prop="created_at" width="150px" align="center" sortable="custom">
        <template slot-scope="{ row }">
          <span>{{ row.created_at }}</span>
        </template>
      </el-table-column>

      <el-table-column label="角色" width="140px" align="center">
        <template slot-scope="{ row }">
          <el-select v-if="row.edit" v-model="row.role" placeholder="角色" clearable>
            <el-option v-for="item in roleOptions" :key="item.value" :label="item.key" :value="item.value" />
          </el-select>
          <span v-else>{{ row.role_text }}</span>
        </template>
      </el-table-column>

      <el-table-column label="状态" class-name="status-col" width="100">
        <template slot-scope="{ row }">
          <el-tag :type="row.status | statusFilter">
            {{ row.status == 1 ? "正常" : "禁用" }}
          </el-tag>
        </template>
      </el-table-column>

      <el-table-column label="Actions" align="center" width="250" fixed="right" class-name="small-padding">
        <template slot-scope="{ row }">
          <template v-if="!row.edit">
            <el-button type="primary" size="mini" @click="startEditMode(row)">
              编 辑
            </el-button>
            <el-button v-if="row.status == 1" size="mini" type="danger" @click="handleModifyStatus(row, 2)">
              禁 用
            </el-button>
            <el-button v-else size="mini" type="success" @click="handleModifyStatus(row, 1)">
              解禁
            </el-button>
            <el-button size="mini" type="warning" @click="passwordReset(row)">
              重置密码
            </el-button>
          </template>
          <template v-else>
            <el-button type="primary" size="mini" @click="handleUpdate(row)">
              确 认
            </el-button>
            <el-button type="info" size="mini" @click="cancelEdit(row)">
              取 消
            </el-button>
          </template>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total > 0" style="margin-top: 20px; text-align: right; padding: 0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getList" />

    <CustomModal ref="userAddModal" title="新增用户" @ok="createData" @close="closeCreateModel">
      <el-form ref="dataForm" :rules="rules" :model="temp" label-position="left" label-width="70px">
        <el-alert style="margin-bottom: 18px" title="温馨提示" type="info" :closable="false" description="添加用户会根据*手机号*自动关联钉钉账号，以使用其头像和昵称！" show-icon />
        <el-form-item label="手机号" prop="mobile">
          <el-input v-model="temp.mobile" />
        </el-form-item>
        <el-form-item label="角色" prop="role">
          <el-select v-model="temp.role" placeholder="角色" clearable class="filter-item">
            <el-option v-for="item in roleOptions" :key="item.value" :label="item.key" :value="item.value" />
          </el-select>
        </el-form-item>
      </el-form>
    </CustomModal>
  </div>
</template>

<script>
import {
  fetchUserList,
  createUser,
  editUser,
  userChangeStatus,
  userPasswordReset
} from '@/api/admin'
import waves from '@/directive/waves' // waves directive
import Pagination from '@/components/Pagination'
import CustomModal from '@/components/Modal'

export default {
  name: 'UserTable',
  components: { Pagination, CustomModal },
  directives: { waves },
  filters: {
    statusFilter(status) {
      const statusMap = {
        1: '正常',
        2: '禁用'
      }
      return statusMap[status]
    }
  },
  data() {
    return {
      tableKey: 0,
      list: null,
      total: 0,
      listLoading: true,
      changeRowOrigin: {},
      listQuery: {
        page: 1,
        limit: 20,
        mobile: '',
        status: 0,
        role: 0,
        sort: { prop: 'created_at', order: 'descending' }
      },
      roleOptions: [
        { value: 0, key: '选择角色' },
        { value: 1, key: '管理员' },
        { value: 2, key: '开发' },
        { value: 3, key: '测试' },
        { value: 4, key: '产品' },
        { value: 5, key: '其他' }
      ],
      statusOptions: [
        { key: 0, display_name: '全部' },
        { key: 1, display_name: '正常' },
        { key: 2, display_name: '禁用' }
      ],
      temp: {
        mobile: '',
        role: 0
      },
      rules: {
        mobile: [{ required: true, message: '手机号必填哦', trigger: 'blur' }],
        role: [{ required: true, message: '角色必选哦', trigger: 'blur' }]
      },
      downloadLoading: false
    }
  },
  created() {
    this.getList()
  },
  methods: {
    // 拉取数据
    getList() {
      this.listLoading = true
      const query = {}
      for (const key of Object.keys(this.listQuery)) {
        if (this.listQuery[key] !== '' && this.listQuery[key] !== 0) {
          query[key] = this.listQuery[key]
        }
      }
      fetchUserList(query).then((response) => {
        this.list = []
        response.data.data.map((item) => {
          this.list.push(Object.assign({}, item, { edit: false }))
        })
        this.total = response.data.total

        // Just to simulate the time of the request
        setTimeout(() => {
          this.listLoading = false
        }, 1 * 1000)
      })
    },
    // 重置查询
    resetQueryCondition() {
      this.listQuery.mobile = ''
      this.listQuery.status = 0
      this.listQuery.role = 0
    },
    handleModifyStatus(row, status) {
      userChangeStatus({ id: row.id }).then(() => {
        this.$notify({
          title: '操作成功',
          message: '用户状态已修改',
          type: 'success',
          duration: 3000
        })
        row.status = status
      })
    },
    passwordReset(row) {
      userPasswordReset({ id: row.id }).then(() => {
        this.$notify({
          title: '重置成功',
          message: '用户【' + row.name + '】的密码已重置为默认密码',
          type: 'success',
          duration: 3000
        })
      })
    },
    // 排序变化
    sortChange(data) {
      this.listQuery.sort = { prop: data.prop, order: data.order }
      this.getList()
    },
    resetTemp() {
      this.temp = {
        mobile: '',
        role: 0
      }
    },
    openCreateModel() {
      this.resetTemp()
      this.$refs['userAddModal'].showModal()
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    closeCreateModel() {
      this.resetTemp()
      this.$refs['userAddModal'].hiddeModal()
    },
    createData() {
      this.$refs['userAddModal'].startLoading()
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          createUser(this.temp).then(() => {
            this.$notify({
              title: '增加用户成功',
              message: '用户已增加，并通过钉钉告知了其初始密码！',
              type: 'success',
              duration: 3000
            })
            this.$refs['userAddModal'].hiddeModal()
          })
        } else {
          this.$refs['userAddModal'].stopLoading()
        }
      })
    },

    // 开始行编辑
    startEditMode(row) {
      this.changeRowOrigin = {
        name: row.name,
        mobile: row.mobile,
        role: row.role
      }
      row.edit = true
    },
    // 取消行编辑
    cancelEdit(row) {
      row.name = this.changeRowOrigin.name
      row.mobile = this.changeRowOrigin.mobile
      row.role = this.changeRowOrigin.role
      row.edit = false
      this.changeRowOrigin = {}
    },
    // 提交行编辑内容
    handleUpdate(row) {
      editUser({
        id: row.id,
        name: row.name,
        mobile: row.mobile,
        role: row.role
      }).then(() => {
        this.$notify({
          title: '更新成功',
          message: '用户信息已更新',
          type: 'success',
          duration: 3000
        })
        row.edit = false
        this.changeRowOrigin = {}
      })
    },
    // 下载
    handleDownload() {
      this.downloadLoading = true
      import('@/vendor/Export2Excel').then((excel) => {
        const tHeader = ['ID', '昵称', '手机', '创建时间', '状态', '角色']
        const filterVal = [
          'id',
          'name',
          'mobile',
          'created_at',
          'status',
          'role'
        ]
        const data = this.formatJson(filterVal)
        excel.export_json_to_excel({
          header: tHeader,
          data,
          filename: 'table-list'
        })
        this.downloadLoading = false
      })
    },
    formatJson(filterVal) {
      return this.list.map((v) =>
        filterVal.map((j) => {
          if (j === 'status') {
            return v[j] === 1 ? '正常' : '禁用'
          } else if (j === 'role') {
            return v['role_text']
          } else {
            return v[j]
          }
        })
      )
    }
  }
}
</script>

<style lang="scss" scoped>
.user-table {
  max-height: calc(100vh - 250px);
  overflow: scroll;

  .user-table-cell {
    white-space: nowrap;
  }
}
.edit-input {
  padding-right: 100px;
}
</style>

