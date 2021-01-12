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
    >
      <i class="ion-plus-round"></i>
      &nbsp;
      Follow Eric Simons <span class="counter">(10)</span>
    </button>
    &nbsp;&nbsp;
    <!-- 用户是否已点赞 -->
    <button 
      class="btn btn-sm btn-outline-primary"
      :class="{
        active: article.favorited
      }"
      >
      <i class="ion-heart"></i>
      &nbsp;
      Favorite Post <span class="counter">(29)</span>
    </button>
  </div>
</template>

<script>
export default {
  name: 'ArticleMeta',
  props: {
    article: Object,
    required: true // 必须的
  }
}
</script>

<style>

</style>