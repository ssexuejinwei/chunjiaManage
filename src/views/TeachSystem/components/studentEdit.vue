<template>
  <div class="editInfo">
    <el-page-header
      content="详情页面"
      @back="goBack"
    />
    <el-container>
      <el-aside>
        <br><br>
        <el-col
          :offset="6"
          :span="8"
        >
          <el-upload
            class="avatar-uploader"
            action="#"
            accept="image/*"
            :limit="3"
            :http-request="handleUpload"
            :on-success="handleUploadSuccess"
            :on-change="handleUploadChange"
            :show-file-list="false"
          >
            <img
              v-if="squareImageUrl==''?false:true"
              :src="squareImageUrl"
              class="avatar"
            >
            <i
              v-else
              class="el-icon-plus avatar-uploader-icon"
            />
          </el-upload>
        </el-col>
      </el-aside>
      <el-main>
        <el-form
          ref="form"
          class="form"
          :model="form"
          label-width="80px"
        >
          <el-row>
            <el-col :span="8">
              <el-form-item label="学员姓名">
                <el-input v-model="form.name" />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="性别">
                <el-input v-model="form.sex" />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="生日">
                <el-input v-model="form.birth" />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="8">
              <el-form-item label="身高">
                <el-input v-model="form.height" />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="体重">
                <el-input v-model="form.weight" />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="微信ID">
                <el-input
                  v-model="form.wechat"
                  disabled
                />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="8">
              <el-form-item label="联系电话">
                <el-input
                  v-model="form.tel"
                  disabled
                />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="积分">
                <el-input
                  v-model="form.points"
                  disabled
                />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="8">
              <el-form-item label="体能经验">
                <el-input v-model="form.physicalExperience" />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="球类经验">
                <el-input v-model="form.ballExperience" />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="8">
              <el-form-item label="期待队友">
                <el-input
                  v-model="form.mate"
                  disabled
                />
              </el-form-item>
            </el-col>
            <el-col
              :span="8"
              :offset="7"
            >
              <el-form-item size="large">
                <el-button @click="save">
                  保存
                </el-button>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </el-main>
    </el-container>

    <el-container>
      <el-header>
        <el-row>
          <el-col :span="9">
            <el-menu
              :default-active="menuIndex"
              mode="horizontal"
              @select="handleMenuSelect"
            >
              <el-menu-item index="全部课程">
                全部课程
              </el-menu-item>
              <el-menu-item index="上课记录">
                上课记录
              </el-menu-item>
              <el-menu-item index="我的评测">
                我的评测
              </el-menu-item>
            </el-menu>
          </el-col>
          <el-col
            :span="8"
            :offset="7"
          >
            <el-radio-group
              v-if="false"
              v-model="RadioIndex"
              style="margin-bottom: 20px;"
            >
              <el-radio-button label="1">
                周
              </el-radio-button>
              <el-radio-button label="2">
                月
              </el-radio-button>
              <el-radio-button label="3">
                季度
              </el-radio-button>
            </el-radio-group>
          </el-col>
          <el-col
            :span="10"
            :offset="5"
          >
            <el-radio-group
              v-if="menuIndex=='我的评测'"
              v-model="RadioIndex"
              style="margin-bottom: 20px;"
            >
              <el-radio-button label="1">
                课后反馈
              </el-radio-button>
              <el-radio-button label="2">
                阶段性评测
              </el-radio-button>
              <el-radio-button label="3">
                年度体测
              </el-radio-button>
            </el-radio-group>
          </el-col>
        </el-row>
      </el-header>
      <el-main>
        <div
          v-show="menuIndex=='全部课程'"
          class="courseTable"
        >
          <el-table
            :data="tableCourse"
            style="width: 100%;"
            class="courseTable"
          >
            <el-table-column
              prop="course"
              label="课程"
            />
            <el-table-column
              prop="date"
              label="上课日期"
            />
            <el-table-column
              prop="time"
              label="上课时间"
            />
            <!-- <el-table-column
              label="操作"
            >
              <template slot-scope="scope">
                <el-button
                  size="medium"
                  type="success"
                  @click="handleCancel(scope.$index,scope.row)"
                >
                  取消
                </el-button>
              </template>
            </el-table-column> -->
          </el-table>
          <span class="demonstration" />
          <el-pagination
            :page-size="pageSizeForCourse"
            style="text-align: right;"
            layout="prev, pager, next"
            :total="courseTotal"
            @current-change="handleCoursePageChange"
          />
        </div>
        <div
          v-show="menuIndex=='上课记录'"
          class="attendTable"
        >
          <el-table
            :data="tableAttend"
            style="width: 100%;"
            class="attendTable"
          >
            <el-table-column
              prop="course"
              label="课程"
            />
            <el-table-column
              prop="time"
              label="上课时间"
            />
            <el-table-column
              prop="status"
              label="状态"
            />
          </el-table>
          <span class="demonstration" />
          <el-pagination
            :page-size="pageSizeForAttend"
            style="text-align: right;"
            layout="prev, pager, next"
            :total="attendTotal"
            @current-change="handleAttendPageChange"
          />
        </div>
        <div
          v-show="menuIndex=='我的评测'"
          class="markTable"
        >
          <PMark
            :student="student"
            :mark-index="parseInt(RadioIndex)"
          />
        </div>
      </el-main>
    </el-container>
  </div>
