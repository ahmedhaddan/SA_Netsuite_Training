/**
 * @NApiVersion 2.x
 * @NScriptType Restlet
 */
define(['N/https', 'N/log'], function (https, log) {

    function doPost(requestBody) {
        try {
            var githubToken = '0a6b2cb09ca69e2311c6510685b2e600a086cf2d';
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
                    'User-Agent': 'NetSuite-Restlet' // GitHub API requires a User-Agent header
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
