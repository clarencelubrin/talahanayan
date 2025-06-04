export type UserWithoutPassword = {
    username: string
    email: string
    first_name: string
    last_name: string
    disabled: boolean
}

export type UserUnsafe = UserWithoutPassword & {
    password: string
}