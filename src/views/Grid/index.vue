<template>
  <div>
    <div v-if='!isEdit' class ='gridlist'>
      <page-header title="网格信息管理"/>
      <el-container>
        <el-main>
          <el-table
            :data="gridTableData"
            @selection-change="handleSelect"
            highlight-current-row
            :border="true"
          >
            <el-table-column
              type="selection"
            />
            <el-table-column
              prop="name"
              label="网格"
              align="center"
            />
            <el-table-column
              label="网格长"
              align="center"
            >
              <template slot-scope="scope">
                <span>{{scope.row.admin.name}}</span>
              </template>
            </el-table-column>
            <el-table-column
              label="网格员"
              align="center"
            >
              <template slot-scope="scope">
                <span>{{scope.row.member.name}}</span>
              </template>
            </el-table-column>
            <el-table-column
              label="网格员"
              align="center"
            >
              <template slot-scope="scope">
                <span>{{scope.row.leader.name}}</span>
              </template>
            </el-table-column>
            <el-table-column
              label="网格员"
              align="center"
            >
              <template slot-scope="scope">
                <span>{{scope.row.police.name}}</span>
              </template>
            </el-table-column>
            <el-table-column
              label="网格员"
              align="center"
            >
              <template slot-scope="scope">
                <span>{{scope.row.pioneer.name}}</span>
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
            <el-row style="margin-top:1.5rem; ">
              <el-col :span="3">
                <el-button @click='isAdd = true'>添加网格</el-button>
              </el-col>
              <el-col :span="5">
                <el-button @click="deleteDatas">
                  删除网格
                </el-button>
              </el-col>
            </el-row>
        </el-footer>
      </el-container>
      <el-dialog
        title="网格信息"
        :visible.sync="isAdd "
      >
        <el-form
          :model="gridForm"
          label-width="100px"
          style="width:31.25rem;"
        >
          <el-form-item
            label="网格名称"
            prop="name"
          >
            <el-input
              v-model="gridForm.name"
              autocomplete="off"
            />
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
            <el-button @click="isAdd = false">取 消</el-button>
            <el-button type="primary" @click="addGrid">确 定</el-button>
          </span>
        </el-dialog>
    </div>
    <div v-if="isEdit" class ='userInfo'>
      <GridEdit :grid='grid' @update="handleEditFinish" @back="backHome"></GridEdit>
    </div>
  </div>
</template>

<script>
  //这里的跳转有问题
import GridEdit from './gridEdit'
import Axios from 'axios'
import qs from 'querystring'
export default {
  components: {
    GridEdit
  },
  data () {
    return {
      api:'/api/user/manage/grid/',
      gridForm:{},
      isAdd:false,
      selectedData:[],
      grid:{},
      isEdit: false,
      gridTableData:[],
      loading:false
    }
  },
  created () {
    this.getData()
  },
  methods: {
    addGrid () {
      this.gridForm = {
        ...this.gridForm,
      }
      Axios.post(this.api, qs.stringify(this.gridForm))
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
    getData () {
      Axios.get(this.api).then(response => {
        console.log(response)
        this.gridTableData = response.data.data
      }).catch(e => {
        console.error(e)
        this.$message.error(`获取信息列表失败: ${e.message || '未知错误'}`)
        this.gridTableData = []
      }).finally(() => { this.loading = false })
    },
    handleSelect (val) {
      this.selectedData = val
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
      this.grid = this.gridTableData[index]
      console.log(index,row)
    },
    deleteData (grid) {
      const data = {
        id: grid.id
      }
      return Axios.delete(this.api, {data:qs.stringify(data)})
    },
    deleteDatas () {
      this.$confirm('是否删除选中的网格', '提示', { type: 'warning' }).then(() => {
        Promise.all(this.selectedData.map(this.deleteData))
          .then(() => this.$alert('删除成功', '成功', { type: 'success' }).then(() => {
            this.getData()
          }), (e) => {
            console.error(e)
            this.$alert('删除失败', '错误', { type: 'error' })
          })
      })
    }
  }
}
</script>

<style lang="scss">
</style>
