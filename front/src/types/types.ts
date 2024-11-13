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