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
        </div>
      </template>
      <template v-slot:column>
        <el-table-column prop="id" label="#ID" width="80" align="center" sortable="custom" />
        <el-table-column prop="project" label="项目名" class-name="desc" />
        <el-table-column prop="version" label="版本" align="center" />
        <el-table-column prop="judge_time" label="评审时间" width="140" align="center" />
        <el-table-column prop="total_duration" label="开发工时" width="80" align="center" />
        <el-table-column prop="test_finish_at" label="测试完成" width="140" align="center" sortable="custom" />
        <el-table-column class-name="desc" prop="description" label="版本描述" min-width="200" show-overflow-tooltip />
        <el-table-column label="操作" width="120" align="center">
          <template slot-scope="{ row }">
            <el-button type="text" size="small">
              移除{{ row.id }}
            </el-button>
          </template>
        </el-table-column>
      </template>
    </search-table>
  </div>
</template>

<script>
import SearchTable from '@/components/SearchTable'

export default {
  name: 'TesterIteration',
  components: { SearchTable },
  data() {
    return {
      list: [],
      query: {
        project: '',
        test_finish_at: []
      }
    }
  },
  methods: {
    tapSearch() {
      this.$refs['table'].getList()
    },
    resetQuery() {
      this.query = {
        project: '',
        test_finish_at: []
      }
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
  line-height: 1.8;
}
</style>
