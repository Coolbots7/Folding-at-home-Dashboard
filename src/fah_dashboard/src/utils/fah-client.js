function fah_api(uri) {
    return window.fetch(`/fah/${uri}`);
}

function client(uri) {
    return window.fetch(`/api/${uri}`);
}


/// ------ FAH User ------
function getUser(id) {
    return fah_api(`uid/${id}`);
}


/// ------ FAH Project ------
function getProject(id) {
    return fah_api(`/project/${id}`)
}


/// ------ API Clients ------
function getClients() {
    return client('clients');
}

function getClient(id) {
    return client(`clients/${id}`);
}

function getClientSlots(id) {
    return client(`clients/${id}/slots`);
}

export {
    getUser,
    getProject,
    getClients, getClient, getClientSlots
};