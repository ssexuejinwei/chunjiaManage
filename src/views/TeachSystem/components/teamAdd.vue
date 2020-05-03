<template>
  <div class="courseAdd">
    <header style="background-color: #FFFFFF;">
      <h1>添加队伍</h1>
    </header>
    <el-container>
      <el-aside />
      <el-container>
        <!-- 基本信息 -->
        <el-main class="basicInfo">
          <el-form :model="teamForm">
            <el-row>
              <el-col :span="14">
                <el-form-item prop="age">
                  <el-radio-group v-model="teamForm.age">
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
                  <el-radio-group v-model="teamForm.type">
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
                    <el-input v-model="teamForm.name" />
                  </el-col>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="14">
                <el-form-item
                  label="体能训练"
                  prop="physicalTraining"
                >
                  <el-radio-group v-model="teamForm.physicalTraining">
                    <el-radio :label="0">
                      否
                    </el-radio>
                    <el-radio :label="1">
                      是
                    </el-radio>
                    <el-radio :label="2">
                      一年以上
                    </el-radio>
                  </el-radio-group>
                </el-form-item>
              </el-col>
              <el-col
                :span="8"
                :offset="2"
              >
                <el-form-item
                  label="球类训练"
                  prop="ballTraining"
                >
                  <el-radio-group v-model="teamForm.ballTraining">
                    <el-radio :label="0">
                      否
                    </el-radio>
                    <el-radio :label="1">
                      是
                    </el-radio>
                  </el-radio-group>
                </el-form-item>
              </el-col>
            </el-row>
            <el-form-item
              size="large"
              style="text-align: center;"
            >
              <el-button @click="handleRest(0)">
                重置
              </el-button>
            </el-form-item>
          </el-form>
        </el-main>
      </el-container>
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
  </div>
</template>
<script>
import qs from 'qs'
export default {
  data () {
    return {
      teamForm: {
        age: '3-4岁',
        type: '篮球',
        name: '',
        physicalTraining: '',
        ballTraining: ''
      }
    }
  },
  methods: {
    handleRest () {
      this.teamForm = {
        age: '3-4岁',
        type: '篮球',
        name: '',
        physicalTraining: '',
        ballTraining: ''
      }
    },
    save () {
      const api = '/sellerctr/addTeams'
      const data = {
        name: this.teamForm.name,
        physical_training: this.teamForm.physicalTraining,
        ball_training: this.teamForm.ballTraining,
        choose_sports: this.teamForm.type === '篮球' ? '0' : '1',
        age_min: this.teamForm.age.split('-')[0],
        age_max: this.teamForm.age.split('-')[1].split('岁')[0]
      }
      this.$axios.post(api, qs.stringify(data)).then((response) => {
        this.$alert('保存成功').then(() => {
          this.$router.go(-1)
        })
      }).catch(() => {
        this.$alert('保存失败')
      })
    },
    cancel () {
      this.$router.go(-1)// 返回上一层
    }
  }
}
</script>
<style lang="scss">
</style>
