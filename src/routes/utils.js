/**
 * Responds to the client with an INTERNAL SERVER ERROR stating that something went wrong when trying to retrieve the
 * requested resource.
 * @param {HttpResponse} res the response being sent back to the client
 */
function respondWithError(res) {
    return res.status(500).json({ message: 'Failed to complete request' });
}

module.exports = {
    respondWithError
}