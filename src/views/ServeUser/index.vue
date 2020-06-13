<template>
  <div>
    <div v-if='!isEdit' class ='serveUserlist'>
      <page-header title="服务人员信息管理"/>
      <el-container>
        <el-main>
          <el-table
            :data="serveUserTableData"
            highlight-current-row
            :border="true"
          >
            <el-table-column
              type="selection"
            />
            <el-table-column
              prop="name"
              label="姓名"
              align="center"
            />
            <el-table-column
              prop="sex"
              label="性别"
              align="center"
            />
            <el-table-column
              prop="tel"
              label="联系电话"
              align="center"
            />
            <el-table-column
              prop="IDNumber"
              label="身份证号"
              align="center"
            />
            <el-table-column
              prop="grid"
              label="所属网格"
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
              <el-button @click='isAdd = true'>添加服务人员</el-button>
            </el-col>
            <el-col :span="5">
              <el-button @click="deleteserveUsers">
                删除服务人员
              </el-button>
            </el-col>
          </el-row>
        </el-footer>
      </el-container>
      <el-dialog
        title="服务人员信息"
        :visible.sync="isAdd "
      >
        <el-form
          :model="serveUserForm"
          label-width="100px"
          style="width:31.25rem;"
        >
          <el-form-item
            label="姓名"
            prop="name"
          >
            <el-input
              v-model="serveUserForm.name"
              autocomplete="off"
            />
          </el-form-item>
          <el-form-item
            label="性别"
            prop="date"
          >
            <el-radio-group v-model="serveUserForm.sex">
              <el-radio label="男">男</el-radio>
              <el-radio label="女">女</el-radio>
            </el-radio-group>
            
          </el-form-item>
          <el-form-item
            label="联系电话"
            prop="tel"
          >
          <el-input
            v-model="serveUserForm.tel"
            autocomplete="off"
          />
          </el-form-item>
          <el-form-item
            label="身份证号"
            prop="IDNumber"
          >
          <el-input
            v-model="serveUserForm.IDNumber"
            autocomplete="off"
          />
          </el-form-item>
          <el-form-item
            label="所属网格"
            prop="grid"
          >
          <el-input
            v-model="serveUserForm.grid"
            autocomplete="off"
          />
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
            <el-button @click="isAdd = false">取 消</el-button>
            <el-button type="primary" @click="addserveUser">确 定</el-button>
          </span>
        </el-dialog>
    </div>
    <div v-if="isEdit" class ='serveUserInfo'>
      <serveUserEdit :serveUser='serveUser' @update="handleEditFinish" @back="backHome"></serveUserEdit>
    </div>
  </div>
</template>

<script>
  //这里的跳转有问题
import serveUserEdit from './serveUserEdit'
export default {
  components: {
    serveUserEdit
  },
  data () {
    return {
      serveUser:{},
      isEdit: false,
      isAdd: false,
      serveUserTableData:[],
      serveUserForm:{
        name:'',
        sex:'',
        tel:'',
        IDNumber:'',
        grid:''
      }
    }
  },
  watch: {
  },
  created () {
    for (let i = 0; i < 4; i ++) {
      this.serveUserTableData.push({
        id:i,
        name:'张三',
        sex:'男',
        tel:'18238192231',
        IDNumber:'25131199003012931',
        grid:'春嘉网格'
      })
    }
  },
  methods: {
    handleEditFinish (val) {
      if (val) {
        //获取新数据
        this.isEdit = false
      }
    },
    backHome (val) {
      this.isEdit = val
    },
    handleEdit(index,row) {
      this.isEdit = true
      this.serveUser = this.serveUserTableData[index]
      console.log(index,row)
    },
    addserveUser() {
      // console.log(this.serveUserForm)
      this.isAdd = false
    },
    deleteserveUser (serveUser) {
      console.log('serveUser', serveUser)
      const data = {
        id: serveUser.id
      }
      // return this.$axios.post('/sellerctr/deleteParents', qs.stringify(data))
    },
    deleteserveUsers () {
      this.$confirm('是否删除选中的服务人员', '提示', { type: 'warning' }).then(() => {
        Promise.all(this.selectedserveUsers.map(this.deleteserveUser))
          .then(() => this.$alert('删除成功', '成功', { type: 'success' }), (e) => {
            console.error(e)
            this.$alert('删除失败', '错误', { type: 'error' })
          })
          .then()
      })
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
