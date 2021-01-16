<template>
  <!-- 创建编辑文章 -->
  <div class="editor-page">
    <div class="container page">
      <div class="row">

        <div class="col-md-10 offset-md-1 col-xs-12">
          <form>
            <fieldset>
              <fieldset class="form-group">
                  <input 
                    type="text"
                    class="form-control form-control-lg"
                    placeholder="Article Title"
                    v-model="article.title"
                    :disabled="publishDisabled"
                  >
              </fieldset>
              <fieldset class="form-group">
                  <input 
                    type="text"
                    class="form-control"
                    placeholder="What's this article about?"
                    v-model="article.description"
                    :disabled="publishDisabled"
                  >
              </fieldset>
              <fieldset class="form-group">
                  <textarea 
                    class="form-control"
                    rows="8"
                    placeholder="Write your article (in markdown)"
                    v-model="article.body"
                    :disabled="publishDisabled"
                  ></textarea>
              </fieldset>
              <fieldset class="form-group">
                  <input 
                    type="text"
                    class="form-control"
                    placeholder="Enter tags"
                    v-model="articleTag"
                    @keypress.enter="enterTag"
                    :disabled="publishDisabled"
                  >
                  <div class="tag-list">
                    <span
                      class="tag-default tag-pill"
                      v-for="tag in article.tagList"
                      :key="tag"
                    >
                      <i 
                        class="ion-close-round"
                        @click="removeTag(tag)"
                        :disabled="publishDisabled"
                      ></i>
                      {{ tag }}
                    </span>  
                  </div>
              </fieldset>
              <button 
                class="btn btn-lg pull-xs-right btn-primary"
                type="button"
                @click="publishArticle"
                :disabled="publishDisabled"
              >
                  Publish Article
              </button>
            </fieldset>
          </form>
        </div>

      </div>
    </div>
  </div>
  <!-- /创建编辑文章 -->
</template>

<script>
import { getArticle, createArticle, updateArticle } from "@/api/article"

export default {
  // 在路由匹配组件渲染之前会先执行中间件处理
  middleware: ['authenticated'],
  name: 'EditorIndex',
  data () {
    return {
      publishDisabled: false,
      articleTag: '',
      article: {
        title: '',
        description: '',
        body: '',
        tagList: []
      }
    }
  },
  async created () {
    if(this.$route.params.slug) {
      const { data } = await getArticle(this.$route.params.slug)
      this.article = data.article
    }
  },
  methods: {
    enterTag () {
      if(this.article.tagList.indexOf(this.articleTag) === -1) {
        this.article.tagList.push(this.articleTag)
        this.articleTag = ''
      }
    },
    removeTag (tag) {
      this.article.tagList.splice(this.article.tagList.indexOf(tag), 1)
    },
    async publishArticle () {
      this.publishDisabled = true
      const { data } = this.$route.params.slug
      ? await updateArticle ({
        article: this.article
      }, this.$route.params.slug)
      : await createArticle ({
        article: this.article
      })
      this.$router.push({
        name: 'article',
        params: {
          slug: data.article.slug
        }
      })
    }
  }
}
</script>

<style>

</style>