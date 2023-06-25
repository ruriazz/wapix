import { Handlers } from "./domain/_interface";
import { ApiContext, Manager } from "@vendor";
import { Status, sendJson } from "@src/utils/api/response";
import newAccountDomainUsecase from "./usecases";
import { authenticatedResponse } from "./domain/serializer";

const newAccountHandler = (manager: Manager): Handlers => {
    const usecase = newAccountDomainUsecase(manager);

    return new class implements Handlers {
        async auth(ctx: ApiContext): Promise<void> {
            const authData = await usecase.defaultAuthentication(ctx, { email: ctx.request.body["email"], password: ctx.request.body["password"] });
            if (authData) {
                return sendJson(ctx, { data: authenticatedResponse(authData), status: Status.Accepted });
            }

            return sendJson(ctx, { status: Status.Unauthorized });
        }

        profile(ctx: ApiContext): void {
            return sendJson(ctx);
        }
    };
};

export default newAccountHandler;