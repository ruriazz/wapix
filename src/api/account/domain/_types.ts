import { Account } from "@src/entities/_types";

export type AuthData = { email: string, password: string }
export type AuthenticatedData = { account: Account, authToken: string, refreshToken: string, expiredAt: Date };