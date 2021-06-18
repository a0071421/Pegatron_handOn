<template>
  <form class="border rounded p-3" @submit.prevent="updateUser()">
    <div class="mb-3">
      <label for="username" class="form-label fw-bold">Username</label>
      <input
        type="text"
        class="form-control"
        id="username"
        v-model="username"
        required
        autofocus
      />
      <div v-if="feedback.valid.username" class="valid-feedback d-block">
        {{ feedback.msg.username }}
      </div>
      <div v-else class="invalid-feedback d-block">
        {{ feedback.msg.username }}
      </div>
    </div>
    <div class="mb-3">
      <label for="age" class="form-label fw-bold">Age(Years)</label>
      <input
        type="text"
        class="form-control"
        id="age"
        v-model.number="age"
        required
      />
      <div v-if="feedback.valid.age" class="valid-feedback d-block">
        {{ feedback.msg.age }}
      </div>
      <div v-else class="invalid-feedback d-block">{{ feedback.msg.age }}</div>
    </div>
    <div class="d-flex">
      <button
        v-if="!Object.keys(user).length"
        type="submit"
        class="btn btn-primary me-auto"
        :disabled="!feedback.valid.age || !feedback.valid.username"
      >
        Add User
      </button>
      <button
        v-else
        type="submit"
        class="btn btn-primary me-auto"
        :disabled="!feedback.valid.age || !feedback.valid.username"
      >
        Modify User
      </button>
      <button type="button" class="btn btn-danger" @click="closeEdit">
        Cancel
      </button>
    </div>
  </form>
</template>

<script>
export default {
  name: "editUser",
  props: ["user"],
  data() {
    return {
      username: "",
      age: "",
      feedback: {
        valid: {
          username: false,
          age: false,
        },
        msg: {
          username: "",
          age: "",
        },
      },
    };
  },
  methods: {
    closeEdit() {
      // 關閉編輯視窗
      this.$emit("closeEdit");
    },
    updateUser() {
      // 更新或新增資料
      const vm = this;
      const api = "http://localhost:3000/users";
      // 此為新增一筆新user
      if (!Object.keys(vm.user).length) {
        const user = {
          username: vm.username,
          age: vm.age,
          id: vm.$uuid.v1(),
          updateTime: new Date(),
        };
        vm.$http.post(api, user).then(() => {
          vm.$emit("updateUser");
          vm.age = "";
          vm.username = "";
        });
      } else {
        const api = `http://localhost:3000/users/${vm.user.id}`;
        // 假設是舊的，就推到指定ID修改user資料
        const user = {
          username: vm.username,
          age: vm.age,
          updateTime: new Date(),
        };
        vm.$http.patch(api, { ...user }).then(() => {
          vm.closeEdit();
          vm.$emit("updateUser");
          vm.age = "";
          vm.username = "";
        });
      }
    },
    validateUsername(name) {
      // 驗證username
      const vm = this;
      if (/^$/.test(name)) {
        vm.feedback.valid.username = false;
        vm.feedback.msg["username"] = "名稱不得為空";
      } else if (/^[a-z ,.'-]+$/i.test(name)) {
        vm.feedback.valid.username = true;
        vm.feedback.msg["username"] = "合法的使用者名稱。";
      } else {
        vm.feedback.valid.username = false;
        vm.feedback.msg["username"] = "請勿輸入數字或特殊符號。";
      }
    },
    validateAge(age) {
      // age
      const vm = this;
      if (/^$/.test(age)) {
        vm.feedback.valid.age = false;
        vm.feedback.msg["age"] = "年齡不得為空";
      }
      if (age < 0 || age > 120) {
        vm.feedback.valid.age = false;
        vm.feedback.msg["age"] = "有這種年齡嗎。";
      } else if (/^\d{1,3}$/.test(age)) {
        vm.feedback.valid.age = true;
        vm.feedback.msg["age"] = "合法的年齡。";
      } else {
        vm.feedback.valid.age = false;
        vm.feedback.msg["age"] = "請輸入數字。";
      }
    },
  },
  created() {
    const vm = this;
    const cacheUser = { ...vm.user };
    vm.username = cacheUser.username || "";
    vm.age = cacheUser.age || "";
  },
  watch: {
    user() {
      // 監聽每次按下編輯傳進之user資料
      const vm = this;
      vm.username = vm.user.username;
      vm.age = vm.user.age;
    },
    username(value) {
      // 監聽username change驗證
      const vm = this;
      vm.validateUsername(value);
    },
    age(value) {
      // 監聽age change驗證
      const vm = this;
      vm.validateAge(value);
    },
  },
};
</script>
