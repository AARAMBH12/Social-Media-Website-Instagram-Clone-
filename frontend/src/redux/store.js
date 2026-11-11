import { combineReducers, configureStore } from "@reduxjs/toolkit";
import authSlice from "./authSlice.js"
import postSlice from "./postSlice.js"
import socketslice from "./socketSlice.js"
import chatSlice from "./chatSlice.js"
import rtnSlice from "./rtnSlice.js";
import { 
    persistReducer,
    FLUSH,
    REHYDRATE,
    PAUSE,
    PERSIST,
    PURGE,
    REGISTER,
} from 'redux-persist'

const storage = {
    getItem: (key) => Promise.resolve(window.localStorage.getItem(key)),
    setItem: (key, value) => Promise.resolve(window.localStorage.setItem(key, value)),
    removeItem: (key) => Promise.resolve(window.localStorage.removeItem(key)),
};
const persistConfig={
    key:'root',
    version:1,
    storage,
    blacklist:['socketio','realTimeNotification'],
}
const rootReducer = combineReducers({
    auth:authSlice,
    post:postSlice,
    socketio:socketslice,
    chat:chatSlice,
    realTimeNotification:rtnSlice
    
})


const persistedReducer = persistReducer(persistConfig, rootReducer)

const store = configureStore({
    reducer: persistedReducer,
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: {
                ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER, 'socketio/setSocket'],
                ignoredPaths: ['socketio.socket'],
            },
        }),
});
export default store;