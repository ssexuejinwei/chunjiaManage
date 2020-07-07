<template>
  <div>
    <div v-if='!isEdit'  v-loading="isLoading" class ='userlist'>
      <page-header title="用户信息管理"/>
      <el-container>
        <el-main>
          <el-table
            :data="UserTableData"
            @selection-change="handleSelect"
            highlight-current-row
            :border="true"
          >
            <el-table-column
              type="selection"
            />
            <el-table-column
              prop="name"
              label="姓名"
              align="center"
            />
            <el-table-column
              label="性别"
              align="center"
            >
              <template slot-scope="scope">
                <span v-if="scope.row.sex==1">男</span>
                <span v-if="scope.row.sex==0">女</span>
              </template>
            </el-table-column>
            <el-table-column
              prop="phone_number"
              label="联系电话"
              align="center"
            />
            <el-table-column
              prop="politics_status"
              label="政治面貌"
              align="center"
            />
            <el-table-column
              prop="address"
              label="住址"
              align="center"
            />
            <el-table-column
              prop="grid"
              label="所属网格"
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
          <div style="text-align: right;">
            <el-pagination
              layout="prev, pager, next"
              :total="total"
              :current-page.sync="cur_page"
            />
          </div>
          <el-row>
            <el-col :span="6">
              <!-- <el-button type='danger' @click='isAdd = true'>添加新用户</el-button> -->
              <el-button
              :disabled="!selectedData.length"
                @click="deleteUsers"
              >
                删除用户
              </el-button>
            </el-col>
          </el-row>
        </el-footer>
      </el-container>
    </div>
    <div v-if="isEdit" class ='userInfo'>
      <UserEdit :user='user' @update="handleEditFinish" @back="backHome"></UserEdit>
    </div>
  </div>
</template>

<script>
  //这里的跳转有问题
 
import UserEdit from './userEdit'
import Axios from 'axios'
import qs from 'querystring'

export default {
  components: {
    UserEdit
  },
  data () {
    return {
      api:'/api/user/manage/user/',
      selectedData:[],
      user:{},
      isEdit: false,
      UserTableData:[],
      isLoading:true,
      total:100,
      cur_page:1
    }
  },
  created () {
    this.getData()
  },
  watch: {
    cur_page(newValue, oldValue) {
      this.getData()
    }
  },
  methods: {
    getData () {
      this.$axios.get(this.api, {
        params: {
          page_index: this.cur_page,
        }
      }).then(response => {
        console.log(response)
        this.UserTableData = response.data.data.list
        this.total = response.data.data.page_number
      }).catch(e => {
        console.log(e)
        this.$message.error(`获取用户列表失败: ${e.message || '未知错误'}`)
        this.UserTableData = []
        this.total_page = 0
      }).finally(() => {this.isLoading = false  })
    },
    handleSelect (val) {
      this.selectedData = val
    },
    handleEditFinish (val) {
      if (val) {
        //获取新数据
        this.isEdit = false
        this.getData()
      }
    },
    backHome (val) {
      this.isEdit = val
    },
    handleEdit(index,row) {
      this.isEdit = true
      this.user = this.UserTableData[index]
      console.log(index,row)
    },
    deleteUser (user) {
      console.log('user', user)
      const data = {
        user_id: user.id
      }
      return Axios.delete(this.api, {data:qs.stringify(data)})
    },
    deleteUsers () {
      this.$confirm('是否删除选中的用户', '提示', { type: 'warning' }).then(() => {
        Promise.all(this.selectedData.map(this.deleteUser))
          .then(() => {
            this.$alert('删除成功', '成功', { type: 'success' })
            this.getData()
          }, (e) => {
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
