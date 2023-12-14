/**
 * @NApiVersion 2.x
 * @NScriptType ClientScript
 * 
 */
/////Subscribtion Billing Amount
 define(['N/record','N/currentRecord','N/ui/dialog',['N/format']],

 function(record,currentRecord,dialog,format){
     
    function ItemAddSub(context) {
        var myRecord = context.currentRecord;
        /*VARIABLE *************************************************************/
        ////this one
        var currentdate = new Date();
        const endatefield = new Date();
        

        var amountsub = myRecord.getCurrentSublistValue({
            sublistId: 'item',
            fieldId: 'amount',    
        });
        var termsub = myRecord.getCurrentSublistValue({
            sublistId: 'item',
            fieldId: 'custcol_ns_subterm_fld_line',    
        });
        var uomlist = myRecord.getCurrentSublistText({
            sublistId: 'item',
            fieldId: 'custcol_ns_subtermuom_lst_line',    
        });

        var issubscriber = myRecord.getCurrentSublistValue({
            sublistId: 'item',
            fieldId: 'custcol_ns_issubscrib_fld_line',    
        });

        var billtermlist = myRecord.getCurrentSublistText({
            sublistId: 'item',
            fieldId: 'custcol_ns_billterm_lst_line',    
        });
        
 /*CONDITION FOR MONTHLY BILLING *************************************************************/
        if (issubscriber === true)
        {
        if(uomlist === 'Months' )
        {
            endatefield.setMonth(endatefield.getMonth() + termsub);

            if(billtermlist === 'Yearly'){
                var monthlymount = (amountsub / termsub * 12);
            }
            else {
            var monthlymount = amountsub / termsub ;}
        }
        else
        {
            endatefield.setMonth(endatefield.getMonth() + (termsub*12));
            if(billtermlist === 'Yearly'){

                var monthlymount = amountsub / termsub ;
            }

            else {
                var monthlymount = (amountsub / termsub) / 12 ; }
        }
        
        myRecord.setCurrentSublistValue({
            sublistId: 'item',
            fieldId: 'custcol_ns_monthbill_fld_line',
            value: monthlymount  
        }); 

        myRecord.setCurrentSublistValue({
            sublistId: 'item',
            fieldId: 'custcol_ns_startdate_fld_line',
            value: currentdate  }); 

            myRecord.setCurrentSublistValue({
                sublistId: 'item',
                fieldId: 'custcol_ns_endate_fld_line',
                value: endatefield  }); 
        }
/*CONDITION FOR NON SUB ITEM  SET NULL*************************************************************/
       else { 
        myRecord.setCurrentSublistValue({
            sublistId: 'item',
            fieldId: 'custcol_ns_subterm_fld_line',
            value: ''  });

        myRecord.setCurrentSublistValue({
                sublistId: 'item',
                fieldId: 'custcol_ns_subtermuom_lst_line',
                value: ''  });

              myRecord.setCurrentSublistValue({
                    sublistId: 'item',
                    fieldId: 'custcol_ns_billterm_lst_line',
                    value: ''  });
         
                  
                 
     /*   myRecord.setValue({
            fieldId: 'memo',
            value: 'testddt'
        });*/
     } 

         return true;
         
        }

 return {
    
    validateLine: ItemAddSub,
 };
 });
