<template>
    <div class="fancybox-thumbnails">
      <transition name="fadeLeft-transform" mode="out-in">
        <div v-if="loadingPic" key="loading">
          <svg-icon class="fancybox-thumbnails__loading" icon-class="loading"></svg-icon>
        </div>
        <a ref="fancyboxLink" key="loaded" v-else :href="url" class="fancybox-thumbnails__link" @click.prevent="HandleFancyBox($event)">
          <img class="fancybox-thumbnails__img" :src="thumbnailsUrl">
        </a>
      </transition>
    </div>
</template>

<script>
/* eslint-disable no-unused-vars */
import fancyBoxMain from './lib'

export default {
  name: 'fancy-box',
  props: {
    msUrl: {
      type: String
    },
    url: {
      type: String
    }
  },
  data() {
    return {
      thumbnail_Width: null,
      thumbnail_Height: null,
      loadingPic: true
    }
  },
  /* 只是第一次加载的时候调用 */
  mounted() {
    this.loadingPic = true
    this.handleImage()
      .then((res) => {
        this.loadingPic = false
      }, () => {
        this.loadingPic = true
      })
  },
  methods: {
    handleImage(url) {
      const self = this
      return new Promise((resolve, reject) => {
        const img = document.createElement('img')
        img.onload = (response) => {
          self.thumbnail_Width = img.naturalWidth
          self.thumbnail_Height = img.naturalHeight
          resolve(img)
        }
        img.onerre = (err) => {
          reject(err)
        }
        // just simulate the asynchronization of loading image, can delete
        // setTimeout(function() {
        if (self.thumbnailsUrl === '') {
          reject()
        } else {
          img.src = self.thumbnailsUrl
        }
        // }, 2000)
      })
    },
    HandleFancyBox(event) {
      const target = this.$refs.fancyboxLink

      fancyBoxMain(target, Object.assign({}, {
        url: this.url
      }))
    }
  },
  computed: {
    thumbnailsUrl() {
      return this.msUrl ? this.msUrl : this.url
    }
  },
  watch: {
    /* watch the variation of url */
    url(oldValue, newValue) {
      this.loadingPic = true
      this.handleImage()
        .then((res) => {
          this.loadingPic = false
        }, () => {
          this.loadingPic = true
        })
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.fancybox-thumbnails {
  .fancybox-thumbnails__loading {
    -ms-animation: rotating 2s linear infinite;
    -webkit-animation: rotating 2s linear infinite;
    animation: rotating 2s linear infinite;
  }
  .fancybox-thumbnails__loading, .fancybox-thumbnails__img {
    width: 1.4rem;
    height: 1.4rem;
    color: #999;
    vertical-align: middle;
  }
  .fancybox-thumbnails__link {
    display: inline-block;
    cursor: pointer;
  }
}

</style>