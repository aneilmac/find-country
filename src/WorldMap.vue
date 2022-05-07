<script setup lang="ts">
import { toRefs, ref, type Ref, withDefaults, computed } from 'vue';
import  type {  CountryData } from './countryCodes';
import panzoom from 'panzoom';

const props = withDefaults(
    defineProps<{
        hiddenCountries: CountryData[];
    }>(), { 
        hiddenCountries: () => []
    } 
);

// List of countries to hide.
const { hiddenCountries } = toRefs(props);

// List of countries user has selected.
const selectedCountries: Ref<(CountryData | null)[]> = ref([]);

// Computed dictionary of country codes and their state, can be one of:
// 1. hidden = user has not found/selected this country.
// 2. correct = user has discovered hidden country.
// 3. incorrect = user has mistakenly clicked a different country.
const countryCols = computed(() => {
    const cols: any = {};
    for (let a of hiddenCountries.value) {
        cols[a.code] = "hidden";
    }
    for (let a of selectedCountries.value) {
        if (a) {
            if (cols[a.code] === "hidden") {
                cols[a.code] = "correct";
            }
            else if (cols[a.code] !== "correct") {
                cols[a.code] = "incorrect";
            }
        }
    }
    return cols;
});

// Flag as to whether the user has finalized their choices or not.
const submitted : Ref<boolean> = ref(false);

/**
 * Edits the SVG render. Removes countries and/or colours countries based on 
 * user submission.
 * @param svg SVG document to edit.
 */
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

/**
 * Called by parent, applies the user's guesses to the map.
 * @param cc Countries user has selected as their guesses.
 */
function guessCountries(cc: CountryData[]) {
    submitted.value = true;
    selectedCountries.value = [...cc];
    console.log(selectedCountries.value);
}
defineExpose({guessCountries});

/**
 * After SVG is injected into DOM, adds navigation properties to the SVG. 
 * @param element 
 */
function addSvgNavigation(element: SVGElement) {
    panzoom(element, 
    {
        bounds: true,
        minZoom: 1.0,
        smoothScroll: false,
        onTouch: _e => false
    });
}
</script>

<template>
    <inline-svg
        src="worldHigh.svg"
        :keepDuringLoading="false"
        :transformSource="renderCountries"
        @loaded="addSvgNavigation"
    ></inline-svg>
</template>

<style scoped>
</style>
