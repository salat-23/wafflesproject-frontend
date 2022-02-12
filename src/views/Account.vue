<template>
  <div class="profile">

    <div class="details_container">

      <div class="details">

        <img :src="user.avatar" class="avatar">

        <h2 class="username">{{user.username}}</h2>

        <div class="other">

          <p ref="roleField"></p>
          <p>{{user.email}}</p>

        </div>

      </div>

    </div>


  </div>
</template>

<script>
import axios from "axios";
import {userData, moderData, memberData, adminData} from "@/scripts/userTypesData";

export default {
  name: "Account",
  data() {
    return {
      user: {}
    }
  },
  methods: {
    setRole() {
      this.$refs.roleField.innerText = this.user.roleData.name
      this.$refs.roleField.style.color = this.user.roleData.color
    }
  },
  mounted() {
    axios.get('/api/users/me', ).then(resp =>{
      this.user = resp.data

      let role = this.user.role;
      if (role === "ROLE_ADMIN") {
        this.user.roleData = adminData
      } else if (role === "ROLE_MEMBER") {
        this.user.roleData = memberData
      } else if (role === "ROLE_MODERATOR") {
        this.user.roleData = moderData
      } else {
        this.user.roleData = userData
      }

      this.setRole()
    })
  }
}
</script>

<style scoped lang="scss">
@import "@/assets/_global_style.scss";

  .profile {
    background: $secondary-light;
  }

.details_container {
  display: flex;
  flex-direction: column;
  align-items: center;


  .details {
    border-bottom: 5px $border-color solid;
    border-top: 5px $border-color solid;
    width: 90%;
    margin: 50px 0;
    padding: 50px 0;
    display: grid;
    grid-template-rows: 1fr 1fr;
    grid-template-columns: 1fr 1fr 1fr;
    grid-template-areas:
        "avatar username username"
        "avatar other    other";

    .avatar {
      grid-area: avatar;
      border-radius: 20px;
    }

    .username {
      grid-area: username;
    }

    .other {
      grid-area: other;
    }


  }

}



</style>