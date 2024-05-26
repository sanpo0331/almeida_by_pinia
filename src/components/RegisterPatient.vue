<template>
  <div>
    <v-card elevation="5" width="800" class="pa-5 bg-teal-lighten-5">
      <v-toolbar color="transparent" class="mb-4">
        <v-toolbar-title>患者登録</v-toolbar-title>
        <v-spacer />
        <v-icon icon="fa-solid fa-hospital-user" color="primary" size="60" />
      </v-toolbar>
      <v-row>
        <v-col cols="7">
          <v-form ref="frmValid">
            <v-text-field
              label="名前"
              density="compact"
              variant="outlined"
              :rules="[rules.required]"
              v-model="name"
            />

            <v-radio-group v-model="gender" inline>
              <v-radio label="男" value="m"></v-radio>
              <v-radio label="女" value="f"></v-radio>
            </v-radio-group>

            <v-select
              label="診療科"
              :items="medicals"
              item-title="name"
              item-value="id"
              :rules="[rules.required]"
              v-model="medical"
            >
            </v-select>

            <p>生年月日</p>
            <div class="d-flex aign-center mb-3">
              <v-select
                label="年"
                :items="selectBirthY"
                :rules="[rules.required]"
                v-model="birthY"
              />
              <v-select
                label="月"
                :items="selectBirthM"
                :rules="[rules.required]"
                v-model="birthM"
              />
              <v-select
                label="日"
                :items="selectBirthD"
                :rules="[rules.required]"
                v-model="birthD"
              />
            </div>

            <v-radio-group v-model="blood" inline>
              <v-radio label="A" value="A"></v-radio>
              <v-radio label="B" value="B"></v-radio>
              <v-radio label="O" value="O"></v-radio>
              <v-radio label="AB" value="AB"></v-radio>
            </v-radio-group>

            <v-text-field
              label="電話番号"
              density="compact"
              variant="outlined"
              :rules="[rules.required]"
              v-model="tel"
            />

            <p>入院期間</p>
            <div class="d-flex aign-center mb-3">
              <v-text-field
                prepend-inner-icon="fa-regular fa-calendar"
                clearable
                @click:prepend-inner="dlgDateOpen('from')"
                v-model="nyuinFrom"
              />
              &nbsp;～&nbsp;
              <v-text-field
                prepend-inner-icon="fa-regular fa-calendar"
                clearable
                @click:prepend-inner="dlgDateOpen('to')"
                v-model="nyuinTo"
              />
            </div>

            <v-select
              label="病室"
              :items="room"
              clearable
              v-model="roomNo"
              class="mb-3"
            />

            <v-dialog v-model="dateDialog">
              <v-card width="370">
                <v-locale-provider locale="ja">
                  <v-date-picker
                    v-model="selectDate"
                    hide-header
                    @update:model-value="updDate()"
                  ></v-date-picker>
                </v-locale-provider>
                <v-card-actions>
                  <v-spacer />
                  <v-btn elevation="2" @click="dateDialog = false"
                    >閉じる</v-btn
                  >
                </v-card-actions>
              </v-card>
            </v-dialog>

            <v-card-actions>
              <v-spacer />
              <v-btn rounded="lg" elevation="2" color="update" @click="setData"
                >更新</v-btn
              >
              <v-btn rounded="lg" elevation="2" color="back" @click="transEvent"
                >閉じる</v-btn
              >
            </v-card-actions>
          </v-form>
        </v-col>
        <v-col cols="5">
          <v-list
            density="compact"
            lines="two"
            style="max-height: 565px"
            class="overflow-y"
          >
            <v-list-item
              v-for="(item, ix) in list"
              :key="ix"
              :title="item.name"
              :subtitle="item.medical + '(' + item.id + ')'"
            >
              <template v-slot:append>
                <v-btn
                  color="primary"
                  size="small"
                  icon="fa-solid fa-pencil"
                  @click="selPat(ix)"
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
import { collection, query, getDocs, setDoc, doc } from "firebase/firestore";

