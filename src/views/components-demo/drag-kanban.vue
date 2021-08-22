<template>
  <div class="board">
    <Kanban
      v-for="(item, index) in list"
      :key="index"
      :list="item.dat"
      :group="group"
      :ind="index"
      class="kanban"
      :header-text="item.title"
      @add-item="addItem"
      @del-item="delItem"
    />
  </div>
</template>
<script>
import Kanban from '@/components/Kanban'
import { getDatetimeWithFormat } from '@/utils/datetime'
import { getWorkflow, updateWorkflow } from '@/api/user'
import { deepClone } from '@/utils'

export default {
  name: 'DragKanbanDemo',
  components: {
    Kanban
  },
  data() {
    return {
      group: 'mission',
      list: [],
      backList: []
    }
  },
  computed: {
    isChange: function() {
      return JSON.stringify(this.list) !== JSON.stringify(this.backList)
    }
  },
  created() {
    getWorkflow().then((res) => {
      this.backList = deepClone(res.data)
      this.list = res.data
    })
  },
  methods: {
    addList(title) {
      this.list.push({
        title: title,
        dat: []
      })
    },
    refresh() {
      this.$confirm('刷新将会重新载入工作流，未保存的信息将被丢弃！', '确认信息', {
        distinguishCancelAndClose: true,
        confirmButtonText: '刷新',
        cancelButtonText: '取消'
      }).then(() => {
        getWorkflow().then((res) => {
          this.backList = deepClone(res.data)
          this.list = res.data
        })
      })
    },
    save() {
      updateWorkflow({ list: this.list }).then(() => {
        this.backList = deepClone(this.list)
        this.$notify({
          title: '已保存',
          message: '工作流已更新',
          type: 'success',
          duration: 3000
        })
      })
    },
    addItem(index) {
      this.$prompt('请输入工作流的标题', '', {
        confirmButtonText: '确定',
        cancelButtonText: '取消'
      }).then(({ value }) => {
        this.list[index].dat.push({
          at: getDatetimeWithFormat(new Date()),
          content: value
        })
      })
    },
    delItem(ind, index) {
      this.list[ind].dat.splice(index, 1)
    },
    isListChanged() {
      return this.isChange
    }
  }
}
</script>
<style lang="scss">
.board {
  width: 100%;
  display: flex;
  justify-content: flex-start;
  flex-direction: row;
  align-items: baseline;
  flex-wrap: wrap;
}
.kanban {
  margin: 10px;
  &.todo {
    .board-column-header {
      background: #4a9ff9;
    }
  }
  &.working {
    .board-column-header {
      background: #f9944a;
    }
  }
  &.done {
    .board-column-header {
      background: #2ac06d;
    }
  }
}
</style>

