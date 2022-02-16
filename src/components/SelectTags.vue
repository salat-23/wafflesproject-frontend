<template>
<div class="vignette">
  <div class="select_space">

  </div>
</div>
</template>

<script>
export default {
  name: "SelectTags",
  mounted() {

  }
}
</script>

<style scoped lang="scss">
@import "@/assets/_global_style.scss";

  .vignette {
    z-index: 2;
    position: fixed;
    width: 100%;
    height: 100%;
    background: rgba(41,35,45,0.9);
    display: flex;
    flex-direction: column;
    align-items: center;

    .select_space {
      height: 100%;
      width: 700px;
      background: $main-twin;

    }


  }

</style>