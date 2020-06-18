<template>
  <div>
    <div v-if='!isEdit' class ='volunteerlist'>
      <page-header title="志愿服务信息管理"/>
      <el-container>
        <el-main>
          <el-table
            :data="volunteerTableData"
            highlight-current-row
            :border="true"
          >
            <el-table-column
              type="selection"
            />
            <el-table-column
              prop="name"
              label="志愿服务名"
              align="center"
            />
            <el-table-column
              prop="date"
              label="日期"
              align="center"
            />
            <el-table-column
              prop="address"
              label="志愿服务地址"
              align="center"
            />
            <el-table-column
              prop="signUser"
              label="报名用户"
              align="center"
            />
            <el-table-column
              label="操作"
              align="center"
            >
              <template slot-scope="scope">
                <el-row>
                  <el-col :span="1" :offset="3">
                    <el-button
                      size="medium"
                      @click="handleEdit(scope.$index,scope.row)"
                    >
                      详情
                    </el-button>
                  </el-col>
                  <el-col :span="1" :offset="8">
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
              <el-button @click='isAdd = true'>添加志愿服务</el-button>
            </el-col>
            <el-col :span="5">
              <el-button @click="deletevolunteers">
                删除志愿服务
              </el-button>
            </el-col>
          </el-row>
        </el-footer>
      </el-container>
      <el-dialog
        title="志愿服务信息"
        :visible.sync="isAdd "
      >
        <el-form
          :model="volunteerForm"
          label-width="100px"
          style="width:31.25rem;"
        >
          <el-form-item
            label="志愿服务名"
            prop="name"
          >
            <el-input
              v-model="volunteerForm.name"
              autocomplete="off"
            />
          </el-form-item>
		  <el-form-item
		    label="志愿服务时间"
		    prop="date"
		  >
		      <el-date-picker
		           v-model="volunteerForm.date"
		           type="daterange"
		           range-separator="至"
		           start-placeholder="开始日期"
		           end-placeholder="结束日期">
         </el-date-picker>
		  </el-form-item>
		  <el-form-item
		    label="志愿服务地址"
		    prop="address"
		  >
		    <el-input
		      v-model="volunteerForm.address"
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
export default {
  components: {
    volunteerEdit
  },
  data () {
    return {
      volunteer:{},
      isEdit: false,
      isAdd: false,
      volunteerTableData:[],
      volunteerForm:{
        name:'',
        sex:'',
        tel:'',
        IDNumber:'',
        grid:''
      }
    }
  },
  watch: {
    volunteerForm(newValue,oladValue) {
      console.log(newValue)
    }
  },
  created () {
    for (let i = 0; i < 4; i ++) {
      this.volunteerTableData.push({
        id:i,
        name:'舞蹈班',
        date:'2020年3月1日-2020年6月1日',
        address:'春嘉居委会103',
        signUser:'张三、王五、张柳',
      })
    }
  },
  methods: {
    handleEditFinish (val) {
      if (val) {
        //获取新数据
        this.isEdit = false
      }
    },
    backHome (val) {
      this.isEdit = val
    },
    download(index, row) {
      console.log(this.volunteerTableData[index])
    },
    handleEdit(index,row) {
      this.isEdit = true
      this.volunteer = this.volunteerTableData[index]
      console.log(index,row)
    },
    addvolunteer() {
      // console.log(this.volunteerForm)
      this.isAdd = false
    },
    deletevolunteer (volunteer) {
      console.log('volunteer', volunteer)
      const data = {
        id: volunteer.id
      }
      // return this.$axios.post('/sellerctr/deleteParents', qs.stringify(data))
    },
    deletevolunteers () {
      this.$confirm('是否删除选中的志愿服务', '提示', { type: 'warning' }).then(() => {
        Promise.all(this.selectedvolunteers.map(this.deletevolunteer))
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

<style lang="scss">
$Green: #69bc38;
$Gray: #cdcdcb;
$Red : #92535e;
$pink : #FE8083;
.teachHeader  {
  padding: 0.5rem 1rem;
  margin-bottom: 2rem;
  background: $pink;
  display: flex;
  justify-content: space-between;

  a {
    color: inherit;
    text-decoration: none;
  }

  h1 {
    font-size: 1rem;
    margin: 0;
  }
}
  .chooseMenu{
    margin-left: 1.25rem;
    width:12.5rem;
    box-shadow: 0 2px 4px rgba(0, 0, 0, .12), 0 0 6px rgba(0, 0, 0, .04)
  }
  .chooseMenu .el-menu-item.is-active {
    background-color: $Green ;
    font-size: x-large !important;
    border: 1px solid !important;
  }
</style>
