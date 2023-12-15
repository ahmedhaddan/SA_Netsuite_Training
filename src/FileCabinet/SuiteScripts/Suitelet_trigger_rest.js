/**
 * @NApiVersion 2.x
 * @NScriptType Suitelet
 */
define(['N/https', 'N/log'], function (https, log) {

    function onRequest(context) {
        if (context.request.method === 'GET') {
            // Display a simple form for the user to trigger the POST request
            context.response.write('<html><body>');
            context.response.write('<form method="post">');
            context.response.write('<input type="submit" value="Send POST Request to RESTlet"/>');
            context.response.write('</form>');
            context.response.write('</body></html>');
        } else {
            // Handle the POST request
            try {
                var restletUrl = 'https://tstdrv2690016.restlets.api.netsuite.com/app/site/hosting/restlet.nl?script=312&deploy=1'; // Replace with your RESTlet URL

                // Example: Sending a POST request to the RESTlet
                var response = https.post({
                    url: restletUrl,
                    body: JSON.stringify({ message: 'Hello from Suitelet!' }),
                    headers: {
                        'Content-Type': 'application/json'
                    }
                });

                // Handling the response
                context.response.write({
                    output: 'Response from RESTlet: ' + response.body
                });
            } catch (e) {
                log.error({ title: 'Error', details: e });
                context.response.write({
                    output: 'Error: ' + e.toString()
                });
            }
        }
    }

    return {
        onRequest: onRequest
    };
});
