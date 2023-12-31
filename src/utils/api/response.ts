import { type ApiContext } from '@vendor';
import { StatusCodes, ReasonPhrases } from 'http-status-codes';

type _status = {
    status?: number;
    reason?: string;
};
type _responseBody = {
    status: number;
    message?: string;
    data?: any;
    pagination?: Pagination;
};
type Pagination = {
    totalItems: number;
    currentPage: number;
    totalPages: number;
    pageSize: number;
};

class Status {
    // Success
    static Ok: _status = { status: StatusCodes.OK, reason: ReasonPhrases.OK };
    static Created: _status = { status: StatusCodes.CREATED, reason: ReasonPhrases.CREATED };
    static Accepted: _status = {
        status: StatusCodes.ACCEPTED,
        reason: ReasonPhrases.ACCEPTED,
    };

    // Error
    static BadRequest: _status = {
        status: StatusCodes.BAD_REQUEST,
        reason: ReasonPhrases.BAD_REQUEST,
    };

    static Unauthorized: _status = {
        status: StatusCodes.UNAUTHORIZED,
        reason: ReasonPhrases.UNAUTHORIZED,
    };

    static NotFound: _status = {
        status: StatusCodes.NOT_FOUND,
        reason: ReasonPhrases.NOT_FOUND,
    };

    static InternalError: _status = {
        status: StatusCodes.INTERNAL_SERVER_ERROR,
        reason: ReasonPhrases.INTERNAL_SERVER_ERROR,
    };
}

const sendJson = (
    ctx: ApiContext,
    props: {
        status?: _status;
        data?: any;
        message?: string;
        pagination?: Pagination;
        headers?: Record<string, string>;
    } = {}
) => {
    const body: _responseBody = {
        status: props?.status?.status || StatusCodes.OK,
        message: props.message || props?.status?.reason || ReasonPhrases.OK,
        data: props?.data || undefined,
        pagination: props?.pagination || undefined,
    };

    Object.entries(props.headers != null || {}).forEach(([key, value]) => ctx.response.setHeader(key, value));
    Object.entries(body).forEach(([key, value]) => {
        if (typeof value === undefined) Reflect.deleteProperty(body, key);
    });

    ctx.response.status(props?.status?.status || StatusCodes.OK).json(body);
};

const sendString = (ctx: ApiContext, props: { status?: _status; body?: string; headers?: Record<string, string> } = {}) => {
    Object.entries(props.headers != null || {}).forEach(([key, value]) => ctx.response.setHeader(key, value));
    ctx.response.status(props?.status?.status || StatusCodes.OK).send(props.body || '');
};

export { Status, sendJson, sendString, type Pagination };
