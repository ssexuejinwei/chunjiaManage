<template>
  <div class="editInfo">
    <el-page-header
      content="详情页面"
      @back="goBack"
    />
    <el-container>
      <el-aside>
        <el-col
          :offset="6"
          :span="8"
        >
          <br>
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
        <el-col
          :offset="8"
          :span="8"
        >
          <p>认证：<span style="background-color:#69bc38;color: #FFFFFF;">主教练</span></p>
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
              <el-form-item label="姓名">
                <el-input v-model="form.name" />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="性别">
                <el-input v-model="form.sex" />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="年龄">
                <el-input v-model="form.age" />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="8">
              <el-form-item label="联系电话">
                <el-input v-model="form.tel" />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="工龄">
                <el-input v-model="form.workAge" />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="微信ID">
                <el-input v-model="form.wechat" disabled />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="8">
              <el-form-item label="教练介绍">
                <el-input
                  v-model="form.intro"
                  type="textarea"
                />
              </el-form-item>
            </el-col>
            <el-col
              :span="6"
              :offset="14"
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

    <el-container class="bottom">
      <el-header>
        <el-row>
          <el-col :span="8">
            <el-menu
              :default-active="menuIndex"
              mode="horizontal"
              @select="handleMenuSelect"
            >
              <el-menu-item index="全部课程">
                全部课程
              </el-menu-item>
              <el-menu-item index="考勤">
                考勤
              </el-menu-item>
            </el-menu>
          </el-col>
          <el-col
            :span="6"
            :offset="9"
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
        </el-row>
      </el-header>
      <el-main>
        <div
          v-show="menuIndex=='全部课程'"
          class="courseTable"
        >
          <el-table
            :data="tableCourse"
            style="wi
        dth: 100%;"
            class="courseTable"
          >
            <el-table-column
              prop="time"
              label="上课时间"
            />
            <el-table-column
              prop="course"
              label="课程"
            />
            <el-table-column
              prop="duration"
              label="起止时间"
            />
          </el-table>

          <span class="demonstration" />
          <el-pagination
            style="text-align: right;"
            layout="prev, pager, next"
            :total="courseTotal"
            @current-change="handleCoursePageChange"
          />
        </div>
        <div
          v-show="menuIndex=='考勤'"
          class="attendTable"
        >
          <el-calendar v-model="value">
            <template
              slot="dateCell"
              slot-scope="{date, data}"
            >
              <p
                :id="getDate(date,data)"
                :class="courseDateArray.indexOf(data.day) !== -1 ?'':'is-selected'"
                @dblclick="handleSelected"
              >
                {{ data.day.split('-').slice(2).join('') }}
                <span v-if="courseDateArray.indexOf(data.day) !==-1" class="spanText">有课</span>
              </p>
              <el-dialog
                title=""
                :visible.sync="dialogTableVisible&&data.isSelected"
                append-to-body
              >
                <div style="text-align: center;">
                  <el-table
                    :data="tableAttend"
                    style="width: 100%"
                  >
                    <el-table-column
                      label="课程"
                      prop="course"
                    />
                    <el-table-column label="考勤">
                      <template slot-scope="scope">
                        <el-button
                          size="medium"
                          type="text"
                          @click="handleAttend(0, scope.$index)"
                        >
                          <span :class="tableAttend[scope.$index]['sign_in']==0?'attend':'normal'">
                            签到
                          </span>
                        </el-button>
                        <el-button
                          size="medium"
                          type="text"
                          @click="handleAttend(1, scope.$index)"
                        >
                          <span :class="tableAttend[scope.$index]['sign_in']==1?'absent':'normal'">
                            缺席
                          </span>
                        </el-button>
                      </template>
                    </el-table-column>
                  </el-table>
                  <el-button
                    style="text-align: center;margin-top: 2rem;"
                    type="success"
                    @click="confirm"
                  >
                    确定
                  </el-button>
                </div>
              </el-dialog>
            </template>
          </el-calendar>
        </div>
      </el-main>
    </el-container>

    <!-- 添加新课程对话框 -->
    <el-dialog
      title="添加课程"
      :visible.sync="outerVisible "
    >
      <el-form :model="courseForm">
        <el-form-item
          label="年龄时段"
          prop="age"
        >
          <el-radio-group v-model="courseForm.age">
            <el-radio-button label="3-4岁" />
            <el-radio-button label="4-5岁" />
            <el-radio-button label="5-6岁" />
          </el-radio-group>
        </el-form-item>
        <el-form-item
          label="项目分类"
          prop="type"
        >
          <el-radio-group v-model="courseForm.type">
            <el-radio-button label="篮球" />
            <el-radio-button label="足球" />
          </el-radio-group>
        </el-form-item>
        <el-form-item label="课程时间">
          <el-col :span="10">
            <el-form-item prop="dateStart">
              <el-date-picker
                v-model="courseForm.dateStart"
                type="date"
                placeholder="选择日期"
                style="width: 100%;"
              />
            </el-form-item>
          </el-col>
          <el-col
            class="line"
            :span="2"
          >
            -
          </el-col>
          <el-col :span="10">
            <el-form-item prop="dateEnd">
              <el-date-picker
                v-model="courseForm.dateEnd"
                type="date"
                placeholder="选择日期"
                style="width: 100%;"
              />
            </el-form-item>
          </el-col>
        </el-form-item>
        <el-form-item
          label="课程名称"
          prop="name"
        >
          <el-col :span="10">
            <el-input v-model="courseForm.name" />
          </el-col>
        </el-form-item>
        <br><br>
        <el-form-item
          size="large"
          style="text-align: center;"
        >
          <el-button
            type="danger"
            @click="submit"
          >
            确定
          </el-button>
          <el-button
            type="info"
            @click="outerVisible=false"
          >
            返回
          </el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
