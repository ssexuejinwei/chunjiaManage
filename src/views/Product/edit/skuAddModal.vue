<template>
  <el-dialog :visible.sync="v" title="添加 sku">
    <el-form
      ref="form"
      :model="form"
      :rules="rules"
      label-width="80px"
    >
      <el-form-item required label="尺码" prop="size">
        <el-input v-model="form.size" />
      </el-form-item>
      <el-form-item required label="库存" prop="num">
        <el-input-number
          v-model="form.num"
          :min="0"
          :precision="0"
          controls-position="right"
        />
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="v = false">取消</el-button>
      <el-button type="primary" @click="handleSubmit">确 定</el-button>
    </span>
  </el-dialog>
</template>

<script>
export default {
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    submit: {
      type: Function,
      required: true
    }
  },

  data () {
    return {
      form: {
        size: null,
        num: 0
      },
      rules: {
        size: [
          { required: true, trigger: 'change', message: '尺码不能为空' }
        ],
        num: [
          { required: true, trigger: 'change', message: '库存不能为空' }
        ]
      },

      isLoading: false
    }
  },

  computed: {
    v: {
      get () {
        return this.visible
      },

      set (v) {
        this.$emit('update:visible', v)
      }
    }
  },

  methods: {
    handleSubmit () {
      this.$refs.form.validate(async valid => {
        console.log(valid)
        if (!valid) return
        this.isLoading = true
        await this.submit(Object.assign({}, this.form))
        // close
        this.isLoading = false
        this.form = {
          size: '',
          num: 0
        }
        this.v = false
      })
    }
  }

}
</script>
