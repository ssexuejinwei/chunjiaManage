<template>
  <div>
    <div v-if='!isEdit' class ='communityInfolist'>
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
      <el-container v-if="type == 0">
        <el-main>
          <el-input type="textarea" rows="10" v-model="profile" :disabled="!profileEdit"></el-input>
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
      <el-container v-if="type == 3">
        <el-main>
          <el-input type="textarea" rows="20" v-model="flowNest" :disabled="!flowNestEdit"></el-input>
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
      <el-container v-if="type==1||type==2">
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
export default {
  components: {
    communityInfoEdit
  },
  data () {
    return {
      selectedcommunityInfos:[],
      loading:false,
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
      }
    }
  },
  watch: {
    type(newValue,oldValue) {
      console.log(newValue)
      this.communityInfoTableData = []
      if(newValue == 1) {
        for (let i = 0; i < 4; i ++) {
          this.communityInfoTableData.push({
            id:i,
            name:'春嘉党委',
            position:'春嘉社区党总支副书记、居委会副主任',
          })
        }
      }
      if (newValue == 2){
        for (let i = 0; i < 4; i ++) {
          this.communityInfoTableData.push({
            id:i,
            name:'春嘉网格支部',
            clerk:'张三',
            tel:'18239120321'
          })
        }
        console.log(this.communityInfoTableData)
      }
    }
  },
  created () {
    this.profile.content = "春嘉社区区域面积1.2平方公里。户籍人口1421人，常住人口约8500人。"+
    "辖区有相韵花园、春嘉花园、朝阳花园、永嘉花园、君汇上品五个居民小区，原多服公司两幢居民楼（待拆迁）及佰尚广场"+
    "、春菊广场、君汇上品三个商业区域。党总支下设6个党支部，党员63名。近年来，在全面从严治党的新背景下，春嘉社区党"+
    "总支结合自身文化特点，以党员志愿者为主体，开展'文化进社区，党员送春风\”书画志愿党建项目，每年举办\“温情送春联"+
    "红火过大年\”、\“迎新春吉祥语（物）书画作品\”巡回展览、书画协会书画交流会、儿童画培训、\“家风\”例句书法"+
    "比赛等活动。春嘉社区党总支打造\“流动锋小巢\”依托\“惠民先锋\”党员志愿者服务队和\“爱心义剪\”行动支部，"+
    "为辖区居民提供理发、义诊、修补、法律援助、政策咨询等服务，并结合节假日开展特色党员服务活动，发挥党员先锋引"+
    "领作用。春嘉社区先后获评\“苏州市和谐示范社区\”、\“苏州市民主法治社区\”、\“苏州市先进投诉站\”、\“相城区示范社"+
    "区\”、 \“相城区文明社区\”等荣誉称号。"
    this.flowNest = "春嘉社区目前有流动锋小巢，提供美甲美发、磨剪刀、缝补、政策咨询、法律咨询等服务。纳凉锋小巢，在高温季节为辖区老人、室外作业人员提供纳凉服务。电影锋小巢为居民提供电影播放。\n"+
    "1、朝阳花园\n"+
    "服务时间：单月的7号上午9:00-11：30 \n"+
    "服务地点：朝阳花园小公园\n"+
    "2、永嘉花园\n"+
    "服务项目：理发、义诊、磨刀、修鞋、缝补、小家电维修\n"+
    "服务时间：单月的15号上午9:00-11：30\n"+
    "服务地点：永嘉花园小公园\n"+
    "3、相韵花园\n"+
    "服务项目：理发、义诊、磨刀、修鞋、缝补、小家电维修\n"+
    "服务时间：双月的7号上午9:00-11：30\n"+
    "服务地点：相韵花园物业管理处\n"+
    "4、君汇上品\n"+
    "服务项目：理发、美甲、义诊、磨刀、修鞋、缝补、小家电维修\n"+
    "服务时间：双月的15号上午9:00-11：30\n"+
    "服务地点：君汇上品物业服务处北"
  },
  methods: {
    handleSelect (val) {
      this.selectedcommunityInfos = val
    },
    getData () {
      if(this.type == 0 ){
        Axios.get('getIntro').then(response => {
          this.profile = response.data.data
        }).catch(e => {
          console.error(e)
          this.$message.error(`获取信息列表失败: ${e.message || '未知错误'}`)
          this.profile = []
        }).finally(() => { this.loading = false })
      }
      else if (this.type == 3) {
        Axios.get('getFlow').then(response => {
          this.flowNest = response.data.data
        }).catch(e => {
          console.error(e)
          this.$message.error(`获取信息列表失败: ${e.message || '未知错误'}`)
          this.profile = []
        }).finally(() => { this.loading = false })
      }
      else{
        Axios.get('getPartyBranch').then(response => {
          this.communityInfoTableData = response.data.data
        }).catch(e => {
          console.error(e)
          this.$message.error(`获取信息列表失败: ${e.message || '未知错误'}`)
          this.profile = []
        }).finally(() => { this.loading = false })
      }
    },
    saveProfile() {
      if(type === 0 ){
        Axios.post('/updateIntro', qs.stringify({
          intro_id:this.profile.id,
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
        Axios.post('/updateHoneyComb', qs.stringify({
          flow_honeycomb_id:this.flowNest.id,
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
      }
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
      this.communityInfo = this.communityInfoTableData[index]
      console.log(index,row)
    },
    addcommunityInfo() {
      // console.log(this.communityInfoForm)
      if(type == 2) {
        Axios.post('/addPartyBranch', qs.stringify({
          name : this.communityInfoForm.name,
          avatar:'ffff',
          duty:this.communityInfoForm.duty
        }))
          .then(() => {
            this.$alert('保存成功', '成功').then(() => {
              this.getData()
              this.isAdd = false
            })
          }).catch(e => {
            console.error(e)
            this.$alert(`错误原因: ${e.message || '未知错误'}`, '保存失败')
          })
      }
      else {
        Axios.post('/addPartyBranch', qs.stringify({
          name:this.communityInfoForm.name,
          chairman:this.communityInfoForm.chairman,
          phone_number: this.communityInfoForm.phone_number
        }))
          .then(() => {
            this.$alert('保存成功', '成功').then(() => {
              this.getData()
              this.isAdd = false
            })
          }).catch(e => {
            console.error(e)
            this.$alert(`错误原因: ${e.message || '未知错误'}`, '保存失败')
          })
      }
    },
    deletecommunityInfo (communityInfo) {
      console.log('communityInfo', communityInfo)
      
      const data = this.type == 1?{party_commission_id: communityInfo.id}:{party_branch_id:communityInfo.id}
      return this.$axios.post(this.type==1?'/deleteCommissions':'/deletePartyBranchs', qs.stringify(data))
    },
    deletecommunityInfos () {
      this.$confirm('是否删除', '提示', { type: 'warning' }).then(() => {
        Promise.all(this.selectedcommunityInfos.map(this.deletecommunityInfo))
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

<style lang="scss" scoped>

</style>
