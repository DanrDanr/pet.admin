<template>
  <div class="app-container">
    <el-form ref="form" :model="form" label-width="120px" style="width: 700px" >
      <el-form-item label="店铺名称">
        <el-input v-model="form.name" />
      </el-form-item>
      <el-form-item label="店铺地址">
        <el-input v-model="form.address" type="textarea" />
      </el-form-item>
      <el-form-item label="手机号">
        <el-input v-model="form.tel" />
      </el-form-item>
      <el-form-item label="店铺LOGO">
        <el-input v-model="form.logo" />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onSubmit">注册店铺</el-button>
        <el-button @click="onCancel">Cancel</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { registerShop } from '@/api/shop'

export default {
  data() {
    return {
      form: {
        name: '',
        tel: '',
        address: '',
        logo: ''

      }
    }
  },
  methods: {
    onSubmit() {
      console.log(this.form)
      const requestData = {
        name: this.form.name,
        tel: this.form.tel,
        address: this.form.address,
        logo: this.form.logo
      }
      registerShop(requestData).then(response => {
        console.log('requestData:', requestData)
        if (response['resultCode'] === 200) {
          this.$message('您的申请已提交 请等待审核')
          this.$router.back()
        } else {
          this.$message(response['message'])
        }
      })
    },
    onCancel() {
      this.$message({
        message: 'cancel!',
        type: 'warning'
      })
    }
  }
}
</script>

<style scoped>
.line{
  text-align: center;
}
</style>

