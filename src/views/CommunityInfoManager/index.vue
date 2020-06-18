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
        </el-radio-group>
      </div>
      <el-container v-if="type == 0">
        <el-main>
          <el-input type="textarea" rows="5" v-model="profile" :disabled="!profileEdit"></el-input>
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
      <el-container v-if="type==1||type==2">
        <el-main>
          <el-table
            v-show="type == 1"
            :data="communityInfoTableData"
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
              prop="position"
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
              prop="clerk"
              label="支部书记"
              align="center"
            />
            <el-table-column
              prop="tel"
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
            prop="position"
          >
            <el-input
              v-model="communityInfoForm.position"
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
            prop="clerk"
          >
            <el-input
              v-model="communityInfoForm.clerk"
              autocomplete="off"
            />
          </el-form-item>
          <el-form-item
            label="联系电话"
            prop="tel"
          >
            <el-input
              v-model="communityInfoForm.tel"
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
      profileEdit:false,
      type:0,
      profile:"",
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
    this.profile = "春嘉社区区域面积1.2平方公里。户籍人口1421人，常住人口约8500人。"+
    "辖区有相韵花园、春嘉花园、朝阳花园、永嘉花园、君汇上品五个居民小区，原多服公司两幢居民楼（待拆迁）及佰尚广场"+
    "、春菊广场、君汇上品三个商业区域。党总支下设6个党支部，党员63名。近年来，在全面从严治党的新背景下，春嘉社区党"+
    "总支结合自身文化特点，以党员志愿者为主体，开展'文化进社区，党员送春风\”书画志愿党建项目，每年举办\“温情送春联"+
    "红火过大年\”、\“迎新春吉祥语（物）书画作品\”巡回展览、书画协会书画交流会、儿童画培训、\“家风\”例句书法"+
    "比赛等活动。春嘉社区党总支打造\“流动锋小巢\”依托\“惠民先锋\”党员志愿者服务队和\“爱心义剪\”行动支部，"+
    "为辖区居民提供理发、义诊、修补、法律援助、政策咨询等服务，并结合节假日开展特色党员服务活动，发挥党员先锋引"+
    "领作用。春嘉社区先后获评\“苏州市和谐示范社区\”、\“苏州市民主法治社区\”、\“苏州市先进投诉站\”、\“相城区示范社"+
    "区\”、 \“相城区文明社区\”等荣誉称号。"
  },
  methods: {
    saveProfile() {
      this.profileEdit = false
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
      this.isAdd = false
    },
    deletecommunityInfo (communityInfo) {
      console.log('communityInfo', communityInfo)
      const data = {
        id: communityInfo.id
      }
      // return this.$axios.post('/sellerctr/deleteParents', qs.stringify(data))
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
