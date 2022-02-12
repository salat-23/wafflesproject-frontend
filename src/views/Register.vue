<template>

  <div class="login">

    <div class="form">

      <div class="field_container">
        <label>Логин</label>
        <input ref="loginField" type="text" class="text_field">
      </div>

      <div class="field_container">
        <label>Пароль</label>
        <input ref="passwordField" type="password" class="text_field">
      </div>

      <div class="field_container">
        <label>Почта</label>
        <input ref="emailField" type="email" class="text_field">
      </div>

      <div class="field_container">
        <button @click="register">Зарегистрироваться</button>
      </div>
      <div class="field_container">
        <button @click="loginClick">Войти</button>
      </div>




    </div>

  </div>

</template>

<script>

export default {
  name: "Register",
  methods: {
    loginClick() {
      this.$router.push({ path: 'login'})
    },
    register() {
      const data = {
        username: this.$refs.loginField.value,
        password: this.$refs.passwordField.value,
        email: this.$refs.emailField.value
      }
      this.$store.dispatch('register', data)
          .then(() => this.$router.push('/'))
          .catch(err => console.log(err))
    }
  }
}
</script>

<style scoped lang="scss">
@import "@/assets/_global_style.scss";

.login {
  background: $secondary-light;
}

.form {
  margin-top: 130px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 20px;
}

.field_container {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 5px;
  label {
    font-size: 2.4em;
    font-weight: 500;
    color: $type-face;
  }

  .text_field, button {
    border-radius: 5px;
    font-size: 2em;
    font-weight: 500;
    color: $type-face;
    outline: 1px $type-face solid;
    padding:10px;
    border:0;
    box-shadow:0 0 15px 4px rgba(0,0,0,0.08);
    background: $main-twin;
  }
  button {
    font-size: 1em;
    width: 407px;
    transition: 0.1s;
    margin-top: 20px;
  }
  button:hover {
    background: $secondary-dark;
  }
  button:active {
    outline: 1px $secondary-dark solid;
    color: $secondary-dark;
    background: $type-face;
  }


  .social {
    opacity: 0.85;
    border: none;
    outline: none;
  }

  .social:hover {
    opacity: 1;
  }
  .social:active {
    opacity: 0.3;
  }

  //Google
  .social:nth-child(1) {
    background: #dd4b39;
    color: white;
  }

  //Vk
  .social:nth-child(2) {
    background: #3B5998;
    color: white;
  }


}

</style>