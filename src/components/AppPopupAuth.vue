<script setup lang="ts">
import { defineProps, defineEmits, ref } from 'vue'
import AppButton from './AppButton.vue'
import { removeOverflowHidden } from '../functions'
import type { FormData } from '../inretfaces'

const isAuth = ref<boolean>(true)

defineProps({
  showOverlay: {
    type: Boolean,
    reqired: true,
  },
})

const emit = defineEmits(['close'])

const formData = ref<FormData>({
  email: '',
  password: '',
})

const submitForm = () => {
  console.log(formData.value)
}

const closeOverlay = () => {
  emit('close')
  removeOverflowHidden()
}
</script>

<template>
  <div class="overlay" @click.self="closeOverlay">
    <form class="form" @submit.prevent="submitForm">
      <button class="form__btn-close" type="button" @click="closeOverlay">&times;</button>

      <h2 class="form__title">
        {{ isAuth ? 'Авторизация' : 'Регистрация' }}
      </h2>

      <fieldset class="form__fieldset">
        <label for="email" class="form__label">
          Ваше имя:
          <input type="email" id="email" v-model="formData.email" placeholder="Ваш email" />
        </label>

        <label for="password" class="form__label">
          Почта:
          <input
            type="password"
            id="password"
            v-model="formData.password"
            placeholder="Ваш password"
          />
        </label>
      </fieldset>

      <app-button :label="isAuth ? 'Войти' : 'Зарегиться'" class="form__bnt-submit" />

      <p class="form__status">
        {{ isAuth ? 'Еще не зарегистрировались?' : 'Уже зарегистрированы?' }}

        <button class="form__bnt-status" @click="isAuth = !isAuth">
          {{ isAuth ? 'Регистрация' : 'Войти' }}
        </button>
      </p>
    </form>
  </div>
</template>

<style scoped lang="scss">
.overlay {
  position: fixed;
  top: 0;
  left: 0;

  display: flex;
  justify-content: center;
  align-items: center;

  width: 100%;
  height: 100%;

  background-color: rgba(0, 0, 0, 0.7);
  z-index: 9999;
}

.form {
  position: relative;
  display: flex;
  flex-direction: column;
  max-width: 400px;
  width: 100%;
  padding: 30px;

  background-color: white;
  border-radius: 5px;
  box-shadow: 0 0 15px rgba(0, 0, 0, 0.3);

  &__btn-close {
    position: absolute;
    top: 5px;
    right: 5px;
    padding: 8px;
    font-size: 35px;
    opacity: 0.5;
  }
  &__bnt-submit {
  }
  &__title {
    margin-bottom: 20px;
    font-size: 25px;
    text-align: center;
  }
  &__fieldset {
    margin-bottom: 15px;
  }
  &__label {
    display: grid;
    gap: 5px;
  }

  &__status {
    padding: 10px 0 0;
    font-size: 14px;
    text-align: center;

    & button {
      padding: 4px;
      color: #f44336;
    }
  }
}

.form input {
  display: block;
  margin-bottom: 10px;
  padding: 10px;
  width: 100%;
  border: 1px solid #ccc;
  border-radius: 3px;
}
</style>
