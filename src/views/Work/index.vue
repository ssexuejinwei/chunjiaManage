<template>
  <div>
    <div v-if='!isEdit' class ='worklist'>
      <page-header title="办事管理"/>
      <el-container>
        <el-main>
          <el-table
            :data="workTableData"
            @selection-change="handleSelect"
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
              prop="service_target"
              label="服务对象"
              align="center"
            />
            <el-table-column
              label="类型"
              align="center"
            >
            <template slot-scope="scope">
              <span>{{scope.row.type.type}}</span>
            </template>
            </el-table-column>
            <el-table-column
              prop="apply_material"
              label="申请材料"
              align="center"
            />
            <el-table-column
              prop="caution"
              label="注意事项"
              align="center"
            />
            <el-table-column
              prop="apply_procedure"
              label="办理流程"
              align="center"
            />
            <el-table-column
              prop="policy"
              label="相关政策"
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
          <el-form-item label="办事类型">
            <el-select v-model="workForm.type_id" placeholder="请选择">
                <el-option
                  v-for="item in typeOptions"
                  :key="item.id"
                  :label="item.type"
                  :value="item.id">
                </el-option>
              </el-select>
          </el-form-item>
          <el-form-item
            label="服务对象"
          >
          <el-input
            v-model="workForm.service_target"
            autocomplete="off"
          />
          </el-form-item>
          <el-form-item
            label="申请材料"
          >
            <el-input
              v-model="workForm.apply_material"
              autocomplete="off"
            />
          </el-form-item>
          <el-form-item
            label="办理流程"
          >
          <el-input
            v-model="workForm.apply_procedure"
            autocomplete="off"
          />
          </el-form-item>
          <el-form-item
            label="注意事项"
          >
          <el-input
            v-model="workForm.caution"
            autocomplete="off"
          />
          </el-form-item>
          <el-form-item
            label="相关政策"
          >
          <el-input
            v-model="workForm.policy"
            autocomplete="off"
          />
          </el-form-item>
          <!-- <el-form-item
            label="附件上传"
          >
          <el-upload
            class="upload-demo"
            action="https://jsonplaceholder.typicode.com/posts/"
            :on-change="handleChange"
            :file-list="fileList">
            <el-button size="small" type="primary">点击上传</el-button>
          </el-upload>
          </el-form-item> -->
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
import Axios from 'axios'
import qs from 'qs'
export default {
  components: {
    workEdit
  },
  data () {
    return {
      api_detail:'/api/community/manage/work_detail/',
      api:'/api/community/manage/work/',
      api_type:'/api/community/manage/work_type/',
      selectedworks:[],
      fileList:{},
      work:{},
      isEdit: false,
      isAdd: false,
      workTableData:[],
      workForm:{},
      typeOptions:[]
    }
  },
  created () {
   this.getData()
  },
  methods: {
    getData () {
      this.workTableData=[]
      Axios.get(this.api).then(response => {
        for(let work of response.data.data){
          let id = work.id
          Axios.get(this.api_detail,{
            params:{
              id:id
            }
          }).then(response2 => {
            this.workTableData.push(response2.data.data.work)
            this.typeOptions = response2.data.data.type_list
          })
        }
      }).catch(e => {
        console.error(e)
        this.$message.error(`获取信息列表失败: ${e.message || '未知错误'}`)
        this.workTableData = []
      }).finally(() => { this.loading = false })
    },
    handleChange(file, fileList) {
      this.fileList = fileList.slice(-3)
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
      this.work = this.workTableData[index]
      console.log(index,row)
    },
    addwork() {
      Axios.post(this.api, qs.stringify({
        title:this.workForm.title,
        type_id:this.workForm.type_id,
        service_target:this.workForm.service_target,
        apply_material:this.workForm.apply_material,
        apply_procedure:this.workForm.apply_procedure,
        caution:this.workForm.caution,
        policy:this.workForm.policy
      }))
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
    deletework (work) {
      const data = {
        id: work.id
      }
      return this.$axios.delete(this.api, {data:qs.stringify(data)})
    },
    deleteworks () {
      this.$confirm('是否删除选中的办事', '提示', { type: 'warning' }).then(() => {
        Promise.all(this.selectedworks.map(this.deletework))
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
      this.selectedworks = val
    }
  }
}
</script>

<style lang="scss">

</style>
