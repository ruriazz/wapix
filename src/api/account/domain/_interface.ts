import { ApiContext } from "@vendor";
import { AuthData, AuthenticatedData } from "./_types";

export interface Handlers {
    auth: (ctx: ApiContext) => Promise<void>;
    profile: (ctx: ApiContext) => void;
}

export interface Usecases {
    defaultAuthentication: (ctx: ApiContext, data: AuthData) => Promise<AuthenticatedData | undefined>;
}
