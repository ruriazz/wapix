import { type ApiContext, type Manager } from '@vendor';
import { type _AccountRoleRepository } from './@interface';
import { type AccountRole } from '@src/entities/@typed';
import AccountRoleModel from '@entity/accountRole';

const newAccountRoleRepositoy = (manager: Manager) => {
    return new (class implements _AccountRoleRepository {
        async findOne(filter: Record<string, any>, ctx?: ApiContext): Promise<AccountRole | null> {
            try {
                const result = await AccountRoleModel.findOne(filter).exec();
                return result;
            } catch (err) {
                manager.Log.error({
                    message: 'AccountRoleRepository.findOne Exception',
                    error: err,
                });
                return null;
            }
        }
    })();
};

export default newAccountRoleRepositoy;
