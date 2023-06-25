import { AuthenticatedData } from "./_types";

const authenticatedResponse = (data: AuthenticatedData | AuthenticatedData[]): Record<string, any> | Record<string, any>[] => {
    if (Array.isArray(data)) {
        const results: Record<string, any> = [];
        data.forEach(item => {
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
        expiredAt: objectData.expiredAt
    }
}

export { authenticatedResponse };