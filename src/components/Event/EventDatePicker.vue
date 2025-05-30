<template>
  <!-- 
   :key is required to force rerender when time change
   If not used, the input becomes empty
   See : https://vuejs.org/api/built-in-special-attributes.html#key
    -->
  <input
    :type="time ? 'datetime-local' : 'date'"
    :key="time.toString()"
    class="rounded invalid:border-red-500 dark:bg-zinc-600"
    v-model="component"
    :min="computeMin"
    @blur="$emit('blur')"
  />
</template>
<script lang="ts" setup>
import { computed } from "vue";

const props = withDefaults(
  defineProps<{
    modelValue: Date | null;
    time: boolean;
    min?: Date | null | undefined;
  }>(),
  {
    min: undefined,
  }
);

const emit = defineEmits(["update:modelValue", "blur"]);

/** Format a Date to 'YYYY-MM-DDTHH:MM' based on local time zone */
const UTCToLocal = (date: Date) => {
  const localDate = new Date(date.getTime() - date.getTimezoneOffset() * 60000);
  return localDate.toISOString().slice(0, props.time ? 16 : 10);
};

const component = computed({
  get() {
    if (!props.modelValue) {
      return null;
    }
    return UTCToLocal(props.modelValue);
  },
  set(value) {
    if (!value) {
      emit("update:modelValue", null);
      return;
    }
    const date = new Date(value);

    if (!props.time) {
      date.setHours(0, 0, 0, 0);
    }

    emit("update:modelValue", date);
  },
});

const computeMin = computed((): string | undefined => {
  if (!props.min) {
    return undefined;
  }
  return UTCToLocal(props.min);
});
</script>
