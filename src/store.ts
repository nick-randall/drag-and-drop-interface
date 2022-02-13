import { createStore } from "@reduxjs/toolkit";
import { stateReducer } from "./stateReducer";



const store = createStore(stateReducer);

  // // Infer the `RootState` and `AppDispatch` types from the store itself
  export type RootState = ReturnType<typeof store.getState>;
  // // Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}

  // TodoList.js



export default store;
