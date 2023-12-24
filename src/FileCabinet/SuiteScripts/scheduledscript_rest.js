/**
 * @NApiVersion 2.x
 * @NScriptType Suitelet
 */
define(['N/https', 'N/log','N/search', 'N/runtime','N/record','N/ui/serverWidget','N/url','N/redirect'], function(https, log,search,runtime,record,serverWidget,url,redirect) {

    function onRequest(context) {
        if (context.request.method === 'GET') {
            var form = serverWidget.createForm({
                title: 'Submit Data'
            });
            form.addSubmitButton({
                label: 'Submit to GitHub'
            });
            context.response.writePage(form);
        } else { // POST request
            sendToGitHub(context); // your existing logic
        
            redirect.toSuitelet({
                scriptId: 'customscript324',
                deploymentId: 'customdeploy1'
            });
       
        }
    }

    function sendToGitHub(context) {

       // var customMessage = "";
        var messageObject = [];

        var today = new Date();
        var dateString = today.getDate() + '-' + getMonthName(today.getMonth()) + '-' + today.getFullYear().toString().substr(-2);
        function getMonthName(monthIndex) {
            var monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
            return monthNames[monthIndex];
        }

        var systemNoteSearch = search.create({
            type: search.Type.SYSTEM_NOTE,
            filters: [
                ["type","is","T"], 
                "AND", 
                ["date","on","20-Dec-2023 11:59 pm"], 
                "AND", 
                ["name","anyof","53"],
                "AND",
                 ["context","anyof","UIF"]
             ],
            columns: [
                'record',    // Record type
                'type',      // System note type
                'field',   // Field name
                'name',
                'recordtype'
            ]
        });

        systemNoteSearch.run().each(function(result) {
            // Process each result
            var record = result.getValue({name: 'record'});
            var type = result.getValue({name: 'type'});
            var field = result.getText({name: 'field'});
            var name = result.getText({name: 'name'});
            var recordtype = result.getValue({name: 'recordtype'});
            

            // Log or return the object
            var noteDetails = {
                record: record,
                type: type,
                field: field,
                name:name,
                recordtype:recordtype
            };

            messageObject.push(noteDetails)
           
            log.debug('System Note Details', noteDetails);
            return true; // Continue to the next result
        });
        log.debug('message', customMessage);
        log.debug('message', customMessage);
        
        var customMessage = messageObject.map(function(note) {
            return 'new ' + note.recordtype + ' ' + 'created named ' + note.record + ' by '  + note.name ;
        }).join('\n'); // Join each message with a newline character

        var headers = {
            'Authorization': 'Bearer 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',
            'Accept': 'application/vnd.github.v3+json',
            'X-GitHub-Api-Version': '2022-11-28'

        };


        var body = JSON.stringify({
            title: 'UI update',
            body: customMessage,
            labels: ['ui']
        });
        
        var response = https.post({
            url: 'https://api.github.com/repos/ahmedhaddan/SA_Netsuite_Training/issues',
            body: body,
            headers: headers
        });

        log.debug({
            title: 'Response',
            details: response
        });

        

        
    }

    return {
        onRequest:onRequest

    };
});
