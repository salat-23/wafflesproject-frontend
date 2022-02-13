<template>
  <div class="footer">
    <h2>Waffles-Project 2022</h2>
    <h2>site by <colored>salat23</colored></h2>
  </div>
</template>

<script>
export default {
  name: "Footer"
}
</script>

<style scoped lang="scss">
@import "@/assets/_global_style.scss";
  .footer {
    width: 100%;
    display: flex;
    background: $main-color;
    justify-content: space-between;
    border-top: 8px $secondary-dark solid;
    height: 70px;
    flex-direction: row;
    align-items: center;

    h2 {
      margin: 0 50px;
      colored {
        color: $secondary-dark;
      }
    }
  }

</style>