<template>
  <div>
    <div v-if='!isEdit' class ='medicalServicelist'>
      <page-header title="医疗服务信息管理"/>
      <el-container>
        <el-main>
          <el-table
            :data="medicalServiceTableData"
            @selection-change="handleSelect"
            highlight-current-row
            :border="true"
          >
            <el-table-column
              type="selection"
            />
            <el-table-column
              prop="doctor"
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
              label="职位"
              align="center"
            />
            <el-table-column
              prop="skill"
              label="擅长"
              align="center"
            />
            <el-table-column
              prop="service_address"
              label="地点"
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
              <el-button @click='isAdd = true'>添加医疗服务</el-button>
            </el-col>
            <el-col :span="5">
              <el-button @click="deletemedicalServices">
                删除医疗服务
              </el-button>
            </el-col>
          </el-row>
        </el-footer>
      </el-container>
      <el-dialog
        title="医疗服务信息"
        :visible.sync="isAdd "
      >
        <el-form
          :model="medicalServiceForm"
          label-width="100px"
          style="width:31.25rem;"
        >
          <el-form-item
            label="姓名"
          >
            <el-input
              v-model="medicalServiceForm.name"
              autocomplete="off"
            />
          </el-form-item>
          <el-form-item
            label="联系电话"
          >
          <el-input
            v-model="medicalServiceForm.phone_number"
            autocomplete="off"
          />
          </el-form-item>
          <el-form-item
            label="职位"
          >
          <el-input
            v-model="medicalServiceForm.position"
            autocomplete="off"
          />
          </el-form-item>
          <el-form-item
            label="擅长"
          >
          <el-input
            v-model="medicalServiceForm.skill"
            autocomplete="off"
          />
          </el-form-item>
          <el-form-item
            label="地点"
          >
          <el-input
            v-model="medicalServiceForm.service_address"
            autocomplete="off"
          />
          </el-form-item>
          <el-form-item
            label="服务时间"
          >
          <el-input
            v-model="medicalServiceForm.service_time"
            autocomplete="off"
          />
          </el-form-item>
          
        </el-form>
        <span slot="footer" class="dialog-footer">
            <el-button @click="isAdd = false">取 消</el-button>
            <el-button type="primary" @click="addmedicalService">确 定</el-button>
          </span>
        </el-dialog>
    </div>
    <div v-if="isEdit" class ='medicalServiceInfo'>
      <medicalServiceEdit :medicalService='medicalService' @update="handleEditFinish" @back="backHome"></medicalServiceEdit>
    </div>
  </div>
</template>

<script>
  //这里的跳转有问题
import medicalServiceEdit from './medicalServiceEdit'
import Axios from 'axios'
import qs from 'querystring'
export default {
  components: {
    medicalServiceEdit
  },
  data () {
    return {
      api:'/api/community/manage/medical_service/',
      imageUrl:'',
      selectedmedicalServices:[],
      medicalService:{},
      isEdit: false,
      isAdd: false,
      medicalServiceTableData:[],
      medicalServiceForm:{}
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
		    this.medicalServiceTableData = response.data.data
		  }).catch(e => {
		    console.error(e)
		    this.$message.error(`获取信息列表失败: ${e.message || '未知错误'}`)
		    this.medicalServiceTableData = []
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
      this.medicalService = this.medicalServiceTableData[index]
      console.log(index,row)
    },
    addmedicalService() {
      // console.log(this.medicalServiceForm)
      Axios.post(this.api, qs.stringify(this.medicalServiceForm))
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
    deletemedicalService (medicalService) {
      console.log('medicalService', medicalService)
      const data = {
        id: medicalService.id
      }
      return this.$axios.delete(this.api, {data:qs.stringify(data)})
    },
    deletemedicalServices () {
      this.$confirm('是否删除选中的数据', '提示', { type: 'warning' }).then(() => {
        Promise.all(this.selectedmedicalServices.map(this.deletemedicalService))
          .then(() => this.$alert('删除成功', '成功', { type: 'success' }).then(()=>{
            this.getData()
          }), (e) => {
            console.error(e)
            this.$alert('删除失败', '错误', { type: 'error' })
          })
      })
    },
    handleSelect (val) {
      this.selectedmedicalServices = val
    },
    handleAvatarSuccess(res, file) {
      this.medicalServiceForm.avatar = URL.createObjectURL(file.raw);
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
