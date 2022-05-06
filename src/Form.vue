<script setup lang="ts">
import { toRefs, ref, type Ref, watch, computed } from 'vue';
import EntryText from './EntryText.vue';
import type { CountryData } from './countryCodes';

const props = defineProps<{targetCountries: CountryData[];}>();
const {targetCountries} = toRefs(props);
const numEntries = computed(() => targetCountries.value.length);

const selectedCountries: Ref<(CountryData | null)[]> = ref([]);
watch(numEntries, (newValue: number, _oldValue: number) => {
    while (selectedCountries.value.length >= newValue) {
        selectedCountries.value.pop();
    }
    while (selectedCountries.value.length < newValue) {
        selectedCountries.value.push(null);
    }
});

const incorrect = computed(() => {
    let count = [];
    for (const ca of targetCountries.value) {
        if (!selectedCountries.value.some(x => x?.code === ca.code)) {
            count.push(ca.name);
        }
    }
    return count;
});

const emit = defineEmits<{
  (e: 'countriesSubmitted', countries: (CountryData | null)[]): void
}>()

const submitted: Ref<boolean> = ref(false);
function submitCountries() {
    submitted.value = true;
    emit('countriesSubmitted', selectedCountries.value);
}
</script>

<template>
    <div>
        <h1>Find the missing countries</h1>
        <div>
            {{numEntries}} countries have been removed from this map.<br>
            Input the names of the missing countries and hit "Submit".<br>
            <h6>(Pan and zoom the map.)</h6>
        </div>
        <div v-for="n in numEntries">
            <EntryText class="member" 
                :index="n-1" 
                :selected-countries="selectedCountries"
                :disabled="submitted"/>
        </div>
        <button class="member b" @click="submitCountries" :disabled="submitted">Submit</button>
        <div v-if="submitted" class="member">
            You got: {{numEntries - incorrect.length}} / {{numEntries}} correct.<br>
            <span v-if="incorrect.length > 0">
            The countries you missed were:
                <ul>
                    <li  v-for="i of incorrect">
                        {{i}}
                    </li>
                </ul>
            </span>
            <span v-else>Well done, you got all the countries!</span>
            <br>
            Come back tomorrow for a new puzzle!
        </div>
    </div>
</template>

<style scoped>
h1 {
    text-align: center;
}

.member {
    padding: 10px;
}

.b {
    width: 100%;
}

</style>
