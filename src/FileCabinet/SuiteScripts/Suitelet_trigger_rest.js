/**
 * @NApiVersion 2.x
 * @NScriptType Suitelet
 */
define(['N/search', 'N/ui/serverWidget'], function(search, serverWidget) {

    function onRequest(typecontext) {
        if (context.request.method === 'GET') {
            // Create a form
            var form = serverWidget.createForm({
                title: 'System Notes Since Last Launch'
            });

            // Add a list to the form
            var list = form.addSublist({
                id: 'custpage_system_notes_list',
                type: serverWidget.SublistType.LIST,
                label: 'System Notes'
            });

            // Define columns for the sublist
            list.addField({
                id: 'custpage_date',
                type: serverWidget.FieldType.TEXT,
                label: 'Date'
            });
            list.addField({
                id: 'custpage_name',
                type: serverWidget.FieldType.TEXT,
                label: 'Name'
            });
            list.addField({
                id: 'custpage_type',
                type: serverWidget.FieldType.TEXT,
                label: 'Type'
            });
            list.addField({
                id: 'custpage_note',
                type: serverWidget.FieldType.TEXT,
                label: 'Note'
            });

            // Perform the search to get system notes
            var systemNotesSearch = search.create({
                type: search.Type.SYSTEM_NOTE,
                columns: [
                    'date',
                    'name',
                    'context',
                    
                                ],
                filters: [
                    // Add your filters here, for example, to filter by date
                ]
            });

            var searchResult = systemNotesSearch.run().getRange({start: 0, end: 1000});
            for (var i = 0; i < searchResult.length; i++) {
                list.setSublistValue({
                    id: 'custpage_date',
                    line: i,
                    value: searchResult[i].getValue({name: 'date'})
                });
                list.setSublistValue({
                    id: 'custpage_name',
                    line: i,
                    value: searchResult[i].getValue({name: 'name'})
                });
                list.setSublistValue({
                    id: 'custpage_type',
                    line: i,
                    value: searchResult[i].getText({name: 'context'})
                });
                list.setSublistValue({
                    id: 'custpage_note',
                    line: i,
                    value: searchResult[i].getValue({name: 'note'})
                });
            }

            // Display the form
            context.response.writePage(form);
        }
    }

    return {
        onRequest: onRequest
    };
});
