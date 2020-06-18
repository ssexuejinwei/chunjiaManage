<template>
  <div>
      <page-header title="网格信息管理"/>
      <el-container>
        <el-main>
          <el-table
            :data="complaintTableData"
            highlight-current-row
            :border="true"
          >
            <el-table-column
              type="selection"
            />
            <el-table-column
              prop="name"
              label="名称"
              align="center"
            />
            <el-table-column
              prop="content"
              label="详细信息"
              align="center"
            />
            <el-table-column
              prop="status"
              label="状态"
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
                  处理
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
                删除投诉
              </el-button>
            </el-col>
          </el-row>
        </el-footer>
      </el-container>
    <el-dialog
      title="投诉详情"
      :visible.sync="isEdit"
    >
      <el-form
        :model="complaintForm"
        label-width="100px"
        style="width:31.25rem;"
      >
        <el-form-item
          label="投诉具体内容"
          prop="content"
        >
          <el-input
            v-model="complaintForm.content"
            autocomplete="off"
          />
        </el-form-item>
        <el-form-item
          label="处理意见"
          prop="advice"
        >
        <el-input
          v-model="complaintForm.advice"
          autocomplete="off"
        />
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
          <el-button @click="isEdit = false">取 消</el-button>
          <el-button type="primary" @click="handleComplaint">处理完成</el-button>
        </span>
      </el-dialog>
  </div>
</template>

<script>
  //这里的跳转有问题
export default {
  data () {
    return {
      complaint:{},
      complaintForm:{
        id:'',
        content:'',
        advice:''
      },
      isEdit: false,
      complaintTableData:[]
    }
  },
  created () {
    for (let i = 0; i < 4; i ++) {
      this.complaintTableData.push({
        id:i,
        name:'投诉'+i.toString(),
        content:'物业漏水',
        status:'待处理',
      })
    }
  },
  methods: {
    handleComplaint () {
      this.isEdit = false;
      this.complaintTableData[this.complaintForm.id].status = '处理完成'
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
      this.complaint = this.complaintTableData[index]
      this.complaintForm.id = this.complaintTableData[index].id
      this.complaintForm.content = this.complaintTableData[index].content
      console.log(index,row)
    },
    deleteUser (complaint) {
      const data = {
        id: complaint.id
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
