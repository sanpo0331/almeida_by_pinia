<template>
  <div>
    <v-card
      elevation="5"
      width="700"
      height="450"
      class="pa-5 bg-teal-lighten-5"
    >
      <v-toolbar color="transparent" class="mb-4">
        <v-toolbar-title>外来担当医登録</v-toolbar-title>
        <v-spacer />
        <v-icon icon="fa-solid fa-stethoscope" color="primary" size="50" />
      </v-toolbar>

      <v-select
        label="診療科"
        :items="medicals"
        item-title="name"
        item-value="id"
        v-model="frmMedical"
        @update:model-value="getDoctors"
      />

      <v-select
        label="担当医師"
        :items="doctors"
        item-title="docName"
        item-value="docId"
        v-model="frmDoctor"
        class="mt-3"
      />

      <div class="checkbox-area">
        <v-checkbox
          v-for="(item, ix) in yobi"
          :key="ix"
          :label="item"
          :value="ix"
          v-model="frmYobi"
        />
      </div>

      <v-card-actions class="mt-3">
        <v-spacer></v-spacer>
        <v-btn rounded="lg" elevation="2" color="update" @click="addData"
          >更新</v-btn
        >
        <v-btn rounded="lg" elevation="2" @click="transEvent">閉じる</v-btn>
      </v-card-actions>
    </v-card>
  </div>
</template>

<script>
import { firebaseDb } from "@/plugins/firebase";
import { collection, query, where, getDocs, addDoc } from "firebase/firestore";

export default {
  data: () => ({
    frmMedical: "",
    frmDoctor: "",
    frmYobi: [],
    medicals: [
      { id: "med101", name: "消化器内科" },
      { id: "med102", name: "神経内科" },
      { id: "med103", name: "循環器内科" },
      { id: "med201", name: "外科・消化器外科" },
      { id: "med301", name: "皮膚科" },
      { id: "med302", name: "耳鼻咽喉科" },
      { id: "med303", name: "小児科" },
    ],
    yobi: ["月", "火", "水", "木", "金"],
    doctors: [],
  }),
  methods: {
    async getDoctors() {
      this.doctors = [];
      const q = query(
        collection(firebaseDb, "doctors"),
        where("medical", "==", this.frmMedical)
      );
      const querySnapshot = await getDocs(q);
      querySnapshot.forEach((doc) => {
        this.doctors.push({
          docId: doc.id,
          docName: doc.data().name,
        });
      });
    },
    transEvent() {
      this.$emit("dlg-close");
    },
    initData() {
      this.frmMedical = "";
      this.frmDoctor = "";
      this.frmYobi = [];
      this.doctors = [];
    },
    async addData() {
      await addDoc(collection(firebaseDb, "gairai-tanto"), {
        medical: this.frmMedical,
        doctor: this.frmDoctor,
        yobi: this.frmYobi,
      }).then((response) => {
        console.log("RegisterDoctor-addData-response:", response);
        this.initData();
      });
    },
  },
};
</script>

<style scoped>
.checkbox-area {
  display: flex;
  justify-content: fex-start;
}
</style>
