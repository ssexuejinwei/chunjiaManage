<template>
  <div>
    <div v-if='!isEdit' v-loading="loading" class ='activitylist'>
      <page-header title="党员活动信息管理"/>
      <el-container>
        <el-main>
          <el-table
            :data="activityTableData"
            @selection-change="handleSelect"
            highlight-current-row
            :border="true"
          >
            <el-table-column
              type="selection"
            />
            <el-table-column
              prop="name"
              label="活动名"
              align="center"
            />
            <el-table-column
              prop="activity_time"
              label="时间"
              align="center"
            />
            <el-table-column
              prop="content"
              label="活动内容"
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
            <el-col :span="3">
              <el-button @click='isAdd = true'>添加活动</el-button>
            </el-col>
            <el-col :span="5">
              <el-button @click="deleteactivitys">
                删除活动
              </el-button>
            </el-col>
          </el-row>
        </el-footer>
      </el-container>
      <el-dialog
        title="活动信息"
        :visible.sync="isAdd "
      >
        <el-form
          :model="activityForm"
          label-width="100px"
          style="width:31.25rem;"
        >
          <el-form-item
            label="活动名称"
            prop="name"
          >
            <el-input
              v-model="activityForm.name"
              autocomplete="off"
            />
          </el-form-item>
          <el-form-item
            label="活动日期"
            prop="activity_time"
          >
            <el-col :span="11">
              <el-date-picker
                v-model="activityForm.activity_time"
                type="date"
                placeholder="选择日期"
                format="yyyy 年 MM 月 dd 日"
                value-format="yyyy-MM-dd"
                style="width: 100%;"
              />
            </el-col>
          </el-form-item>
          <el-form-item
            label="活动具体内容"
            prop="content"
          >
          <el-input
            v-model="activityForm.content"
            autocomplete="off"
          />
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
            <el-button @click="isAdd = false">取 消</el-button>
            <el-button type="primary" @click="addActivity">确 定</el-button>
          </span>
        </el-dialog>
    </div>
    <div v-if="isEdit" class ='activityInfo'>
      <activityEdit :activity='activity' @update="handleEditFinish" @back="backHome"></activityEdit>
    </div>
  </div>
</template>

<script>
  //这里的跳转有问题
import activityEdit from './components/activityEdit'
import Axios from 'axios'
import qs from 'qs'
export default {
  components: {
    activityEdit
  },
  data () {
    return {
      api:'/api/community/manage/party_activity/',
      selectedactivitys:[],
      activity:{},
      isEdit: false,
      isAdd: false,
      activityTableData:[],
      activityForm:{},
      loading:true
    }
  },
  created () {
    this.getData()
  },
  methods: {
    getData () {
      Axios.get(this.api).then(response => {
        this.activityTableData = response.data.data
      }).catch(e => {
        console.error(e)
        this.$message.error(`获取信息列表失败: ${e.message || '未知错误'}`)
        this.activityTableData = []
      }).finally(() => { 
        this.loading = false
        this.isEdit = false
       })
    },
    handleEditFinish (val) {
      if (val) {
        //获取新数据
        this.getData()
        this.isEdit = false
      }
    },
    backHome (val) {
      // this.isEdit = val
      // this.$router.go(0)
      this.getData()
    },
    handleEdit(index,row) {
      this.isEdit = true
      this.activity = this.activityTableData[index]
      console.log(index,row)
    },
    addActivity() {
      Axios.post(this.api, qs.stringify(this.activityForm))
        .then(() => {
          this.$alert('添加成功', '成功').then(() => {
            this.getData()
            this.isAdd = false
          })
        }).catch(e => {
          console.error(e)
          this.$alert(`错误原因: ${e.message || '未知错误'}`, '添加失败')
        })
    },
    deleteactivity (activity) {
      const data = {
        id: activity.id
      }
      return this.$axios.delete(this.api, {data:qs.stringify(data)})
    },
    deleteactivitys () {
      this.$confirm('是否删除选中的活动', '提示', { type: 'warning' }).then(() => {
        Promise.all(this.selectedactivitys.map(this.deleteactivity))
          .then(() => this.$alert('删除成功', '成功', { type: 'success' }).then(()=>{
            this.getData()
          }), (e) => {
            console.error(e)
            this.$alert('删除失败', '错误', { type: 'error' })
          })
      })
    },
    handleSelect (val) {
      this.selectedactivitys = val
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
