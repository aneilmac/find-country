<script setup lang="ts">
import { defineProps, toRefs, ref, type Ref, withDefaults, computed } from 'vue';
import type { CountryData } from './countryCodes';
import panzoom from 'panzoom';

const props = withDefaults(
    defineProps<{
        hiddenCountries: string[];
    }>(), { 
        hiddenCountries: () => []
    } 
);

const { hiddenCountries } = toRefs(props);
const selectedCountries: Ref<(CountryData | null)[]> = ref([]);

const countryCols = computed(() => {
    const cols: any = {};
    for (let a of hiddenCountries.value) {
        cols[a] = "hidden";
    }
    for (let a of selectedCountries.value) {
        if (a) {
            if (cols[a.code]) {
                cols[a.code] = "correct";
            }
            else {
                cols[a.code] = "incorrect";
            }
        }
    }
    return cols;
});

const submitted : Ref<boolean> = ref(false);

function renderCountries(svg: Document) {
    for (const [k, v] of Object.entries(countryCols.value)) {
        const a = svg.getElementById(k);
        if (submitted.value === true) {
            a?.setAttribute("visibility", "visible");
            if (v === "hidden") {
                a?.setAttribute("class", "land-missed");
            } else if (v === "correct") {
                a?.setAttribute("class", "land-correct");
            } else if (v === "incorrect") {
                a?.setAttribute("class", "land-incorrect");
            }
        } else {
            if (v === "hidden") {
                a?.setAttribute("visibility", "hidden");
            }
        }
    }
    return svg;
}

function guessCountries(cc: CountryData[]) {
    submitted.value = true;
    selectedCountries.value = [...cc];
    console.log(selectedCountries.value);
}
defineExpose({guessCountries});

function svgLoaded(element: SVGElement) {
    panzoom(element, 
    {
        bounds: true,
        minZoom: 1.0,
        smoothScroll: false
    });
}

</script>

<template>
    <inline-svg
        src="worldHigh.svg"
        :keepDuringLoading="false"
        :transformSource="renderCountries"
        @loaded="svgLoaded"
    ></inline-svg>
</template>

<style scoped>
</style>
