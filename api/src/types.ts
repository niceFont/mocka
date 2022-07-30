export interface Headers {
    [key: string]: string
}

export interface RequestLog {
    method: string
    status: number
    date: string
    device: string
    matching: boolean
}

export interface EmitOptions extends Omit<RequestLog, 'date'> {
    roomId: string,
    device: string
}
