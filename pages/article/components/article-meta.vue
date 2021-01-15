<template>
  <div class="article-meta">
    <nuxt-link :to="{
      name: 'profile',
      params: {
        username: article.author.username
      }
    }">
      <img :src="article.author.image" />
    </nuxt-link>
    <div class="info">
      <nuxt-link class="author" :to="{
        name: 'profile',
        params: {
          username: article.author.username
        }
      }">
        {{ article.author.username }}
      </nuxt-link>
      <span class="date">{{ article.createdAt | date('MMMM DD, YYYY') }}</span>
    </div>
    <!-- 用户关注状态 -->
    <button 
      class="btn btn-sm btn-outline-secondary"
      :class="{
        active: article.author.following
      }"
      @click="onFollow"
      :disabled="isFollowDisabled"
    >
      <i class="ion-plus-round"></i>
      &nbsp;
      {{ article.author.following ? 'un' : '' }}Follow {{ article.author.username }} 
    </button>
    &nbsp;&nbsp;
    <!-- 用户是否已点赞 -->
    <button 
      class="btn btn-sm btn-outline-primary"
      :class="{
        active: article.favorited
      }"
      @click="onFavorite"
      :disabled="favoriteDisabled"
      >
      <i class="ion-heart"></i>
      &nbsp;
      Favorite Post <span class="counter">({{ article.favoritesCount }})</span>
    </button>
  </div>
</template>

<script>
import {
  addFavorite,
  deleteFavorite,
  addFollow,
  deleteFollow
} from "@/api/article"

export default {
  name: 'ArticleMeta',
  props: {
    article: Object,
    required: true // 必须的
  },
  data () {
    return {
      isFollowDisabled: false,
      favoriteDisabled: false
    }
  },
  methods: {
    async onFollow () {
      if(!this.$store.state.user) {
        this.$router.push('/login')
        return false
      }
      const article = this.article
      this.isFollowDisabled = true
      // true 取消关注； false 添加关注
      article.author.following
      ? await deleteFollow (article.author.username)
      : await addFollow (article.author.username)
      article.author.following = !article.author.following
      this.isFollowDisabled = false
    },
    async onFavorite () {
      if(!this.$store.state.user) {
        this.$router.push('/login')
        return false
      }
      const article = this.article
      if (article.favorited) {
        // 取消点赞
        await deleteFavorite(article.slug)
        article.favorited = false
        article.favoritesCount -= 1
      } else {
        // 添加点赞
        await addFavorite(article.slug)
        article.favorited = true
        article.favoritesCount += 1
      }
      this.favoriteDisabled = false
    }
  }
}
</script>

<style>

</style>