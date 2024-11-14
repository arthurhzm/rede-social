import { createSlice } from "@reduxjs/toolkit";
import { GridPostProps } from "../../types/types";

interface PostsState {
    posts: GridPostProps[];
}

const initialState: PostsState = {
    posts: []
}

const postsSlice = createSlice({
    name: 'posts',
    initialState,
    reducers: {
        setPosts(state, action) {
            state.posts = action.payload;
        },
        addPost(state, action) {
            state.posts.push(action.payload);
        },
        updatePost(state, action) {
            const { id, content } = action.payload;
            state.posts = state.posts.map(post => post.id === id ? { ...post, content } : post);
        },
        deletePost(state, action) {
            const postId = action.payload;
            state.posts = state.posts.filter(post => post.id !== postId);
        }
    }
});

export const { setPosts, addPost, updatePost, deletePost } = postsSlice.actions;