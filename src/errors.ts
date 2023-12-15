export type SocketError = {
    code: number,
    message: string

}
export const ErrorBadPayload: SocketError = {
    code: 1000,
    message: 'Bad payload'
}
