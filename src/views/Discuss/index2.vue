<template>
  <div>
    <div v-if='!isEdit' class ='discusslist'>
      <page-header title="已发布提议管理"/>
      <el-container>
        <el-main>
          <el-table
            :data="discussTableData"
            @selection-change="handleSelect"
            highlight-current-row
            :border="true"
          >
            <el-table-column
              type="selection"
            />
            <el-table-column
              label="提议人"
              align="center"
            >
            <template slot-scope="scope">
              <span>{{scope.row.user.name}}</span>
            </template>
            </el-table-column>
            <el-table-column
              prop="phone_number"
              label="联系方式"
              align="center"
            >
            <template slot-scope="scope">
              <span>{{scope.row.user.phone_number}}</span>
            </template>
            </el-table-column>
            <el-table-column
              prop="title"
              label="提议标题"
              align="center"
            />
            <el-table-column
              label="提议类型"
              align="center"
            >
              <template slot-scope="scope">
                <span>{{scope.row.type.type}}</span>
              </template>
            </el-table-column>
            <el-table-column
              prop="content"
              label="提议内容"
              align="center"
            />
            <el-table-column
              label="提议状态"
              align="center"
            >
              <template slot-scope="scope">
                <span v-if="scope.row.status == 0">刚上传</span>
                <span v-if="scope.row.status == 1">已发布</span>
              </template>
            </el-table-column>
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
          <el-footer>
            <el-row style="margin-top:1.5rem; ">
              <!-- <el-col :span="3">
                <el-button @click='isAdd = true'>发布议题</el-button>
              </el-col> -->
              <el-col :span="5">
                <el-button @click="deletediscusss">
                  删除议题
                </el-button>
              </el-col>
            </el-row>
          </el-footer>
        </el-footer>
      </el-container>
    </div>
    <div v-if="isEdit" class ='discussInfo'>
      <discussEdit :discuss='discuss' @update="handleEditFinish" @back="backHome"></discussEdit>
    </div>
  </div>
</template>

<script>
  //这里的跳转有问题
import discussEdit from './discussEdit'
import Axios from 'axios'
import qs from 'qs'
export default {
  components: {
    discussEdit
  },
  data () {
    return {
      api:'/api/community/manage/proposal/',
      discuss:{},
      isEdit: false,
      isAdd: false,
      discussTableData:[],
      discussForm:{},
      selecteddiscusss:[]
    }
  },
  created () {
    this.getData()
  },
  methods: {
    getData () {
      Axios.get(this.api,{
        params:{
          tag:1
        }
      }).then(response => {
        this.discussTableData = response.data.data
      }).catch(e => {
        console.error(e)
        this.$message.error(`获取信息列表失败: ${e.message || '未知错误'}`)
        this.discussTableData = []
      }).finally(() => { this.loading = false })
    },
    handleEditFinish (val) {
      if (val) {
        //获取新数据
        this.getData()
        this.isEdit = false
      }
    },
    backHome (val) {
      this.isEdit = val
      this.getData()
    },
    handleEdit(index,row) {
      this.isEdit = true
      this.discuss = this.discussTableData[index]
      console.log(index,row)
    },
    adddiscuss() {
      this.isAdd = false
    },
    deletediscuss (discuss) {
      console.log('discuss', discuss)
      const data = {
        id: discuss.id
      }
      return this.$axios.delete(this.api, {data:qs.stringify(data)})
    },
    deletediscusss () {
      this.$confirm('是否删除选中的议题', '提示', { type: 'warning' }).then(() => {
        Promise.all(this.selecteddiscusss.map(this.deletediscuss))
          .then(() => this.$alert('删除成功', '成功', { type: 'success' }).then(()=>{
            this.getData()
          }), (e) => {
            console.error(e)
            this.$alert('删除失败', '错误', { type: 'error' })
          })
          .then()
      })
    },
    handleSelect (val) {
      this.selecteddiscusss = val
    }
  }
}
</script>

<style lang="scss">
</style>
