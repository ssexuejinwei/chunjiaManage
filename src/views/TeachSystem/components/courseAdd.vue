<template>
  <div class="courseAdd">
    <header style="background-color: #FFFFFF;">
      <h1>添加课程</h1>
    </header>
    <el-container>
      <el-aside />
      <el-container>
        <!-- 基本信息 -->
        <el-main class="basicInfo">
          <el-form :model="courseForm">
            <el-row>
              <el-col :span="14">
                <el-form-item prop="age">
                  <el-radio-group v-model="courseForm.age">
                    <el-radio-button label="3-4岁" />
                    <el-radio-button label="4-5岁" />
                    <el-radio-button label="5-6岁" />
                  </el-radio-group>
                </el-form-item>
              </el-col>
              <el-col
                :span="8"
                :offset="2"
              >
                <el-form-item prop="type">
                  <el-radio-group v-model="courseForm.type">
                    <el-radio-button label="篮球" />
                    <el-radio-button label="足球" />
                  </el-radio-group>
                </el-form-item>
              </el-col>
            </el-row>

            <el-row>
              <el-col :span="12">
                <el-form-item
                  label="课程名称"
                  prop="name"
                >
                  <el-col :span="10">
                    <el-input v-model="courseForm.name" />
                  </el-col>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item
                  label="学员人数设置(人):"
                  prop="person"
                >
                  <el-col :span="10">
                    <el-input v-model="courseForm.person" />
                  </el-col>
                </el-form-item>
              </el-col>
              <br><br><br><br>
              <el-form-item
                size="large"
                style="text-align: center;"
              >
                <el-button @click="handleRest(0)">
                  重置
                </el-button>
              </el-form-item>
            </el-row>
          </el-form>
        </el-main>

        <br><br>
        <!-- 选择训练流程 -->
        <el-main class="stepInfo">
          <el-col style="text-align: right;">
            <el-button @click="addStep">
              <i class="el-icon-plus" />
            </el-button>
            <el-button
              :disabled="stepsList.length==0?true:false"
              @click="deleteStep"
            >
              <i class="el-icon-delete" />
            </el-button>
          </el-col>
          <br>
          <br>
          <br>
          <el-row
            v-for="(value,index) in stepsList"
            :key="index"
          >
            <el-col :span="6">
              <el-card>
                <div style="text-align: center;">
                  <slot> 步骤-{{ index+1 }}</slot>
                </div>
              </el-card>
            </el-col>
            <el-col
              :span="8"
              :offset="3"
            >
              <el-radio-group
                v-model="value.radio"
                :class="radioDisplay(value,index)"
              >
                <el-radio-button label="有球" />
                <el-radio-button label="无球" />
              </el-radio-group>
            </el-col>
            <el-col
              :span="6"
              :offset="value.className=='radio-hide'?11:0"
            >
              <el-select
                v-model="value.select"
                placeholder="请选择"
              >
                <el-option
                  v-for="item in value.options"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </el-col>
            <br><br>
            <br><br>
          </el-row>
          <el-row>
            <el-col style="text-align: center;">
              <el-button @click="handleRest(1)">
                重置
              </el-button>
            </el-col>
          </el-row>
        </el-main>
        <br><br>

        <!-- 选择评测项 -->
        课程评测项
        <el-main class="markInfo">
          <el-form
            ref="form"
            :model="markForm"
            label-width="100px"
          >
            <el-form-item label="身体素质目标:">
              <el-col
                v-for="(value,index) in markForm.body"
                :key="index"
                :span="3"
                style="margin-left: 0.625rem;"
              >
                <el-input v-model="markForm.body[index]" />
              </el-col>
            </el-form-item>
            <el-form-item label="技术目标:">
              <el-col
                v-for="(value,index) in markForm.technical"
                :key="index"
                :span="3"
                style="margin-left: 0.625rem;"
              >
                <el-input v-model="markForm.technical[index]" />
              </el-col>
            </el-form-item>
            <el-form-item label="情感目标:">
              <el-col
                v-for="(value,index) in markForm.sense"
                :key="index"
                :span="3"
                style="margin-left: 0.625rem;"
              >
                <el-input v-model="markForm.sense[index]" />
              </el-col>
            </el-form-item>
            <el-col style="text-align: center;">
              <el-button @click="handleRest(2)">
                重置
              </el-button>
            </el-col>
          </el-form>
        </el-main>
        <el-footer>
          <el-col style="text-align: center;margin-top: 1.25rem;">
            <el-button
              type="danger"
              @click="save"
            >
              提交
            </el-button>
            <el-button @click="cancel">
              取消
            </el-button>
          </el-col>
        </el-footer>
      </el-container>
      <el-aside />
    </el-container>
  </div>
</template>

