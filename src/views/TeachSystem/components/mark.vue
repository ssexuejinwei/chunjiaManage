<template>
  <div class="markPage">
    <!-- 课后反馈 -->
    <div
      v-if="markIndex==1"
      class="afterClass"
    >
      <el-table
        v-if="!isClicked"
        :data="tableCourse"
        style="width: 100%;"
        class="courseTable"
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
          label="操作"
        >
          <template slot-scope="scope">
            <el-button
              v-if="tableCourse[scope.$index]['status']=='未评测'"
              size="medium"
              type="success"
              @click="handleMark(scope.$index,scope.row)"
            >
              未评测
            </el-button>
            <el-button
              v-if="tableCourse[scope.$index]['status']=='已评测'"
              size="medium"
              type="info"
              @click="handleCheckMark(scope.$index,scope.row)"
            >
              已评测
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        v-if="!isClicked"
        :page-size="pageSizeForCourse"
        style="text-align: right;"
        layout="prev, pager, next"
        :total="courseTotal"
        @current-change="handleCoursePageChange"
      />
      <!-- 评测页面 -->
      <div
        v-if="isClicked"
        class="courseMark"
      >
        <el-button
          type="info"
          icon="el-icon-back"
          @click="isClicked = false"
        >
          返回
        </el-button>
        <!-- 查看评测页面 -->
        <div
          v-if="mode=='check'"
          class="check"
        >
          <el-table
            :data="tableMark"
            :span-method="objectSpanMethod"
            border
            style="width: 100%; margin-top: 20px"
          >
            <el-table-column
              prop="content"
              label="内容"
            />
            <el-table-column
              prop="performance"
              label="表现"
            />
            <el-table-column
              label="评分"
            >
              <template slot-scope="scope">
                <el-rate
                  v-model="tableMark[scope.$index]['value']"
                  disabled
                  text-color="#ff9900"
                  score-template="{value}"
                />
              </template>
            </el-table-column>
          </el-table>
        </div>
        <!-- 提交评测页面 -->
        <div
          v-if="mode=='submit'"
          class="check"
        >
          <el-table
            :data="tableMark"
            :span-method="objectSpanMethod"
            border
            style="width: 100%; margin-top: 20px"
          >
            <el-table-column
              prop="content"
              label="内容"
            />
            <el-table-column
              prop="performance"
              label="表现"
            />
            <el-table-column
              label="评分"
            >
              <template slot-scope="scope">
                <el-rate
                  v-model="tableMark[scope.$index]['value']"
                  text-color="#ff9900"
                  score-template="{value}"
                />
              </template>
            </el-table-column>
          </el-table>
          <el-col
            :span="6"
            :offset="9"
            style="margin-top: 1.25rem;"
          >
            <el-button
              type="success"
              style="text-align: center;"
              @click="courseSubmit"
            >
              提交
            </el-button>
          </el-col>
        </div>
      </div>
    </div>
    <!-- 阶段性评测 -->
    <div
      v-if="markIndex==2"
      class="phaseMark"
    >
      <el-form v-if="false" :model="timeForm" label-width="80px">
        <el-row>
          <el-col :span="8">
            <el-form-item
              label="开始时间"
              prop="start"
            >
              <el-date-picker
                v-model="timeForm.start"
                type="date"
                placeholder="选择日期"
                format="yyyy 年 MM 月 dd 日"
                value-format="yyyy-MM-dd"
              />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item
              label="结束时间"
              prop="end"
            >
              <el-date-picker
                v-model="timeForm.end"
                type="date"
                placeholder="选择日期"
                format="yyyy 年 MM 月 dd 日"
                value-format="yyyy-MM-dd"
              />
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <el-table
        v-if="!isClicked"
        :data="tablePhase"
        style="width: 100%;"
        class="courseTable"
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
          label="操作"
        >
          <template slot-scope="scope">
            <el-button
              v-if="tablePhase[scope.$index]['status']=='详情'"
              size="medium"
              type="success"
              @click="handleMark(scope.$index,scope.row)"
            >
              详情
            </el-button>
            <el-button
              v-if="tablePhase[scope.$index]['status']=='已评测'"
              size="medium"
              type="info"
              @click="handleCheckMark(scope.$index,scope.row)"
            >
              已评测
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- <el-pagination
        v-if="!isClicked"
        :page-size="pageSizeForPhase"
        style="text-align: right;"
        layout="prev, pager, next"
        :total="phaseTotal"
        @current-change="handlePhaseChange"
      /> -->

      <!-- 具体评测页面 -->
      <div
        v-if="isClicked"
        class="courseMark"
      >
        <el-button
          type="info"
          icon="el-icon-back"
          @click="isClicked = false"
        >
          返回
        </el-button>
        <!-- 查看评测页面 -->
        <div
          v-if="mode=='check'"
          class="check"
        >
          <el-table
            :data="tableMark"
            :span-method="objectSpanMethod"
            border
            style="width: 100%; margin-top: 20px"
          >
            <el-table-column
              prop="content"
              label="内容"
            />
            <el-table-column
              prop="performance"
              label="表现"
            />
            <el-table-column
              label="评分"
            >
              <template slot-scope="scope">
                <el-rate
                  v-model="tableMark[scope.$index]['value']"
                  disabled
                  text-color="#ff9900"
                  score-template="{value}"
                />
              </template>
            </el-table-column>
          </el-table>
          <el-col style="margin-top: 1.25rem;">
            教练评语:<el-input
              v-model="textarea"
              type="textarea"
              placeholder="输入评语"
              style="text-align: center; "
            />
          </el-col>
        </div>
        <!-- 提交评测页面 -->
        <div
          v-if="mode=='submit'"
          class="check"
        >
          <el-table
            :data="tableMark"
            :span-method="objectSpanMethod"
            border
            style="width: 100%; margin-top: 20px"
          >
            <el-table-column
              prop="content"
              label="内容"
            />
            <el-table-column
              prop="performance"
              label="表现"
            />
            <el-table-column
              label="评分"
            >
              <template slot-scope="scope">
                <el-rate
                  v-model="tableMark[scope.$index]['value']"
                  text-color="#ff9900"
                  score-template="{value}"
                  disabled
                />
              </template>
            </el-table-column>
          </el-table>
          <br>
          教练评语:
          <el-input
            v-model="phaseTextArea"
            type="textarea"
            placeholder="输入评语"
            style="text-align: center; "
          />

          <el-col
            :span="6"
            :offset="9"
            style="margin-top: 1.25rem;"
          >
            <el-button
              type="success"
              style="text-align: center;"
              @click="phaseSubmit"
            >
              提交
            </el-button>
          </el-col>
        </div>
      </div>
    </div>
    <!-- 年度体测 -->
    <div
      v-if="markIndex == 3"
      class="yearMark"
    >
      <el-table
        v-if="!isClicked"
        :data="tableYear"
        style="width: 100%;"
        class="courseTable"
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
          label="操作"
        >
          <template slot-scope="scope">
            <el-button
              v-if="tableYear[scope.$index]['status']=='详情'"
              size="medium"
              type="success"
              @click="handleMark(scope.$index,scope.row)"
            >
              详情
            </el-button>
            <el-button
              v-if="tableYear[scope.$index]['status']=='已评测'"
              size="medium"
              type="info"
              @click="handleCheckMark(scope.$index,scope.row)"
            >
              已评测
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- <el-pagination
        v-if="!isClicked"
        :page-size="pageSizeForYear"
        style="text-align: right;"
        layout="prev, pager, next"
        :total="yearTotal"
        @current-change="handleYearChange"
      /> -->
      <!-- 具体评测页面 -->
      <div
        v-if="isClicked"
        class="yearMark"
      >
        <el-button
          type="info"
          icon="el-icon-back"
          @click="isClicked = false"
        >
          返回
        </el-button>
        <PFigure :star="yearStar" />
        <!-- 查看评测页面 -->
        <br>
        <div
          v-if="mode=='check'"
          class="check"
        >
          教练评语:<el-input
            v-model="textarea"
            type="textarea"
            placeholder="输入评语"
            style="text-align: center; "
          />
          针对性建议:<el-input
            v-model="textarea"
            type="textarea"
            placeholder="输入评语"
            style="text-align: center; "
          />
        </div>
        <br>
        <!-- 提交评测页面 -->
        <div
          v-if="mode=='submit'"
          class="check"
        >
          教练评语:<el-input
            v-model="yearEvaluate"
            type="textarea"
            placeholder="输入评语"
            style="text-align: center; "
          />
          针对性建议:<el-input
            v-model="yearAdvice"
            type="textarea"
            placeholder="输入评语"
            style="text-align: center; "
          />
          <el-col
            :span="6"
            :offset="9"
            style="margin-top: 1.25rem;"
          >
            <el-button
              type="success"
              style="text-align: center;"
              @click="yearSubmit"
            >
              提交
            </el-button>
          </el-col>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import PFigure from './figure'
