<template>
  <div class="app-container">
    <search-table ref="table" url="/iteration/search" class="iter-table" :query="query" :sort="{prop: 'test_finish_at', order: 'descending'}">
      <template v-slot:filter>
        <div class="filter-container">
          <el-input v-model="query.project" placeholder="项目" class="filter-item ele-common" clearable />
          <span class="filter-item label">测试完成时间:</span>
          <el-date-picker v-model="query.test_finish_at" type="daterange" class="filter-item ele-common" />
          <el-button class="filter-item" type="primary" icon="el-icon-search" @click="tapSearch">
            查 询
          </el-button>
          <el-button class="filter-item" type="info" icon="el-icon-search" @click="resetQuery">
            重 置
          </el-button>

          <div style="float: right">
            <el-button class="filter-item" style="margin-left: 10px" type="success" icon="el-icon-plus" @click="showAddModal">
              增 加
            </el-button>
          </div>
        </div>
      </template>
      <template v-slot:column>
        <el-table-column prop="id" label="#ID" width="80" align="center" sortable="custom" />
        <el-table-column prop="project" label="项目名" class-name="desc" />
        <el-table-column prop="version" label="版本" align="center" />
        <el-table-column label="状态" width="80" align="center">
          <template slot-scope="{ row }">
            <el-tag hit :type="statusColor[row.status]"> {{ row.status_text }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="judge_time" label="评审时间" width="140" align="center" />
        <el-table-column prop="total_duration" label="开发工时" width="80" align="center" />
        <el-table-column prop="test_finish_at" label="测试完成" width="140" align="center" sortable="custom" />
        <el-table-column class-name="desc" prop="description" label="版本描述" min-width="200" show-overflow-tooltip />
        <el-table-column label="操作" width="150" align="center">
          <template slot-scope="{ row }">
            <el-button v-if="row.status === 1" type="danger" size="small" @click="deleteIter(row.id)">
              删除
            </el-button>
            <el-button type="primary" size="small" @click="showEditModal(row)">
              编辑
            </el-button>
          </template>
        </el-table-column>
      </template>
    </search-table>
    <!-- 新迭代弹框 -->
    <add-iteration ref="addModal" @add-success="tapSearch" />
    <!-- 编辑迭代弹框 -->
    <edit-iteration ref="editModal" @edit-success="tapSearch" />
  </div>
</template>

<script>
import SearchTable from '@/components/SearchTable'
import AddIteration from './components/AddIteration'
import EditIteration from './components/EditIteration'
import { deleteIteration } from '@/api/iteration'

export default {
  name: 'ProjectorIteration',
  components: { SearchTable, AddIteration, EditIteration },
  data() {
    return {
      list: [],
      statusColor: { 1: 'warning', 2: 'warning', 3: 'warning', 4: 'info', 5: 'danger', 6: 'danger', 7: 'success' },
      query: {
        project: '',
        test_finish_at: []
      }
    }
  },
  created() {
    this.tapSearch()
  },
  methods: {
    tapSearch() {
      this.$refs['table'] && this.$refs['table'].getList()
    },
    resetQuery() {
      this.query = {
        project: '',
        test_finish_at: []
      }
    },
    showAddModal() {
      this.$refs['addModal'].open()
    },
    showEditModal(row) {
      this.$refs['editModal'].open(row)
    },
    deleteIter(id) {
      const loading = this.$loading({
        lock: true,
        text: '删除中...',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)'
      })
      deleteIteration({ id: id }).then(() => {
        loading.close()
        this.$notify({
          title: '操作成功',
          message: '我都通知完了你又删除啦？还可以这么干？狼来了的故事，懂？',
          type: 'error',
          duration: 3000
        })
        this.tapSearch()
      })
    }
  }
}
</script>
<style lang="scss">
.desc {
  .cell {
    white-space: nowrap;
    overflow: hidden;
  }
}
.el-tooltip__popper {
  width: 300px;
  line-height: 1.6;
}
</style>
