<template>
  <div>
      <page-header title="投诉建议管理"/>
      <el-container>
        <el-main>
          <el-table
            :data="complaintTableData"
            @selection-change="handleSelect"
            highlight-current-row
            :border="true"
          >
            <el-table-column
              type="selection"
            />
            <el-table-column
              label="投诉人"
              align="center"
            >
              <template slot-scope="scope">
                <span>{{complaintTableData[scope.$index].user.name}}</span>
              </template>
            </el-table-column>
            <el-table-column
              label="联系电话"
              align="center"
            >
            <template slot-scope="scope">
              <span>{{complaintTableData[scope.$index].user.phone_number}}</span>
            </template>
            </el-table-column>
            <el-table-column
              prop="title"
              label="标题"
              align="center"
            />
            <el-table-column
              prop="content"
              label="详细信息"
              align="center"
            />
            <el-table-column
              label="状态"
              align="center"
            >
              <template slot-scope="scope">
                <span v-if="scope.row.status==0">未处理</span>
                <span v-if="scope.row.status==1">已处理</span>
                <span v-if="scope.row.status==2">不予受理</span>
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
        :model="complaint"
        label-width="100px"
        style="width:31.25rem;"
      >
        <el-form-item
          label="反馈"
          prop="feedback"
        >
        <el-input type="textarea" autosize maxlength="100" v-model="complaint.feedback"> </el-input>
        <span>(100字以内)</span>
        </el-form-item>
        <el-form-item
          label="状态"
          prop="advice"
        >
          <el-radio-group v-model="complaint.status">
            <el-radio :label="0">未处理</el-radio>
            <el-radio :label="1">已处理</el-radio>
            <el-radio :label="2">不予受理</el-radio>
        </el-radio-group>
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
import Axios from 'axios'
import qs from 'qs'
  //这里的跳转有问题
export default {
  data () {
    return {
      api:'/api/community/manage/complaint/',
      selectedUsers:[],
      dealIndex:1,
      complaint:{},
      complaintForm:{},
      isEdit: false,
      complaintTableData:[]
    }
  },
  created () {
    this.getData()
  },
  methods: {
    getData () {
      Axios.get(this.api).then(response => {
        this.complaintTableData = response.data.data
      }).catch(e => {
        console.error(e)
        this.$message.error(`获取信息列表失败: ${e.message || '未知错误'}`)
        this.complaintTableData = []
      }).finally(() => { this.loading = false })
    },
    handleComplaint () {
      this.isEdit = false;
      Axios.post(this.api, qs.stringify({
        id:this.complaint.id,
        feedback:this.complaint.feedback,
        status:this.complaint.status
      }))
        .then(() => {
          this.$alert('处理完成', '成功').then(() => {
            this.getData()
            this.isAdd = false
          })
        }).catch(e => {
          console.error(e)
          this.$alert(`错误原因: ${e.message || '未知错误'}`, '添加失败')
        })
    },
    handleEdit(index,row) {
      this.isEdit = true
      this.complaint = this.complaintTableData[index]
      this.complaintForm.id = this.complaintTableData[index].id
      this.complaintForm.content = this.complaintTableData[index].content
    },
    deleteUser (complaint) {
      const data = {
        id: complaint.id
      }
      return this.$axios.delete(this.api, {data:qs.stringify(data)})
    },
    deleteUsers () {
      this.$confirm('是否删除选中的网格', '提示', { type: 'warning' }).then(() => {
        Promise.all(this.selectedUsers.map(this.deleteUser))
          .then(() => this.$alert('删除成功', '成功', { type: 'success' }).then(()=>{
            this.getData()
          }), (e) => {
            console.error(e)
            this.$alert('删除失败', '错误', { type: 'error' })
          })
      })
    },
    handleSelect (val) {
      this.selectedUsers = val
    }
  }
}
</script>

<style lang="scss">
</style>
