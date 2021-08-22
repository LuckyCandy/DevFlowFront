<template>
  <div class="search-table">
    <!-- 搜索区域 -->
    <div class="filter">
      <slot name="filter" />
    </div>
    <!-- 列表区域 -->
    <el-table
      v-loading="listLoading"
      border
      fit
      highlight-current-row
      :data="list"
      height="calc(100vh - 250px)"
      class="content"
      :header-cell-style="{background: '#2E4255', color: 'white'}"
      :default-sort="sort"
      @sort-change="sortChange"
    >
      <slot name="column" />
    </el-table>
    <!-- 分页区域 -->
    <pagination
      v-show="total > 0"
      class="pager"
      :total="total"
      :page.sync="listQuery.page"
      :limit.sync="listQuery.limit"
      @pagination="getList"
    />
  </div>
</template>
<script>
import Pagination from '@/components/Pagination'
import request from '@/utils/request'

export default {
  name: 'SearchTable',
  components: { Pagination },
  props: {
    url: {
      type: String,
      default: ''
    },
    sort: {
      type: Object,
      default: function() {
        return { prop: 'id', order: 'descending' }
      }
    },
    query: {
      type: Object,
      default: function() {
        return {}
      }
    }
  },
  data() {
    return {
      listLoading: false, // 列表是否在加载
      list: [], // 列表数据
      total: 0, // 列表总数
      asort: this.sort,
      listQuery: {
        page: 1,
        limit: 20
      }
    }
  },
  created() {
    this.getList()
  },
  methods: {
    /* 当排序变化时 */
    sortChange(data) {
      this.asort = { prop: data.prop, order: data.order }
      this.getList()
    },
    /* 拉取新数据 */
    getList() {
      this.listLoading = true
      const query = {}
      // 查询条件
      for (const key of Object.keys(this.query)) {
        if (this.query[key] !== '' && this.query[key] !== 0) {
          query[key] = this.query[key]
        }
      }
      // 处理分页
      query['page'] = this.listQuery.page
      query['limit'] = this.listQuery.limit
      // 处理排序
      query['sort'] = this.asort
      request({
        url: this.url,
        method: 'get',
        params: query
      }).then(res => {
        this.list = res.data.data
        this.total = res.data.total
      }).finally(() => {
        this.listLoading = false
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.search-table {
  .filter {
    .label {
      color: gray;
      font-size: 14px;
      margin-left: 5px;
      margin-right: 3px;
    }
    .ele-common {
      width: 200px;
      margin-right: 10px;
    }
  }
  .content {
    overflow: scroll;
    width: 100%;

    .user-table-cell {
      white-space: nowrap;
    }
  }
  .pager {
    margin-top: 20px;
    text-align: right;
    padding: 0;
  }
  .el-table::before {
    z-index: inherit;
  }
}
</style>
