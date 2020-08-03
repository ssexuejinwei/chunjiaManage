<template>
  <div>
    <div v-if='!isEdit'class ='communityInfolist'>
     <page-header title="服务人员信息管理"/> 
     
      <div class="type">
        <el-radio-group v-model="type">
          <el-radio-button label="0">
            社区简介
          </el-radio-button>
          <el-radio-button label="1">
            党员部委
          </el-radio-button>
          <el-radio-button label="2">
            党员支部
          </el-radio-button>
          <el-radio-button label="3">
            流动蜂小巢
          </el-radio-button>
        </el-radio-group>
      </div>
      <el-container v-loading="isLoading"  v-if="type == 0">
        <el-main>
          <el-input type="textarea" autosize maxlength="1500" v-model="profile.content" :disabled="!profileEdit"></el-input>
          <span v-if="profileEdit" >(1500字以内)</span><br/>
          <el-row style="margin-top:1.5rem; ">
            <el-col :span="3">
              <el-button @click='profileEdit=true'>修改</el-button>
            </el-col>
            <el-col :span="5">
              <el-button @click="saveProfile">
                保存
              </el-button>
            </el-col>
          </el-row>
        </el-main>
        <el-footer>
        </el-footer>
      </el-container>
      <el-container v-loading="isLoading"  v-if="type == 3">
        <el-main>
          <el-form>
            <el-form-item>
              <el-upload
                action="#"
                ref="upload"
                list-type="picture-card"
                :file-list="fileList"
                :on-remove="handleRemove"
                :on-change="handleChange"
                :auto-upload="false"
                >
                 <i class="el-icon-plus"></i>
              </el-upload>
            </el-form-item>
            <el-form-item>
              <el-input type="textarea" autosize maxlength="1500" v-model="flowNest.content" :disabled="!flowNestEdit"></el-input>
              <span v-if="flowNestEdit">(1500字以内)</span> 
            </el-form-item>
            
          </el-form>
          <el-row style="margin-top:1.5rem; ">
            <el-col :span="3">
              <el-button @click='flowNestEdit=true'>修改</el-button>
            </el-col>
            <el-col :span="5">
              <el-button @click="saveProfile">
                保存
              </el-button>
            </el-col>
          </el-row>
        </el-main>
        <el-footer>
        </el-footer>
      </el-container>
      <el-container  v-loading="isLoading"  v-if="type==1||type==2">
        <el-main>
          <el-table
            v-show="type == 1"
            :data="communityInfoTableData"
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
              prop="duty"
              label="职位"
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
          <el-table
            v-show="type == 2"
            :data="communityInfoTableData"
            @selection-change="handleSelect"
            highlight-current-row
            :border="true"
          >
            <el-table-column
              type="selection"
            />
            <el-table-column
              prop="name"
              label="支部名"
              align="center"
            />
            <el-table-column
              prop="chairman"
              label="支部书记"
              align="center"
            />
            <el-table-column
              prop="phone_number"
              label="联系电话"
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
            <el-col :span="5">
              <el-button @click='isAdd = true'>添加</el-button>
            </el-col>
            <el-col :span="5">
              <el-button @click="deletecommunityInfos">
                删除
              </el-button>
            </el-col>
          </el-row>
        </el-footer>
      </el-container>
      <el-dialog
        title="填写信息"
        :visible.sync="isAdd "
      >
        <el-form
          v-if="type==1"
          :model="communityInfoForm"
          label-width="100px"
          style="width:31.25rem;"
        >
          <el-form-item
            label="姓名"
            prop="name"
          >
            <el-input
              v-model="communityInfoForm.name"
              autocomplete="off"
            />
          </el-form-item>
          <el-form-item
            label="职位"
            prop="duty"
          >
            <el-input
              v-model="communityInfoForm.duty"
              autocomplete="off"
            />
          </el-form-item>
        </el-form>
        <el-form
          v-if="type==2"
          :model="communityInfoForm"
          label-width="100px"
          style="width:31.25rem;"
        >
          <el-form-item
            label="支部名"
            prop="name"
          >
            <el-input
              v-model="communityInfoForm.name"
              autocomplete="off"
            />
          </el-form-item>
          <el-form-item
            label="支部书记"
            prop="chairman"
          >
            <el-input
              v-model="communityInfoForm.chairman"
              autocomplete="off"
            />
          </el-form-item>
          <el-form-item
            label="联系电话"
            prop="phone_number"
          >
            <el-input
              v-model="communityInfoForm.phone_number"
              autocomplete="off"
            />
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
            <el-button @click="isAdd = false">取 消</el-button>
            <el-button type="primary" @click="addcommunityInfo">确 定</el-button>
          </span>
        </el-dialog>
    </div>
    <div v-if="isEdit" class ='communityInfo'>
      <communityInfoEdit :type = 'type' :communityInfo='communityInfo' @update="handleEditFinish" @back="backHome"></communityInfoEdit>
    </div>
  </div>
