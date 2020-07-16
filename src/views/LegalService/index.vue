<template>
  <div>
    <div v-if='!isEdit' class ='legalServicelist'>
      <page-header title="法律服务信息管理"/>
      <el-container>
        <el-main>
          <el-table
            :data="legalServiceTableData"
            @selection-change="handleSelect"
            highlight-current-row
            :border="true"
          >
            <el-table-column
              type="selection"
            />
            <el-table-column
              prop="staff"
              label="姓名"
              align="center"
            />
            <el-table-column
              prop="phone_number"
              label="联系电话"
              align="center"
            />
            <el-table-column
              prop="position"
              label="职务"
              align="center"
            />
            <el-table-column
              prop="service_time"
              label="服务时间"
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
              <el-button @click='isAdd = true'>添加法律咨询</el-button>
            </el-col>
            <el-col :span="5">
              <el-button @click="deletelegalServices">
                删除法律咨询
              </el-button>
            </el-col>
          </el-row>
        </el-footer>
      </el-container>
      <el-dialog
        title="法律咨询信息"
        :visible.sync="isAdd "
      >
        <el-form
          :model="legalServiceForm"
          label-width="100px"
          style="width:31.25rem;"
        >
          <el-form-item
            label="姓名"
            prop="staff"
          >
            <el-input
              v-model="legalServiceForm.name"
              autocomplete="off"
            />
          </el-form-item>
          <el-form-item
            label="联系电话"
          >
          <el-input
            v-model="legalServiceForm.phone_number"
            autocomplete="off"
          />
          </el-form-item>
          <el-form-item
            label="职位"
          >
          <el-input
            v-model="legalServiceForm.position"
            autocomplete="off"
          />
          </el-form-item>
          <el-form-item
            label="服务时间"
          >
          <el-input
            v-model="legalServiceForm.service_time"
            autocomplete="off"
          />
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
            <el-button @click="isAdd = false">取 消</el-button>
            <el-button type="primary" @click="addlegalService">确 定</el-button>
          </span>
        </el-dialog>
    </div>
    <div v-if="isEdit" class ='legalServiceInfo'>
      <legalServiceEdit :legalService='legalService' @update="handleEditFinish" @back="backHome"></legalServiceEdit>
    </div>
  </div>
</template>

<script>
  //这里的跳转有问题
import legalServiceEdit from './legalServiceEdit'
import Axios from 'axios'
import qs from 'querystring'
export default {
  components: {
    legalServiceEdit
  },
  data () {
    return {
      api:'/api/community/manage/legal_service/',
      imageUrl:'',
      selectedlegalServices:[],
      legalService:{},
      isEdit: false,
      isAdd: false,
      legalServiceTableData:[],
      legalServiceForm:{}
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
		    this.legalServiceTableData = response.data.data
		  }).catch(e => {
		    console.error(e)
		    this.$message.error(`获取信息列表失败: ${e.message || '未知错误'}`)
		    this.legalServiceTableData = []
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
      this.legalService = this.legalServiceTableData[index]
      console.log(index,row)
    },
    addlegalService() {
      // console.log(this.legalServiceForm)
      Axios.post(this.api, qs.stringify(this.legalServiceForm))
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
    deletelegalService (legalService) {
      console.log('legalService', legalService)
      const data = {
        id: legalService.id
      }
      return this.$axios.delete(this.api, {data:qs.stringify(data)})
    },
    deletelegalServices () {
      this.$confirm('是否删除选中的数据', '提示', { type: 'warning' }).then(() => {
        Promise.all(this.selectedlegalServices.map(this.deletelegalService))
          .then(() => this.$alert('删除成功', '成功', { type: 'success' }).then(()=>{
            this.getData()
          }), (e) => {
            console.error(e)
            this.$alert('删除失败', '错误', { type: 'error' })
          })
      })
    },
    handleSelect (val) {
      this.selectedlegalServices = val
    },
    handleAvatarSuccess(res, file) {
      this.legalServiceForm.avatar = URL.createObjectURL(file.raw);
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
