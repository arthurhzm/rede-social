export type CreateUserProps = {
    username: string;
    email: string;
    password: string;
}

export type UserLoginProps = {
    username: string;
    password: string;
}

export type CreatePostProps = {
    content: string;
}

export type GridPostProps = {
    id: number;
    content: string;
    userId: number;
    user: {
        username: string;
    };
    likes: [
        {
            userId: number;
        }
    ],
    comments: PostCommentProps[],
    createdAt: string;
    updatedAt: string;
}

export type UpdatePostProps = {
    id: number;
    content: string;
}

export type ProfilePostsProps = {
    id: number
    followers: number;
    username: string;
    posts: GridPostProps[]
}

export type CreateCommentProps = {
    id: number;
    content: string;
}

export type PostCommentProps = {
    id: number;
    content: string;
    userId: number;
    user: {
        username: string;
    }
}