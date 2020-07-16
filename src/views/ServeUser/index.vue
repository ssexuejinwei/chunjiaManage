<template>
  <div>
    <div v-if='!isEdit' class ='serveUserlist'>
      <page-header title="服务人员信息管理"/>
      <el-container>
        <el-main>
          <el-table
            :data="serveUserTableData"
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
              prop="phone_number"
              label="联系电话"
              align="center"
            />
            <el-table-column
              prop="duty"
              label="职位"
              align="center"
            />
            <el-table-column
              prop="company"
              label="公司/社区"
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
          <el-row style="margin-top:1.5rem; ">
            <el-col :span="3">
              <el-button @click='isAdd = true'>添加服务人员</el-button>
            </el-col>
            <el-col :span="5">
              <el-button @click="deleteserveUsers">
                删除服务人员
              </el-button>
            </el-col>
          </el-row>
        </el-footer>
      </el-container>
      <el-dialog
        title="服务人员信息"
        :visible.sync="isAdd "
      >
        <el-form
          :model="serveUserForm"
          label-width="100px"
          style="width:31.25rem;"
        >
          <!-- <el-form-item label="头像">
            <el-upload
              class="avatar-uploader"
              action="#"
              :show-file-list="false"
              :on-success="handleAvatarSuccess"
              >
              <img v-if="imageUrl" :src="imageUrl" class="avatar">
              <i v-else class="el-icon-plus avatar-uploader-icon"></i>
            </el-upload>
          </el-form-item> -->
          <el-form-item
            label="姓名"
            prop="name"
          >
            <el-input
              v-model="serveUserForm.name"
              autocomplete="off"
            />
          </el-form-item>
          <el-form-item
            label="联系电话"
            prop="phone_number"
          >
          <el-input
            v-model="serveUserForm.phone_number"
            autocomplete="off"
          />
          </el-form-item>
          <el-form-item
            label="职位"
            prop="duty"
          >
          <el-input
            v-model="serveUserForm.duty"
            autocomplete="off"
          />
          </el-form-item>
          <el-form-item
            label="公司/社区"
            prop="company"
          >
          <el-input
            v-model="serveUserForm.company"
            autocomplete="off"
          />
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
            <el-button @click="isAdd = false">取 消</el-button>
            <el-button type="primary" @click="addserveUser">确 定</el-button>
          </span>
        </el-dialog>
    </div>
    <div v-if="isEdit" class ='serveUserInfo'>
      <serveUserEdit :serveUser='serveUser' @update="handleEditFinish" @back="backHome"></serveUserEdit>
    </div>
  </div>
</template>

<script>
  //这里的跳转有问题
import serveUserEdit from './serveUserEdit'
import Axios from 'axios'
import qs from 'querystring'
export default {
  components: {
    serveUserEdit
  },
  data () {
    return {
      api:'/api/community/manage/service_group/',
      imageUrl:'',
      selectedserveUsers:[],
      serveUser:{},
      isEdit: false,
      isAdd: false,
      serveUserTableData:[],
      serveUserForm:{
        name:'',
        sex:'',
        tel:'',
        IDNumber:'',
        grid:''
      }
    }
  },
  watch: {
  },
  created () {
    this.getData()
  },
  methods: {
		getData () {
		  Axios.get(this.api).then(response => {
		    this.serveUserTableData = response.data.data
		  }).catch(e => {
		    console.error(e)
		    this.$message.error(`获取信息列表失败: ${e.message || '未知错误'}`)
		    this.serveUserTableData = []
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
      this.serveUser = this.serveUserTableData[index]
      console.log(index,row)
    },
    addserveUser() {
      // console.log(this.serveUserForm)
      Axios.post(this.api, qs.stringify(this.serveUserForm))
        .then(() => {
          this.$alert('添加成功', '成功').then(() => {
            this.getData()
            this.isAdd = false
          })
        }).catch(e => {
          console.error(e)
          this.$alert(`错误原因: ${e.message || '未知错误'}`, '添加失败')
        })
    },
    deleteserveUser (serveUser) {
      console.log('serveUser', serveUser)
      const data = {
        id: serveUser.id
      }
      return this.$axios.delete(this.api, {data:qs.stringify(data)})
    },
    deleteserveUsers () {
      this.$confirm('是否删除选中的服务人员', '提示', { type: 'warning' }).then(() => {
        Promise.all(this.selectedserveUsers.map(this.deleteserveUser))
          .then(() => this.$alert('删除成功', '成功', { type: 'success' }).then(()=>{
            this.getData()
          }), (e) => {
            console.error(e)
            this.$alert('删除失败', '错误', { type: 'error' })
          })
      })
    },
    handleSelect (val) {
      this.selectedserveUsers = val
    },
    handleAvatarSuccess(res, file) {
      this.serveUserForm.avatar = URL.createObjectURL(file.raw);
    },
  }
}
</script>

<style lang="scss" scoped>
.avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }
  .avatar-uploader .el-upload:hover {
    border-color: #409EFF;
  }
  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 178px;
    height: 178px;
    line-height: 178px;
    text-align: center;
  }
  .avatar {
    width: 178px;
    height: 178px;
    display: block;
  }
</style>