</template>

<script>
import Axios from 'axios'
import PMark from './mark'
import qs from 'qs'
export default {
  components: {
    PMark
  },
  props: {
    student: {
      type: Object,
      default: () => {}
    }
  },
  data () {
    return {
      squareImageUrl: '',
      menuIndex: '全部课程',
      RadioIndex: 1,
      RadioType: '',
      pageSizeForMark: 6,
      markTotal: 1,
      curPageForMark: 1,
      pageSizeForAttend: 4,
      attendTotal: 1,
      curPageForAttend: 1,
      pageSizeForCourse: 4,
      courseTotal: 1,
      curPageForCourse: 1,
      form: {
        name: '韩',
        height: 134,
        tel: '1234145',
        physicalExperience: '3个月',
        mate: '王小佳',
        sex: '女',
        weight: 34,
        points: 134,
        ballExperience: '3个月',
        birth: '2019-9-8',
        wechat: '21414'
      },
      tableCourse: [],
      tableAttend: [],
      tableStar: [],
      // tableEvaluate:[{
      //   content:'教学内容',
      //   value:4,
      //   performance:'团队表现'
      // },
      // {
      //   content:'教学内容',
      //   value:3,
      //   performance:'个人表现'
      // },
      // {
      //   content:'运动目标',
      //   value:2,
      //   performance:'身体素质'
      // },
      // {
      //   content:'运动目标',
      //   value:4,
      //   performance:'技能'
      // },
      // {
      //   content:'情感目标',
      //   value:3,
      //   performance:'团队表现'
      // },
      //  {
      //    content:'情感目标',
      //    value:4,
      //    performance:'个人表现'
      //  }
      // ],
      fileList: []

    }
  },
  watch: {
    menuIndex () {
      this.RadioIndex = 1
    }
  },
  created () {
    this.form.name = this.student.name
    this.form.height = this.student.height
    this.form.tel = this.student.tel
    this.form.physicalExperience = this.student.physicalExperience
    this.form.ballExperience = this.student.ballExperience
    this.form.mate = this.student.friendName
    this.form.sex = this.student.sex
    this.form.points = this.student.points
    this.form.birth = this.student.birth
    this.form.wechat = this.student.wechat
    this.form.weight = this.student.weight
    this.squareImageUrl = this.student.avatar == null ? '' : this.student.avatar
    console.log(this.student)
    this.getCourse()
    this.getAttend()
    this.getMark()
  },
  methods: {
    getMark () {
      const api = '/sellerctr/getMarking'
      this.$axios.get(api, {
        params: {
          student_id: this.student.id,
          cur_page: this.curPageForMark,
          page_size: this.pageSizeForMark
        }
      }).then((response) => {
        const list = response.data.data.data
        this.markTotal = response.data.data.total
        // console.log(this.coursePages)
        this.tableEvaluate = []
        for (const data of list) {
          for (const star of data.star) {
            const content = star.title
            for (const mark of star.list) {
              const obj = {
                content: content,
                value: mark.score,
                performance: mark.name + '表现'
              }
              this.tableEvaluate.push(obj)
            }
          }
        }
      })
    },
    handleMarkPageChange (val) {
      this.curPageForMark = val
      this.getMark()
    },
    getAttend () {
      const api = '/sellerctr/getAttendanceByStudentId'
      this.$axios.get(api, {
        params: {
          id: this.student.id,
          cur_page: this.curPageForAttend,
          page_size: this.pageSizeForAttend
        }
      }).then((response) => {
        const list = response.data.data.data
        this.attendTotal = response.data.data.total
        // console.log(this.coursePages)
        this.tableAttend = []
        for (const attend of list) {
          const obj = {
            course: attend.tp_name + '(' + attend.team_name + ')',
            time: attend.start_time + '-' + attend.end_time.split(' ')[1],
            status: String(attend.sign_in) === '1' ? '缺席' : '签到'
          }
          this.tableAttend.push(obj)
        }
      })
    },
    handleAttendPageChange (val) {
      this.curPageForAttend = val
      this.getAttend()
    },
    getCourse () {
      const api = '/sellerctr/getScheduleByTeamId'
      this.$axios.get(api, {
        params: {
          team_id: this.student.teamID,
          cur_page: this.curPageForCourse,
          page_size: this.pageSizeForCourse
        }
      }).then((response) => {
        const list = response.data.data.data
        this.courseTotal = response.data.data.total
        // console.log(this.coursePages)
        this.tableCourse = []
        for (const course of list) {
          const obj = {
            id: course.id,
            name: course.tp_name,
            team_name: this.student.teamName,
            startTime: course.start_time,
            endTime: course.end_time
          }
          const jobj = {
            id: obj.id,
            date: course.date,
            course: obj.name + '(' + obj.team_name + ')',
            time: obj.startTime.split(' ')[1] + '-' + obj.endTime.split(' ')[1],
            edit: ''
          }
          this.tableCourse.push(jobj)
        }
      })
    },
    handleCoursePageChange (val) {
      this.curPageForCourse = val
      this.getCourse()
    },
    goBack () {
      this.$emit('back', false)
    },
    objectSpanMethod () {
    },
    handleCancel (index, row) {
      console.log(index, row)
      const api = '/sellerctr/attendance'
      const studentID = this.student.id
      const scheduleID = this.tableCourse[index].id
      const data = {
        sign_in: 2,
        schedule_id: scheduleID,
        student_id: studentID
      }
      console.log(data)
      this.$axios.post(api, qs.stringify(data)).then((response) => {
        this.$alert('取消成功').then(() => {
          this.getCourse()
        })
      }).catch(() => {
        this.$alert('取消失败')
      })
    },
    handleMenuSelect (index) {
      this.menuIndex = index
      console.log(this.menuIndex)
    },
    save () {
      const api = '/sellerctr/updateStudent'
      var data = {
        id: this.student.id,
        name: this.form.name,
        sex: String(this.form.sex) === '男' ? 0 : 1,
        birthday: this.form.birth,
        height: parseInt(this.form.height),
        weight: parseInt(this.form.weight),
        physical_training: this.form.physicalExperience,
        ball_training: this.form.ballExperience,
        avatar: this.fileList.length === 0 ? '' : this.fileList[0].url
      }
      console.log(this.fileList)
      this.$axios.post(api, qs.stringify(data)
      ).then(() => {
        // console.log(teamName)
        this.$alert('保存成功').then(() => {
          this.$emit('update', true)
        })
      }).catch((error) => {
        console.log(error)
        this.$alert('保存失败')
      })
    },
    handleUpload (param) {
      const file = param.file

      const formData = new FormData()
      formData.append('image_url', file)

      return Axios.post('/sellerctr/save', formData, {
        onUploadProgress: param.onProgress
      })
    },
    handleUploadSuccess (res, rawFile) {
      if (!rawFile.url) {
        this.$set(rawFile, 'url', URL.createObjectURL(rawFile.raw))
      }
      if (res?.data?.data?.fileName) {
        this.$set(rawFile, 'name', res?.data?.data?.fileName)
      }
    },
    handleUploadChange (file, fileList) {
      this.fileList = fileList
      this.squareImageUrl = this.fileList[this.fileList.length - 1].url
    }
  }
}
</script>

<style lang="scss">
  .editInfo{
    .el-container{
      .el-aside{
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
      }

    }
  }
</style>
