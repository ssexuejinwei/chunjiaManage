<template>
  <div id="schedule">
    <el-container
      v-loading="isLoading"
      class="container"
    >
      <el-main class="main">
        <el-calendar v-model="value">
          <template
            slot="dateCell"
            slot-scope="{date, data}"
          >
            <p
              :id="getDate(date,data)"
              :class="courseDateArray.indexOf(data.day) !== -1 ?'':'is-selected'"
            >
              {{ data.day.split('-').slice(2).join('') }}
              <span v-if="courseDateArray.indexOf(data.day) !==-1" class="spanText">有课</span>
            </p>
            <!-- 排课菜单 -->
            <el-dialog
              :title="getTitle(data.day,state)"
              :visible.sync="state =='schedule'&&scheduleVisible&&data.isSelected"
            >
              <el-time-picker
                v-model="timePickerValue"
                is-range
                range-separator="至"
                start-placeholder="开始时间"
                end-placeholder="结束时间"
                placeholder="选择时间范围"
                @change="handleTimePicker"
              />
              <el-button style="margin-left: 10px;" :disabled="addDuration === ''" @click="timeAdd">
                添加
              </el-button>
              <br><br>
              <el-cascader-panel
                :options="optionsSchedule"
                @change="((data) =>{scheduleChange(data,state)})"
              />
              <div
                slot="footer"
                class="dialog-footer"
              >
                <el-button @click="cancelDialog(state)">
                  取 消
                </el-button>
                <el-button
                  type="primary"
                  @click="submitDialog(state)"
                >
                  确 定
                </el-button>
              </div>
            </el-dialog>

            <!-- 考勤菜单 -->
            <el-dialog
              :title="getTitle(data.day,state)"
              :visible.sync="state =='checkAttend'&&checkAttendVisible&&data.isSelected"
            >
              <!-- 考勤名单 -->
              <el-dialog
                :title="getTitle(data.day,state)"
                :visible.sync="dialogTableVisible"
                append-to-body
              >
                <el-table
                  :data="tableData"
                  style="width: 100%"
                >
                  <el-table-column
                    label="学生名单"
                    prop="student_name"
                    width="180"
                  />
                  <el-table-column
                    label="考勤"
                    width="180"
                  >
                    <template slot-scope="scope">
                      <el-button
                        size="medium"
                        type="text"
                        @click="handleAttend(scope.$index,scope.row)"
                      >
                        <span :class="tableData[scope.$index]['sign_in']=='attend'?'attend':'normal'">
                          签到
                        </span>
                      </el-button>
                      <el-button
                        size="medium"
                        type="text"
                        @click="handleAbsent(scope.$index, scope.row)"
                      >
                        <span :class="tableData[scope.$index]['sign_in']=='absent'?'absent':'normal'">
                          缺席
                        </span>
                      </el-button>
                    </template>
                  </el-table-column>
                </el-table>
                <div
                  slot="footer"
                  class="dialog-footer"
                >
                  <el-button @click="dialogTableVisible =false">
                    上一步
                  </el-button>
                  <el-button
                    type="primary"
                    @click="(()=>{dialogTableVisible = false;checkAttendVisible =false;buttonType[state] = 'info'})"
                  >
                    确定
                  </el-button>
                </div>
              </el-dialog>

              <el-cascader-panel
                :options="optionsCheckAttend"
                @change="((data) =>{scheduleChange(data,state)})"
              />
              <div
                slot="footer"
                class="dialog-footer"
              >
                <el-button @click="cancelDialog(state)">
                  取 消
                </el-button>
                <el-button
                  type="primary"
                  @click="submitDialog(state)"
                >
                  下一步
                </el-button>
              </div>
            </el-dialog>
            <!-- 删除菜单 -->
            <el-dialog
              :title="getTitle(data.day,state)"
              :visible.sync="state=='delete'&&deleteVisible&&data.isSelected"
            >
              <el-table
                :data="scheduleTable"
                @selection-change="handleTableSelect"
              >
                <el-table-column
                  type="selection"
                />
                <el-table-column
                  label="课程名"
                  prop="tp_name"
                />
                <el-table-column
                  label="教练名"
                  prop="coach_name"
                />
                <el-table-column
                  label="队伍名"
                  prop="team_name"
                />
                <el-table-column
                  label="日期"
                  prop="date"
                />
                <el-table-column
                  label="时间段"
                >
                  <template slot-scope="scope">
                    {{ scheduleTable[scope.$index].start_time.split(' ')[1] + '--' + scheduleTable[scope.$index].end_time.split(' ')[1] }}
                  </template>
                </el-table-column>
              </el-table>
              <div
                slot="footer"
                class="dialog-footer"
              >
                <el-button @click="(()=>{deleteVisible = false;buttonType[state] = 'info'})">
                  取消
                </el-button>
                <el-button
                  type="primary"
                  @click="deleteSchedules"
                >
                  删除
                </el-button>
              </div>
            </el-dialog>
            <!-- 编辑菜单 -->
            <el-dialog
              :title="getTitle(data.day,state)"
              :visible.sync="state=='edit'&&editVisible&&data.isSelected"
            >
              <el-cascader-panel
                :options="optionsEdit"
                @change="((data) =>{scheduleChange(data,state)})"
              />
              <div
                slot="footer"
                class="dialog-footer"
              >
                <el-button @click="(()=>{editVisible = false;buttonType[state] = 'info'})">
                  取 消
                </el-button>
                <el-button
                  type="primary"
                  @click="submitDialog(state)"
                >
                  确 定
                </el-button>
              </div>
            </el-dialog>
          </template>
        </el-calendar>
        <el-row class="scheduleButton">
          <el-col
            :span="5"
          >
            <el-button
              :type="buttonType['schedule']"
              @click="buttonClick('schedule')"
            >
              &nbsp;排课&nbsp;
            </el-button>
          </el-col>
          <el-col
            :span="5"
          >
            <el-button
              :type="buttonType['checkAttend']"
              @click="buttonClick('checkAttend')"
            >
              &nbsp;考勤&nbsp;
            </el-button>
          </el-col>
          <el-col
            :span="5"
          >
            <el-button
              :type="buttonType['delete']"
              @click="buttonClick('delete')"
            >
              &nbsp;删除&nbsp;
            </el-button>
          </el-col>
          <el-col
            :span="5"
          >
            <el-button
              :type="buttonType['edit']"
              @click="buttonClick('edit')"
            >
              &nbsp;编辑&nbsp;
            </el-button>
          </el-col>
        </el-row>
      <!--    <el-row v-else>
            <el-col :span="5" :offset="12" >
            <el-button type="success" @click="buttonClick('submit')" >&nbsp;确定&nbsp;</el-button>
            </el-col>
          </el-row> -->
      </el-main>
    </el-container>
  </div>
