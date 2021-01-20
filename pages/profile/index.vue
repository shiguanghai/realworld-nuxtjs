<template>
  <!-- 用户页面-->
  <div class="profile-page">

    <div class="user-info">
      <div class="container">
        <div class="row">

          <div class="col-xs-12 col-md-10 offset-md-1">
            <img :src="user.image" class="user-img" />
            <h4>{{ user.username }}</h4>
            <p>
              {{ user.bio }}
            </p>

            <!-- 游客或非作者访问 -->
            <template v-if="!$store.state.user || (user.username != $store.state.user.username)">
              <button 
                class="btn btn-sm btn-outline-secondary action-btn"
                :class="{
                  active: user.following
                }"
                @click="onFollow"
                :disabled="isFollowDisabled"
              >
                <i class="ion-plus-round"></i>
                &nbsp;
                {{ user.following ? 'un' : '' }}Follow {{ user.username }}
              </button>
            </template>
            <!-- 作者访问 -->
            <template v-else>
              <nuxt-link
                class="btn btn-sm btn-outline-secondary action-btn"
                :to="{
                  name: 'settings'
                }"
              >
                <i class="ion-gear-a"></i> Edit Profile Settings
              </nuxt-link>
            </template>
          </div>

        </div>
      </div>
    </div>

    <div class="container">
      <div class="row">

        <div class="col-xs-12 col-md-10 offset-md-1">
          <div class="articles-toggle">
            <ul class="nav nav-pills outline-active">
              <li class="nav-item">
                <a 
                  class="nav-link" 
                  :class="{
                    active: isActive
                  }"
                  @click.prevent="loadArticles(true)"
                >My Articles</a>
              </li>
              <li class="nav-item">
                <a 
                  class="nav-link"
                  :class="{
                    active: !isActive
                  }"
                  @click.prevent="loadArticles(false)"
                >Favorited Articles</a>
              </li>
            </ul>
          </div>

          <div class="article-preview" v-show="isLoading">
            Loading articles...
          </div>
          <div class="article-preview" v-show="!isLoading && articles.length === 0">
            No articles are here... yet.
          </div>
          <div 
            class="article-preview"
            v-for="article in articles"
            :key="article.slug"
            v-show="!isLoading"
          >
            <div class="article-meta">
              <nuxt-link
                :to="{
                  name: 'profile',
                  params: {
                    username: article.author.username
                  }
                }"
              >
                <img :src="article.author.image">
              </nuxt-link>
              <div class="info">
                <nuxt-link
                  :to="{
                    name: 'profile',
                    params: {
                      username: article.author.username
                    }
                  }"
                  class="author"
                >
                  {{ article.author.username}}
                </nuxt-link>
                <span class="date">{{ article.createdAt | date('MMMM DD, YYYY') }}</span>
              </div>
              <button 
                class="btn btn-outline-primary btn-sm pull-xs-right"
                :class="{
                  active: article.favorited
                }"
                @click="onFavorite(article)"
                :disabled="article.favoritedDisabled"
              >
                <i class="ion-heart"></i> {{ article.favoritesCount }}
              </button>
            </div>
            <nuxt-link 
              :to="{
                name: 'article',
                params: {
                  slug: article.slug
                }
              }"
              class="preview-link"
            >
              <h1>{{ article.title }}</h1>
              <p>{{ article.description }}</p>
              <span>Read more...</span>
              <ul class="tag-list">
                <li
                  class="tag-default tag-pill tag-outline"
                  v-for="tag in article.tagList"
                  :key="tag"
                >{{ tag }}</li>    
              </ul>
            </nuxt-link>
          </div>

        </div>

      </div>
    </div>

  </div>  
  <!-- /用户页面 -->
</template>

<script>
import { getProfile } from '@/api/user'
import {
  getArticles,
  addFavorite,
  deleteFavorite,
  addFollow,
  deleteFollow,
} from '@/api/article'

export default {
  // 在路由匹配组件渲染之前会先执行中间件处理
  // middleware: ['authenticated'],
  name: 'UserProfile',
  data () {
    return {
      user: {},
      isActive: true,
      articles: [],
      isLoading: true,
      isFollowDisabled: false,
    }
  },
  async created () {
    const { data } = await getProfile(this.$route.params.username)
    this.user = data.profile
    this.loadArticles(true)
  },
  methods: {
    async loadArticles(isMyArticle) {
      this.isLoading = true
      this.isActive = isMyArticle
      const params = isMyArticle
      ? { author: this.user.username }
      : { favorited: this.user.username }
      const { data } = await getArticles(params)
      this.isLoading = false
      this.articles = data.articles
      // 默认未禁用
      this.articles.forEach((article) => (article.favoriteDisabled = false))
    },
    async onFavorite (article) {
      // console.log(article)
      if(!this.$store.state.user) {
        this.$router.push('/login')
        return false
      }
      article.favoriteDisabled = true
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
      article.favoriteDisabled = false
    },
    async onFollow () {
      if(!this.$store.state.user) {
        this.$router.push('/login')
        return false
      }
      const user = this.user
      this.isFollowDisabled = true
      // true 取消关注； false 添加关注
      user.following
      ? await deleteFollow (user.username)
      : await addFollow (user.username)
      user.following = !user.following
      this.isFollowDisabled = false
    }
  }
}
</script>

<style>

</style>