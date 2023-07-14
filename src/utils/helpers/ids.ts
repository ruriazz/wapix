import { v4 as uuid4 } from 'uuid';

export const getUid = () => uuid4();

export const isUUID = (value: string): boolean => {
    const uuidv4Regex = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    return uuidv4Regex.test(value);
};
