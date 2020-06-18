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
              prop="name"
              label="报事名称"
              align="center"
            />
            <el-table-column
              label="类型"
              align="center"
            >
            <template slot-scope="scope">
              <p v-if="reportTableData[scope.$index].type==1"> 群众报事</p>
              <p v-else> 企业报事</p>
            </template>
            </el-table-column>
            <el-table-column
              prop="grid"
              label="报给"
              align="center"
            />
            <el-table-column
              prop="position"
              label="位置"
              align="center"
            />
            <el-table-column
              label="状态"
              align="center"
            >
            <template slot-scope="scope">
              <p v-if="reportTableData[scope.$index].status==1"> 待解决</p>
              <p v-else> 已解决</p>
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
          <!-- <el-row style="margin-top:1.5rem; ">
            <el-col :span="3">
              <el-button @click='isAdd = true'>添加微信息</el-button>
            </el-col>
            <el-col :span="5">
              <el-button @click="deletereports">
                删除微信息
              </el-button>
            </el-col>
          </el-row> -->
        </el-footer>
      </el-container>
    <!--  <el-dialog
        title="报事"
        :visible.sync="isAdd "
      >
        <el-form
          :model="reportForm"
          label-width="100px"
          style="width:31.25rem;"
        >
          <el-form-item
            label="标题"
            prop="title"
          >
            <el-input
              v-model="reportForm.title"
              autocomplete="off"
            />
          </el-form-item>
          <el-form-item
            label="具体内容"
            prop="content"
          >
            <el-input
              v-model="reportForm.content"
              autocomplete="off"
            />
          </el-form-item>
          <el-form-item
            label="时间截点"
            prop="date"
          >
            <el-input
              v-model="reportForm.date"
              autocomplete="off"
            />
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
            <el-button @click="isAdd = false">取 消</el-button>
            <el-button type="primary" @click="addreport">确 定</el-button>
          </span>
        </el-dialog> -->
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
