import { AnyAction, applyMiddleware, createStore, compose } from "@reduxjs/toolkit";
import { stateReducer } from "./stateReducer";
import thunkMiddleware, { ThunkDispatch } from 'redux-thunk'
const composedEnhancer = compose(applyMiddleware<ThunkDispatch<any, undefined, AnyAction>>(thunkMiddleware))




const store = createStore(stateReducer, composedEnhancer);

  export type RootState = ReturnType<typeof store.getState>;
  export type AppDispatch = ThunkDispatch<any, undefined, AnyAction>;



export default store;
