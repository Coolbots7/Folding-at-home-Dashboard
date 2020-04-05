function fah_api(uri) {
    return window.fetch(`/fah/${uri}`);
}

function client(uri, { method, body } = {}) {

    if (!method) {
        method = body ? 'POST' : 'GET';
    }

    var params = {
        method
    }

    if (body) {
        params.body = JSON.stringify(body);
        params.headers = { 'Content-Type': 'application/json' };
    }

    return window.fetch(`/api/${uri}`, params);
}


/// ------ FAH User ------
function getUser(id) {
    return fah_api(`uid/${id}`);
}

function getUserTeams(id) {
    return fah_api(`uid/${id}/teams`)
}


/// ------ FAH Team ------
function getTeam(id) {
    return fah_api(`team/${id}`);
}

function getTeamMembers(id) {
    return fah_api(`/team/${id}/members`);
}

/// ------ FAH Project ------
function getProject(id) {
    return fah_api(`/project/${id}`)
}


/// ------ API Clients ------
function getClients() {
    return client('clients');
}

function pauseAllClients() {
    const body = {
        'status': 'paused'
    };

    return client(`clients/status`, { method: 'PUT', body });
}

function unpauseAllClients() {
    const body = {
        'status': 'unpaused'
    };

    return client(`clients/status`, { method: 'PUT', body });
}

function finishAllClients() {
    const body = {
        'status': 'finish'
    };

    return client(`clients/status`, { method: 'PUT', body });
}

function getClient(id) {
    return client(`clients/${id}`);
}

function getClientSlots(id) {
    return client(`clients/${id}/slots`);
}

function pauseClient(id) {
    const body = {
        'status': 'paused'
    };

    return client(`clients/${id}/status`, { method: 'PUT', body });
}

function unpauseClient(id) {
    const body = {
        'status': 'unpaused'
    };

    return client(`clients/${id}/status`, { method: 'PUT', body });
}

function finishClient(id) {
    const body = {
        'status': 'finish'
    };

    return client(`clients/${id}/status`, { method: 'PUT', body });
}

function pauseClientSlot(id, slot) {
    const body = {
        'status': 'paused'
    };

    return client(`clients/${id}/${slot}/status`, { method: 'PUT', body });
}

function unpauseClientSlot(id, slot) {
    const body = {
        'status': 'unpaused'
    };

    return client(`clients/${id}/${slot}/status`, { method: 'PUT', body });
}

function finishClientSlot(id, slot) {
    const body = {
        'status': 'finish'
    };

    return client(`clients/${id}/${slot}/status`, { method: 'PUT', body });
}

export {
    getUser, getUserTeams,
    getTeam, getTeamMembers,
    getProject,
    getClients, pauseAllClients, unpauseAllClients, finishAllClients, getClient, getClientSlots, pauseClient, unpauseClient, finishClient, pauseClientSlot, unpauseClientSlot, finishClientSlot
};