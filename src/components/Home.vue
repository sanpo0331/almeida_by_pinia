<template>
  <div class="d-flex justify-space-start mb-5">
    <cardGairaiTantoVue class="mr-4" />
    <cardNurseTanto class="mr-4" />
    <v-locale-provider locale="ja">
      <v-date-picker color="amber" hide-header></v-date-picker>
    </v-locale-provider>
  </div>
</template>

<script>
import cardGairaiTantoVue from './cardGairaiTanto.vue'
import cardNurseTanto from './cardNurseTanto.vue'

export default {
  components: {
    cardGairaiTantoVue,
    cardNurseTanto
  }
}
</script>
