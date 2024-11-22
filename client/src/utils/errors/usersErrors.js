const userErrorMessages = {
    fetchAll: {
        default: {
            message: 'Failed to fetch users.',
            code: 'USERS_FETCH_FAILED'
        },
        network: {
            message: 'Network error while fetching users.',
            code: 'USERS_FETCH_NETWORK_ERROR'
        },
        unauthorized: {
            message: 'You are not authorized to fetch users.',
            code: 'USERS_FETCH_UNAUTHORIZED'
        },
    },
    fetchSingle: {
        default: {
            message: 'Failed to fetch the user.',
            code: 'USER_FETCH_FAILED'
        },
        notFound: {
            message: 'User not found.',
            code: 'USER_NOT_FOUND'
        },
        unauthorized: {
            message: 'You are not authorized to view this user.',
            code: 'USER_FETCH_UNAUTHORIZED'
        },
    },
    create: {
        default: {
            message: 'Failed to create the user.',
            code: 'USER_CREATE_FAILED'
        },
        duplicate: {
            message: 'This user already exists.',
            code: 'USER_DUPLICATE'
        },
        validation: {
            message: 'Provided data is invalid.',
            code: 'USER_CREATE_INVALID_DATA'
        },
    },
    update: {
        default: {
            message: 'Failed to update the user.',
            code: 'USER_UPDATE_FAILED'
        },
        notFound: {
            message: 'User not found for update.',
            code: 'USER_UPDATE_NOT_FOUND'
        },
        unauthorized: {
            message: 'You are not authorized to update this user.',
            code: 'USER_UPDATE_UNAUTHORIZED'
        },
    },
    delete: {
        default: {
            message: 'Failed to delete the user.',
            code: 'USER_DELETE_FAILED'
        },
        ownAccountDelete: {
            message: 'You cannot delete your own account.',
            code: 'USER_DELETE_OWN_ACCOUNT'
        },
        notFound: {
            message: 'User login not found.',
            code: 'USER_DELETE_NOT_FOUND'
        },
    },
};

export default userErrorMessages;
