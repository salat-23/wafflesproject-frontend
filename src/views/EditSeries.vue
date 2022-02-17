<template>
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css">
  <button @click="saveChanges" class="floating_button"><i class="fa fa-save"></i></button>
  <div class="watch">
    <div class="player_container">

      <div class="item" @drop.prevent="uploadImage">
        <img class="cover" :src="series.cover">
        <textarea ref="autz1" @input="autosize" class="title textarea_clean">{{ series.title }}</textarea>
        <textarea ref="autz2" @input="autosize" class="description textarea_clean">{{ series.description }}</textarea>

        <div class="tags">
          <tag @click.prevent.stop="removeTag" v-for="tag in series.tags" :to="{ path: '/tag/'+tag }">{{ tag }}</tag>
          <tag @click="addTag" v-if="!isAddingTag" class="special">Добавить</tag>
          <tag @keydown.enter="saveTag" @dblclick="cancelTag" v-else class="special"><input ref="tagInput"/></tag>
        </div>
      </div>

      <div class="details">
        <div class="details-first-col details-col">
          <h4>Режиссер</h4>
          <h4>Тип</h4>
          <h4>Статус</h4>
          <h4>Первоисточник</h4>
          <h4>Студия</h4>
          <h4>Возрастные ограничения</h4>
        </div>
        <div class="details-second-col details-col">
          <input class="details_edit_el" :value="series.director"/>
          <select class="details_edit_el" :value="series.type">
            <option value="ТВ сериал">ТВ Сериал</option>
            <option value="Фильм">Фильм</option>
          </select>
          <select class="details_edit_el" :value="series.status">
            <option value="ONGOING">Онгоинг</option>
            <option value="OUT">Вышел</option>
            <option value="PAUSED">Приостоновлен</option>
          </select>
          <select class="details_edit_el" :value="series.source">
            <option value="Манга">Манга</option>
            <option value="Новелла">Лайт-новелла</option>
          </select>
          <input class="details_edit_el" :value="series.studio"/>
          <input class="details_edit_el" type="number" :value="series.ageRestriction"/>
        </div>
      </div>

      <div v-if="hasEpisodes" class="player_main_container">

        <div class="video_player_container">
          <div class="video_player">
            <iframe ref="player" src="https://video.sibnet.ru/shell.php?videoid=4521284"/>
          </div>
        </div>

        <div class="episode_selector">

          <RouterLink v-for="episode in episodes" :to="{ path: '/' + series.title + '/' + episode.number}"
                      class="episode_button" :class="{ 'active': (
                          (episode.number === 1 && this.$route.params.episode == null) ||
                          episode.number+'' === this.$route.params.episode) }">
            <p class="episode_button_text">{{ episode.number }}</p>
          </RouterLink>

        </div>
      </div>
    </div>
  </div>

</template>

<script>
import axios from "axios";
import SelectTags from "@/components/SelectTags";

