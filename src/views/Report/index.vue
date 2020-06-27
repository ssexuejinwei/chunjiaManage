<template>
  <div>
    <div v-if='!isEdit' class ='reportlist'>
      <page-header title="报事管理"/>
      <el-container>
        <el-main>
          <el-table
            :data="reportTableData"
            highlight-current-row
            :border="true"
          >
            <el-table-column
              type="selection"
            />
            <el-table-column
              prop="title"
              label="报事名称"
              align="center"
            />
            <el-table-column
              label="类型"
              align="center"
            >
            <template slot-scope="scope">
              <span v-if="reportTableData[scope.$index].type==0"> 群众报事</span>
              <span v-else> 企业报事</span>
            </template>
            </el-table-column>
            <el-table-column
              label="报事人"
              align="center"
            >
              <template slot-scope="scope">
                <span>{{scope.row.reporter.name}} </span>
              </template>
            </el-table-column>
            <el-table-column
              label="报给"
              align="center"
            >
              <template slot-scope="scope">
                <span>{{scope.row.report_to.name}} </span>
              </template>
            </el-table-column>
            <el-table-column
              prop="ID_number"
              label="身份证号"
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
        </el-footer>
      </el-container>
    </div>
    <div v-if="isEdit" class ='reportInfo'>
      <reportEdit :report='report' @update="handleEditFinish" @back="backHome"></reportEdit>
    </div>
  </div>
</template>

<script>
  //这里的跳转有问题
import reportEdit from './reportEdit'
export default {
  components: {
    reportEdit
  },
  data () {
    return {
      report:{},
      isEdit: false,
      isAdd: false,
      reportTableData:[],
      reportForm:{}
    }
  },
  created () {
    for (let i = 0; i < 4; i ++) {
      this.reportTableData.push({
        id:i,
        name:'漏水',
        title:'议题标题1',
        type:1,
        content:'17号209室一直漏水',
        position:"17号楼",
        status:1,
        grid:'永嘉网格-王可欣',
        IDNumber:'123141525351213'
      })
    }
  },
  methods: {
    getData () {
      Axios.get('getUs').then(response => {
        this.reportTableData = response.data.data
      }).catch(e => {
        console.error(e)
        this.$message.error(`获取信息列表失败: ${e.message || '未知错误'}`)
        this.activityTableData = []
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
      this.report = this.reportTableData[index]
      console.log(index,row)
    },
    addreport() {
      this.isAdd = false
    },
    deletereport (report) {
      console.log('report', report)
      const data = {
        id: report.id
      }
      // return this.$axios.post('/sellerctr/deleteParents', qs.stringify(data))
    },
    deletereports () {
      this.$confirm('是否删除选中的微信息', '提示', { type: 'warning' }).then(() => {
        Promise.all(this.selectedreports.map(this.deletereport))
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
