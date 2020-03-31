import client from './api-client';

function getUser(id) {
    return client(`uid/${id}`);
}

export { getUser };