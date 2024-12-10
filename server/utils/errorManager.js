export const errorMessages = {
    general: {
        somethingWentWrong: 'An unexpected error occurred.',
        databaseError: {
            error: 'Database error',
            code: 'LOGIN_DATABASE_ERROR',
        },
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
            cannotChangeScoutFunction: { error: 'Cannot change scout function because the member is currently a troop leader.', code: "UPDATE_MEMBER_IS_TROOP_LEADER" },

        },
        delete: {
            default: { error: 'Failed to delete user.', code: 'USER_DELETE_FAILED' },
            ownAccountDelete: { error: 'You cannot delete your own login.', code: 'USER_DELETE_OWN_ACCOUNT' },
            cannotDeleteScoutLeader: { error: 'Cannot delete member because  they are currently a troop leader.', code: "DELETE_MEMBER_IS_TROOP_LEADER" },
        },
    },

    troops: {
        fetchAll: {
            default: { error: 'Failed to fetch troops.', code: 'TROOP_FETCH_FAILED' },
        },
        fetchSingle: {
            default: { error: 'Failed to fetch troop.', code: 'TROOP_FETCH_FAILED' },
            notFound: { error: 'Troop not found.', code: 'TROOP_NOT_FOUND' },
        },
        create: {
            default: { error: 'Failed to create troop.', code: 'TROOP_CREATE_FAILED' },
            validation: { error: 'Invalid input data.', code: 'TROOP_INVALID_DATA' },
            leaderAlreadyAssigned: { error: 'Selected leader is already a leader of another troop.', code: 'LEADER_ALREADY_ASSIGNED' },
            leaderIsTeamLeader: { error: 'Selected leader is a team leader and cannot be assigned to a troop.', code: 'LEADER_IS_TEAM_LEADER' },
        },
        update: {
            default: { error: 'Failed to update troop.', code: 'TROOP_UPDATE_FAILED' },
        },
        delete: {
            default: { error: 'Failed to delete troop.', code: 'TROOP_DELETE_FAILED' },
            notFound: { error: 'Troop not found.', code: 'TROOP_NOT_FOUND' },
        },
    },

    troop: {
        fetchSingle: {
            default: { error: 'Failed to fetch troop details.', code: 'TROOP_FETCH_DETAILS_FAILED' },
            notFound: { error: 'Troop not found.', code: 'TROOP_NOT_FOUND' },
        },
        users: {
            fetchAll: { error: 'Failed to fetch troop users.', code: 'TROOP_USERS_FETCH_FAILED' },
            add: {
                default: { error: 'Failed to add user to troop.', code: 'TROOP_ADD_USER_FAILED' },
                validation: { error: 'Invalid user data for troop addition.', code: 'TROOP_ADD_USER_INVALID' },
            },
            remove: {
                default: { error: 'Failed to remove user from troop.', code: 'TROOP_REMOVE_USER_FAILED' },
                notFound: { error: 'User not found in troop.', code: 'TROOP_USER_NOT_FOUND' },
            },
        },
        update: {
            default: { error: 'Failed to update troop details.', code: 'TROOP_UPDATE_FAILED' },
        },
    },

};

export const sendError = (res, errorObj, statusCode = 400) => {
    res.status(statusCode).json({ success: false, ...errorObj });
};

export const throwError = (error) => {
    throw {
        message: error.error, // Komunikat błędu
        code: error.code,     // Kod błędu
    };
};

