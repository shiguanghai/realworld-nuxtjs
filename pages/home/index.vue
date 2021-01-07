<template>
  <!-- 首页 -->
  <div class="home-page">

    <div class="banner">
      <div class="container">
        <h1 class="logo-font">conduit</h1>
        <p>A place to share your knowledge.</p>
      </div>
    </div>

    <div class="container page">
      <div class="row">

        <div class="col-md-9">
          <div class="feed-toggle">
            <ul class="nav nav-pills outline-active">
              <li class="nav-item">
                <a class="nav-link disabled" href="">Your Feed</a>
              </li>
              <li class="nav-item">
                <a class="nav-link active" href="">Global Feed</a>
              </li>
            </ul>
          </div>

          <div
            class="article-preview"
            v-for="article in articles"
            :key="article.slug"
          >
            <div class="article-meta">
              <!-- <a href="profile.html"><img src="http://i.imgur.com/Qr71crq.jpg" /></a> -->
              <nuxt-link :to="{
                name: 'profile',
                params: {
                  username: article.author.username
                }
              }">
                <img :src="article.author.image" />
              </nuxt-link>
              <div class="info">
                <!-- <a href="" class="author">Eric Simons</a> -->
                <nuxt-link class="author" :to="{
                  name: 'profile',
                  params: {
                    username: article.author.username
                  }
                }">
                  {{ article.author.username }}
                </nuxt-link>
                <span class="date">{{ article.createdAt }}</span>
              </div>
              <button class="btn btn-outline-primary btn-sm pull-xs-right"
                :class="{
                    active: article.favorited
                  }">
                <i class="ion-heart"></i> {{ article.favoritesCount }}
              </button>
            </div>
            <!-- <a href="" class="preview-link"> -->
            <nuxt-link 
              class="preview-link" 
              :to="{
                name: 'article',
                params: {
                  slug: article.slug
                }
              }">
              <h1>{{ article.title }}</h1>
              <p>{{ article.description }}</p>
              <span>Read more...</span>
            <!-- </a> -->
            </nuxt-link>  
          </div>

          <!-- 分页列表 -->
          <nav>
            <ul class="pagination">

              <li 
                class="page-item"
                :class="{
                  active: item === page
                }"
                v-for="item in totalPage"
                :key="item"  
              >

                <!-- 默认query的改变不会调用asyncData方法。
                如果要监听这个行为，可以设置应通过页面组建的watchQuery参数监听参数 -->
                <nuxt-link 
                  class="page-link" 
                  :to="{
                    name: 'home',
                    query: {
                      page: item,
                      tag: $route.query.tag
                    }
                  }"
                >{{ item }}</nuxt-link>

              </li>
            </ul>
          </nav>
          <!-- /分页列表 -->

        </div>

        <div class="col-md-3">
          <div class="sidebar">
            <p>Popular Tags</p>

            <div class="tag-list">
              <nuxt-link 
                :to="{
                  name: 'home',
                  query: {
                    tag: item
                  }
                }" 
                class="tag-pill tag-default"
                v-for="item in tags"
                :key="item"
              >{{ item }}</nuxt-link>
            </div>
          </div>
        </div>

      </div>
    </div>

  </div>
  <!-- /首页 -->
</template>

<script>
import { getArticles } from '@/api/article'
import { getTags } from '@/api/tag'

export default {
  name: 'HomeIndex',
  async asyncData ({ query }) {
    const page = Number.parseInt(query.page || 1)
    const limit = 10
    const [ articleRes, tagRes ] = await Promise.all([
      getArticles({
        limit, // 文章分页数（默认20）
        offset: (page - 1) * limit, // 文章偏移/跳跃数（默认0）
        tag: query.tag // 按标签筛选
      }),
      getTags()
    ])

    const { articles, articlesCount } = articleRes.data
    const { tags } = tagRes.data

    return {
      articles,
      articlesCount,
      tags,
      page,
      limit
    }
  },
  watchQuery:['page', 'tag'],
  computed: {
    // 总页码
    totalPage () {
      return Math.ceil(this.articlesCount / this.limit)
    }
  }
}
</script>

<style>

</style>