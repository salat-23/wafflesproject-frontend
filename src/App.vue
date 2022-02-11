<template>
  <Header class="sticky"/>
  <div class="container">
    <router-view/>
  </div>

</template>

<script>

import Header from "@/components/Header";
import axios from "axios";

export default {
  components: {Header},
  created: function () {
  axios.interceptors.response.use(undefined, function (err) {
    return new Promise(function (resolve, reject) {
      if (err.status === 401 && err.config && !err.config.__isRetryRequest) {
        // if you ever get an unauthorized, logout the user
        this.$store.dispatch(AUTH_LOGOUT)
        this.$router.push('/')
        // you can also redirect to /login if needed !
      }
      throw err;
    });
  });
}
}
</script>

<style scoped lang="scss">
@import "@/assets/_global_style.scss";

.sticky {
  z-index: 2;
  position: sticky;
  top: 0;
}

.container {
  background: $main-twin;
  display: flex;
  justify-content: center;
  min-height: 100vh;

  >div {
    width: 1000px;
  }

}

</style>
