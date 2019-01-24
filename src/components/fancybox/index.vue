<template>
    <div class="fancybox-thumbnails">
      <transition name="fadeLeft-transform" mode="out-in">
        <div v-if="!url" key="null">{{errorTxt}}</div>
        <div v-else-if="loadingPic" key="loading">
          <svg-icon class="fancybox-thumbnails__loading" icon-class="loading" :style="{width: computedThumbWidth, height: computedThumbWidth}"></svg-icon>
        </div>
        <div v-else-if="loadedError" key="loadedError">
          <svg-icon class="fancybox-thumbnails__loadedError" icon-class="picture_error" :style="{width: computedThumbWidth, height: computedThumbWidth}"></svg-icon>
        </div>
        <a v-else key="loadedSuccess" ref="fancyboxLink" :href="url" class="fancybox-thumbnails__link" v-fancybox="open">
          <img class="fancybox-thumbnails__img" :src="thumbnailsUrl" :style="{width: computedWidth, height: computedHeight}">
        </a>
      </transition>
    </div>
</template>

<script>
import fancybox from '@/directive/fancybox'

export default {
  name: 'fancy-box',
  directives: { fancybox },
  props: {
    msUrl: {
      type: String
    },
    url: {
      type: String
    },
    width: {
      type: [String, Number],
      default: '2.4rem'
    },
    height: {
      type: [String, Number],
      default: '2.4rem'
    },
    open: {
      type: Boolean,
      default: true
    },
    errorTxt: {
      type: String,
      default: '暂无图片'
    }
  },
  data() {
    return {
      thumbnail_Width: null,
      thumbnail_Height: null,
      loadingPic: true,
      loadedError: false,
      isVisible: this.visible
    }
  },
  /* 只是第一次加载的时候调用 */
  mounted() {
    this.loadingPic = true
    this.handleImage()
      .then((res) => {
        this.loadingPic = false
      }, () => {
        this.loadingPic = false
        this.loadedError = true
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
        img.onerror = (err) => {
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
    }
  },
  computed: {
    thumbnailsUrl() {
      return this.msUrl ? this.msUrl : this.url
    },
    computedWidth() {
      const { width } = this
      if (isNaN(width)) {
        return width
      } else {
        return `${width}px`
      }
    },
    computedHeight() {
      const { height } = this
      if (isNaN(height)) {
        return height
      } else {
        return `${height}px`
      }
    },
    computedThumbWidth() {
      const { width } = this
      if (isNaN(width)) {
        const num = parseFloat(width)
        // const suffix = width.slice(num.toString())
        // return `${num / 4}${suffix}`
        return `${num / 4}px`
      } else {
        return `${width / 4}px`
      }
    },
    computedThumbHeight() {
      const { height } = this
      if (isNaN(height)) {
        const num = parseFloat(height)
        // const suffix = width.slice(num.toString())
        // return `${num / 4}${suffix}`
        return `${num / 4}px`
      } else {
        return `${height / 4}px`
      }
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
    position: relative;
    display: inline-block;
  .fancybox-thumbnails__loading {
    -ms-animation: rotating 2s linear infinite;
    -webkit-animation: rotating 2s linear infinite;
    animation: rotating 2s linear infinite;
  }
 .fancybox-thumbnails__loading, .fancybox-thumbnails__loadedError {
    width: 1.4rem;
    height: 1.4rem;
    min-width: 1.4rem;
    min-height: 1.4rem;
    color: #999;
    vertical-align: middle;
  }
  .fancybox-thumbnails__img {
    width: 100%;
    height: 100%;
    min-width: 2.4rem;
    min-height: 2.4rem;
    color: #999;
    vertical-align: middle;
    border-radius: 5px;
  }
  .fancybox-thumbnails__link {
    cursor: pointer;
  }
}

</style>