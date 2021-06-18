<template>
  <div id="app">
    <div class="container mt-3">
      <div class="position-relative" v-show="!isNew && !currentEditUser.id">
        <i
          class="
            fas
            fa-plus fa-lg
            position-absolute
            top-50
            start-2
            translate-middle
          "
        ></i>
        <input
          type="text"
          class="form-control form-control-lg"
          @click="isNew = true"
        />
      </div>

      <EditUserItem
        :user="currentEditUser"
        @closeEdit="closeEdit"
        @updateUser="getUsers"
        v-if="isNew || currentEditUser.id"
      />
      <div class="d-flex justify-content-end mt-2">
        <button class="btn btn-outline-primary" @click="changeType('age')">
          <span class="mr-1">年齡</span>
          <span v-if="sortType === 'age'">
            <i v-if="!isReverse" class="fas fa-long-arrow-alt-up"></i>
            <i v-else class="fas fa-long-arrow-alt-down"></i>
          </span>
        </button>
        <button
          class="btn btn-outline-primary"
          @click="changeType('updateTime')"
        >
          <span class="mr-1">更新時間</span>
          <span v-if="sortType === 'updateTime'">
            <i v-if="!isReverse" class="fas fa-long-arrow-alt-up"></i>
            <i v-else class="fas fa-long-arrow-alt-down"></i>
          </span>
        </button>
      </div>
      <div class="mt-2">
        <UserItem
          @editUser="editUser"
          @deleteUser="deleteUser"
          v-for="item in sortUsers"
          :key="item.id"
          :user="item"
        />
      </div>
    </div>
  </div>
</template>

<script>
import "@/assets/all.scss";
import EditUserItem from "@/components/EditUserItem";
import UserItem from "@/components/UserItem";
export default {
  name: "App",
  data() {
    return {
      allUsers: [],
      sortType: "updateTime",
      isReverse: false,
      isNew: false,
      currentEditUser: {},
    };
  },
  components: {
    EditUserItem,
    UserItem,
  },
  computed: {
    sortUsers() {
      const vm = this;
      const type = vm.sortType;
      return vm.allUsers.sort((a, b) => {
        switch (type) {
          case "age":
            if (vm.isReverse) {
              return b[type] - a[type];
            } else {
              return a[type] - b[type];
            }
          case "updateTime":
            if (vm.isReverse) {
              return new Date(b[type]) - new Date(a[type]);
            } else {
              return new Date(a[type]) - new Date(b[type]);
            }
          default:
            break;
        }
      });
    },
  },
  methods: {
    getUsers() {
      // 每次新增內容都會取得資料，包含 Todos 及排序
      const vm = this;
      const api = "http://localhost:3000/users";
      vm.$http.get(api).then((response) => {
        vm.allUsers = response.data;
      });
    },
    editUser(id) {
      // 取得相對應之id user傳入editUserItem編輯
      const vm = this;
      vm.isNew = false;
      vm.currentEditUser = vm.allUsers.find((item) => {
        return item.id === id;
      });
    },
    deleteUser(id) {
      // 刪除相對應之id user
      const vm = this;
      const api = `http://localhost:3000/users/${id}`;
      vm.isNew = false;
      vm.$http.delete(api).then(() => {
        vm.getUsers();
      });
    },
    closeEdit() {
      this.isNew = false;
      this.currentEditUser = {};
    },

    changeType(type) {
      const vm = this;
      if (vm.sortType === type) {
        vm.isReverse = !vm.isReverse;
      } else {
        vm.isReverse = false;
      }
      vm.sortType = type;
    },
  },
  created() {
    this.getUsers();
  },
};
</script>
