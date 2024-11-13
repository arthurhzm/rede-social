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
    }
    createdAt: string;
    updatedAt: string;
}