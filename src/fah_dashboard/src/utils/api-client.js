function client(uri) {
    return window.fetch(`/api/${uri}`);
}

export default client;