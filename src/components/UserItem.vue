<template>
  <div>
    <div class="bg-light rounded d-flex p-3 mb-3">
      <!-- <div class="form-check">
        <input class="form-check-input" type="checkbox" value="" id="check" />
        <label class="form-check-label" for="check"></label>
      </div> -->

      <span class="flex-grow-1 fw-bold"
        >{{ user.username }} ({{ user.age }} years old)</span
      >

      <div>
        <a href="#" class="text-muted me-3" @click="editUser(user.id)"
          ><i class="fas fa-pencil-alt fa-lg"></i
        ></a>
        <a href="#" class="text-muted"
          ><i class="fas fa-trash-alt fa-lg" @click="deleteUser(user.id)"></i
        ></a>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "userItem",
  props: ["user"],
  data() {
    return {};
  },
  methods: {
    editUser(id) {
      // 更新內容時，傳此user Id讓外層了解並觸發更新
      this.$emit("editUser", id);
    },
    deleteUser(id) {
      // 刪除內容時，傳此user Id讓外層了解並觸發刪除
      this.$emit("deleteUser", id);
    },
  },
};
</script>
