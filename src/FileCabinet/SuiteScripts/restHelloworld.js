/**
 * @NApiVersion 2.x
 * @NScriptType Restlet
 */
define([], function () {

    function doGet() {
        return 'Hello World from GET';
    }

    function doPost() {
        var githubToken = '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';
        var owner = 'ahmedhaddan';
        var repo = 'Netsuite_Training';
        var workflowFileName = 'hello-world.yml';

        try {
            var response = https.post({
                url: 'https://api.github.com/repos/' + owner + '/' + repo + '/actions/workflows/' + workflowFileName + '/dispatches',
                headers: {
                    'Authorization':  githubToken,
                    'Content-Type': 'application/json',
                    'User-Agent': 'NetSuite-RESTlet'
                },
                body: JSON.stringify({
                    ref: 'dev', // Replace with the branch name you want to trigger the workflow on
                    // Add any other necessary payload data here
                })
            });

            return response.body;
        } catch (error) {
            log.error({ title: 'Error', details: error });
            return 'Error triggering GitHub Workflow: ' + error.toString();
        }

    }

    return {
        get: doGet,
        post: doPost
    };
});
