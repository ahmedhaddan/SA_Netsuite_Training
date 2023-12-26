/**
 * @NApiVersion 2.x
 * @NScriptType ScheduledScript
 */

/**
 * This module defines functions used in the scheduled script for processing system notes and sending notifications to GitHub.
 *
 * @module N/https
 * @module N/log
 * @module N/search
 * @module N/runtime
 * @module N/record
 * @module N/format
 */

define([
  "N/https",
  "N/log",
  "N/search",
  "N/runtime",
  "N/record",
  "N/format",
], function (https, log, search, runtime, record, format) {

  /**
   * The main entry point for the Scheduled Script execution.
   *
   * @param {Object} context - The context object containing references to the script's runtime settings.
   */

  function execute(context) {
    var messageObject = [];

    var systemNoteConfig_Rec = record.load({
      type: "customrecord_ss_systemnoteconfig",
      id: 1,
      isDynamic: true,
    });

    var lastRunDateISO = systemNoteConfig_Rec.getValue({
      fieldId: "custrecord_ss_last_run_date",
    });
    var userFilterGroup = systemNoteConfig_Rec.getValue({
      fieldId: "custrecord_ss_userfilter",
    });

    var gitHubRepoUrl = systemNoteConfig_Rec.getValue({
        fieldId: "custrecord_ss_sysnoteconf_url",
      });
      
    var githubToken = systemNoteConfig_Rec.getValue({
        fieldId: "custrecord_ss_sysnoteconf_token",
      });

    var githubLabels = systemNoteConfig_Rec.getValue({
        fieldId: "custrecord_ss_sysnoteconf_labels",
      });
      var githubLabelsArry = githubLabels.split(' ')


    var configRecordType = systemNoteConfig_Rec.getValue({
        fieldId: "custrecord_ss_sysnoteconf_rectype",
      });
      
    var configIssueTitle = systemNoteConfig_Rec.getValue({
        fieldId: "custrecord_ss_sysnoteconf_issuetitle",
      });


      
    log.debug("users", userFilterGroup);

    var lastRunDate = convertISODatetoNetSuiteFormat(lastRunDateISO);

    log.debug("Date 2 is", lastRunDate);

    var systemNoteSearch = search.create({
      type: search.Type.SYSTEM_NOTE,
      filters: [
        ["type", "is", "T"],
        "AND",
        ["date", "onorafter", lastRunDate],
        "AND",
        ["name", "anyof", userFilterGroup],
        "AND",
        ["context", "anyof", "UIF"],
        "AND",
        ["recordtype", "anyof", configRecordType],
      ],
      columns: ["record", "type", "field", "name", "recordtype", "newvalue","date"],
    });

    systemNoteSearch.run().each(function (result) {
      var record = result.getValue({ name: "record" });
      var type = result.getValue({ name: "type" });
      var field = result.getText({ name: "field" });
      var name = result.getText({ name: "name" });
      var recordtype = result.getValue({ name: "recordtype" });
      var internalid = result.getValue({ name: "newvalue" });
      var date = result.getValue({ name: "date" });

      var noteDetails = {
        record: record,
        type: type,
        field: field,
        name: name,
        recordtype: recordtype,
        internalid: internalid,
        date: date
      };

      messageObject.push(noteDetails);

      log.debug("System Note Details", noteDetails);
      return true;
    });
    log.debug("message", customMessage);
    log.debug("message", customMessage);



    if (messageObject.length) {
      var customMessage =
        "### Notification of NetSuite Object Creation\n\n" +
        "This issue has been created to track the export process of multiple objects recently created in NetSuite. Below are the details of each object that requires review and export to GitHub.\n\n" +
        "**Action Required**:\n" +
        "1. Review each object in NetSuite.\n" +
        "2. Initiate the export process for each object.\n" +
        "3. Once the export process for all listed objects is complete, update this issue with any relevant comments and close it.\n\n" +
        "**List of Created Objects**:\n\n";

        log.debug("recordtype from object", messageObject.recordtype);



       

    


      customMessage += messageObject
        .map(function (note, index) {
          return (
            "**Object " +
            (index + 1) +
            ":**\n" +
            "- **Type**: " +
            note.recordtype +
            "\n" +
            "- **Name**: " +
            note.record +
            "\n" +
            "- **Internal ID**: " +
            note.internalid +
            "\n" +
            "- **Change Date**: " +
            note.date +
            "\n" +
            "- **Action**: " +
            note.type +
            "\n" +
            "- **Creator's Name**: " +
            note.name +
            "\n"
          );
        })
        .join("\n");

      customMessage +=
        "\n" +
        "\n" +
        "\n" +
        "\n" +
        "**Reminder**: Please adhere to the standard protocols for data handling and privacy during the export process.\n";

      //  var customMessage = messageObject.map(function(note) {
      //      return 'List of Created Objects:' + 'Object:' + note.recordtype + ' ' + 'created named ' + note.record + ' by '  + note.name ;
      //  }).join('\n'); // Join each message with a newline character

      var objectName = messageObject.record;
      var headers = {
        Authorization:
          "Bearer "+githubToken,
        Accept: "application/vnd.github.v3+json",
        "X-GitHub-Api-Version": "2022-11-28",
      };

      var body = JSON.stringify({
        title: configIssueTitle ,
        body: customMessage,
        labels: githubLabelsArry
      });

      var response = https.post({
        url: gitHubRepoUrl,
        body: body,
        headers: headers,
      });

    }
    updateLastRunDate();
  }


   /**
     * Updates the 'last run date' on the custom record 'systemnoteconfig'.
     */

  function updateLastRunDate() {
    //var currentDate = new Date(); // Get current date and time

    var currentDate = new Date();
 //   currentDate.setHours(currentDate.getHours() - 9);

// Adjust currentDate to Pacific Time


    var systemNoteConfigRec = record.load({
      type: "customrecord_ss_systemnoteconfig",
      id: 1,
      isDynamic: true,
    });

    systemNoteConfigRec.setValue({
      fieldId: "custrecord_ss_last_run_date",
      value: currentDate, // Pass the Date object directly
    });

    systemNoteConfigRec.save(); // Save the changes
  }

  function convertISODatetoNetSuiteFormat(isoDate) {
    if (!isoDate) return null;

    // Parse ISO date
    var date = new Date(isoDate);

    // Format the date as M/d/yy h:mm a
    var month = date.getMonth() + 1;
    var day = date.getDate();
    var year = date.getFullYear().toString().substr(-2);
    var hours = date.getHours();
    var minutes = date.getMinutes();
    var ampm = hours >= 12 ? "PM" : "AM";
    hours = hours % 12;
    hours = hours ? hours : 12; // the hour '0' should be '12'
    minutes = minutes < 10 ? "0" + minutes : minutes;

    return (
      month + "/" + day + "/" + year + " " + hours + ":" + minutes + " " + ampm
    );
  }

  return {
    execute: execute,
  };
});


