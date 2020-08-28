<template>
  <div>
    <div v-if='!isEdit' class ='volunteerlist'>
      <page-header title="志愿活动信息管理"/>
      <el-container>
        <el-main>
          <el-table
            :data="volunteerTableData"
            @selection-change="handleSelect"
            highlight-current-row
            :border="true"
          >
            <el-table-column
              type="selection"
            />
            <el-table-column
              prop="title"
              label="活动标题"
              align="center"
            />
            <el-table-column
              prop="activity_time"
              label="活动时间"
              align="center"
            />
            <el-table-column
              prop="address"
              label="活动地点"
              align="center"
            />
            <el-table-column
              prop="publisher"
              label="发布人姓名"
              align="center"
            />
            <el-table-column
              prop="publisher_contact"
              label="发布人联系方式"
              align="center"
            />
            <el-table-column
              prop="participant_number"
              label="已报名人数"
              align="center"
            />
            <el-table-column
              prop="max_number"
              label="最大报名人数"
              align="center"
            />
            <el-table-column
              prop="status"
              label="活动状态"
              align="center"
            >
            <template slot-scope="scope">
              <span v-if="scope.row.status == 0">可报名</span>
              <span v-if="scope.row.status == 1">报名结束</span>
            </template>
            </el-table-column>
            <el-table-column
              label="操作"
              align="center"
            >
              <template slot-scope="scope">
                <el-row>
                    <el-button
                      size="medium"
                      @click="handleEdit(scope.$index,scope.row)"
                    >
                      详情
                    </el-button>
                </el-row>
                <el-row>
                    <el-button
                      size="medium"
                      @click="download(scope.$index,scope.row)"
                    >
                      下载
                    </el-button>
                </el-row>
              </template>
            </el-table-column>
          </el-table>
        </el-main>
        <el-footer>
          <el-row style="margin-top:1.5rem; ">
            <el-col :span="3">
              <el-button @click='isAdd = true'>添加活动</el-button>
            </el-col>
            <el-col :span="5">
              <el-button @click="deletevolunteers">
                删除活动
              </el-button>
            </el-col>
          </el-row>
        </el-footer>
      </el-container>
      <el-dialog
        title="活动信息"
        :visible.sync="isAdd "
      >
        <el-form
          :model="volunteerForm"
          label-width="120px"
          style="width:40rem;"
        >
          <el-form-item
            label="活动标题"
          >
            <el-input
              v-model="volunteerForm.title"
              autocomplete="off"
            />
          </el-form-item>
          <el-form-item
            label="发布人姓名"
          >
            <el-input
              v-model="volunteerForm.publisher"
              autocomplete="off"
            />
          </el-form-item>
          <el-form-item
            label="发布人联系方式"
          >
            <el-input
              v-model="volunteerForm.publisher_contact"
              autocomplete="off"
            />
          </el-form-item>
          <el-form-item
            label="活动地点"
          >
            <el-input
              v-model="volunteerForm.address"
              autocomplete="off"
            />
          </el-form-item>
          <el-form-item
            label="活动详情"
          >
          <el-input type="textarea" autosize maxlength="1000" v-model="volunteerForm.detail"> </el-input>
           <span>(1000字以内)</span>
          </el-form-item>
          <el-form-item
            label="注意事项"
          >
          <el-input type="textarea" autosize maxlength="100" v-model="volunteerForm.notice"> </el-input>
           <span>(100字以内)</span>
          </el-form-item>
		  <el-form-item
		    label="活动时间"
		  >
		     <el-date-picker
		           v-model="volunteerForm.activity_time"
		           type="date"
		           value-format="yyyy-MM-dd"
		           placeholder="日期">
		     </el-date-picker>
		  </el-form-item>
		  <el-form-item
		    label="最大报名人数"
		  >
		    <el-input
		      v-model="volunteerForm.max_number"
		      autocomplete="off"
		    />
		  </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
            <el-button @click="isAdd = false">取 消</el-button>
            <el-button type="primary" @click="addvolunteer">确 定</el-button>
          </span>
        </el-dialog>
    </div>
    <div v-if="isEdit" class ='volunteerInfo'>
      <volunteerEdit :volunteer='volunteer' @update="handleEditFinish" @back="backHome"></volunteerEdit>
    </div>
  </div>
</template>

<script>
  //这里的跳转有问题
import volunteerEdit from './volunteerEdit'
import Axios from 'axios'
import qs from 'qs'
export default {
  components: {
    volunteerEdit
  },
  data () {
    return {
      api:'/api/community/manage/activity/',
      loading:false,
      volunteer:{},
      isEdit: false,
      isAdd: false,
      volunteerTableData:[],
      volunteerForm:{},
      fileList:{},
      selectedvolunteers:[],
      date:'',
      time:''
    }
  },
  watch: {
    volunteerForm(newValue,oladValue) {
      console.log(newValue)
    }
  },
  created () {
    this.getData()
  },
  methods: {
    getData () {
      Axios.get(this.api,{
        params:{
          type:1
        }
      }).then(response => {
        this.volunteerTableData = response.data.data
      }).catch(e => {
        console.error(e)
        this.$message.error(`获取信息列表失败: ${e.message || '未知错误'}`)
        this.volunteerTableData = []
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
    download(index, row) {
      let api = '/api/community/manage/activity/download/'+this.volunteerTableData[index].id+'/'
        let link = document.createElement('a');
        link.style.display = 'none';
        link.href = 'http://47.101.181.233:8080'+api;
        document.body.appendChild(link);
        link.click();
      
    },
    handleEdit(index,row) {
      this.isEdit = true
      this.volunteer = this.volunteerTableData[index]
      console.log(index,row)
    },
    addvolunteer() {
      // console.log(this.volunteerForm)
      Axios.post(this.api, qs.stringify({
        ...this.volunteerForm,
        type:1
      }))
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
    deletevolunteer (volunteer) {
      console.log('volunteer', volunteer)
      const data = {
        id: volunteer.id,
        type:1
      }
      return Axios.delete(this.api, {data:qs.stringify(data)})
    },
    deletevolunteers () {
      this.$confirm('是否删除选中的活动', '提示', { type: 'warning' }).then(() => {
        Promise.all(this.selectedvolunteers.map(this.deletevolunteer))
          .then(() => this.$alert('删除成功', '成功', { type: 'success' }).then(()=>{
            this.getData()
          }), (e) => {
            console.error(e)
            this.$alert('删除失败', '错误', { type: 'error' })
          })
      })
    },
    handleSelect (val) {
      this.selectedvolunteers = val
    },
    handleRemove(file, fileList) {
      console.log(file, fileList);
    },
    handlePreview(file) {
      console.log(file);
      this.volunteerForm.pic = file.raw
    }
  }
}
</script>

<style lang="scss">
</style>
