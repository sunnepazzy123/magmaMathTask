

export const getEnvironment = () => {
    const NODE_ENV = process.env.NODE_ENV
    const envPath = NODE_ENV === 'production' ? NODE_ENV : 'development'
    return envPath

}