<template>
  <div class="header">
    <RouterLink to="/">
      <img src="@/assets/logo.svg"/>
    </RouterLink>
    <div class="container">
      <RouterLink to="/">главная</RouterLink>
      <RouterLink to="/">каталог</RouterLink>
      <RouterLink to="/">профиль</RouterLink>
      <RouterLink to="/">настройки</RouterLink>
      <RouterLink @click="logout" v-if="isAuthenticated" to='/'>выйти</RouterLink>
      <RouterLink v-else to="/login">войти</RouterLink>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapState } from "vuex";
import {AUTH_LOGOUT, AUTH_REQUEST} from "@/modules/auth-actions";
export default {

  name: "Header",
  data() {
    return {

    }
  },
  methods: {
    logout() {
      console.log('logging out')
      this.$store.dispatch(AUTH_LOGOUT).then(() => {
        this.$router.go(0)
      })
    }
  },
  computed: {
    ...mapGetters(["getProfile", "isAuthenticated", "isProfileLoaded"]),
    ...mapState({
      authLoading: state => state.auth.status === "loading",
      name: state => `${state.user.profile.title} ${state.user.profile.name}`
    })
  }
}
</script>

<style scoped lang="scss">
@import "@/assets/_global_style.scss";

.header {
  width: 100%;
  display: flex;
  background: $main-color;
  justify-content: space-between;
  border-bottom: 8px $secondary-dark solid;
  height: 80px;
  position: relative;

  img {
    margin-left: 20px;
    padding: 10px;
    height: 60px;
    width: 60px;
  }

  .container {
    display: flex;
    gap: 2px;
    height: inherit;
    align-items: center;
    justify-content: right;
    padding: 0 50px 0 0;

    a {
      font-size: 1.5em;
      font-weight: 650;
      padding: 10px;
    }

    a:hover {
      color: $main-color;
      background: $type-face;
    }

  }
}


</style>