<template>
  <div>
    <div v-if='!isEdit' class ='gridlist'>
      <page-header title="网格信息管理"/>
      <el-container>
        <el-main>
          <el-table
            :data="gridTableData"
            highlight-current-row
            :border="true"
          >
            <el-table-column
              type="selection"
            />
            <el-table-column
              prop="name"
              label="网格"
              align="center"
            />
            <el-table-column
              prop="gridLeader"
              label="网格长"
              align="center"
            />
            <el-table-column
              prop="gridPerson"
              label="网格员"
              align="center"
            />
            <el-table-column
              prop="teamLeader"
              label="居民组长"
              align="center"
            />
            <el-table-column
              prop="police"
              label="辅警"
              align="center"
            />
            <el-table-column
              prop="party"
              label="党员先锋户"
              align="center"
            />
            <el-table-column
              label="操作"
              align="center"
            >
              <template slot-scope="scope">
                <el-button
                  size="medium"
                  @click="handleEdit(scope.$index,scope.row)"
                >
                  详情
                </el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-main>
        <el-footer>
          <el-row>
            <el-col :span="6">
              <!-- <el-button type='danger' @click='isAdd = true'>添加新用户</el-button> -->
              <el-button
                @click="deleteUsers"
              >
                删除网格
              </el-button>
            </el-col>
          </el-row>
        </el-footer>
      </el-container>
    </div>
    <div v-if="isEdit" class ='userInfo'>
      <GridEdit :grid='grid' @update="handleEditFinish" @back="backHome"></GridEdit>
    </div>
  </div>
</template>

<script>
  //这里的跳转有问题
import GridEdit from './gridEdit'
export default {
  components: {
    GridEdit
  },
  data () {
    return {
      grid:{},
      isEdit: false,
      gridTableData:[]
    }
  },
  created () {
    for (let i = 0; i < 4; i ++) {
      this.gridTableData.push({
        id:i,
        name:'永嘉网格',
        gridLeader:'张三',
        gridPerson:'赵四',
        teamLeader:'王五',
        police:'李警官',
        party:'张三'
      })
    }
  },
  methods: {
    handleEditFinish (val) {
      if (val) {
        //获取新数据
        this.isEdit = false
      }
    },
    backHome (val) {
      this.isEdit = val
    },
    handleEdit(index,row) {
      this.isEdit = true
      this.grid = this.gridTableData[index]
      console.log(index,row)
    },
    deleteUser (grid) {
      const data = {
        id: grid.id
      }
      // return this.$axios.post('/sellerctr/deleteParents', qs.stringify(data))
    },
    deleteUsers () {
      this.$confirm('是否删除选中的网格', '提示', { type: 'warning' }).then(() => {
        Promise.all(this.selectedUsers.map(this.deleteUser))
          .then(() => this.$alert('删除成功', '成功', { type: 'success' }), (e) => {
            console.error(e)
            this.$alert('删除失败', '错误', { type: 'error' })
          })
          .then()
      })
    }
  }
}
</script>

<style lang="scss">
$Green: #69bc38;
$Gray: #cdcdcb;
$Red : #92535e;
$pink : #FE8083;
.teachHeader  {
  padding: 0.5rem 1rem;
  margin-bottom: 2rem;
  background: $pink;
  display: flex;
  justify-content: space-between;

  a {
    color: inherit;
    text-decoration: none;
  }

  h1 {
    font-size: 1rem;
    margin: 0;
  }
}
  .chooseMenu{
    margin-left: 1.25rem;
    width:12.5rem;
    box-shadow: 0 2px 4px rgba(0, 0, 0, .12), 0 0 6px rgba(0, 0, 0, .04)
  }
  .chooseMenu .el-menu-item.is-active {
    background-color: $Green ;
    font-size: x-large !important;
    border: 1px solid !important;
  }
</style>
