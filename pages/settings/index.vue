<template>
  <!-- 设置 -->
  <div class="settings-page">
    <div class="container page">
      <div class="row">

        <div class="col-md-6 offset-md-3 col-xs-12">
          <h1 class="text-xs-center">Your Settings</h1>

          <form>
            <fieldset>
                <fieldset class="form-group">
                  <input 
                    class="form-control"
                    type="text"
                    placeholder="URL of profile picture"
                    v-model="user.image"
                    :disabled="updateDisabled" 
                  >
                </fieldset>
                <fieldset class="form-group">
                  <input 
                    class="form-control form-control-lg"
                    type="text"
                    placeholder="Your Name"
                    v-model="user.username"
                    :disabled="updateDisabled" 
                  >
                </fieldset>
                <fieldset class="form-group">
                  <textarea 
                    class="form-control form-control-lg"
                    rows="8"
                    placeholder="Short bio about you"
                    v-model="user.bio"
                    :disabled="updateDisabled" 
                  ></textarea>
                </fieldset>
                <fieldset class="form-group">
                  <input 
                    class="form-control form-control-lg"
                    type="text"
                    placeholder="Email"
                    v-model="user.email"
                    :disabled="updateDisabled" 
                  >
                </fieldset>
                <fieldset class="form-group">
                  <input 
                    class="form-control form-control-lg"
                    type="password"
                    placeholder="Password"
                    v-model="user.password"
                    :disabled="updateDisabled"  
                  >
                </fieldset>
                <button 
                  class="btn btn-lg btn-primary pull-xs-right"
                  @click.prevent="updateSettings"
                  :disabled="updateDisabled"  
                >
                  Update Settings
                </button>
            </fieldset>
          </form>
          <hr>
          <button
            class="btn btn-outline-danger"
            @click="logout"
          >
            Or click here to logout.
          </button>
        </div>

      </div>
    </div>
  </div>  
  <!-- /设置 -->
</template>

<script>
import { getUser, updateUser} from '@/api/user'
import { mapMutations } from 'vuex'

const Cookie = process.client ? require('js-cookie') : undefined

export default {
  // 在路由匹配组件渲染之前会先执行中间件处理
  middleware: ['authenticated'],
  name: 'SettingsIndex',
  data () {
    return {
      user: {},
      updateDisabled: false
    }
  },
  async created () {
    const { data } = await getUser()
    this.user = data.user
  },
  methods: {
    ...mapMutations(['setUser']),
    async updateSettings () {
      this.updateDisabled = true
      const { data } = await updateUser({
        user: this.user
      })
      // 保存用户的登录状态
      // this.$store.commit('setUser', data.user)
      this.setUser(data.user)

      // 为了防止刷新页面数据丢失，需要将数据持久化
      Cookie.set('user', data.user)
      
      // 跳转到个人主页
      this.$router.push(`/profile/${data.user.username}`)
    },
    logout () {
      this.setUser(null)
      Cookie.remove('user')
      this.$router.push('/')
    }
  }
}
</script>

<style>

</style>