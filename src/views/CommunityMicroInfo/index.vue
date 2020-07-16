<template>
  <div>
    <div v-if='!isEdit' class ='communityMicroInfolist'>
      <page-header title="社区微信息管理"/>
      <el-container>
        <el-main>
          <el-table
            :data="communityMicroInfoTableData"
            @selection-change="handleSelect"
            highlight-current-row
            :border="true"
          >
            <el-table-column
              type="selection"
            />
            <el-table-column
              prop="title"
              label="标题"
              align="center"
            />
            <el-table-column
              prop="publisher"
              label="发布者"
              align="center"
            />
            <el-table-column
              prop="content"
              label="内容"
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
              <el-button @click='isAdd = true'>添加微信息</el-button>
            </el-col>
            <el-col :span="5">
              <el-button @click="deletecommunityMicroInfos">
                删除微信息
              </el-button>
            </el-col>
          </el-row>
        </el-footer>
      </el-container>
      <el-dialog
        title="社区微信息"
        :visible.sync="isAdd "
      >
        <el-form
          :model="communityMicroInfoForm"
          label-width="100px"
          style="width:31.25rem;"
        >
          <el-form-item
            label="标题"
            prop="title"
          >
            <el-input
              v-model="communityMicroInfoForm.title"
              autocomplete="off"
            />
          </el-form-item>
          <el-form-item
            label="发布人"
            prop="publisher"
          >
            <el-input
              v-model="communityMicroInfoForm.publisher"
              autocomplete="off"
            />
          </el-form-item>
          <el-form-item
            label="发布内容"
            prop="content"
          >
            <el-input
              v-model="communityMicroInfoForm.content"
              autocomplete="off"
            />
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
            <el-button @click="isAdd = false">取 消</el-button>
            <el-button type="primary" @click="addcommunityMicroInfo">确 定</el-button>
          </span>
        </el-dialog>
    </div>
    <div v-if="isEdit" class ='communityMicroInfoInfo'>
      <communityMicroInfoEdit :communityMicroInfo='communityMicroInfo' @update="handleEditFinish" @back="backHome"></communityMicroInfoEdit>
    </div>
  </div>
</template>

<script>
  //这里的跳转有问题
import communityMicroInfoEdit from './communityMicroInfoEdit'
import Axios from 'axios'
import qs from 'qs'
export default {
  components: {
    communityMicroInfoEdit
  },
  data () {
    return {
      api:'/api/community/manage/micro_community/',
      selectedcommunityMicroInfos:[],
      communityMicroInfo:{},
      isEdit: false,
      isAdd: false,
      communityMicroInfoTableData:[],
      communityMicroInfoForm:{}
    }
  },
  created () {
    this.getData()
  },
  methods: {
    getData () {
      Axios.get(this.api).then(response => {
        this.communityMicroInfoTableData = response.data.data
      }).catch(e => {
        console.error(e)
        this.$message.error(`获取信息列表失败: ${e.message || '未知错误'}`)
        this.communityMicroInfoTableData = []
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
      this.communityMicroInfo = this.communityMicroInfoTableData[index]
      console.log(this.communityMicroInfo)
      console.log(index,row)
    },
    addcommunityMicroInfo() {
      Axios.post(this.api, qs.stringify(this.communityMicroInfoForm))
        .then(() => {
          this.$alert('添加成功', '成功').then(() => {
            this.getData()
            this.isAdd = false
          })
        }).catch(e => {
          console.error(e)
          this.$alert(`错误原因: ${e.message || '未知错误'}`, '添加失败')
        })
      this.isAdd = false
    },
    deletecommunityMicroInfo (communityMicroInfo) {
      console.log('communityMicroInfo', communityMicroInfo)
      const data = {
        id: communityMicroInfo.id
      }
      return this.$axios.delete(this.api, {data:qs.stringify(data)})
    },
    deletecommunityMicroInfos () {
      this.$confirm('是否删除选中的微信息', '提示', { type: 'warning' }).then(() => {
        Promise.all(this.selectedcommunityMicroInfos.map(this.deletecommunityMicroInfo))
          .then(() => this.$alert('删除成功', '成功', { type: 'success' }).then(()=>{
            this.getData()
          }), (e) => {
            console.error(e)
            this.$alert('删除失败', '错误', { type: 'error' })
          })
      })
    },
    handleSelect (val) {
      this.selectedcommunityMicroInfos = val
    }
  }
}
</script>

<style lang="scss">
</style>
