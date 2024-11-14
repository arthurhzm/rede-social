import { configureStore } from "@reduxjs/toolkit";
import postsReducer from "./slices/postsSlice";
import authReducer from "./slices/authSlice";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";
import { FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER } from "redux-persist";

const persistConfig = {
    key: "root",
    storage,
};

const persistedAuthReducer = persistReducer(persistConfig, authReducer);
const persistedPostsReducer = persistReducer(persistConfig, postsReducer);

const store = configureStore({
    reducer: {
        posts: persistedPostsReducer,
        auth: persistedAuthReducer,
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: {
                ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
            },
        }),
});

export const persistor = persistStore(store);
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