export default {
  name: "EditSeries",
  components: {SelectTags},
  data() {
    return {
      user: localStorage.getItem('user'),
      series: {},
      editLink: '',
      isAddingTag: false,
      hasEpisodes: true,
      episodes: [
        {
          number: 1,
          resource: 'https://video.sibnet.ru/shell.php?videoid=4521284'
        },
        {
          number: 2,
          resource: 'https://video.sibnet.ru/shell.php?videoid=4594744'
        }
      ]
    }
  },
  computed: {
    isAbleEdit() {
      let curRole = localStorage.getItem('role');
      return curRole === 'ROLE_ADMIN' || curRole === 'ROLE_MEMBER'
    }
  },
  mounted() {
    this.changeEpisode()
    this.fetchSeries()
  }
  ,
  updated() {
    this.changeEpisode()
  },
  methods: {
    uploadImage(event) {
      event.preventDefault()
      let file = event.dataTransfer.files[0]
      let bodyFormData = new FormData();
      bodyFormData.append('cover', file)
      axios({
        method: 'post',
        url: '/api/series/cover/'+this.series.id,
        data: bodyFormData,
        headers: { "Content-Type": "multipart/form-data" }
      }).then(resp => {
        this.series.cover = resp.data.url
      })
    },
    saveChanges() {

    },
    cancelTag() {
      this.$refs.tagInput.value = ''
      this.isAddingTag = false;
    },
    saveTag() {
      let tagName = this.$refs.tagInput.value
      this.$refs.tagInput.value = ''
      this.series.tags.push(tagName)
      this.isAddingTag = false;
    },
    addTag() {
      this.isAddingTag = true;
    },
    changeEpisode() {
      if (this.$route.params.episode !== null
          && Number(this.$route.params.episode) <= this.episodes.length
          && Number(this.$route.params.episode) > 0
          && this.episodes.length > 0) {
        //This will execute if you have an episode number in url
        let number = this.$route.params.episode
        this.$refs.player.src = this.episodes[number - 1].resource
        this.scrollTo(this.$refs.player)
        return
      }

      if (this.$route.params.episode == null) {

        if (this.episodes.length > 0) {
          //This will execute if you dont have an episode number in url
          //and have at least 1 episode

          this.$refs.player.src = this.episodes[0].resource
          return
        }

        //This will execute if you dont have any episodes
        this.hasEpisodes = false

        return
      }
      this.$router.push({path: '/' + this.$route.params.title, force: true})
    },
    scrollTo(element) {
      element.scrollIntoView({
        behavior: 'smooth',
        block: "center"
      })
    },
    autosize(e) {
      let el = e.target
      setTimeout(() => {
        el.style.cssText = 'height:auto'
        el.style.cssText = 'height:' + el.scrollHeight + 'px'
      }, 0);
    },
    autosizeInit(e) {
      setTimeout(() => {
        e.style.cssText = 'height:auto'
        e.style.cssText = 'height:' + e.scrollHeight + 'px'
      }, 0);
    },
    clearComment() {
      this.$refs.your_text.textContent = ''
    },
    fetchSeries() {
      axios.get('/api/series/title/' + this.$route.params.title)
          .then(response => {
            this.series = response.data
            this.editLink = '/edit/' + this.series.title
            this.autosizeInit(this.$refs.autz1)
            this.autosizeInit(this.$refs.autz2)
          })
    },
    removeTag(e) {
      let el = e.target
      setTimeout(() => {
        el.remove()
      })
    }
  }
}
</script>

<style scoped lang="scss">

@import "@/assets/_global_style.scss";

.floating_button {
  z-index: 2;
  right: 5px;
  bottom: 5px;
  position: fixed;
  width: 100px;
  height: 100px;
  background: $secondary-dark;
  border: 5px $border-color solid;
  border-radius: 50%;
  color: $border-color;
  font-size: 300%;
}
.floating_button:hover {
  background: $secondary-light;
  color: $type-face;
}

.watch {
  background: $secondary-light;
  padding-bottom: 30px;
}

.player_container {
  display: flex;
  align-items: center;
  flex-direction: column;
}

.textarea_clean {
  background: none;
  outline: none;
  border: none;
  resize: none;
  height: fit-content;
}


