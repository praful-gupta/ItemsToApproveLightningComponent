=public class DSC_pendingapprovals {
    
    @AuraEnabled
    public static List<Result> getPendingApprvl() {
        //ProcessInstance.TargetObject.Name = case number
        //ProcessInstance.TargetObject.Type = object name
        //ProcessInstance.TargetObjectId = record Id
        //ProcessInstance.ProcessDefinition.Name =Approval Name
        
        List<Result> itemToApprovelList = new  List<Result>();
        List<ProcessInstanceWorkItem> processWorkItemList = new List<ProcessInstanceWorkItem>();
        Set<Id> groupIds = new Set<Id>();
        Set<Id> grpWUserRoleId = new Set<Id>();
        Set<Id> createdbyIds = new Set<Id>(); 
        
        for(Group gp1 : [SELECT id, RelatedId from group where RelatedId =: userinfo.getUserRoleId()])  {
            groupIds.add(gp1.id);  
        }
        
        for(GroupMember gp  : [Select groupId from GroupMember where Group.Type = 'Queue' and (UserOrGroupId =: userinfo.getuserid() or UserOrGroupId In : groupIds)]){
            grpWUserRoleId.add(gp.groupId);
        }
        
        grpWUserRoleId.add(userinfo.getUserId());
        
        Map<Id, ProcessInstanceWorkItem> CasIdNPiwi= new Map<Id, ProcessInstanceWorkItem>();
        
        processWorkItemList = [SELECT ProcessInstance.TargetObjectId,  ProcessInstance.TargetObject.Name,  CreatedDate, CreatedById, ActorId, ProcessInstanceId, Id 
                               FROM ProcessInstanceWorkItem 
                               WHERE ProcessInstance.Status = 'Pending' and ProcessInstance.TargetObject.Type = 'Case' and  ActorId In : grpWUserRoleId Order by CreatedDate ASC ];          
        
        for(ProcessInstanceWorkItem pw   : processWorkItemList) {
            CasIdNPiwi.put(pw.ProcessInstance.TargetObjectId, pw);
            createdbyIds.add(pw.CreatedById)  ;
        }
        
        Map<Id, Case> mapCaseDetails = new Map<Id, Case>([SELECT id, Type, Low_Value_Approver__c, Medium_Value_Approver__c, Flag_Pegno_Vincolo__c, Policy_Amount__c, Ammontare__c,
                                                          Policy__c, Policy__r.Name, Client__r.id, Client__r.Name, Policy__r.LA_Client__r.Name, Policy__r.LA_Client__r.Id 
                                                          FROM Case 
                                                          WHERE id In : CasIdNPiwi.keySet() ]);
        
        Map<Id, User> idUserMap = new Map<Id, User>([select id, name from user where id In : createdbyIds]);
        
        for(ProcessInstanceWorkItem pw   : processWorkItemList)  
        {
            result val = new Result(string.valueof(pw.ProcessInstance.TargetObject.Name), pw.ProcessInstance.TargetObjectId, 
                                    mapCaseDetails.get(pw.ProcessInstance.TargetObjectId).Type,   mapCaseDetails.get(pw.ProcessInstance.TargetObjectId).Flag_Pegno_Vincolo__c,
                                    mapCaseDetails.get(pw.ProcessInstance.TargetObjectId).Ammontare__c, mapCaseDetails.get(pw.ProcessInstance.TargetObjectId).Policy_Amount__c,
                                    mapCaseDetails.get(pw.ProcessInstance.TargetObjectId).Low_Value_Approver__c, mapCaseDetails.get(pw.ProcessInstance.TargetObjectId).Medium_Value_Approver__c,
                                    pw.CreatedDate, mapCaseDetails.get(pw.ProcessInstance.TargetObjectId).Policy__r.Name, mapCaseDetails.get(pw.ProcessInstance.TargetObjectId).Policy__c,
                                    idUserMap.get(pw.CreatedById).Name,  pw.Id,mapCaseDetails.get(pw.ProcessInstance.TargetObjectId).Client__r.id,
                                    mapCaseDetails.get(pw.ProcessInstance.TargetObjectId).Client__r.Name, mapCaseDetails.get(pw.ProcessInstance.TargetObjectId).Policy__r.LA_Client__r.Id ,
                                    mapCaseDetails.get(pw.ProcessInstance.TargetObjectId).Policy__r.LA_Client__r.Name );
            itemToApprovelList.add(val);  
        }
        return itemToApprovelList;
    }
    
    
    Public class Result
    {
        @AuraEnabled public String caseNumber;
        @AuraEnabled public Id CaseId;
        @AuraEnabled public String type;
        @AuraEnabled public Decimal amount;
        @AuraEnabled public Decimal policyAmount;
        @AuraEnabled public String flagPegno;
        @AuraEnabled public String lowvalueapprover;
        @AuraEnabled public String mediumvalApprover;
        @AuraEnabled public DateTime dateSubmit;
        @AuraEnabled public String PolicyNumber;
        @AuraEnabled public Id PolicyId;
        @AuraEnabled public String Submitted;
        @AuraEnabled public Id workItmId;
        @AuraEnabled public Id policyHolderID;
        @AuraEnabled public String policyHolderName;
        @AuraEnabled public Id LAClientID;
        @AuraEnabled public String LAClientName;
        
        public Result(String caseNumber , Id CaseId , String type, String flagpegno, Decimal amount, Decimal policyAmount , String lowvalueapprover , String mediumvalApprover,
                      DateTime dateSubmit, String PolicyNumber, Id policyId, string Submitted, Id workItmId, Id policyHolderID, String policyHolderName, Id LAClientID, String LAClientName)
        {
            this.caseNumber = caseNumber;
            this.CaseId = CaseId;
            this.type = type;
            this.amount = amount;
            this.policyAmount = policyAmount;
            this.flagPegno = flagpegno;
            this.lowvalueapprover = lowvalueapprover;
            this.mediumvalApprover = mediumvalApprover;
            this.dateSubmit = dateSubmit;   
            this.PolicyNumber = PolicyNumber;
            this.PolicyId = policyId;
            this.Submitted = Submitted;
            this.workItmId = workItmId;
            this.policyHolderID = policyHolderID;
            this.policyHolderName = policyHolderName;
            this.LAClientID = LAClientID;
            this.LAClientName= LAClientName;
        }
    }
    
    @AuraEnabled
    public static String forApproval(List<ID> selectedrecs, String isApproval, String commntadded) {
        string isSuccess; 
        try{
            for (Id pInstanceWorkitemsId : selectedrecs){
                Approval.ProcessWorkitemRequest req2 = new Approval.ProcessWorkitemRequest();
                req2.setComments(commntadded);
                req2.setAction('Approve'); //to approve use 'Approve'
                req2.setWorkitemId(pInstanceWorkitemsId);
                Approval.ProcessResult result = Approval.process(req2);
                isSuccess = 'True';}
        }catch(exception e){
            isSuccess = e.getMessage();
        }
        return isSuccess;
    }
    
    
    @AuraEnabled
    public static void forRejection(List<ID> selectedrecs, String isApproval, String commentadded) {
        for (Id pInstanceWorkitemsId : selectedrecs){
            Approval.ProcessWorkitemRequest req2 = new Approval.ProcessWorkitemRequest();
            req2.setComments(commentadded);
            req2.setAction('Reject'); //to approve use 'Approve'
            req2.setWorkitemId(pInstanceWorkitemsId);
            Approval.ProcessResult result = Approval.process(req2);
        }  
    }   
}
