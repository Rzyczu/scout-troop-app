const loginErrorMessages = {
    missingCredentials: {
        message: 'E-mail and password are required.',
        code: 'LOGIN_MISSING_CREDENTIALS',
    },
    invalidCredentials: {
        message: 'Invalid e-mail or password.',
        code: 'LOGIN_INVALID_CREDENTIALS',
    },
    passwordNotFound: {
        message: 'Password not found.',
        code: 'LOGIN_PASSWORD_NOT_FOUND',
    },
    networkError: {
        message: 'A network error occurred. Please try again later.',
        code: 'LOGIN_NETWORK_ERROR',
    },
    databaseError: {
        message: 'A database error occurred. Please try again later.',
        code: 'LOGIN_DATABASE_ERROR',
    },
    unauthorized: {
        message: 'You are not authorized to perform this action.',
        code: 'LOGIN_UNAUTHORIZED',
    },
};

export default loginErrorMessages;
