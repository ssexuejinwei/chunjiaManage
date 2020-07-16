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
              label="联系电话"
              align="center"
            >
            <template slot-scope="scope">
              <span>{{scope.row.reporter.phone_number}} </span>
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
    <div v-if="isEdit" class ='reportInfo'>
      <reportEdit :report='report' @update="handleEditFinish" @back="backHome"></reportEdit>
    </div>
  </div>
</template>

<script>
  //这里的跳转有问题
import reportEdit from './reportEdit'
import Axios from 'axios'
import qs from 'qs'
export default {
  components: {
    reportEdit
  },
  data () {
    return {
      api:'/api/community/manage/report/',
      report:{},
      isEdit: false,
      isAdd: false,
      reportTableData:[],
      reportForm:{}
    }
  },
  created () {
    this.getData()
  },
  methods: {
    getData () {
      Axios.get(this.api).then(response => {
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
        this.getData()
        this.isEdit = false
      }
    },
    backHome (val) {
      this.isEdit = val
      this.getData()
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
      return this.$axios.delete(this.api, {data:qs.stringify(data)})
    },
    deletereports () {
      this.$confirm('是否删除选中的微信息', '提示', { type: 'warning' }).then(() => {
        Promise.all(this.selectedreports.map(this.deletereport))
          .then(() => this.$alert('删除成功', '成功', { type: 'success' }), (e) => {
            console.error(e)
            this.$alert('删除失败', '错误', { type: 'error' })
          })
      })
    }
  }
}
</script>

<style lang="scss">
</style>
