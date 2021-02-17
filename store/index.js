import Vuex from "vuex";

const createStore = () => {
  return new Vuex.Store({
    state: {
      loadedPosts: []
    },
    mutations: {
      setPosts(state, posts) {
        state.loadedPosts = posts;
      },
      addPosts(state, posts) {
        state.loadedPosts.push(posts);
      },
      editPosts(state, editPosts) {
        const postIndex = state.loadedPosts.findIndex(
          post => post.id === editPosts.id
        );
        state.loadedPosts[postIndex] = editPosts;
      }
    },
    actions: {
      nuxtServerInit(vuexContext, context) {
        return context.app.$axios
          .$get("/posts.json")
          .then(data => {
            const postArray = [];
            for (const key in data) {
              postArray.push({ ...data[key], id: key });
            }
            vuexContext.commit("setPosts", postArray);
          })
          .catch(err => context.console.error(err));
      },
      addPosts(vuexContext, posts) {
        const createdPost = { ...posts, updatedDate: new Date() };

        return this.$axios
          .$post(
            "https://nuxt-blog-34a29-default-rtdb.firebaseio.com/posts.json",
            createdPost
          )
          .then(data => {
            vuexContext.commit("addPosts", {
              ...createdPost,
              id: data.name
            });
          })
          .catch(error => console.log(error));
      },
      editPosts(vuexContext, editedPost) {
        return this.$axios
          .$put(
            `https://nuxt-blog-34a29-default-rtdb.firebaseio.com/posts/${editedPost.id}.json`,
            {
              ...editedPost,
              updatedDate: new Date()
            }
          )
          .then(result => {
            vuexContext.commit("editPosts", editedPost);
          })
          .catch(error => console.log(error));
      },
      setPosts(vuexContext, posts) {
        vuexContext.commit("setPosts", posts);
      }
    },
    getters: {
      loadedPosts(state) {
        return state.loadedPosts;
      }
    }
  });
};

export default createStore;
