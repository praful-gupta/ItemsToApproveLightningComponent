({
    doInit : function(component, event, helper) {
        helper.getApprovalList(component);
        component.set('v.filterSelected', 'All');     
    },
    
    openTabWithSubtab : function(component, event, helper) {
        var paramtskId = event.currentTarget.dataset.param1;
        var paramClintId = event.currentTarget.dataset.param2;
        var parampilicyholderId= event.currentTarget.dataset.param3;
        var paramLAClintId = event.currentTarget.dataset.param4;
        if( paramtskId !== null && paramtskId !== '' && paramtskId !== undefined)
            var urLvalue = '/lightning/r/Case/' + paramtskId+ '/view';   
        if(paramClintId !== null && paramClintId !== '' && paramClintId !== undefined)
            var urLvalue = '/lightning/r/Policy__C/' + paramClintId+ '/view';  
        if(parampilicyholderId !== null && parampilicyholderId !== '' && parampilicyholderId !== undefined)
            var urLvalue = '/lightning/r/Account/' + parampilicyholderId+ '/view';
        if(paramLAClintId !== null && paramLAClintId !== '' && paramLAClintId !== undefined)
            var urLvalue = '/lightning/r/Account/' + paramLAClintId+ '/view';
        var workspaceAPI = component.find("workspace");
        workspaceAPI.openTab({ 
            url: urLvalue,
            focus: true
        })
    },
    
    surrendersList : function(component, event, helper) {
        component.set("v.isSelectAll", false);
        var allApprovalList = component.get("v.allApprovalList");
        var surrenderList = [];
        for(var i=0; i< allApprovalList.length; i++){
            if(allApprovalList[i].type == 'Partial Surrender'|| allApprovalList[i].type =='Total Surrender'){
                console.log('dd');
                surrenderList.push(allApprovalList[i]);
            } 
        }
        component.set('v.finalApprovalList', surrenderList); 
        component.set('v.filterSelected', 'Surrender');  
    },
    
    deathClaimList : function(component, event, helper) {
        component.set("v.isSelectAll", false);
        var allApprovalList = component.get("v.allApprovalList");
        var deathClaimList = [];
        for(var i=0; i< allApprovalList.length; i++){
            if(allApprovalList[i].type == 'Death Claim'){
                deathClaimList.push(allApprovalList[i]);
            } 
        }
        component.set('v.finalApprovalList', deathClaimList);   
        component.set('v.filterSelected', 'deathClaim');
    },
    
    othersList : function(component, event, helper) {
        component.set("v.isSelectAll", false);
        var allApprovalList = component.get("v.allApprovalList");
        var othersList = [];
        for(var i=0; i< allApprovalList.length; i++){
            if(allApprovalList[i].type !== 'Death Claim' && allApprovalList[i].type !== 'Partial Surrender'&& allApprovalList[i].type !== 'Total Surrender'){
                othersList.push(allApprovalList[i]);
            } 
        }
        component.set('v.finalApprovalList', othersList); 
        component.set('v.filterSelected', 'other');
    },
    
    openActionSubtab : function(component, event, helper) {
        var wrkItemId = event.currentTarget.dataset.param3;
        if( wrkItemId !== null && wrkItemId !== '' && wrkItemId !== undefined)
            var urLvalue = '/lightning/r/ProcessInstanceWorkitem/' + wrkItemId + '/view';   
        
        var workspaceAPI = component.find("workspace");
        workspaceAPI.openTab({ 
            url: urLvalue,
            focus: true
        })
    },
    
    handleSelectAll: function(component, event, helper) {
        var checkvalue = component.find("selectAll").get("v.value");        
        var checkContact = component.find("checkContact"); 
        if(checkContact !== undefined)
        {     
            if(checkvalue == true){
                for(var i=0; i<checkContact.length; i++){
                    checkContact[i].set("v.value",true);
                }
            } else{ 
                for(var i=0; i<checkContact.length; i++){
                    checkContact[i].set("v.value",false);
                }
            }
        }    
    }, 
    
    massrecordApprovebuttonClick : function(component, event, helper) {
        var selectedRec = [];
        var checkvalue = component.find("checkContact");
        if(checkvalue !== undefined)
        {    
            if(!Array.isArray(checkvalue)){
                if (checkvalue.get("v.value") == true) {
                    selectedRec.push(checkvalue.get("v.text"));
                }
            }else{
                for (var i = 0; i < checkvalue.length; i++) {
                    if (checkvalue[i].get("v.value") == true) {
                        selectedRec.push(checkvalue[i].get("v.text"));
                    }
                }
            }
            if(selectedRec.length > 0 ) {    
                component.set("v.showPopUp", true);
                component.set("v.isRejection", false);
                component.set("v.isApproved", true);
                component.set("v.selectedRec", selectedRec);
            } else {
                var toastEvent = $A.get("e.force:showToast");
                toastEvent.setParams({
                    title : 'Info Message',
                    message: 'No record Selected',
                    duration:' 5000',
                    key: 'info_alt',
                    type: 'info',
                    mode: 'dismissible'
                });
                toastEvent.fire();            
            }
        }   
    },
    
    
    massrecordRejectedbuttonClick : function(component, event, helper) {
        var selectedRec = [];
        var checkvalue = component.find("checkContact");
        if(checkvalue !== undefined)
        {    
            if(!Array.isArray(checkvalue)){
                if (checkvalue.get("v.value") == true) {
                    selectedRec.push(checkvalue.get("v.text"));
                }
            }else{
                for (var i = 0; i < checkvalue.length; i++) {
                    if (checkvalue[i].get("v.value") == true) {
                        selectedRec.push(checkvalue[i].get("v.text"));
                    }
                }
            }
            
            if(selectedRec.length > 0 ) {    
                component.set("v.showPopUp", true);
                component.set("v.isApproved", false);
                component.set("v.isRejection", true);
                component.set("v.selectedRec", selectedRec);
            } else {
                var toastEvent = $A.get("e.force:showToast");
                toastEvent.setParams({
                    title : 'Info Message',
                    message: 'No record Selected',
                    duration:' 5000',
                    key: 'info_alt',
                    type: 'info',
                    mode: 'dismissible'
                });
                toastEvent.fire();            
            }
        }    
    },
    
    massApprovRecords : function(component, event, helper) {
        var recordsforApproval = component.get("v.selectedRec");  
        console.log('ddd--?'  + recordsforApproval.length);
        var commentAdded = component.get("v.apprvORRejctComment");    
        var action = component.get("c.forApproval");   
        action.setParams({
            "selectedrecs": recordsforApproval,
            "isApproval" : "True",
            "commntadded" : commentAdded
        });
        action.setCallback(this, function(actionResult) {
            var state = actionResult.getState();
            if ( state === "SUCCESS") {
                if (actionResult.getReturnValue() !=  'True')
                {
                    var toastEvent = $A.get("e.force:showToast");
                    toastEvent.setParams({
                        title : 'Error',
                        message: actionResult.getReturnValue(),
                        duration:' 5000',
                        key: 'info_alt',
                        type: 'error',
                        mode: 'dismissible'
                    });
                    toastEvent.fire();
                }    else
                {
                    var toastEvent = $A.get("e.force:showToast");
                    toastEvent.setParams({
                        title : 'success',
                        message: 'Record Successfully Approved',
                        duration:' 5000',
                        key: 'info_alt',
                        type: 'success',
                        mode: 'dismissible'
                    });
                    toastEvent.fire();
                    
                }
                
                component.set("v.showPopUp", false);
                component.set("v.isSelectAll", false);
                component.set("v.apprvORRejctComment", "");  
                helper.getApprovalList(component);
            }            
        });
        $A.enqueueAction(action); 
    } , 
    
    massRejectRecords : function(component, event, helper) {
        var recordsforRejection = component.get("v.selectedRec");  
        var commentProvided = component.get("v.apprvORRejctComment");    
        var action = component.get("c.forRejection");   
        action.setParams({
            "selectedrecs": recordsforRejection,
            "isApproval" : "False",
            "commentadded" : commentProvided
        });
        action.setCallback(this, function(actionResult) {
            var state = actionResult.getState();
            if ( state === "SUCCESS") {
                var toastEvent = $A.get("e.force:showToast");
                toastEvent.setParams({
                    title : 'success',
                    message: 'Record Successfully Rejected',
                    duration:' 5000',
                    key: 'info_alt',
                    type: 'success',
                    mode: 'dismissible'
                });
                toastEvent.fire();
                component.set("v.showPopUp", false);
                component.set("v.isSelectAll", false);
                component.set("v.apprvORRejctComment", "");  
                helper.getApprovalList(component);
            }            
        });
        $A.enqueueAction(action); 
        
    } , 
    
    sortByserialNumbr: function(component, event, helper) {
        helper.sortBy(component, "serialNumber");
    },
    sortByType: function(component, event, helper) {
        helper.sortBy(component, "type");
    },
    sortBycsNumbr: function(component, event, helper) {
        helper.sortBy(component, "caseNumber");
    },
    sortByAmount: function(component, event, helper) {
        helper.sortBy(component, "amount");
    },
    sortByPolicyNum: function(component, event, helper) {
        helper.sortBy(component, "PolicyNumber");
    },
    sortByPolicyholder: function(component, event, helper) {
        helper.sortBy(component, "policyHolderName");
    },
    sortByLAClient: function(component, event, helper) {
        helper.sortBy(component, "LAClientName");
    },
    sortpolicyAmount: function(component, event, helper) {
        helper.sortBy(component, "policyAmount");
    },
    sortByFlagPegno: function(component, event, helper) {
        helper.sortBy(component, "flagPegno");
    },
    sortBysubmittedDate: function(component, event, helper) {
        helper.sortBy(component, "dateSubmit");
    },
    sortBysubmittedby: function(component, event, helper) {
        helper.sortBy(component, "Submitted");
    },
    sortByLowValueApp: function(component, event, helper) {
        helper.sortBy(component, "lowvalueapprover");
    },
    sortByMediumValuApp: function(component, event, helper) {
        helper.sortBy(component, "mediumvalApprover");
    },
    closeModel: function(component, event, helper) {
        component.set("v.showPopUp", false);
        component.set("v.apprvORRejctComment", "");  
    },
    
})