const errorMessages = {
    general: {
        somethingWentWrong: 'An unexpected error occurred.',
    },
    login: {
        missingCredentials: {
            error: 'E-mail and password are required',
            code: 'LOGIN_MISSING_CREDENTIALS',
        },
        invalidCredentials: {
            error: 'Invalid credentials',
            code: 'LOGIN_INVALID_CREDENTIALS',
        },
        passwordNotFound: {
            error: 'Password not found',
            code: 'LOGIN_PASSWORD_NOT_FOUND',
        },
        databaseError: {
            error: 'Database error',
            code: 'LOGIN_DATABASE_ERROR',
        },
    },
    users: {
        fetchAll: {
            error: 'Failed to fetch users.',
            code: 'USER_FETCH_FAILED',
        },
        fetchSingle: {
            default: { error: 'Failed to fetch user.', code: 'USER_FETCH_FAILED' },
            notFound: { error: 'User not found.', code: 'USER_NOT_FOUND' },
        },
        create: {
            default: { error: 'Failed to create user.', code: 'USER_CREATE_FAILED' },
            duplicate: { error: 'User already exists.', code: 'USER_DUPLICATE' },
            validation: { error: 'Invalid input data.', code: 'USER_INVALID_DATA' },
        },
        update: {
            default: { error: 'Failed to update user.', code: 'USER_UPDATE_FAILED' },
        },
        delete: {
            default: { error: 'Failed to delete user.', code: 'USER_DELETE_FAILED' },
            ownAccountDelete: { error: 'You cannot delete your own login.', code: 'USER_DELETE_OWN_ACCOUNT' },
            notFound: { error: 'User not found.', code: 'USER_NOT_FOUND' },
        },
    },
};

module.exports = errorMessages;
