<template>
  <v-card title="入院患者状況更新" max-width="700">
    <v-container>
      <v-table>
        <tr>
          <th>ID</th>
          <td>{{ patient.id }}</td>
          <th>名前</th>
          <td>{{ patient.name }}</td>
          <th>年齢</th>
          <td>{{ patient.age }}</td>
        </tr>
      </v-table>
    </v-container>
    <v-divider />
    <v-container>
      <v-row>
        <v-col cols="2">
          <v-card-text>体温</v-card-text>
        </v-col>
        <v-col cols="2">
          <v-text-field
            label="朝"
            variant="outlined"
            density="compact"
            hide-details
            v-model="tempMo"
          />
        </v-col>
        <v-col cols="2">
          <v-text-field
            label="夕"
            variant="outlined"
            density="compact"
            hide-details
            v-model="tempEv"
          />
        </v-col>
      </v-row>

      <v-row>
        <v-col cols="2">
          <v-card-text>血圧</v-card-text>
        </v-col>
        <v-col cols="4">
          <div class="d-flex align-center">
            <v-text-field
              label="朝(上)"
              variant="outlined"
              density="compact"
              hide-details
              v-model="bloodPresureMoH"
            />～
            <v-text-field
              label="朝(下)"
              variant="outlined"
              density="compact"
              hide-details
              v-model="bloodPresureMoL"
            />
          </div>
        </v-col>
        <v-col cols="4">
          <div class="d-flex align-center">
            <v-text-field
              label="夕(上)"
              variant="outlined"
              density="compact"
              hide-details
              v-model="bloodPresureEvH"
            />～
            <v-text-field
              label="夕(下)"
              variant="outlined"
              density="compact"
              hide-details
              v-model="bloodPresureEvL"
            />
          </div>
        </v-col>
      </v-row>

      <v-row>
        <v-col cols="2">
          <v-card-text>脈拍</v-card-text>
        </v-col>
        <v-col cols="2">
          <v-text-field
            label="朝"
            variant="outlined"
            density="compact"
            hide-details
            v-model="pulseRateMo"
          />
        </v-col>
        <v-col cols="2">
          <v-text-field
            label="夕"
            variant="outlined"
            density="compact"
            hide-details
            v-model="pulseRateEv"
          />
        </v-col>
      </v-row>

      <v-row>
        <v-col cols="2">
          <v-card-text>酸素濃度</v-card-text>
        </v-col>
        <v-col cols="2">
          <v-text-field
            label="朝"
            variant="outlined"
            density="compact"
            hide-details
            v-model="oxygenMo"
          />
        </v-col>
        <v-col cols="2">
          <v-text-field
            label="夕"
            variant="outlined"
            density="compact"
            hide-details
            v-model="oxygenEv"
          />
        </v-col>
      </v-row>

      <v-row>
        <v-col cols="2">
          <v-card-text>食事</v-card-text>
        </v-col>
        <v-col cols="3">
          <v-select
            label="朝"
            :items="mealStatus"
            density="compact"
            variant="outlined"
            v-model="mealMo"
          />
        </v-col>
        <v-col cols="3">
          <v-select
            label="昼"
            :items="mealStatus"
            density="compact"
            variant="outlined"
            v-model="mealAf"
          />
        </v-col>
        <v-col cols="3">
          <v-select
            label="夕"
            :items="mealStatus"
            density="compact"
            variant="outlined"
            v-model="mealEv"
          />
        </v-col>
      </v-row>
      <v-row>
        <v-col cols="2">
          <v-card-text>伝達事項</v-card-text>
        </v-col>
        <v-col cols="9">
          <v-textarea v-model="transmission" variant="outlined"></v-textarea>
        </v-col>
      </v-row>
    </v-container>
    <v-card-actions>
      <v-spacer></v-spacer>
      <v-btn rounded="lg" elevation="2" color="update" @click="setData"
        >更新</v-btn
      >
      <v-btn rounded="lg" elevation="2" @click="transEvent">閉じる</v-btn>
    </v-card-actions>
  </v-card>
</template>

<script>
import { firebaseDb } from "@/plugins/firebase";
import { setDoc, doc } from "firebase/firestore";

export default {
  props: {
    patient: {
      type: Object,
    },
  },
  data: () => ({
    mealStatus: [
      { title: "全て", status: "0" },
      { title: "残あり", status: "1" },
      { title: "全て残", status: "2" },
    ],
    tempMo: "",
    tempEv: "",
    bloodPresureMoH: "",
    bloodPresureMoL: "",
    bloodPresureEvH: "",
    bloodPresureEvL: "",
    pulseRateMo: "",
    pulseRateEv: "",
    oxygenMo: "",
    oxygenEv: "",
    mealMo: "",
    mealAf: "",
    mealEv: "",
    transmission: "",
  }),
  created: function () {
    this.tempMo = this.patient.tempMo;
    this.tempEv = this.patient.tempEv;
    this.bloodPresureMoH = this.patient.bloodPresureMoH;
    this.bloodPresureMoL = this.patient.bloodPresureMoL;
    this.bloodPresureEvH = this.patient.bloodPresureEvH;
    this.bloodPresureEvL = this.patient.bloodPresureEvL;
    this.pulseRateMo = this.patient.pulseRateMo;
    this.pulseRateEv = this.patient.pulseRateEv;
    this.oxygenMo = this.patient.oxygenMo;
    this.oxygenEv = this.patient.oxygenEv;
    this.mealMo = this.patient.mealMo;
    this.mealAf = this.patient.mealAf;
    this.mealEv = this.patient.mealEv;
  },
  methods: {
    transEvent: function () {
      this.$emit("dlg-close");
    },
    // 更新
    async setData() {
      const today = new Date().toLocaleString("ja-JP", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
      });
      const key =
        this.patient.id +
        today.substring(0, 4) +
        today.substring(5, 7) +
        today.substring(8);
      await setDoc(doc(firebaseDb, "inpatientStatus", key), {
        id: this.patient.id,
        date: today,
        tempMo: this.tempMo,
        tempEv: this.tempEv,
        bloodPresureMoH: this.bloodPresureMoH,
        bloodPresureMoL: this.bloodPresureMoL,
        bloodPresureEvH: this.bloodPresureEvH,
        bloodPresureEvL: this.bloodPresureEvL,
        pulseRateMo: this.pulseRateMo,
        pulseRateEv: this.pulseRateEv,
        oxygenMo: this.oxygenMo,
        oxygenEv: this.oxygenEv,
        mealMo: this.mealMo,
        mealAf: this.mealAf,
        mealEv: this.mealEv,
        transmission: this.transmission,
      });
      this.$emit("dlg-close");
    },
  },
};
</script>

<style scoped>
th {
  background-color: #004d40;
  color: #ffffff;
}
</style>
