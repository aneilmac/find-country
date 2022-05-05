<script setup lang="ts">
import { countryCodes, type CountryData } from './countryCodes';
import {ref, type Ref, defineProps, watch, toRefs} from 'vue';

const regionNames = new Intl.DisplayNames(['en'], {type: 'region'});
const countries = ref(countryCodes.map(x => ({ "code": x, "name": regionNames.of(x) })));

const props = defineProps<{index: number; selectedCountries: (CountryData | null)[];}>();

const {index, selectedCountries} = toRefs(props);

const selected: Ref<CountryData> = ref({ code: "", name: ""});
watch(selected, (newValue: CountryData | null, oldValue: CountryData |null) => {
    if (newValue?.code !== oldValue?.code) {
        selectedCountries.value[index.value] = newValue;
    }
});
</script>

<template>
    <v-select v-model="selected" label="name" :options="countries" :appendToBody="true"></v-select>
</template>

<style scoped>
</style>
