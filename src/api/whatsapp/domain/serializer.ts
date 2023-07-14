import { WhatsappClient } from '@src/entities/@typed';

export const getClientCollectionResponse = (clients: WhatsappClient[]): Record<string, any>[] => {
    const result = [] as Record<string, any>[];

    clients.forEach((client: WhatsappClient) => {
        result.push({
            uid: client.uid,
            name: client.name,
            number: client.number,
            status: client.status,
            createdAt: client.createdAt,
            updatedAt: client.updatedAt,
            authenticatedAt: client.authenticatedAt,
        });
    });

    return result;
};

export const getClientDetailResponse = (client: WhatsappClient): Record<string, any> => {
    return {
        uid: client.uid,
        name: client.name,
        number: client.number,
        status: client.status,
        createdAt: client.createdAt,
        updatedAt: client.updatedAt,
        authenticatedAt: client.authenticatedAt,
    };
};