import Axios from 'axios'
import qs from 'qs'
export default {
  props: {
    coach: {
      type: Object,
      default: () => {}
    }

  },
  data () {
    return {
      courseDateArray: [],
      value: new Date(),
      squareImageUrl: '',
      outerVisible: false,
      dialogTableVisible: false,
      curPageForCourse: 1,
      courseTotal: 3,
      dateCurrent: '',
      menuIndex: '全部课程',
      RadioIndex: 1,
      RadioType: '',
      courseForm: {
        age: '3-4岁',
        type: '篮球',
        dateStart: '',
        dateEnd: '',
        name: '5-6岁初级篮球'
      },
      form: {
        name: '韩',
        tel: '1234145',
        sex: '女',
        age: '18',
        workAge: '3个月',
        wechat: '21414',
        intro: '很擅长教篮球'
      },
      tableCourse: [],
      tableAttend: [],
      fileList: []

    }
  },
  created () {
    this.form.name = this.coach.name
    this.form.tel = this.coach.tel == null ? '暂无' : this.coach.tel
    this.form.age = this.coach.age
    this.form.workAge = this.coach.experience
    this.form.wechat = this.coach.wechat == null ? '暂无' : this.coach.wechat
    this.form.intro = this.coach.info
    this.squareImageUrl = this.coach.avatar == null ? '' : this.coach.avatar
    console.log(this.coach.id)
    this.update()
    this.getCourseDateArray()
    // this.$axios.get(){

    // }
  },
  methods: {
    getCourseDateArray () {
      console.log(' i am here')
      const api_1 = '/sellerctr/getCoachAttendance'
      const year = this.value.getFullYear()
      const month = this.value.getMonth() + 1
      const day = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31]
      if ((year % 4 === 0 && year % 100 !== 0) || (year % 400 === 0)) {
        day[1] = 29
      }
      this.$axios.get(api_1, {
        params: {
          id: this.coach.id,
          start_time: year + '-' + month + '-1',
          end_time: year + '-' + month + '-' + day[month - 1]
        }
      }).then((response) => {
        this.courseDateArray = []
        for (const data of response.data.data) {
          this.courseDateArray.push(data.date)
        }
      })
    },
    update () {
      const api_1 = '/sellerctr/getCoachSchedule'
      this.$axios.get(api_1, {
        params: {
          id: this.coach.id,
          cur_page: this.curPageForCourse
        }
      }).then((response) => {
        this.courseTotal = response.data.data.total
        const courseList = response.data.data.data
        this.tableCourse = []
        for (const course of courseList) {
          const obj = {
            id: course.id,
            course: course.tp_name,
            time: course.start_time.split(' ')[1] + '-' + course.end_time.split(' ')[1],
            duration: course.date,
            edit: ''
          }
          this.tableCourse.push(obj)
        }
      })
    },
    handleCoursePageChange (val) {
      this.curPageForCourse = val
      this.update()
    },
    handleAttend (sign, index) {
      const api = '/sellerctr/coachAttendance'
      const scheduleId = this.tableAttend[index].id
      const data = {
        schedule_id: scheduleId,
        coach_id: this.coach.id,
        sign_in: sign
      }
      console.log(data)
      this.$axios.post(api, qs.stringify(data)).then((response) => {
        this.tableAttend[index].sign_in = sign
        this.$alert('考勤成功')
      }).catch(() => {
        this.$alert('考勤失败')
      })
    },
    handleSelected () {
      const api = '/sellerctr/getCoachAttendance'
      const day = Number(this.dateCurrent.split('-')[2]) + 1
      const end_time = this.dateCurrent.split('-')[0] + '-' + this.dateCurrent.split('-')[1] + '-' + day.toString()
      this.$axios.get(api, {
        params: {
          id: this.coach.id,
          start_time: this.dateCurrent,
          end_time: end_time
        }
      }).then((response) => {
        this.tableAttend = []
        for (const course of response.data.data) {
          const jobj = {
            id: course.id,
            course: course.start_time.split(' ')[1] + '-' + course.end_time.split(' ')[1] + ' ' + course.tp_name,
            sign_in: course.sign_in
          }
          this.tableAttend.push(jobj)
        }
        if (this.tableAttend.length === 0) {
          this.$alert('今日暂无课程')
        } else {
          this.dialogTableVisible = true
        }
      })
    },
    confirm () {
      this.dialogTableVisible = false
    },
    submit () {
      this.$alert('课程添加成功可在全部课程查看详情', {
        confirmButtonText: '确定'
      }).then(() => {
        this.outerVisible = false
      })
    },
    addCourse () {
      this.outerVisible = true
    },
    getDate (date, data) {
      if (data.isSelected) {
        this.dateCurrent = data.day
      }
      return ' p-selected'
    },
    goBack () {
      this.$emit('back', false)
    },
    handleCancel (index) {
      console.log(index)
    },
    handleMenuSelect (index) {
      this.menuIndex = index
    },
    save () {
      console.log(this.form)
      const api = '/sellerctr/updateCoach'
      var data = {
        id: this.coach.id,
        user_name: this.form.name,
        sex: String(this.form.sex) === '男' ? 0 : 1,
        age: this.form.age,
        experience: this.form.workAge,
        info: this.form.info,
        tel: this.form.tel,
        avatar: this.squareImageUrl
      }
      this.$axios.post(api, qs.stringify(data)).then((response) => {
        this.$alert('保存成功').then(() => {
          this.$emit('update', true)
        })
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
  $Green: #69bc38;
  $Gray: #cdcdcb;
  $Red : #92535e;
  .normal{
    color:$Gray;
  }
  .attend {
    color: $Green;
  }
  .absent{
    color:$Red;
  }
  .spanText{
    margin-left: 20px;
    color: #52bcf0
  }
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
    .bottom{
      .el-main{
        .attendTable{
          .normal{
            color:$Gray;
          }
          .attend {
            color: $Green;
          }
          .absent{
            color:$Red;
          }
        }
      }
    }
  }
</style>
