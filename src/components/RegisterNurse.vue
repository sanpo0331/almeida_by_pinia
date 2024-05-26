<template>
  <div>
    <v-card elevation="5" width="700" class="pa-5 bg-teal-lighten-5">
      <v-toolbar color="transparent" class="mb-4">
        <v-toolbar-title>看護師登録</v-toolbar-title>
        <v-spacer />
        <v-icon icon="fa-solid fa-user-nurse" color="primary" size="60" />
      </v-toolbar>
      <v-row>
        <v-col cols="6">
          <v-form ref="frmValid">
            <v-text-field
              label="名前"
              density="compact"
              variant="outlined"
              :rules="[rules.required]"
              class="mt-5"
              v-model="name"
            ></v-text-field>
            <v-radio-group v-model="tanto" inline hide-details class="mt-5">
              <v-radio label="病棟看護" value="byoto"></v-radio>
              <v-radio label="外来看護" value="gairai"></v-radio>
            </v-radio-group>
            <v-select
              v-show="tanto == 'gairai'"
              :items="medicals"
              density="compact"
              item-title="name"
              item-value="id"
              hide-details
              single-line
              class="mt-5"
              v-model="medical"
            >
            </v-select>
            <v-radio-group
              v-show="tanto == 'byoto'"
              v-model="byoto"
              inline
              hide-details
              class="mt-5"
            >
              <v-radio label="３階" value="3f"></v-radio>
              <v-radio label="４階" value="4f"></v-radio>
            </v-radio-group>
            <v-text-field
              label="LoginID"
              density="compact"
              variant="outlined"
              :rules="[rules.required]"
              class="mt-5"
              v-model="loginid"
            ></v-text-field>
            <v-card-actions class="mt-3">
              <v-spacer></v-spacer>
              <v-btn rounded="lg" elevation="2" color="update" @click="setData"
                >更新</v-btn
              >
              <v-btn
                v-if="this.edit"
                rounded="lg"
                elevation="2"
                color="error"
                @click="deleteData"
                >削除</v-btn
              >
              <v-btn rounded="lg" elevation="2" @click="clear">クリア</v-btn>
              <v-btn rounded="lg" elevation="2" @click="transEvent"
                >閉じる</v-btn
              >
            </v-card-actions>
          </v-form>
        </v-col>
        <v-col cols="6">
          <v-list
            density="compact"
            lines="two"
            style="max-height: 340px"
            class="overflow-y"
          >
            <v-list-item
              v-for="(item, ix) in list"
              :key="ix"
              :title="getTitle(item.name, item.tanto)"
              :subtitle="
                getSubTitle(item.tanto, item.medical, item.byoto) +
                '(' +
                item.id +
                ')'
              "
            >
              <template v-slot:append>
                <v-btn
                  color="primary"
                  size="small"
                  icon="fa-solid fa-pencil"
                  @click="selNurse(ix)"
                >
                </v-btn>
              </template>
              <v-divider></v-divider>
            </v-list-item>
          </v-list>
        </v-col>
      </v-row>
    </v-card>
  </div>
</template>

<script>
import { firebaseDb } from "@/plugins/firebase";
import {
  collection,
  query,
  orderBy,
  getDocs,
  setDoc,
  deleteDoc,
  doc,
} from "firebase/firestore";

export default {
  data: () => ({
    name: "",
    tanto: "byoto",
    medical: "",
    byoto: "3f",
    loginid: "",
    edit: false,
    list: [],
    // 診療科目
    medicals: [
      { id: "med101", name: "消化器内科" },
      { id: "med102", name: "神経内科" },
      { id: "med103", name: "循環器内科" },
      { id: "med201", name: "外科・消化器外科" },
      { id: "med301", name: "皮膚科" },
      { id: "med302", name: "耳鼻咽喉科" },
      { id: "med303", name: "小児科" },
    ],
    rules: {
      required: (value) => !!value || "入力してください",
    },
  }),
  created() {
    this.getNurses();
  },
  methods: {
    transEvent: function () {
      this.$emit("dlg-close");
    },
    initData() {
      this.name = "";
      this.tanto = "byoto";
      this.medical = "";
      this.byoto = "";
      this.loginid = "";
      this.edit = false;
      this.getNurses();
    },
    async getNurses() {
      this.list = [];
      const q = query(collection(firebaseDb, "nurses"), orderBy("medical"));
      const querySnapshot = await getDocs(q);
      querySnapshot.forEach((doc) => {
        this.list.push({
          id: doc.id,
          name: doc.data().name,
          tanto: doc.data().tanto,
          medical: doc.data().medical,
          byoto: doc.data().byoto,
        });
      });
    },
    // 更新
    async setData() {
      const result = await this.$refs.frmValid.validate();
      if (!result.valid) return;

      await setDoc(doc(firebaseDb, "nurses", this.loginid), {
        name: this.name,
        tanto: this.tanto,
        medical: this.tanto === "gairai" ? this.medical : "",
        byoto: this.tanto === "byoto" ? this.byoto : "",
      });
      this.initData();
    },
    // 削除
    async deleteData() {
      await deleteDoc(doc(firebaseDb, "nurses", this.loginid));
      this.initData();
    },
    // 診療科目名取得
    getMedicalName(getId) {
      const result = this.medicals.find(({ id }) => id === getId);
      return result.name;
    },
    getTitle(name, tanto) {
      // 名前（担当）
      const wTanto = tanto === "byoto" ? "（病棟看護）" : "（外来看護）";
      return name + wTanto;
    },
    getSubTitle(tanto, medical, byoto) {
      // 診療科 or 担当病棟
      if (tanto === "byoto") {
        return byoto === "3f" ? "３階" : "４階";
      } else {
        return this.getMedicalName(medical);
      }
    },
    // 看護師選択時
    selNurse(ix) {
      this.name = this.list[ix].name;
      this.medical = this.list[ix].medical;
      this.tanto = this.list[ix].tanto;
      this.byoto = this.list[ix].byoto;
      this.loginid = this.list[ix].id;
      this.edit = true;
    },
    clear() {
      this.name = "";
      this.medical = "";
      this.tanto = "byoto";
      this.byoto = "";
      this.loginid = "";
      this.edit = false;
    },
  },
};
</script>

<style></style>
