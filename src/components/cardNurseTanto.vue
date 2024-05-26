<template>
  <v-card rouned="lg" height="450" width="600">
    <!-- <v-card-title>病棟看護師</v-card-title> -->
    <v-row>
      <v-col cols="6" v-for="(list, ix) in byotoList" :key="ix">
        <v-list lines="two">
          <v-list-subheader>{{
            list === "3f" ? "３階" : "４階"
          }}</v-list-subheader>

          <v-list-item>
            <template v-slot:prepend>
              <v-icon color="indigo-darken-3" icon="fa-solid fa-star"></v-icon>
            </template>
            <v-list-item-title>～9:00</v-list-item-title>
            <template v-for="(item, ix2) in tanto1" :key="ix2">
              <v-chip
                v-if="item.jikantai == 3 && item.byoto == list"
                size="small"
                class="mr-2"
                >{{ item.name }}</v-chip
              >
            </template>
          </v-list-item>

          <v-list-item>
            <template v-slot:prepend>
              <v-icon color="orange" icon="fa-solid fa-sun"></v-icon>
            </template>
            <v-list-item-title>8:30～18:00</v-list-item-title>
            <template v-for="(item, ix2) in tanto1" :key="ix2">
              <v-chip
                v-if="item.jikantai == 1 && item.byoto == list"
                size="small"
                class="ix2 > 2 ? mr-2 mt-1 : mr-2"
                >{{ item.name }}</v-chip
              >
            </template>
          </v-list-item>

          <v-list-item>
            <template v-slot:prepend>
              <v-icon color="yellow" icon="fa-solid fa-moon"></v-icon>
            </template>
            <v-list-item-title>17:30～9:00</v-list-item-title>
            <template v-for="(item, ix2) in tanto1" :key="ix2">
              <v-chip
                v-if="item.jikantai == 2 && item.byoto == list"
                size="small"
                class="mr-2"
                >{{ item.name }}</v-chip
              >
            </template>
          </v-list-item>

          <v-list-item>
            <template v-slot:prepend>
              <v-icon color="orange" icon="fa-solid fa-sun"></v-icon>
            </template>
            <v-list-item-title>8:30～18:00</v-list-item-title>
            <template v-for="(item, ix2) in tanto2" :key="ix2">
              <v-chip
                v-if="item.jikantai == 1 && item.byoto == list"
                size="small"
                class="ix2 > 2 ? mr-2 mt-1 : mr-2"
                >{{ item.name }}</v-chip
              >
            </template>
          </v-list-item>
        </v-list>
      </v-col>
    </v-row>
  </v-card>
</template>

<script>
import { firebaseDb } from "@/plugins/firebase";
import { collection, query, where, getDocs } from "firebase/firestore";

export default {
  data: () => ({
    // wd: "",
    wd1: 0,
    wd2: 0,
    // 1:日勤、2:夜勤、3:夜勤明け、0:休み
    // 日,月,火,水,木,金,土
    shift: [
      [2, 3, 0, 0, 1, 1, 1],
      [1, 2, 3, 0, 0, 1, 1],
      [1, 1, 2, 3, 0, 0, 1],
      [1, 1, 1, 2, 3, 0, 0],
      [0, 1, 1, 1, 2, 3, 0],
      [0, 0, 1, 1, 1, 2, 3],
      [3, 0, 0, 1, 1, 1, 2],
    ],
    query1: [],
    query2: [],
    sel1: [],
    sel2: [],
    tanto1: [],
    tanto2: [],
    byotoList: ["3f", "4f"],
  }),
  created: function () {
    const now = new Date();
    this.wd1 = now.getDay();
    this.wd2 = this.wd1 == 6 ? 0 : this.wd1 + 1;

    this.shift.forEach((val, ix) => {
      if (val[this.wd1] != 0) {
        this.query1.push(ix);
        this.sel1.push({
          ix: ix,
          shift: val[this.wd1],
        });
      }
      if (val[this.wd2] != 0) {
        this.query2.push(ix);
        this.sel2.push({
          ix: ix,
          shift: val[this.wd2],
        });
      }
    });
    this.getTanto1();
    this.getTanto2();
  },
  methods: {
    async getTanto1() {
      const q = query(
        collection(firebaseDb, "byoto-shift"),
        where("shift", "in", this.query1)
      );
      const querySnapshot = await getDocs(q);
      querySnapshot.forEach((doc) => {
        this.tanto1.push({
          id: doc.id,
          name: doc.data().name.split("　")[0],
          shift: doc.data().shift,
          byoto: doc.data().byoto,
          jikantai: this.shift[doc.data().shift][this.wd1],
        });
      });
    },
    async getTanto2() {
      const q = query(
        collection(firebaseDb, "byoto-shift"),
        where("shift", "in", this.query2)
      );
      const querySnapshot = await getDocs(q);
      querySnapshot.forEach((doc) => {
        this.tanto2.push({
          id: doc.id,
          name: doc.data().name.split("　")[0],
          shift: doc.data().shift,
          byoto: doc.data().byoto,
          jikantai: this.shift[doc.data().shift][this.wd1],
        });
      });
    },
  },
};
</script>

<style></style>
