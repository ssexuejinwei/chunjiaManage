<template>
  <div>
    <div
      v-if="isEdit==false"
      v-loading="isLoading"
      class="coachList"
    >
      <el-container>
        <el-header v-if="false">
          <el-col :span="4">
            <el-radio-group
              v-model="activeIndexType"
              fill="#52bcf0"
              text-color="#fffff"
              @change="handleSelect"
            >
              <el-radio-button
                v-for="(data,index) in menuType"
                :key="index"
                :label="data"
                :value="index"
              />
            </el-radio-group>
          </el-col>
        </el-header>
        <br>
        <el-main>
          <el-table
            :data="coachTable"
            highlight-current-row
            height="540"
            :border="true"
            @selection-change="handleTableSelect"
            @current-change="handleCurrentChange"
          >
            <!-- <el-table-column
              fixed="left"
              align='center'
              width="100">
              <template slot-scope="scope">
                <el-radio v-model="check" :label="scope.$index" size="medium "></el-radio>
              </template>
            </el-table-column> -->
            <el-table-column
              type="selection"
            />
            <el-table-column
              prop="level"
              label="级别"
              align="center"
            />
            <el-table-column
              prop="name"
              label="姓名"
              align="center"
            />
            <el-table-column
              prop="sex"
              label="性别"
              align="center"
            />
            <el-table-column
              prop="age"
              label="年龄"
              align="center"
            />
            <el-table-column
              prop="experience"
              label="经验"
              align="center"
            />
            <el-table-column
              prop="info"
              label="教学"
              align="center"
            />
            <el-table-column
              prop="edit"
              label="操作"
              align="center"
            >
              <template slot-scope="scope">
                <el-button
                  size="medium"
                  class="info"
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
              <el-button @click="outerVisible = true">
                添加新教练
              </el-button>
            </el-col>
            <el-col :span="5">
              <el-button
                :disabled="!selectedCoachs.length"
                class="delete-button"
                @click="deleteCoachs"
              >
                删除教练
              </el-button>
            </el-col>
          </el-row>
        </el-footer>
      </el-container>
    </div>
    <div class="coachEdit">
      <PEdit
        v-if="isEdit==true"
        :coach="editCoach"
        @back="handleBack"
        @update="handleSave"
      />
    </div>
    <!-- 添加新教练 -->
    <el-dialog
      title="基本信息"
      :visible.sync="outerVisible "
    >
      <el-form
        :model="coachForm"
        :rules="rules"
      >
        <el-form-item
          label="姓名"
          prop="name"
          :label-width="formLabelWidth"
        >
          <el-input
            v-model="coachForm.name"
            autocomplete="off"
          />
        </el-form-item>
        <el-form-item
          label="性别"
          prop="sex"
          :label-width="formLabelWidth"
        >
          <el-radio-group v-model="coachForm.sex">
            <el-radio label="男" />
            <el-radio label="女" />
          </el-radio-group>
        </el-form-item>
        <el-form-item
          label="年龄"
          prop="age"
          :label-width="formLabelWidth"
        >
          <el-input
            v-model="coachForm.age"
            autocomplete="off"
          />
        </el-form-item>
        <el-form-item
          label="工龄(年)"
          prop="workAge"
          :label-width="formLabelWidth"
        >
          <el-input
            v-model="coachForm.workAge"
            autocomplete="off"
          />
        </el-form-item>
        <el-form-item
          label="微信号"
          prop="wechat"
          :label-width="formLabelWidth"
        >
          <el-input
            v-model="coachForm.wechat"
            autocomplete="off"
          />
        </el-form-item>
        <el-form-item
          label="联系方式"
          prop="tel"
          :label-width="formLabelWidth"
        >
          <el-input
            v-model="coachForm.tel"
            autocomplete="off"
          />
        </el-form-item>
        <el-form-item
          label="教练介绍"
          prop="info"
          :label-width="formLabelWidth"
        >
          <el-input
            v-model="coachForm.info"
            autocomplete="off"
          />
        </el-form-item>
        <el-row style="text-align: center;">
          <el-button
            type="danger"
            @click="submit"
          >
            确定
          </el-button>
        </el-row>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