</template>
<script>
import qs from 'qs'
export default {
  name: 'Schedule',
  data () {
    return {
      courseDateArray: [],
      value: new Date(),
      fullscreenLoading: false,
      editVisible: false,
      deleteVisible: false,
      dialogTableVisible: false,
      scheduleVisible: false,
      checkAttendVisible: false,
      scheduleList: {},
      attendSchedule: {
        duration: '',
        schedule_id: '',
        team_id: '',
        team_name: '',
        coach_name: '',
        course_name: ''
      },
      editSchedule: {
        id: '',
        start_time: '',
        end_time: '',
        tp_id: '',
        coach_id: '',
        team_id: ''
      },
      schedule: {
        start_time: '',
        end_time: '',
        tp_id: '',
        coach_id: '',
        team_id: ''
      },
      teamClick: {},
      courseClick: {},
      coachClick: {},
      dateCurrent: '', // 年-月-日
      coachList: ['杜教练', '赵教练', '熊教练', '林教练', '韩教练'],
      courseList: ['3-4岁兴趣班', '4-6岁初级足球班', '5-6岁初级篮球班'],
      teamList: ['Team-01', 'Team-02', 'Team-03'],
      typeList: ['Team', '教练', '课程'],
      timeList: ['16:00-17:00', '17:00-18:00', '18:00-19:00'],
      state: 'lookup',
      showMenu: 'none',
      buttonType: { schedule: 'info', checkAttend: 'info', edit: 'info', delete: 'info' },
      activeIndex: '1',
      tableData: [],
      optionsSchedule: [],
      optionsCheckAttend: [],
      optionsEdit: [],
      isLoading: false,
      scheduleTable: [],
      selectedSchedules: [],
      children_team: [],
      timePickerValue: '',
      addDuration: ''
    }
  },
  watch: {
    timePickerValue (newValue) {
      console.log(newValue)
    },
    value (newValue, oldValue) {
      const oldYear = oldValue.getFullYear()
      const oldMonth = oldValue.getMonth()
      const newYear = newValue.getFullYear()
      const newMonth = newValue.getMonth()
      if (oldYear !== newYear || newMonth !== oldMonth) {
        this.getCourseDateArray()
      }
    }
  },
  created: function () {
    for (var coach of this.coachList) {
      this.coachClick[coach] = false
    }
    for (var team of this.teamList) {
      this.teamClick[team] = false
    }
    for (var course of this.courseList) {
      this.courseClick[course] = false
    }
    this.getData('edit')
    this.getCourseDateArray()
  },
  methods: {
    handleTimePicker (val) {
      const start_time = val[0].getHours() + ':' + val[0].getMinutes()
      const end_time = val[1].getHours() + ':' + val[1].getMinutes()
      // const start_time = val[0].getHours() + ':' + val[0].getMinutes() + ':' + val[0].getSeconds()
      // const end_time = val[1].getHours() + ':' + val[1].getMinutes() + ':' + val[1].getSeconds()
      this.addDuration = start_time + '-' + end_time
    },
    timeAdd () {
      if (this.addDuration !== '') {
        const data = this.optionsSchedule[0]
        this.optionsSchedule.push({
          value: this.addDuration,
          label: this.addDuration,
          children: data.children
        })
        this.addDuration = ''
      } else {
        alert('请先选择时间段')
      }
    },
    handleTableSelect (val) {
      this.selectedSchedules = val
    },
    deleteSchedules () {
      this.$confirm('是否删除选中的排课', '提示', { type: 'warning' }).then(() => {
        Promise.all(this.selectedSchedules.map(this.deleteSchedule))
          .then(() => this.$alert('删除成功', '成功', { type: 'success' }), (e) => {
            console.error(e)
            this.$alert('删除失败', '错误', { type: 'error' })
          })
          .then(() => {
            this.deleteVisible = false
            this.buttonType.delete = 'info'
            this.getData('edit')
            this.getCourseDateArray()
          })
      })
    },
    deleteSchedule (schedule) {
      const data = {
        id: schedule.id
      }
      return this.$axios.post('/sellerctr/deleteSchedule', qs.stringify(data))
    },
    getCourseDateArray () {
      this.isLoading = true
      const api_1 = '/sellerctr/getSchedule'
      const year = this.value.getFullYear()
      const month = this.value.getMonth() + 1
      const day = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31]
      if ((year % 4 === 0 && year % 100 !== 0) || (year % 400 === 0)) {
        day[1] = 29
      }
      this.$axios.get(api_1, {
        params: {
          start_time: year + '-' + month + '-1',
          end_time: year + '-' + month + '-' + day[month - 1]
        }
      }).then((response) => {
        this.courseDateArray = []
        this.isLoading = false
        for (const data of Object.keys(response.data.data)) {
          this.courseDateArray.push(data)
        }
      })
    },
    getData (key) {
      const api_1 = '/sellerctr/getSchedule'
      const api_2 = '/sellerctr/getCoach'
      const api_3 = '/sellerctr/getTeam'
      const api_4 = '/sellerctr/getCourse'
      /**
       *   获取教练和队伍的id  并将其 放在一个对象数组里
       */
      // 获取当前排课
      if (key === 'checkAttend') {
        this.$axios.get(api_1, {
          params: {
            start_time: this.dateCurrent,
            end_time: this.dateCurrent
          }
        }).then((response) => {
          this.scheduleList = response.data.data
          console.log(this.scheduleList)
        })
      } else if (key === 'edit') {
        if (this.dateCurrent === '') {
          const myDate = new Date()
          this.dateCurrent = myDate.getFullYear() + '-' + (myDate.getMonth() + 1) + '-' + myDate.getDate()
        }
        this.$axios.get(api_1, {
          params: {
            start_time: this.dateCurrent,
            end_time: this.dateCurrent
          }
        }).then((response) => {
          this.scheduleList = response.data.data
          this.$axios.get(api_2).then((response) => {
            this.coachList = []
            const data = response.data.data
            for (const coach of data) {
              const obj = {
                id: coach.id,
                name: coach.user_name
              }
              this.coachList.push(obj)
            }
            // 获取队伍
            this.$axios.get(api_3).then((response) => {
              this.teamList = []
              const data = response.data.data
              for (const team of data) {
                const obj = {
                  id: team.id,
                  name: team.name
                }
                this.$axios.get('/sellerctr/getTeachingPlanBySameTeam', {
                  params: {
                    id: team.id
                  }
                }).then((response) => {
                  const children_course = []
                  for (const course of response.data.data) {
                    children_course.push({
                      value: course.id,
                      label: course.name
                    })
                  }
                  this.children_team.push({
                    value: team.id,
                    label: team.name,
                    children: children_course
                  })
                })
                this.teamList.push(obj)
              }
              // 获取课程
              this.$axios.get(api_4).then((response) => {
                this.courseList = []
                const data = response.data.data
                for (const course of data) {
                  const obj = {
                    id: course.id,
                    name: course.name
                  }
                  this.courseList.push(obj)
                }
                this.fullscreenLoading = false
              })
            })
          })
        })
      } else {
        // 获取可选的team教练课程
        this.$axios.get(api_2).then((response) => {
          this.coachList = []
          const data = response.data.data
          for (const coach of data) {
            const obj = {
              id: coach.id,
              name: coach.user_name
            }
            this.coachList.push(obj)
          }
          // 获取队伍
          this.$axios.get(api_3).then((response) => {
            this.teamList = []
            const data = response.data.data
            for (const team of data) {
              const obj = {
                id: team.id,
                name: team.name
              }
              this.teamList.push(obj)
            }
            // 获取课程
            this.$axios.get(api_4).then((response) => {
              this.courseList = []
              const data = response.data.data
              for (const course of data) {
                const obj = {
                  id: course.id,
                  name: course.name
                }
                this.courseList.push(obj)
              }
            })
          })
        })
      }
    },
    cancelDialog (key) {
      switch (key) {
        case 'schedule':
          this.scheduleVisible = false
          this.buttonType[key] = 'info'
          break
        case 'checkAttend':
          this.checkAttendVisible = false
          this.buttonType[key] = 'info'
          break
        default:
          break
      }
    },
    // 表单提交
    submitDialog (key) {
      switch (key) {
        case 'schedule':
          var api_1 = '/sellerctr/schedule'
          if (this.schedule.tp_id === '') {
            this.$alert('请选择排课信息', {
              confirmButtonText: '确定'
            })
            return
          }
          this.$axios.post(api_1, qs.stringify(this.schedule)
          ).then((response) => {
            const code = response.data.code
            if (code === 0) {
              this.schedule.start_time = ''
              this.schedule.end_time = ''
              this.schedule.coach_id = ''
              this.schedule.team_id = ''
              this.schedule.tp_id = ''
              this.$alert('排课成功', {
                confirmButtonText: '确定'
              })
              this.scheduleVisible = false
              this.buttonType.schedule = 'info'
              this.getCourseDateArray()
              this.getData('checkAttend')
            } else {
              this.$alert('排课失败', {
                confirmButtonText: '确定'
              })
            }
          }).catch(() => {
            this.$alert('当前时段已有课程,请重新选择', {
              confirmButtonText: '确定'
            })
          })
          break
          /**
           * 先change函数，在submit函数，成功之后update一下,回来之后写一下update函数，将排课id放在时间段的value里面，因为用不到（或者时间段value+’：‘+排课id）
           */
        case 'checkAttend':
          var api_2 = '/sellerctr/getAttendance'
          this.$axios.get(api_2, {
            params: {
              schedule_id: this.attendSchedule.schedule_id,
              team_id: this.attendSchedule.team_id
            }
          }
          ).then((response) => {
            this.tableData = []
            const studentList = response.data.data
            const code = response.data.code
            if (code === 0) {
              for (const student of studentList) {
                const obj = {
                  student_id: parseInt(student.student_id),
                  student_name: student.student_name,
                  sign_in: parseInt(student.sign_in)
                }
                this.tableData.push(obj)
              }
              this.dialogTableVisible = true
            } else {
              this.$alert('获取学生名单错误', {
                confirmButtonText: '确定'
              })
            }
          })
          break
        case 'edit':
          var api_3 = '/sellerctr/schedule'
          if (this.editSchedule.tp_id === '') {
            this.$alert('请选择排课信息', {
              confirmButtonText: '确定'
            })
            return
          }
          this.$axios.post(api_3, qs.stringify(this.editSchedule)
          ).then((response) => {
            const code = response.data.code
            if (code === 0) {
              this.editSchedule.id = ''
              this.editSchedule.start_time = ''
              this.editSchedule.end_time = ''
              this.editSchedule.coach_id = ''
              this.editSchedule.team_id = ''
              this.editSchedule.tp_id = ''
              this.$alert('排课修改成功', {
                confirmButtonText: '确定'
              })
              this.editVisible = false
              this.buttonType[key] = 'info'
              this.getData('checkAttend')
            } else {
              this.$alert('排课修改失败', {
                confirmButtonText: '确定'
              })
            }
          })
          break
        default:
          break
      }
    },

    // 选中属性
    scheduleChange (data, key) {
      switch (key) {
        case 'schedule':
          this.schedule.start_time = this.dateCurrent + ' ' + data[0].split('-')[0]
          this.schedule.end_time = this.dateCurrent + ' ' + data[0].split('-')[1]
          this.schedule.coach_id = parseInt(data[1])
          this.schedule.team_id = parseInt(data[2])
          this.schedule.tp_id = parseInt(data[3])
          break
        case 'checkAttend':
          this.attendSchedule.duration = data[0].split('+')[0]
          this.attendSchedule.schedule_id = parseInt(data[0].split('+')[1])
          this.attendSchedule.team_id = parseInt(data[2].split('+')[0])
          this.attendSchedule.team_name = data[2].split('+')[1]
          this.attendSchedule.coach_name = data[1].split('+')[1]
          this.attendSchedule.course_name = data[3].split('+')[1]
          break
        case 'edit':
          this.editSchedule.id = parseInt(data[0].split('+')[1])
          this.editSchedule.start_time = this.dateCurrent + ' ' + data[0].split('+')[0].split('-')[0]
          this.editSchedule.end_time = this.dateCurrent + ' ' + data[0].split('+')[0].split('-')[1]
          this.editSchedule.coach_id = parseInt(data[1])
          this.editSchedule.team_id = parseInt(data[2])
          this.editSchedule.tp_id = parseInt(data[3])
          break
        default:
          break
      }
    },
    getTitle (data, key) {
      switch (key) {
        case 'schedule':
          return '排课：  当前时间为' + data
        case 'checkAttend':
          var s = this.attendSchedule.duration + '  ' + this.attendSchedule.course_name + '  ' + this.attendSchedule.coach_name
          return '考勤:' + s
        default:
          break
      }
      return '当前时间为' + data
    },
    // update options
    update (type) {
      switch (type) {
        case 'schedule':
          this.optionsSchedule = [{
            value: '16:00-17:00',
            label: '16:00-17:00',
            children: []
          },
          {
            value: '17:00-18:00',
            label: '17:00-18:00',
            children: []
          },
          {
            value: '18:00-19:00',
            label: '18:00-19:00',
            children: []
          }]
          var children_coach = []
          for (const coach of this.coachList) {
            const obj = {
              value: coach.id,
              label: coach.name,
              children: this.children_team
            }
            children_coach.push(obj)
          }
          for (const option of this.optionsSchedule) {
            option.children = children_coach
          }
          this.scheduleVisible = true
          break
        case 'checkAttend':
          var api_1 = '/sellerctr/getSchedule'
          this.$axios.get(api_1, {
            params: {
              start_time: this.dateCurrent,
              end_time: this.dateCurrent
            }
          }).then((response) => {
            this.scheduleList = response.data.data
            const scheduleArray = this.scheduleList[this.dateCurrent]
            if (typeof (scheduleArray) === 'undefined') {
              this.$alert('今日无排课信息', {
                confirmButtonText: '确定'
              }).then(() => {
                this.buttonType[type] = 'info'
              })
              return
            }
            this.checkAttendVisible = true
            this.optionsCheckAttend = []
            // 教案value的位置用来存排课的id
            for (const schedule of scheduleArray) {
              let isHave = false
              const scheduleID = schedule.id
              const courseID = schedule.tp_id
              const courseName = schedule.tp_name
              const start_time = schedule.start_time.split(' ')[1].split(':').slice(0, 2).join(':')
              const end_time = schedule.end_time.split(' ')[1].split(':').slice(0, 2).join(':')
              const duration = start_time + '-' + end_time
              const obj = {
                value: duration + '+' + scheduleID,
                label: duration,
                children: []
              }
              if (this.optionsCheckAttend.length !== 0) {
                for (const option of this.optionsCheckAttend) {
                  if (option.value.split('+')[0] === duration) {
                    isHave = true
                    break
                  }
                }
              }
              if (!isHave) {
                const obj_course = {
                  value: courseID + '+' + courseName,
                  label: schedule.tp_name
                }
                const obj_team = {
                  value: schedule.team_id + '+' + schedule.team_name,
                  label: schedule.team_name,
                  children: []
                }
                obj_team.children.push(obj_course)
                const obj_coach = {
                  value: schedule.coach_id + '+' + schedule.coach_name,
                  label: schedule.coach_name,
                  children: []
                }
                obj_coach.children.push(obj_team)
                obj.children.push(obj_coach)
                this.optionsCheckAttend.push(obj)
              }
            }
          })
          break
        case 'delete':
          this.$axios.get('/sellerctr/getSchedule', {
            params: {
              start_time: this.dateCurrent,
              end_time: this.dateCurrent
            }
          }).then((response) => {
            this.scheduleTable = response.data.data[this.dateCurrent]
            if (typeof (this.scheduleTable) === 'undefined') {
              this.$alert('今日无排课信息', {
                confirmButtonText: '确定'
              }).then(() => {
                this.buttonType[type] = 'info'
              })
              return
            }
            this.deleteVisible = true
          })
          break
        case 'edit':
          var api_2 = '/sellerctr/getSchedule'
          this.$axios.get(api_2, {
            params: {
              start_time: this.dateCurrent,
              end_time: this.dateCurrent
            }
          }).then((response) => {
            this.scheduleList = response.data.data
            const scheduleArrayEdit = this.scheduleList[this.dateCurrent]
            if (typeof (scheduleArrayEdit) === 'undefined') {
              this.$alert('今日无排课信息,请先排课在进行编辑', {
                confirmButtonText: '确定'
              }).then(() => {
                this.buttonType[type] = 'info'
              })
              return
            }
            this.editVisible = true
            this.optionsEdit = []
            // 教案value的位置用来存排课的id
            for (const schedule of scheduleArrayEdit) {
              let isHave = false
              const scheduleID = schedule.id
              // let courseID = schedule['tp_id']
              // let courseName = schedule['tp_name']
              const start_time = schedule.start_time.split(' ')[1].split(':').slice(0, 2).join(':')
              const end_time = schedule.end_time.split(' ')[1].split(':').slice(0, 2).join(':')
              const duration = start_time + '-' + end_time
              const obj = {
                value: duration + '+' + scheduleID,
                label: duration,
                children: []
              }
              if (this.optionsEdit.length !== 0) {
                for (const option of this.optionsEdit) {
                  if (option.value.split('+')[0] === duration) {
                    isHave = true
                    break
                  }
                }
              }
              if (!isHave) {
                const children_course = []
                // 先遍历course
                for (const course of this.courseList) {
                  const obj = {
                    value: course.id,
                    label: course.name
                  }
                  children_course.push(obj)
                }

                const children_team = []
                for (const team of this.teamList) {
                  const obj = {
                    value: team.id,
                    label: team.name,
                    children: children_course
                  }
                  children_team.push(obj)
                }
                const children_coach = []
                for (const coach of this.coachList) {
                  const obj = {
                    value: coach.id,
                    label: coach.name,
                    children: children_team
                  }
                  children_coach.push(obj)
                }
                obj.children = children_coach
                this.optionsEdit.push(obj)
              }
            }
          })
          break
        default:
          break
      }
      // 只要点击了button之后就开始获取
    },
    getDate (date, data) {
      // console.log(data.day)
      // 写options
      if (data.isSelected) {
        this.dateCurrent = data.day
        this.schedule.date = data.day
      }
      return ' p-selected'
    },
    handleOpen (index) {
      console.log('open' + index)
    },
    handleAttend (index) {
      const api = '/sellerctr/attendance'
      const student_id = this.tableData[index].student_id
      const sign_in = 0
      const params = {
        sign_in: parseInt(sign_in),
        schedule_id: this.attendSchedule.schedule_id,
        student_id: parseInt(student_id)
      }
      this.$axios.post(api, qs.stringify(params)
      ).then((response) => {
        const code = response.data.code
        if (code === 0) {
          this.tableData[index].sign_in = 'attend'
          this.$alert('签到成功', {
            confirmButtonText: '确定'
          })
        }
      }).catch(() => {
        this.$alert('签到失败', {
          confirmButtonText: '确定'
        })
      })
    },
    handleAbsent (index) {
      const api = '/sellerctr/attendance'
      const student_id = this.tableData[index].student_id
      const sign_in = 1
      const params = {
        sign_in: parseInt(sign_in),
        schedule_id: this.attendSchedule.schedule_id,
        student_id: parseInt(student_id)
      }
      this.$axios.post(api, qs.stringify(params)
      ).then((response) => {
        const code = response.data.code
        if (code === 0) {
          this.tableData[index].sign_in = 'absent'
          this.$alert('签到成功', {
            confirmButtonText: '确定'
          })
        }
      }).catch(() => {
        this.$alert('签到失败', {
          confirmButtonText: '确定'
        })
      })
    },
    handleEdit (index, row) {
      console.log(index, row)
    },
    handleSelect (index, indexPath) {
      console.log(index, indexPath)
    },
    // 用来按钮变色
    buttonClick (key) {
      switch (key) {
        case 'schedule':
          this.update(key)
          break
        case 'checkAttend':
          this.update(key)
          break
        case 'edit':
          this.update(key)
          break
        case 'delete':
          this.update(key)
          break
        default:
          break
      }
      for (const index in this.buttonType) {
        if (index !== key && this.buttonType[index] === 'success') {
          this.buttonType[index] = 'info'
        }
      }
      this.buttonType[key] = (this.buttonType[key] === 'info') ? 'success' : 'info'
      if (this.buttonType[key] === 'success') {
        this.state = key
      } else {
        this.state = 'lookup'
        this.showMenu = false
      }
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
.haveCourse{
  background-color: #87CEFA;
}
.spanText{
  margin-left: 20px;
  color: #52bcf0
}
#schedule {
  .container{
    .el-header{
      text-align: center;
      font-size : 1.875rem;
    }
    .scheduleButton{
      margin: 0;
      margin-left: 15.625rem;
    }

    }
}
</style>