.item {
  border-bottom: 5px $border-color solid;
  border-top: 5px $border-color solid;
  margin-top: 30px;
  padding: 20px 0;
  gap: 10px;
  width: 90%;
  height: min-content;
  overflow: hidden;
  display: grid;
  grid-template-columns: 0.7fr 1.6fr 0.7fr;
  grid-template-rows: min-content 1fr min-content;
  grid-template-areas:
        "img title title"
        "img desc desc"
        "tags tags tags";

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
    font-size: 24px;

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


    tag {
      cursor: pointer;
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

    tag.special {
      background: $type-face;
    }
    tag.special:before {
      border-color: transparent $type-face transparent transparent;
    }

    tag.special:hover {
       background: $main-twin;
    }
    tag.special:hover:before {
      border-color: transparent $main-twin transparent transparent;
    }

    tag:hover {
      background: $secondary-dark;
    }
    tag:hover:before {
      border-color: transparent $secondary-dark transparent transparent;
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

.edit {
  padding: 30px 0;
  width: 90%;
  display: flex;
  flex-direction: column;
  align-items: center;
  border-bottom: 5px $border-color solid;

  .edit_link {
    border-radius: 5px;
    width: 50%;
    font-size: 25px;
    text-align: center;
    background: $secondary-dark;

  }
}

.details {

  display: flex;
  flex-direction: row;
  justify-content: space-between;
  width: 90%;

  border-bottom: 5px #95A3B3 solid;

  .details-col {
    padding: 20px;
    width: 50%;
    gap: 10px;
    display: flex;
    flex-direction: column;
    align-items: stretch;
    justify-content: space-between;
  }

  .details-first-col {
    width: 30%;
  }

  .details-second-col {
    width: available;

    .details_edit_el {
      height: 20px;
    }
    .slim {
      font-size: 16px;
      width: 30px;
    }

  }


}

.player_main_container {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.video_player_container {
  width: 90%;
  height: 100%;
  border-bottom: 5px $border-color solid;

  .video_player {
    margin-top: 20px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: stretch;
    position: relative;
    width: 100%;
    padding-bottom: 56.25%;
    float: left;
    height: 0;

    iframe {
      position: absolute;
      width: 100%;
      height: 100%;
    }
  }
}

.episode_selector {

  margin-top: 30px;
  border-top: 5px $border-color solid;
  border-bottom: 5px $border-color solid;

  width: 90%;
  padding: 20px 0;
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: flex-start;
  gap: 10px;

  .episode_button {
    display: inline-block;

    .episode_button_text {
      color: $epidose-button-text-color;
      font-weight: 600;
      -webkit-text-stroke: 0.35px $title-stroke;
      border-radius: 50%;
      text-align: center;
      text-justify: distribute;
      width: 50px;
      height: 50px;
      font-size: 2em;
      background: $main-twin;
    }

  }

  .episode_button.active {
    .episode_button_text {
      background: $tag-color;
    }
  }

  .episode_button:hover {
    .episode_button_text {
      background: $secondary-dark;
    }
  }

}

.comments_block {

  margin-top: 30px;
  display: flex;
  flex-direction: column;
  width: 90%;
  gap: 10px;

  .your_comment {
    margin-bottom: 30px;
    padding: 10px;
    gap: 10px;
    display: grid;
    grid-template-columns: min-content 1fr 1fr;
    grid-template-rows: fit-content(100%) fit-content(100%) 2em;
    grid-template-areas:
        "avatar username username"
        "avatar text     text"
        "button button   button";


    .avatar {
      border-radius: 50%;
      grid-area: avatar;
      object-fit: cover;
      width: 100px;
      height: 100px;
    }

    h3 {
      grid-area: username;
    }

    textarea {
      padding: 5px;
      background: $main-twin;
      color: $type-face;
      border-style: none;
      border-color: Transparent;
      border-radius: 5px;
      grid-area: text;
      outline: none;
      appearance: none;
      resize: none;
      height: auto;
      font-size: 1.1em;

      overflow: hidden;
    }

    .button_container {

      grid-area: button;
      display: flex;
      align-items: center;
      justify-content: center;
      width: 100%;
      height: 100%;

      button {
        background: $border-color;
        transition-duration: 0.1s;

        border: none;
        border-radius: 10px;
        width: 50%;
        height: 100%;

      }

      button:hover {
        background: $secondary-dark;
      }

      button:active {
        background: $type-face;
      }

    }


  }

  .comments {

    display: flex;
    flex-direction: column;
    gap: 10px;
    width: 100%;
    align-items: center;

    .comments_item {
      padding: 10px;
      gap: 10px;
      display: grid;
      grid-template-columns: min-content 1fr 1fr;
      grid-template-rows: 0.3fr 1fr;
      grid-template-areas:
        "avatar username username"
        "avatar text text";


      .avatar {
        border-radius: 50%;
        grid-area: avatar;
        object-fit: cover;
        width: 100px;
        height: 100px;
      }

      h3 {
        grid-area: username;
      }

      p {
        grid-area: text;
      }
    }
  }

}

</style>