<script>
import qs from 'qs'
export default {
  data () {
    return {
      outerVisible: false,
      courseForm: {
        age: '3-4岁',
        type: '篮球',
        person: '',
        name: ''
      },
      markForm: {
        body: [],
        technical: [],
        sense: []
      },
      stepsList: [{
        stepName: '',
        radio: '有球',
        index: 0,
        select: '0',
        className: '',
        options: [{
          value: '0',
          label: '热身'
        }, {
          value: '1',
          label: '跑步一小时'
        }, {
          value: '2',
          label: '仰卧起坐30个'
        },
        {
          value: '3',
          label: '放松'
        },
        {
          value: '4',
          label: '无'
        }]
      }
      ]
    }
  },
  created () {
    for (let i = 0; i < 6; i++) {
      this.markForm.body.push('')
      this.markForm.technical.push('')
      this.markForm.sense.push('')
    }
  },
  methods: {
    cancel () {
      this.$router.go(-1)// 返回上一层
    },
    makeSure () {

    },
    save () {
      const api = '/sellerctr/addTeachingPlan'
      for (let i = 0; i < 6; i++) {
        if (this.markForm.body[i] === '') {
          this.markForm.body.splice(i, 1)
          i--
        }
      }
      console.log(this.markForm.body)
      for (let i = 0; i < 6; i++) {
        if (this.markForm.technical[i] === '') {
          this.markForm.technical.splice(i, 1)
          i--
        }
      }
      for (let i = 0; i < 6; i++) {
        if (this.markForm.sense[i] === '') {
          this.markForm.sense.splice(i, 1)
          i--
        }
      }
      const star = [{
        title: '身体素质目标',
        list: this.markForm.body
      }, {
        title: '技术目标',
        list: this.markForm.technical
      }, {
        title: '情感目标',
        list: this.markForm.sense
      }]
      const trainingId = []
      for (const step of this.stepsList) {
        trainingId.push(Number(step.options[step.select].value))
      }
      const data = {
        training_id: JSON.stringify(trainingId),
        type: this.courseForm.type === '篮球' ? 0 : 1,
        age_min: Number(this.courseForm.age.split('-')[0]),
        age_max: Number(this.courseForm.age.split('-')[1].split('岁')[0]),
        name: this.courseForm.name,
        star: JSON.stringify(star),
        people_num: Number(this.courseForm.person)
      }
      this.$axios.post(api, qs.stringify(data)).then((response) => {
        this.$alert('保存成功').then(() => {
          this.$router.go(-1)
        })
      }).catch(() => {
        this.$alert('保存失败')
      })
    },
    radioDisplay (value, index) {
      console.log(value.select)
      console.log(value.options[value.select].label)

      if (value.select === '') {
        console.log('display-0')
        this.stepsList[index].className = 'radio-display'
        return 'radio-display'
      } else if (value.options[value.select].label !== '热身' && (value.options[value.select].label.indexOf('放松') === -1)) {
        this.stepsList[index].className = 'radio-display'
        return 'radio-display'
      } else {
        this.stepsList[index].className = 'radio-hide'
        return 'radio-hide'
      }
    },
    handleRest (data) {
      switch (data) {
        case 0:
          this.courseForm = {
            age: '3-4岁',
            type: '篮球',
            person: '',
            name: ''
          }
          break
        case 2:
          this.markForm = {
            body: [],
            technical: [],
            sense: []
          }
          for (let i = 0; i < 6; i++) {
            this.markForm.body.push('')
            this.markForm.technical.push('')
            this.markForm.sense.push('')
          }
          break
        case 1:
          this.stepsList = [{
            stepName: '',
            radio: '有球',
            index: 0,
            select: '0',
            className: '',
            options: [{
              value: '0',
              label: '热身'
            }, {
              value: '1',
              label: '跑步一小时'
            }, {
              value: '2',
              label: '仰卧起坐30个'
            },
            {
              value: '3',
              label: '放松'
            },
            {
              value: '4',
              label: '无'
            }]
          }
          ]
          break
        default:
          break
      }
    },
    deleteStep () {
      this.stepsList.pop()
    },
    addStep () {
      const obj = {
        stepName: '',
        radio: '有球',
        index: 0,
        select: '0',
        options: [{
          value: '0',
          label: '热身'
        }, {
          value: '1',
          label: '跑步一小时'
        }, {
          value: '2',
          label: '仰卧起坐30个'
        },
        {
          value: '3',
          label: '放松'
        },
        {
          value: '4',
          label: '无'
        }]
      }
      this.stepsList.push(obj)
    }
  }
}
</script>

<style lang="scss">
  .courseAdd{
    header {
      padding: 0.5rem 1rem;
      margin-bottom: 2rem;
      background: #FE8083;
      h1 {
        font-size: 1rem;
        margin: 0;
      }
    }
    .el-container{
      .el-container{
        .basicInfo{
          border: 1px solid ;
        }
        .stepInfo{
          border: 1px solid ;
          .radio-display{
          }
          .radio-hide{
            display: none;
          }
        }
        .markInfo{
          border: 1px solid ;
        }
      }
    }
  }
</style>