export default {
  data: () => ({
    id: "",
    name: "",
    gender: "m",
    medical: "",
    birthday: "",
    birthY: "",
    birthM: "",
    birthD: "",
    blood: "A",
    tel: "",
    nyuinFrom: "",
    nyuinTo: "",
    roomNo: "",
    selectType: "",
    selectDate: [],
    list: [],
    edit: false,
    medicals: [
      { id: "med101", name: "消化器内科" },
      { id: "med102", name: "神経内科" },
      { id: "med103", name: "循環器内科" },
      { id: "med201", name: "外科・消化器外科" },
      { id: "med301", name: "皮膚科" },
      { id: "med302", name: "耳鼻咽喉科" },
      { id: "med303", name: "小児科" },
    ],
    room: [
      { title: "301", byoto: "3f" },
      { title: "302", byoto: "3f" },
      { title: "303", byoto: "3f" },
      { title: "501", byoto: "4f" },
      { title: "502", byoto: "4f" },
      { title: "503", byoto: "4f" },
      { title: "510", byoto: "4f" },
    ],
    selectBirthY: [],
    selectBirthM: [],
    selectBirthD: [],
    dateDialog: false,
    rules: {
      required: (value) => !!value || "入力してください",
    },
  }),
  created() {
    this.getPatients();
    for (let ix = 1939; ix < 2015; ix++) {
      this.selectBirthY.push(ix);
    }
    for (let ix = 1; ix < 13; ix++) {
      this.selectBirthM.push(ix);
    }
    for (let ix = 1; ix < 32; ix++) {
      this.selectBirthD.push(ix);
    }
  },
  methods: {
    transEvent() {
      this.$emit("dlg-close");
    },
    async getPatients() {
      this.list = [];
      const q = query(collection(firebaseDb, "patients"));
      const querySnapshot = await getDocs(q);
      querySnapshot.forEach((doc) => {
        this.list.push({
          id: doc.id,
          name: doc.data().name,
          gender: doc.data().gender,
          medical: doc.data().medical,
          blood: doc.data().blood,
          tel: doc.data().tel,
          birthday: doc.data().birthday,
          nyuinFrom: doc.data().nyuinFrom,
          nyuinTo: doc.data().nyuinTo,
          roomNo: doc.data().roomNo,
          byoto: doc.data().byoto,
        });
      });
    },
    // 更新
    async setData() {
      const result = await this.$refs.frmValid.validate();
      if (!result.valid) return;

      const frmtBirthday =
        String(this.birthY) +
        ("00" + this.birthM).slice(-2) +
        ("00" + this.birthD).slice(-2);
      await setDoc(doc(firebaseDb, "patients", this.id), {
        name: this.name,
        gender: this.gender,
        birthday: frmtBirthday,
        medical: this.medical,
        blood: this.blood,
        tel: this.tel,
        nyuinFrom: this.nyuinFrom,
        nyuinTo: this.nyuinTo,
        roomNo: this.roomNo,
      });
      this.initData();
      this.getPatients();
    },
    initData() {
      this.name = "";
      this.gender = "m";
      this.medical = "";
      this.birthday = "";
      this.birthY = "";
      this.birthM = "";
      this.birthD = "";
      this.blood = "A";
      this.tel = "";
      this.nyuinFrom = "";
      this.nyuinTo = "";
      this.roomNo = "";
      this.selectType = "";
      this.selectDate = [];
    },
    // 患者一覧選択時
    selPat(ix) {
      this.id = this.list[ix].id;
      this.name = this.list[ix].name;
      this.gender = this.list[ix].gender;
      this.medical = this.list[ix].medical;
      this.blood = this.list[ix].blood;
      this.tel = this.list[ix].tel;
      const bd = this.list[ix].birthday;
      this.birthY = bd.substring(0, 4);
      this.birthM = bd.substring(4, 6);
      this.birthD = bd.substring(6, 8);
      this.nyuinFrom = this.list[ix].nyuinFrom;
      this.nyuinTo = this.list[ix].nyuinTo;
      this.roomNo = this.list[ix].roomNo;
      this.edit = true;
    },
    // DatePicker Open
    dlgDateOpen(type) {
      this.dateDialog = true;
      this.selectType = type;
    },
    // DatePicker 日付選択時
    updDate() {
      const ymd = this.selectDate.toLocaleString("ja-JP", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
      });
      this.selectType == "from" ? (this.nyuinFrom = ymd) : (this.nyuinTo = ymd);
      this.dateDialog = false;
    },
  },
};
</script>

<style></style>
