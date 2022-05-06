<script setup lang="ts">
import WorldMap from './WorldMap.vue'
import seedrandom from 'seedrandom';
import { type CountryData, countryCodes } from './countryCodes';
import {ref} from 'vue';
import Form from './Form.vue';

function todayCountries(count=3) {
  // Grab today's date.
  const n = new Date();
  n.setHours(0, 0, 0, 0);
  // Seed with today's date @ midnight.
  const arng =  seedrandom(n.toUTCString() + " FIND COUNTRY");

  const cs : CountryData[] = [];
  for (let i = 0; i < count; ++i) {
    // Calculate random country code
    const index = arng.double() * countryCodes.length | 0;
    const cc = countryCodes[index];

    // Ensure we have no duplicates.
    if (cs.some(x => x.code === cc.code)) {
      i -= 1;
    } else {
      cs.push(cc);
    }
  }

  cs.sort();
  return cs;
}

const missingCountries = ref(todayCountries());
const worldMap = ref();
</script>

<template>
  <div id="app">
  <WorldMap ref="worldMap" class="worldMap" :hiddenCountries="missingCountries"/>
  <Form class="form" :targetCountries="missingCountries" 
    @countries-submitted="cs => worldMap.guessCountries(cs)"/>
  </div>
</template>

<style>
/* @import "@/assets/base.css"; */

@import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@500&display=swap');
body {
  font-family: 'Montserrat', sans-serif;
}

#app{
  position: fixed;
  width: 100vw;
  height: 100vh;
}

.form {
  overflow: auto;
  opacity: 0.8;
  display: inline-block;
  margin: 10px;
  padding: 10px;
  background-color: white;
}

.worldMap {
   position: fixed;
   height: 100%;
   width: 100%;
 }

</style>
