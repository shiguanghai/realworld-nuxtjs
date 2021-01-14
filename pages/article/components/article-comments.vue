<template>
  <div>
    <form class="card comment-form" @submit.prevent="addMyComment" v-if="$store.state.user">
      <div class="card-block">
        <textarea 
          class="form-control"
          placeholder="Write a comment..."
          rows="3"
          v-model="myComment"
          required
        ></textarea>
      </div>
      <div class="card-footer">
        <img :src="$store.state.user && $store.state.user.image" class="comment-author-img" />
        <button class="btn btn-sm btn-primary" :disabled="addMyCommentDisabled">
        Post Comment
        </button>
      </div>
    </form>
    <p show-authed="false" v-else>
      <nuxt-link to="/login">Sign in</nuxt-link>
         or 
      <nuxt-link to="/register">sign up</nuxt-link>
         to add comments on this article.
    </p>

    <div 
      class="card" 
      v-for="comment in comments"
      :key="comment.id"
    >
      <div class="card-block">
        <p class="card-text">{{ comment.body }}</p>
      </div>
      <div class="card-footer">
        <nuxt-link 
          class="comment-author"
          :to="{
            name: 'profile',
            params: {
              username: comment.author.username
            }
          }"
        >
          <img :src="comment.author.image" class="comment-author-img" />
        </nuxt-link>
        &nbsp;
        <nuxt-link 
          class="comment-author"
          :to="{
            name: 'profile',
            params: {
              username: comment.author.username
            }
          }"
        >
          {{ comment.author.username }}
        </nuxt-link>
        <span class="date-posted">{{ comment.createdAt | date('MMMM DD, YYYY')}}</span>
        <span 
          class="mod-options"
          v-if="$store.state.user && comment.author.username === $store.state.user.username"
          @click="deleteMyComment(comment.id)"
        >
          <i class="ion-trash-a"></i>
        </span>
      </div>
    </div>
  </div>
</template>

<script>
import { getComments, addComment, deleteComment } from '@/api/article'

export default {
  name: 'ArticleComments',
  props: {
    article: {
      type: Object,
      required: true // 必须的
    }
  },
  data () {
    return {
      comments: [], // 文章列表
      myComment: '',
      addMyCommentDisabled: false // 默认未禁用发表评论按钮
    }
  },
  // 评论不需要SEO
  // 客户端加载
  mounted () {
    this.getCommentsList()
  },

  methods: {
    // 获取评论列表
    async getCommentsList () {
      const { data } = await getComments(this.article.slug)
      this.comments = data.comments
    },
    // 添加评论
    async addMyComment () {
      // 未登录，跳转到登录界面
      if (!this.$store.state.user) {
        this.$router.push('/login')
        return false
      }
      // 禁用发表评论按钮
      this.addMyCommentDisabled = true
      await addComment(this.article.slug, {
        comment: {
          body: this.myComment
        }
      })
      this.myComment = ''
      this.getCommentsList()
      this.addMyCommentDisabled = false
    },
    // 删除评论
    async deleteMyComment (id) {
      await deleteComment(this.article.slug, id)
      this.getCommentsList()
    }
  }
}
</script>

<style>

</style>