import qs from 'qs'
export default {
  components: {
    PFigure
  },
  props: {
    student: {
      type: Object,
      default: () => {}
    },
    markIndex: {
      type: Number,
      default: 1
    }
  },
  data () {
    return {
      phaseTextArea: 'xxxxxx',
      yearEvaluate: 'xxxx',
      yearAdvice: 'xxxxxx',
      scheduleId: 1,
      yearTpId: 1,
      yearStar: {},
      phaseTpId: 1,
      phaseStar: {},
      textarea: 'xxxxxxxxxxxxxxxxxxxxxxxxx',
      mode: '',
      isClicked: false,
      pageSizeForCourse: 4,
      courseTotal: 1,
      curPageForCourse: 1,
      pageSizeForPhase: 4,
      phaseTotal: 1,
      curPageForPhase: 1,
      pageSizeForYear: 4,
      yearTotal: 1,
      curPageForYear: 1,
      timeForm: {
        start: '2020-1-1',
        end: '2020-1-2'
      },
      markItem: [],
      tableCourse: [],
      tablePhase: [],
      tableYear: [],
      tableMark: [{
        content: '教学内容',
        value: 4,
        performance: '团队表现'
      },
      {
        content: '教学内容',
        value: 3,
        performance: '个人表现'
      },
      {
        content: '运动目标',
        value: 2,
        performance: '身体素质'
      },
      {
        content: '运动目标',
        value: 4,
        performance: '技能'
      },
      {
        content: '情感目标',
        value: 3,
        performance: '团队表现'
      },
      {
        content: '情感目标',
        value: 4,
        performance: '个人表现'
      }
      ]
    }
  },
  watch: {
    markIndex () {
      this.isClicked = false
    }
  },
  created () {
    // for (let i = 0; i < 3; i++) {
    //   // const jobj = {
    //   //   course: '3-4岁初级篮球(team-01)',
    //   //   time: '2020-03-08 ————2020-06-08',
    //   //   status: i === 0 ? '未评测' : '已评测'
    //   // }
    //   // const kobj = {
    //   //   course: '全学年体测评价(team-01)',
    //   //   time: '2020-03-08 ————2020-06-08',
    //   //   status: i === 0 ? '未评测' : '已评测'
    //   // }
    //   // this.tableCourse.push(iobj)
    //   // this.tablePhase.push(jobj)
    //   // this.tableYear.push(kobj)
    // }
    this.getCourse()
    this.getPhase()
    this.getYear()
  },
  methods: {
    getYear () {
      const api = '/sellerctr/getYearScore'
      const param = {
        id: this.student.id
      }
      this.tableYear = []
      this.$axios.post(api, qs.stringify(param)).then((response) => {
        const data = response.data.data
        for (const year of data) {
          this.tableYear.push({
            tpID: year.tp_id,
            course: year.name + '(' + this.student.teamName + ')',
            time: year.start_time + '----' + year.end_time,
            status: '详情'
          })
        }
      }).catch(() => {
        this.$alert('获取全年评测数据失败')
      })
    },
    getPhase () {
      const api = '/sellerctr/getSessionScore'
      const param = {
        id: this.student.id
      }
      this.tablePhase = []
      this.$axios.post(api, qs.stringify(param)).then((response) => {
        const data = response.data.data
        for (const phase of data) {
          const obj = {
            tpID: phase.tp_id,
            course: phase.name + '(' + this.student.teamName + ')',
            time: phase.start_time + '----' + phase.end_time,
            status: '详情'
          }
          this.tablePhase.push(obj)
        }
      }).catch(() => {
        this.$alert('获取阶段性评测数据失败')
      })
    },
    getCourse () {
      const api = '/sellerctr/getMarkingList'
      const data = {
        student_id: this.student.id,
        team_id: this.student.teamID,
        cur_page: this.curPageForPhase
      }
      this.$axios.post(api, qs.stringify(data)).then((response) => {
        this.tableCourse = []
        this.courseTotal = response.data.data.total
        this.pageSizeForCourse = response.data.data.per_page
        const data = response.data.data.data
        for (const course of data) {
          const obj = {
            id: course.id,
            tpID: course.tp_id,
            course: course.tp_name + '(' + course.team_name + ')',
            time: course.start_time + '-' + course.end_time.split(' ')[1],
            status: course.star === 0 ? '未评测' : '已评测',
            sortKey: course.star
          }
          this.tableCourse.push(obj)
        }
        this.tableCourse.sort((a, b) => b.sortKey - a.sortKey)
      }).catch(() => {
        this.$alert('获取课后反馈数据失败')
      })
    },
    yearSubmit () {
      const api = '/sellerctr/updateYearScore'
      this.$axios.post(api, qs.stringify({
        id: this.yearTpId,
        evaluate: this.yearEvaluate,
        advice: this.yearAdvice
      })).then((response) => {
        this.$alert('提交成功', {
          confirmButtonText: '确定'
        }).then(() => {
          this.isClicked = false
          this.getYear()
        })
      }).catch(() => {
        this.$alert('提交失败', {
          confirmButtonText: '确定'
        })
      })
    },
    courseSubmit () {
      const api = '/sellerctr/marking'
      let i = 0
      const star = []
      for (const itemLength of this.markItem) {
        const list = []
        let title = ''
        for (let j = 0; j < itemLength; j++) {
          title = this.tableMark[i].content
          list.push({
            id: this.tableMark[i].id,
            score: this.tableMark[i].value
          })
          i++
        }
        star.push({
          title: title,
          list: list
        })
      }
      const data = {
        schedule_id: this.scheduleId,
        student_id: this.student.id,
        star: JSON.stringify(star)
      }
      this.$axios.post(api, qs.stringify(data)).then((response) => {
        this.$alert('提交成功', {
          confirmButtonText: '确定'
        }).then(() => {
          this.getCourse()
          this.isClicked = false
        })
      }).catch(() => {
        this.$alert('提交失败', {
          confirmButtonText: '确定'
        })
      })
    },
    phaseSubmit () {
      const api = '/sellerctr/updateSessionScore'
      this.$axios.post(api, qs.stringify({
        id: this.phaseTpId,
        advice: this.phaseTextArea
      })).then((response) => {
        this.$alert('提交成功', {
          confirmButtonText: '确定'
        }).then(() => {
          this.getPhase()
          this.isClicked = false
        })
      }).catch(() => {
        this.$alert('提交失败', {
          confirmButtonText: '确定'
        })
      })
    },
    objectSpanMethod ({ row, column, rowIndex, columnIndex }) {
      console.log(row, column)
      if (columnIndex === 0) {
        if (rowIndex % this.tableMark[rowIndex].type === 0) {
          return {
            rowspan: this.tableMark[rowIndex].type,
            colspan: 1
          }
        } else {
          return {
            rowspan: 0,
            colspan: 0
          }
        }
      }
    },
    handleMark (index, row) {
      console.log(row)
      if (this.markIndex === 1) {
        const api = '/sellerctr/getMarkingById'
        this.scheduleId = this.tableCourse[index].id
        const data = {
          student_id: this.student.id,
          schedule_id: this.tableCourse[index].id,
          tp_id: this.tableCourse[index].tpID
        }
        this.$axios.get(api, {
          params: data
        }).then((response) => {
          const data = response.data.data.star
          this.tableMark = []
          this.markItem = []
          let i = 0
          for (const mark of data) {
            const list = mark.list
            this.markItem.push(list.length)
            for (const item of list) {
              if (item.name === '') {
                continue
              }
              this.tableMark.push({
                content: mark.title,
                id: item.id,
                value: 0,
                performance: item.name,
                type: this.markItem[i]
              })
            }
            i++
          }
          this.isClicked = true
          this.mode = 'submit'
        })
      } else if (this.markIndex === 2) {
        const api = '/sellerctr/getgetSessionScoreDetail'
        this.phaseTpId = this.tablePhase[index].tpID
        this.$axios.post(api, qs.stringify({
          tp_id: this.tablePhase[index].tpID,
          student_id: this.student.id
        })).then((response) => {
          const star = response.data.data.star
          this.phaseTextArea = response.data.data.advice
          this.tableMark = []
          const b = {}
          star.forEach(v => {
            b[v.title] || (b[v.title] = [])
            b[v.title] && b[v.title].push(v)
          })
          console.log('index', b)
          this.markItem = []
          for (const key of Object.keys(b)) {
            this.markItem.push(b[key].length)
            for (const item of b[key]) {
              this.tableMark.push({
                content: item.title,
                value: item.score,
                id: item.id,
                performance: item.name,
                type: b[key].length
              })
            }
          }
          this.isClicked = true
          this.mode = 'submit'
        }).catch(() => {
          this.$alert('暂无评测数据')
        })
      } else {
        const api = '/sellerctr/getgetYearScoreDetail'
        this.yearTpId = this.tableYear[index].tpID
        this.$axios.post(api, qs.stringify({
          tp_id: this.tablePhase[index].tpID,
          student_id: this.student.id
        })).then((response) => {
          this.yearStar = response.data.data
          if (this.yearStar.length !== 0) {
            this.yearAdvice = response.data.data.advice
            this.yearEvaluate = response.data.data.evaluate
            this.isClicked = true
            this.mode = 'submit'
          } else {
            this.$alert('暂无评测数据')
          }
        }).catch(() => {
          this.$alert('暂无评测数据')
        })
      }
    },
    handleCheckMark (index, row) {
      console.log(row)
      if (this.markIndex === 1) {
        const api = '/sellerctr/getMarkingById'
        this.scheduleId = this.tableCourse[index].id
        const data = {
          student_id: this.student.id,
          schedule_id: this.tableCourse[index].id,
          tp_id: this.tableCourse[index].tpID
        }
        this.$axios.get(api, {
          params: data
        }).then((response) => {
          const data = response.data.data.star
          this.tableMark = []
          this.markItem = []
          let i = 0
          for (const mark of data) {
            const list = mark.list
            this.markItem.push(list.length)
            for (const item of list) {
              this.tableMark.push({
                content: mark.title,
                id: item.id,
                value: item.score,
                performance: item.name,
                type: this.markItem[i]
              })
            }
            i++
          }
          this.isClicked = true
          this.mode = 'check'
        })
      } else {
        console.log('我在checkmark')
      }
    },
    handleCoursePageChange (val) {
      this.curPageForCourse = val
      this.getCourse()
    }

  }
}
</script>

<style>

</style>
