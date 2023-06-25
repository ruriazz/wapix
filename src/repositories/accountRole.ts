import { ApiContext, Manager } from "@vendor";
import { _AccountRoleRepository } from "./_interface"
import { AccountRole } from "@src/entities/_types";
import AccountRoleModel from "@src/entities/accountRole";


const newAccountRoleRepositoy = (manager: Manager) => {
    return new class implements _AccountRoleRepository {
        async findOne(filter: Record<string, any>, ctx?: ApiContext): Promise<AccountRole | null | undefined> {
            const result = await AccountRoleModel.findOne(filter).exec();
            return result;
        }
    }
}

export default newAccountRoleRepositoy;