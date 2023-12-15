/**
 * @NApiVersion 2.x
 * @NScriptType Restlet
 */
define(['N/log'], function (log) {

    function doPost(requestBody) {
        log.debug('Received POST Request', requestBody);

        // You can process requestBody here as needed

        return {
            status: 'Success',
            message: 'POST request processed successfully',
            receivedData: requestBody
        };
    }

    return {
        post: doPost
    };
});