</template>

<script>
import communityInfoEdit from './communityInfoEdit'
import Axios from 'axios'
import qs from 'querystring'
export default {
  components: {
    communityInfoEdit
  },
  data () {
    return {
      baseURL:'https://www.cjshequ.top:8000/',
      api_intro:'/api/community/manage/community_intro/',
      api_flow:'/api/community/manage/flow_honeycomb/',
      api_com:'/api/community/manage/commission/',
      api_party:'/api/community/manage/party_branch/',
      api_upload:'/api/community/manage/flow_honeycomb/upload/',
      api_delete:'/api/community/manage/flow_honeycomb/delete/',
      selectedcommunityInfos:[],
      isLoading:true,
      profileEdit:false,
      flowNestEdit:false,
      type:0,
      profile:{},
      flowNest:'',
      communityInfo:{},
      isEdit: false,
      isAdd: false,
      communityInfoTableData:[],
      communityInfoForm:{
        name:'',
        sex:'',
        tel:'',
        IDNumber:'',
        grid:''
      },
      images:[],
      fileList:[],
    }
  },
  watch: {
    type(newValue,oldValue) {
      this.getData()
    }
  },
  created () {
    this.getData()
  },
  methods: {
    handleChange(file, fileList) {
      // this.images = fileList
      // console.log(this.images)
      this.images.push(file)
    },
    handleSelect (val) {
      this.selectedcommunityInfos = val
    },
    getData () {
      console.log('type',this.type)
      this.fileList=[]
      if(this.type == 0 ){
        Axios.get(this.api_intro).then(response => {
          this.profile = response.data.data
        }).catch(e => {
          console.error(e)
          this.$message.error(`获取信息列表失败: ${e.message || '未知错误'}`)
          this.profile = []
        }).finally(() => { this.isLoading = false })
      }
      else if (this.type == 3) {
        Axios.get(this.api_flow).then(response => {
          this.flowNest = response.data.data
          this.flowNest.images.forEach((value,index) => {
            this.fileList.push({
              id: value.id,
              url: this.baseURL+value.url,
            })
          })
          console.log(response.data)
        }).catch(e => {
          console.error(e)
          this.$message.error(`获取信息列表失败: ${e.message || '未知错误'}`)
          this.flowNest = []
        }).finally(() => { this.isLoading = false })
      }
      else if (this.type == 1) {
        Axios.get(this.api_com).then(response => {
          this.communityInfoTableData = response.data.data
        }).catch(e => {
          console.error(e)
          this.$message.error(`获取信息列表失败: ${e.message || '未知错误'}`)
          this.communityInfoTableData = []
        }).finally(() => { this.isLoading = false })
      }
      else{
        Axios.get(this.api_party).then(response => {
          this.communityInfoTableData = response.data.data
        }).catch(e => {
          console.error(e)
          this.$message.error(`获取信息列表失败: ${e.message || '未知错误'}`)
          this.profile = []
        }).finally(() => { this.isLoading = false })
      }
    },
    saveProfile() {
      console.log(this.type)
      if(this.type === 0 ){
        Axios.put(this.api_intro, qs.stringify({
          id:this.profile.id,
          content:this.profile.content
        }))
          .then(() => {
            this.$alert('保存成功', '成功').then(() => {
              this.profileEdit = false
              this.getData()
            })
          }).catch(e => {
            console.error(e)
            this.$alert(`错误原因: ${e.message || '未知错误'}`, '保存失败')
          })
      }
      else{
        let formData = new FormData()
        this.images.forEach((value,index) =>{
          // console.log(value.raw)
          formData.append('images',value.raw)
        })
        
        formData.append('id',this.flowNest.id)
        this.images = []
        this.fileList = []
        Axios.post(this.api_upload,formData).then(response =>{
          console.log(response)
        }).then( () =>{
          Axios.put(this.api_flow, qs.stringify({
            id:this.flowNest.id,
            content:this.flowNest.content
          }))
            .then(() => {
              this.$alert('保存成功', '成功').then(() => {
                this.flowNestEdit = false
                this.getData()
              })
            }).catch(e => {
              console.error(e)
              this.$alert(`错误原因: ${e.message || '未知错误'}`, '保存失败')
            })
        })
      }
    },
    handleEditFinish (val) {
      if (val) {
        //获取新数据
        this.isEdit = false
        this.getData()
      }
    },
    backHome (val) {
      this.getData()
      this.isEdit = val
    },
    handleEdit(index,row) {
      this.isEdit = true
      this.communityInfo = this.communityInfoTableData[index]
      console.log(index,row)
    },
    addcommunityInfo() {
      // console.log(this.communityInfoForm)
      if(this.type == 1) {
        Axios.post(this.api_com, qs.stringify({
          name : this.communityInfoForm.name,
          avatar:'ffff',
          duty:this.communityInfoForm.duty
        }))
          .then(() => {
            this.$alert('添加成功', '成功').then(() => {
              this.getData()
              this.isAdd = false
            })
          }).catch(e => {
            console.error(e)
            this.$alert(`错误原因: ${e.message || '未知错误'}`, '保存失败')
          })
      }
      else {
        Axios.post(this.api_party, qs.stringify({
          name:this.communityInfoForm.name,
          chairman:this.communityInfoForm.chairman,
          phone_number: this.communityInfoForm.phone_number
        }))
          .then(() => {
            this.$alert('添加成功', '成功').then(() => {
              this.getData()
              this.isAdd = false
            })
          }).catch(e => {
            console.error(e)
            this.$alert(`错误原因: ${e.message || '未知错误'}`, '保存失败')
          })
      }
    },
    handleRemove(file, fileList) {
      if(file.hasOwnProperty('id')){
        Axios.post(this.api_delete, qs.stringify({
          id:this.flowNest.id,
          img_id:file.id,
        }))
          .then(() => {
            this.$alert('删除成功', '成功')
          }).catch(e => {
            this.$alert(`错误原因: ${e.message || '未知错误'}`, '添加失败')
          })
      }
      else{
        this.images.forEach((value,index) =>{
            if(file.uid == value.uid){
              this.images.splice(index,1)
              this.$alert('删除成功', '成功')
            } 
        })
      }
    },
    deletecommunityInfo (communityInfo) {
      console.log('communityInfo', communityInfo)
      
      const data = this.type == 1?{id: communityInfo.id}:{id:communityInfo.id}
      return Axios.delete(this.type==1?this.api_com:this.api_party, {data:qs.stringify(data)})
    },
    deletecommunityInfos () {
      this.$confirm('是否删除', '提示', { type: 'warning' }).then(() => {
        Promise.all(this.selectedcommunityInfos.map(this.deletecommunityInfo))
          .then(() => this.$alert('删除成功', '成功', { type: 'success' }).then(()=>{
            this.getData()
          }), (e) => {
            console.error(e)
            this.$alert('删除失败', '错误', { type: 'error' })
          })
      })
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
