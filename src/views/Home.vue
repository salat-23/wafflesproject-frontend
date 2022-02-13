<template>
  <div class="home">

    <div class="updates_container">

      <router-link v-for="series in content" class="itemlink" :to="'/'+series.title">
        <div class="item">
          <img class="cover" :src="series.cover">
          <h2 class="title">{{ series.title }}</h2>
          <p class="description">
            {{ series.description }}
          </p>

          <div class="tags">
            <RouterLink v-for="tag in series.tags" to="/">{{ tag }}</RouterLink>
          </div>
        </div>
      </router-link>
    </div>
  </div>
</template>

<script>


import axios from "axios"

export default {
  name: 'Home',
  data() {
    return {
      msg: '',
      content: []
    }
  },
  methods: {
    loadContent() {
      let pageNumber = 0
      axios.get('/api/series/page/' + pageNumber)
      .then(response => {
        console.log(response)
        this.content = response.data.content
      })
    }
  },
  mounted() {
    this.loadContent()
  }
}
</script>
<style scoped lang="scss">
@import "@/assets/_global_style.scss";

.home {
  background: $secondary-light;
}

.updates_container {
  display: flex;
  flex-direction: column;
  align-items: center;

  .itemlink {
    padding: 0 0 50px 0;
    width: 90%;
    .item {
      border-bottom: 5px $border-color solid;
      border-top: 5px $border-color solid;
      margin-top: 30px;
      padding: 20px 0;
      gap: 10px;
      height: min-content;
      overflow: hidden;
      display: grid;
      grid-template-columns: 0.7fr 1.6fr 0.7fr;
      //grid-template-rows: 0.5fr 1.5fr 1.6fr;
      grid-template-rows: min-content 1fr min-content;
      grid-template-areas:
        "img title title"
        "img desc desc"
        "tags tags tags";
      align-content: start;
      justify-content: start;
      justify-items: start;
      align-items: start;


      > * {
        border-radius: 10px;
        padding: 8px;
      }

      $mw: 480px;

      .cover {
        grid-area: img;
        object-fit: cover;
        width: 225px;
        height: 350px;
      }

      .title {
        color: $title-color;
        -webkit-text-stroke: 0.35px $title-stroke;
        width: available;
        height: fit-content;
        grid-area: title;
      }

      .description {
        font-weight: 500;
        font-style: italic;
        color: $title-color;
        -webkit-text-stroke: 0.35px $title-stroke;
        hyphens: manual;
        width: available;
        height: available;
        grid-area: desc;
      }

      .tags {
        width: available;
        display: flex;
        flex-direction: row;
        flex-wrap: wrap;
        gap: 20px;
        margin-left: 10px;
        grid-area: tags;

        a {
          display: inline-block;
          height: 24px;
          line-height: 24px;
          position: relative;
          padding: 0 10px 0 12px;
          background: $tag-color;
          -webkit-border-bottom-right-radius: 3px;
          border-bottom-right-radius: 3px;
          -webkit-border-top-right-radius: 3px;
          border-top-right-radius: 3px;
          -webkit-box-shadow: 0 1px 2px rgba(0, 0, 0, 0.2);
          box-shadow: 0 1px 2px rgba(0, 0, 0, 0.2);
          color: #fff;
          font-size: 12px;
          text-decoration: none;
          text-shadow: 0 1px 2px rgba(0, 0, 0, 0.2);
          font-weight: bold;
          z-index: -0.1;
        }

        :before {
          content: "";
          position: absolute;
          top: 0;
          left: -12px;
          width: 0;
          height: 0;
          border-color: transparent $tag-color transparent transparent;
          border-style: solid;
          border-width: 12px 12px 12px 0;
        }

        :after {
          content: "";
          position: absolute;
          top: 10px;
          left: 1px;
          float: left;
          width: 5px;
          height: 5px;
          -webkit-border-radius: 50%;
          border-radius: 50%;
          background: #fff;
          -webkit-box-shadow: -1px -1px 2px rgba(0, 0, 0, 0.4);
          box-shadow: -1px -1px 2px rgba(0, 0, 0, 0.4);
        }
      }

    }
  }

}



</style>
