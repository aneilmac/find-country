<script setup lang="ts">
import { countryCodes, type CountryData } from './countryCodes';
import {ref, type Ref, defineProps, watch, toRefs} from 'vue';

const props = defineProps<{index: number; selectedCountries: (CountryData | null)[];}>();

const {index, selectedCountries} = toRefs(props);

// The user's selected country for this field.
const selected: Ref<CountryData> = ref({ code: "", name: ""});

// Whenever the user selection changes, updates the given index in the master
// selected countries list.
watch(selected, (newValue: CountryData | null, oldValue: CountryData |null) => {
    if (newValue?.code !== oldValue?.code) {
        selectedCountries.value[index.value] = newValue;
    }
});
</script>

<template>
    <v-select v-model="selected" label="name" :options="countryCodes" :appendToBody="true"></v-select>
</template>

<style scoped>
</style>
