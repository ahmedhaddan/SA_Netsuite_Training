/**
 * @NApiVersion 2.x
 * @NScriptType Restlet
 */
define(['N/https', 'N/log'], function (https, log) {

    function doPost(requestBody) {
        try {
            var githubToken = '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';
            var owner = 'ahmedhaddan';
            var repo = 'Netsuite_Training';

            var response = https.post({
                url: 'https://api.github.com/repos/' + owner + '/' + repo + '/dispatches',
                body: JSON.stringify({
                    event_type: 'trigger-hello-world', // This should match your GitHub Actions configuration
                    client_payload: { message: 'Hello World' }
                }),
                headers: {
                    'Authorization': 'token ' + githubToken,
                    'Content-Type': 'application/json',
                    'User-Agent': 'ahmedhaddan' // GitHub API requires a User-Agent header
                }
            });

            return response.body;
        } catch (error) {
            log.error('Error', error);
            return error.toString();
        }
    }

    return {
        post: doPost
    };
});