import qs from 'qs'
import PEdit from './components/coachEdit'

export default {
  components: {
    PEdit
  },
  data () {
    return {
      isLoading: false,
      chooseID: '', // 选中的id
      isChoose: false,
      outerVisible: false,
      isEdit: false,
      editCoach: {},
      activeIndexType: '篮球',
      menuType: ['篮球', '足球'],
      coachTable: [],
      coachForm: [],
      formLabelWidth: '140px',
      selectedCoachs: [],
      rules: {
        name: [
          { required: true, message: '请输入姓名', trigger: 'blur' }
        ],
        sex: [
          { required: true, message: '请选择性别', trigger: 'blur' }
        ],
        age: [
          { required: true, message: '请输入年龄', trigger: 'blur' }
        ],
        workAge: [
          { required: true, message: '请输入工龄', trigger: 'blur' }
        ],
        tel: [
          { required: true, message: '请输入联系电话', trigger: 'blur' }
        ],
        info: [
          { required: true, message: '请选择介绍', trigger: 'blur' }
        ]
      }
    }
  },
  watch: {
  },
  created () {
    this.update()
  },
  methods: {
    handleTableSelect (val) {
      this.selectedCoachs = val
    },
    deleteCoach (coach) {
      var data = {
        id: coach.id
      }
      return this.$axios.post('/sellerctr/deleteCoach', qs.stringify(data))
    },
    deleteCoachs () {
      this.$confirm('是否删除选中的教练', '提示', { type: 'warning' }).then(() => {
        Promise.all(this.selectedCoachs.map(this.deleteCoach))
          .then(() => this.$alert('删除成功', '成功', { type: 'success' }), (e) => {
            console.error(e)
            this.$alert('删除失败', '错误', { type: 'error' })
          })
          .then(this.update())
      })
    },
    update () {
      this.isLoading = true
      this.coachForm = []
      this.coachTable = []
      const api = '/sellerctr/getCoach'
      this.$axios.get(api).then((response) => {
        const list = response.data.data
        this.isLoading = false
        for (const coach of list) {
          console.log(coach.tel)
          const obj = {
            id: coach.id,
            level: '主教练',
            name: coach.user_name,
            age: coach.age,
            tel: coach.tel,
            sex: String(coach.sex) === String(0) ? '男' : '女',
            experience: coach.experience,
            info: coach.info,
            avatar: coach.avatar,
            edit: ''
          }
          this.coachTable.push(obj)
        }
      })
    },
    handleSave (val) {
      this.update()
    },
    submit () {
      const api = '/sellerctr/addCoach'
      const coach = this.coachForm
      var data = {
        user_name: coach.name,
        sex: String(coach.sex) === '男' ? 0 : 1,
        age: coach.age,
        experience: coach.workAge,
        info: coach.info,
        tel: coach.tel
      }
      this.$axios.post(api, qs.stringify(data)
      ).then(() => {
        this.$alert('添加成功', {
          confirmButtonText: '确定'
        }).then(() => {
          this.outerVisible = false
          this.update()
        })
      }).catch(() => {
        this.$alert('表单填写错误,添加失败')
      })
    },
    handleCurrentChange (val) {
      this.chooseID = val.id
      this.isChoose = true
    },
    handleBack (data) {
      this.isEdit = data
    },
    handleEdit (index) {
      this.editCoach = this.coachTable[index]
      this.isEdit = true
    }
  }
}
</script>

<style lang="scss">
  .coachList{
    .el-container{
      .el-main{
        .el-radio__label{
          display: none;
        }
        .el-table{
          .el-button{
              color:#52bcf0 ;
              border-color: #52bcf0;
            }
          }
        }
      .el-footer{
        .el-button{
          color: #FFFFFF;
          background-color: #fa7959;
        }
        .delete-button{
          color: #fa7959;
          background-color: #FFFFFF;
          border-color:#fa7959 ;
        }
      }
    }
  }
</style>
