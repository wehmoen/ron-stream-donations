export type SocketError = {
    code: number,
    message: string

}
export const ErrorBadPayload: SocketError = {
    code: 1000,
    message: 'Bad payload'
}

export type APIError = {
    code: number,
    message: string,
    details?: any
}

export const ErrorBadSignature: APIError = {
    code: 6000,
    message: 'Bad signature'
}
