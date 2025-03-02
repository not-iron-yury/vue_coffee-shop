<script setup lang="ts">
import { ref, reactive } from 'vue'
import AppButton from './UI/AppButton.vue'
import { removeOverflowHidden } from '../functions'
import { useAuthStore } from '../stores/authStore'
import type { IFormData } from '../inretfaces'

const authStore = useAuthStore()
const emit = defineEmits(['close'])

const isAuth = ref<boolean>(true)
const formData = reactive<IFormData>({
  fullName: '',
  email: '',
  password: '',
})

const resetInputs = (): void => {
  formData.fullName = ''
  formData.email = ''
  formData.password = ''
}

const closeOverlay = () => {
  emit('close')
  removeOverflowHidden()
}

const submitForm = () => {
  if (formData.email && formData.password) {
    if (!isAuth.value) {
      authStore.register(formData)
    } else {
      authStore.login(formData)
    }

    closeOverlay()
    resetInputs()
  }
}
</script>

<template>
  <form class="form" @submit.prevent>
    <button class="form__btn-close" type="button" @click="closeOverlay">&times;</button>

    <h2 class="form__title">
      {{ isAuth ? 'Авторизация' : 'Регистрация' }}
    </h2>

    <fieldset class="form__fieldset">
      <label for="email" class="form__label" v-show="!isAuth">
        Имя
        <input type="text" id="name" v-model="formData.fullName" placeholder="Ваш name" />
      </label>

      <label for="email" class="form__label">
        Почта
        <input type="email" id="email" v-model="formData.email" placeholder="Ваш email" />
      </label>

      <label for="password" class="form__label">
        Пароль
        <input
          type="password"
          id="password"
          v-model="formData.password"
          placeholder="Ваш password"
        />
      </label>
    </fieldset>

    <app-button
      :label="isAuth ? 'Войти' : 'Зарегистрироваться'"
      class="form__bnt-submit"
      @click="submitForm"
    />

    <p class="form__status">
      {{ isAuth ? 'Еще не зарегистрировались?' : 'Уже зарегистрированы?' }}

      <button class="form__bnt-status" @click="isAuth = !isAuth">
        {{ isAuth ? 'Регистрация' : 'Войти' }}
      </button>
    </p>
  </form>
</template>

<style scoped lang="scss">
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
