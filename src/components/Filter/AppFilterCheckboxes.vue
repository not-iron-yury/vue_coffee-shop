<script setup lang="ts">
defineProps({
  data: {
    type: Object,
    required: true,
  },
})

const emit = defineEmits(['onChange'])

const handlerCheckboxes = (event: Event) => {
  if (event.target instanceof HTMLInputElement && event.target.value !== null) {
    emit('onChange', `${event.target.name}=${event.target.value}`)
  }
}
</script>

<template>
  <div class="filter-item">
    <h3 class="filter-item__title">{{ data.title }}</h3>
    <div class="filter-item__checkbox-list">
      <label v-for="(option, index) in data.options" :key="index">
        <input type="checkbox" :value="option" :name="data.name" @change="handlerCheckboxes" />
        {{ option }}
      </label>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.filter-item {
  &__title {
    margin-bottom: 10px;
    font-size: 21px;
  }
  &__checkbox-list {
    display: flex;
    flex-direction: column;
    gap: 5px;
  }
}
</style>
