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
        <el-table-column prop="project" label="项目名" class-name="desc" width="120" />
        <el-table-column prop="version" label="版本" align="center" width="80" />
        <el-table-column prop="judge_time" label="评审时间" width="160" align="center" />
        <el-table-column prop="total_duration" label="开发工时" width="80" align="center" />
        <el-table-column prop="test_finish_at" label="测试完成" width="160" align="center" sortable="custom" />
        <el-table-column class-name="desc" prop="description" label="版本描述" min-width="200" show-overflow-tooltip />
        <el-table-column label="操作" width="180" align="center">
          <template slot-scope="{ row }">
            {{ void (actions = getActionBtn(row)) }}
            <template v-for="(item, index) in actions.slice(0, 2)">
              <el-button :key="index" type="text" size="small" @click="dispathAction(row, item.func)">
                {{ item.text }}
              </el-button>
              <span v-if="index === 0 || actions.length > 2" :key="'sep'+index"> | </span>
            </template>

            <el-dropdown v-if="actions.length > 2">
              <span class="el-dropdown-link" style="font-size:12px;padding-left:2px;color:#1890ff">
                更多<i class="el-icon-arrow-down el-icon--right" />
              </span>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item v-for="(item, index) in actions.slice(2)" :key="'el-dropdown-item'+index" :divided="index > 0">
                  <el-button style="display:block" type="text" size="small" @click="dispathAction(row, item.func)">
                    {{ item.text }}
                  </el-button>
                </el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </template>
        </el-table-column>
      </template>
    </search-table>
  </div>
</template>

<script>
import SearchTable from '@/components/SearchTable'

export default {
  name: 'DeveloperIteration',
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
    },
    getActionBtn(row) {
      const actions = []
      if (row.status >= 2) {
        actions.push({ func: 'toDuration', text: '估时' })
        actions.push({ func: 'toTestDuration', text: '开发计划' })
        actions.push({ func: 'toTestDuration', text: '测试估时' })
      }
      if (row.status === 4) {
        actions.push({ func: 'toTestDuration', text: '延期' })
      }
      return actions
    },
    dispathAction(row, func) {
      if (func === 'toDuration') {
        return this.toDuration(row)
      } else if (func === 'toTestDuration') {
        return this.toTestDuration(row)
      }
    },
    toDuration(row) {
      this.$router.push({
        path: '/iteration/duration',
        query: {
          id: row.id,
          project: row.project,
          version: row.version,
          role: 'developer'
        }
      })
    },
    toTestDuration(row) {
      this.$router.push({
        path: '/iteration/duration',
        query: {
          id: row.id,
          project: row.project,
          version: row.version,
          role: 'tester'
        }
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
  line-height: 1.8;
}
</style>
