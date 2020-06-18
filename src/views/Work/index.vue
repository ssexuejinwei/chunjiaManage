<template>
  <div>
    <div v-if='!isEdit' class ='worklist'>
      <page-header title="办事管理"/>
      <el-container>
        <el-main>
          <el-table
            :data="workTableData"
            highlight-current-row
            :border="true"
          >
            <el-table-column
              type="selection"
            />
            <el-table-column
              prop="title"
              label="办事名"
              align="center"
            />
            <el-table-column
              prop="object"
              label="服务对象"
              align="center"
            />
            <el-table-column
              prop="material"
              label="申请材料"
              align="center"
            />
            <el-table-column
              prop="process"
              label="办理流程"
              align="center"
            />
            <!-- <el-table-column
              prop="coupon"
              label="优惠券"
              align="center"
            /> -->
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
              <el-button @click='isAdd = true'>新增办事</el-button>
            </el-col>
            <el-col :span="5">
              <el-button @click="deleteworks">
                删除办事
              </el-button>
            </el-col>
          </el-row>
        </el-footer>
      </el-container>
      <el-dialog
        title="办事"
        :visible.sync="isAdd "
      >
        <el-form
          :model="workForm"
          label-width="100px"
          style="width:31.25rem;"
        >
          <el-form-item
            label="办事名"
            prop="title"
          >
            <el-input
              v-model="workForm.title"
              autocomplete="off"
            />
          </el-form-item>
          <el-form-item
            label="服务对象"
            prop="object"
          >
          <el-input
            v-model="workForm.object"
            autocomplete="off"
          />
          </el-form-item>
          <el-form-item
            label="申请材料"
            prop="material"
          >
            <el-input
              v-model="workForm.material"
              autocomplete="off"
            />
          </el-form-item>
          <el-form-item
            label="办理流程"
            prop="process"
          >
          <el-input
            v-model="workForm.process"
            autocomplete="off"
          />
          </el-form-item>
          <el-form-item
            label="附件上传"
          >
          <el-upload
            class="upload-demo"
            action="https://jsonplaceholder.typicode.com/posts/"
            :on-change="handleChange"
            :file-list="fileList">
            <el-button size="small" type="primary">点击上传</el-button>
          </el-upload>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
            <el-button @click="isAdd = false">取 消</el-button>
            <el-button type="primary" @click="addwork">确 定</el-button>
          </span>
        </el-dialog>
    </div>
    <div v-if="isEdit" class ='workInfo'>
      <workEdit :work='work' @update="handleEditFinish" @back="backHome"></workEdit>
    </div>
  </div>
</template>

<script>
  //这里的跳转有问题
import workEdit from './workEdit'
export default {
  components: {
    workEdit
  },
  data () {
    return {
      fileList:{},
      work:{},
      isEdit: false,
      isAdd: false,
      workTableData:[],
      workForm:{}
    }
  },
  created () {
    for (let i = 0; i < 4; i ++) {
      this.workTableData.push({
        id:i,
        title:'办理户籍',
        object:'本小区住户',
        material:'身份证复印件，居住证',
        process:'提出申请-交付材料-签名',
        attachment:'流程详情文件'
      })
    }
  },
  methods: {
    handleChange(file, fileList) {
      this.fileList = fileList.slice(-3)
    },
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
      this.work = this.workTableData[index]
      console.log(index,row)
    },
    addwork() {
      this.isAdd = false
    },
    deletework (work) {
      console.log('work', work)
      const data = {
        id: work.id
      }
      // return this.$axios.post('/sellerctr/deleteParents', qs.stringify(data))
    },
    deleteworks () {
      this.$confirm('是否删除选中的办事', '提示', { type: 'warning' }).then(() => {
        Promise.all(this.selectedworks.map(this.deletework))
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

</style>
