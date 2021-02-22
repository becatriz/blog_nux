import Vuex from "vuex";
import Cookie from "js-cookie";

const createStore = () => {
  return new Vuex.Store({
    state: {
      loadedPosts: [],
      token: null
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
      },
      setToken(state, token) {
        state.token = token;
      },
      clearToken(state) {
        state.token = null;
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
            `https://nuxt-blog-34a29-default-rtdb.firebaseio.com/posts.json?auth=${vuexContext.state.token}`,
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
            `https://nuxt-blog-34a29-default-rtdb.firebaseio.com/posts/${editedPost.id}.json?auth=${vuexContext.state.token}`,
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
      },
      authenticateUser(vuexContext, authData) {
        let authUrl = `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${process.env.fbAPIKEY}`;

        if (!authData.isLogin) {
          authUrl = `https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=${process.env.fbAPIKEY}`;
        }
        return this.$axios
          .$post(authUrl, {
            email: authData.email,
            password: authData.password,
            returnSecureToken: true
          })
          .then(result => {
            vuexContext.commit("setToken", result.idToken);
            localStorage.setItem("token", result.idToken);
            localStorage.setItem(
              "tokenExpiration",
              new Date().getTime() + Number.parseInt(result.expiresIn) * 1000
            );
            Cookie.set("jwt", result.idToken);
            Cookie.set(
              "expirationDate",
              new Date().getTime() + Number.parseInt(result.expiresIn) * 1000
            );
          })
          .catch(e => console.log(e));
      },
      setLogoutTimer(vueContext, duration) {
        setTimeout(() => {
          vueContext.commit("clearToken");
        }, duration);
      },
      initAuth(vuexContext, req) {
        let token;
        let expirationDate;
        if (req) {
          if (!req.headers.cookie) {
            return;
          }
          const jwtCookie = req.headers.cookie
            .split(";")
            .find(c => c.trim().startsWith("jwt="));
          if (!jwtCookie) {
            return;
          }
          token = jwtCookie.split("=")[1];
          expirationDate = req.headers.cookie
            .split(";")
            .find(c => c.trim().startsWith("expirationDate="))
            .split("=")[1];
        } else {
          token = localStorage.getItem("token");
          expirationDate = localStorage.getItem("tokenExpiration");
        }
        if (new Date().getTime() > +expirationDate || !token) {
          console.log("No token or invalid token");
          vuexContext.commit("clearToken");
          return;
        }
        vuexContext.commit("setToken", token);
      },

      logout(vuexContext) {
        vuexContext.commit("clearToken");
        Cookie.remove("jwt");
        Cookie.remove("expirationDate");
        if (process.client) {
          localStorage.removeItem("token");
          localStorage.removeItem("tokenExpiration");
        }
      }
    },

    getters: {
      loadedPosts(state) {
        return state.loadedPosts;
      },
      isAuthenticated(state) {
        return state.token != null;
      }
    }
  });
};

export default createStore;
