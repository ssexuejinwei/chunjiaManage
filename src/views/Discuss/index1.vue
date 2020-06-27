<template>
  <div>
    <div v-if='!isEdit' class ='suggestlist'>
      <page-header title="用户提议管理"/>
      <el-container>
        <el-main>
          <el-table
            :data="suggestTableData"
            highlight-current-row
            :border="true"
          >
            <el-table-column
              type="selection"
            />
            <el-table-column
              prop="name"
              label="提议人"
              align="center"
            />
            <el-table-column
              prop="phone_number"
              label="联系方式"
              align="center"
            />
            <el-table-column
              prop="title"
              label="提议标题"
              align="center"
            />
            <el-table-column
              label="提议类型"
              align="center"
            >
              <template slot-scope="scope">
                <span>{{scope.row.type}}</span>
              </template>
            </el-table-column>
            <el-table-column
              prop="content"
              label="提议内容"
              align="center"
            />
            <el-table-column
              label="提议状态"
              align="center"
            >
              <template slot-scope="scope">
                <span v-if="scope.row.status == 0">刚上传</span>
                <span v-if="scope.row.status == 1">已发布</span>
              </template>
            </el-table-column>
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
        </el-footer>
      </el-container>
    </div>
    <div v-if="isEdit" class ='suggestInfo'>
      <suggestEdit :suggest='suggest' @update="handleEditFinish" @back="backHome"></suggestEdit>
    </div>
  </div>
</template>

<script>
  //这里的跳转有问题
import suggestEdit from './suggestEdit'
export default {
  components: {
    suggestEdit
  },
  data () {
    return {
      suggest:{},
      isEdit: false,
      isAdd: false,
      suggestTableData:[],
      suggestForm:{}
    }
  },
  created () {
    for (let i = 0; i < 4; i ++) {
      this.suggestTableData.push({
        id:i,
        name:'赵四',
        tel:'13823012412',
        title:'议题标题1',
        type:'社区大事',
        content:'如何在疫情期间分发口罩',
        date:'2020年6月',
      })
    }
  },
  methods: {
    getData () {
      Axios.get('getUs',{
        params:{
          tag:0
        }
      }).then(response => {
        this.suggestTableData = response.data.data
      }).catch(e => {
        console.error(e)
        this.$message.error(`获取信息列表失败: ${e.message || '未知错误'}`)
        this.suggestTableData = []
      }).finally(() => { this.loading = false })
    },
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
      this.suggest = this.suggestTableData[index]
      console.log(index,row)
    },
    addsuggest() {
      this.isAdd = false
    },
    deletesuggest (suggest) {
      console.log('suggest', suggest)
      const data = {
        id: suggest.id
      }
      // return this.$axios.post('/sellerctr/deleteParents', qs.stringify(data))
    },
    deletesuggests () {
      this.$confirm('是否删除选中的微信息', '提示', { type: 'warning' }).then(() => {
        Promise.all(this.selectedsuggests.map(this.deletesuggest))
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
</style>
