import { type Account } from '@src/entities/@typed';
import { type AuthenticatedData } from './@interface';

const authenticatedResponse = (data: AuthenticatedData | AuthenticatedData[]): Record<string, any> | Array<Record<string, any>> => {
    if (Array.isArray(data)) {
        const results: Record<string, any> = [];
        data.forEach((item) => {
            results.push(authenticatedResponse(item));
        });

        return results;
    }

    const objectData = data as Record<string, any>;

    return {
        account: {
            uid: objectData.account.uid,
            name: objectData.account.name,
            email: objectData.account.email,
            role: {
                uid: objectData.account.role.uid,
                slug: objectData.account.role.slug,
                name: objectData.account.role.name,
                level: objectData.account.role.level,
            },
            enable: objectData.account.enable,
            createdAt: objectData.account.createdAt,
            updatedAt: objectData.account.updatedAt,
            verifiedAt: objectData.account.verifiedAt,
        },
        authToken: objectData.authToken,
        refreshToken: objectData.refreshToken,
    };
};

const profileResponse = (data: Account): Record<string, any> => {
    return {
        uid: data.uid,
        name: data.name,
        email: data.email,
        role: {
            uid: data.role?.uid,
            slug: data.role?.slug,
            name: data.role?.name,
            level: data.role?.level,
        },
        enable: data.enable,
        createdAt: data.createdAt,
        updatedAt: data.updatedAt,
        verifiedAt: data.verifiedAt,
    };
};

const updateInfoResponse = (data: Account): Record<string, any> => profileResponse(data);

export { authenticatedResponse, profileResponse, updateInfoResponse };
