<template>
  <div class="admin-post-page">
    <section class="update-form">
      <AdminPostForm :post="loadedPost" @submit="onSubmitted" />
    </section>
  </div>
</template>

<script>

import AdminPostForm from "@/components/Admin/AdminPostForm";

export default {
  layout: "admin",
   middleware: ["check-auth", "auth"],
  components: {
    AdminPostForm,
  },
  async asyncData(context) {
    try {
      const data = await  context.app.$axios.$get(
        `/posts/${context.params.postId}.json`
      );
      return {
        loadedPost: {...data, id: context.params.postId },
      };
    } catch (error) {
      console.log(error);
    }
  },

  methods: {
    onSubmitted(editPost) {
     this.$store.dispatch("editPosts", editPost)
      .then(() => {
        this.$router.push("/admin");
      })
    },
  },
};
</script>

<style scoped>
.update-form {
  width: 90%;
  margin: 20px auto;
}
@media (min-width: 768px) {
  .update-form {
    width: 500px;
  }
}
</style>