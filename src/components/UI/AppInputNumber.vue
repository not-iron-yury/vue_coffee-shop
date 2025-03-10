<script setup lang="ts">
const props = defineProps({
  modelValue: {
    type: Number,
    required: true,
  },
  min: {
    type: Number,
    default: 1,
  },
  max: {
    type: Number,
    default: 100,
  },
})

const emit = defineEmits(['update:modelValue'])

const increment = () => {
  if (props.modelValue < props.max) {
    emit('update:modelValue', props.modelValue + 1)
  }
}

const decrement = () => {
  if (props.modelValue > props.min) {
    emit('update:modelValue', props.modelValue - 1)
  }
}
</script>

<template>
  <div class="quantity">
    <div class="quantity__control quantity__control_theme_second-primary">
      <button
        type="button"
        class="quantity__btn quantity__btn-decrease"
        @click="decrement"
        :disabled="modelValue <= min"
      >
        &minus;
      </button>
      <input
        type="number"
        class="quantity__input"
        name="quantity"
        :value="modelValue"
        :min="min"
        :max="max"
        readonly
      />
      <button
        type="button"
        class="quantity__btn quantity__btn-increase"
        @click="increment"
        :disabled="modelValue >= max"
      >
        &plus;
      </button>
    </div>
  </div>
</template>

<style scoped lang="scss">
/* Сброс стилей для input[type="number"] */
input[type='number'] {
  -webkit-appearance: none;
  -moz-appearance: textfield;
  appearance: none;
  margin: 0;
  padding: 0;
  border: none;
  outline: none;

  width: 50px;
  text-align: center;
  font-size: 20px;
}

/* Убираем стрелки для WebKit */
input[type='number']::-webkit-outer-spin-button,
input[type='number']::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}

.quantity {
  display: inline-flex;
  flex-direction: column;
  gap: 10px;

  &__control {
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 122px;
    height: 46px;

    &_theme_white {
      background-color: var(--color-white);
    }
    &_theme_second-primary {
      background-color: var(--color-second-primary);
    }
  }

  &__btn {
    display: flex;
    align-items: center;
    justify-content: center;
    min-width: 44px;
    padding: 10px 12px 12px;
    color: var(--color-text);
    cursor: pointer;
    font-size: 25px;
    border-radius: 5px;

    &:not(:disabled) {
      color: #fa2004;
      background-color: rgba(255, 81, 0, 0.078);
    }

    &:disabled {
      background-color: rgba(104, 13, 1, 0.039);
    }
  }
}
</style>
