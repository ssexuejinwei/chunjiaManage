<template>
  <div>
    <div v-if='!isEdit' class ='activitylist'>
      <page-header title="社区活动信息管理"/>
      <el-container>
        <el-main>
          <el-table
            :data="activityTableData"
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
            <!-- <el-table-column
              prop="status"
              label="活动状态"
              align="center"
            /> -->
            <el-table-column
              label="操作"
              align="center"
            >
              <template slot-scope="scope">
                <el-row>
                  <el-col >
                    <el-button
                      size="medium"
                      @click="handleEdit(scope.$index,scope.row)"
                    >
                      详情
                    </el-button>
                  </el-col>
                  <el-col >
                    <el-button
                      size="medium"
                      @click="download(scope.$index,scope.row)"
                    >
                      下载
                    </el-button>
                  </el-col>
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
              <el-button @click="deleteactivitys">
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
          :model="activityForm"
          label-width="140px"
          style="width:40rem;"
        >
          <el-form-item
            label="活动标题"
          >
            <el-input
              v-model="activityForm.title"
              autocomplete="off"
            />
          </el-form-item>
          <el-form-item
            label="发布人姓名"
          >
            <el-input
              v-model="activityForm.publisher"
              autocomplete="off"
            />
          </el-form-item>
          <el-form-item
            label="发布人联系方式"
          >
            <el-input
              v-model="activityForm.publisher_contact"
              autocomplete="off"
            />
          </el-form-item>
          <el-form-item
            label="活动地点"
          >
            <el-input
              v-model="activityForm.address"
              autocomplete="off"
            />
          </el-form-item>
          <el-form-item
            label="活动详情"
          >
            <el-input
              v-model="activityForm.detail"
              autocomplete="off"
            />
          </el-form-item>
          <el-form-item
            label="注意事项"
          >
            <el-input
              v-model="activityForm.notice"
              autocomplete="off"
            />
          </el-form-item>
		  <el-form-item
		    label="活动时间"
		  >
        <el-date-picker
              v-model="activityForm.activity_time"
              type="date"
              value-format="yyyy-MM-dd"
              placeholder="日期">
        </el-date-picker>
        
        <!-- <el-time-picker
            v-model="time"
            value-format="HH-mm"
            placeholder="具体时间">
        </el-time-picker> -->
		  </el-form-item>
		  <el-form-item
		    label="最大报名人数"
		  >
		    <el-input
		      v-model="activityForm.max_number"
		      autocomplete="off"
		    />
		  </el-form-item>
      <!-- <el-form-item
        label="上传图片"
      >
        <el-upload
          class="upload-demo"
          action="#"
          :on-preview="handlePreview"
          :on-remove="handleRemove"
          :file-list="fileList"
          list-type="picture">
          <el-button size="small" type="primary">点击上传</el-button>
          </el-upload>
      </el-form-item> -->
        </el-form>
        <span slot="footer" class="dialog-footer">
            <el-button @click="isAdd = false">取 消</el-button>
            <el-button type="primary" @click="addactivity">确 定</el-button>
          </span>
        </el-dialog>
    </div>
    <div v-if="isEdit" class ='activityInfo'>
      <activityEdit :activity='activity' @update="handleEditFinish" @back="backHome"></activityEdit>
    </div>
  </div>
</template>

<script>
  //这里的跳转有问题
import activityEdit from './activityEdit'
import Axios from 'axios'
import qs from 'qs'
export default {
  components: {
    activityEdit
  },
  data () {
    return {
      date:'',
      time:'',
      api:'/api/community/manage/activity/',
      loading:false,
      activity:{},
      isEdit: false,
      isAdd: false,
      activityTableData:[],
      activityForm:{},
      fileList:{},
      selectedactivitys:[]
    }
  },
  watch: {
    activityForm(newValue,oladValue) {
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
          type:0
        }
      }).then(response => {
        console.log(response.data)
        this.activityTableData = response.data.data
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
    download(index, row) {
      let api = '/community/manage/activity/download/'+index+'/'
      let link = document.createElement('a');
      link.style.display = 'none';
      link.href = 'http://47.101.181.233:8000'+api;
      document.body.appendChild(link);
      link.click();
    },
    handleEdit(index,row) {
      this.isEdit = true
      this.activity = this.activityTableData[index]
      this.activity.activity_time = this.date+this.time
      console.log(index,row)
    },
    addactivity() {
      // console.log(this.activityForm)
      console.log(this.activityForm)
      Axios.post(this.api, qs.stringify({
        ...this.activityForm,
        type:0
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
    deleteactivity (activity) {
      console.log('activity', activity)
      const data = {
        id: activity.id,
        type:0
      }
      return Axios.delete(this.api, {data:qs.stringify(data)})
    },
    deleteactivitys () {
      this.$confirm('是否删除选中的活动', '提示', { type: 'warning' }).then(() => {
        Promise.all(this.selectedactivitys.map(this.deleteactivity))
          .then(() => this.$alert('删除成功', '成功', { type: 'success' }).then(()=>{
            this.getData()
          }), (e) => {
            console.error(e)
            this.$alert('删除失败', '错误', { type: 'error' })
          })
      })
    },
    handleSelect (val) {
      this.selectedactivitys = val
    },
    handleRemove(file, fileList) {
      console.log(file, fileList);
    },
    handlePreview(file) {
      console.log(file);
      this.activityForm.pic = file.raw
    }
  }
}
</script>

<style lang="scss">
</style>
