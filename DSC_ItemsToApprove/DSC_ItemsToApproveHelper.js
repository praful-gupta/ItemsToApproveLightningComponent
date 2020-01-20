({
  getApprovalList: function(component) {
    var action = component.get("c.getPendingApprvl");
    action.setCallback(this, function(actionResult) {
      var state = actionResult.getState();
      if (state === "SUCCESS") {
        component.set("v.allApprovalList", actionResult.getReturnValue());
        component.set("v.finalApprovalList", actionResult.getReturnValue());
        component.set("v.sortAsc", true);
        component.set("v.sortField", "dateSubmit");
        this.sortBy(component, "dateSubmit");
      }
    });
    $A.enqueueAction(action);
  },

  sortBy: function(component, field) {
    var sortAsc = component.get("v.sortAsc"),
      sortField = component.get("v.sortField"),
      records = component.get("v.finalApprovalList"),
      fieldPath = field.split(/\./),
      fieldValue = this.fieldValue;

    sortAsc = sortField != field || !sortAsc;

    records.sort(function(a, b) {
      var aValue = fieldValue(a, fieldPath),
        bValue = fieldValue(b, fieldPath),
        t1 = aValue == bValue,
        t2 = (!aValue && bValue) || aValue < bValue;
      return t1 ? 0 : (sortAsc ? -1 : 1) * (t2 ? 1 : -1);
    });

    component.set("v.sortAsc", sortAsc);
    component.set("v.sortField", field);
    component.set("v.finalApprovalList", records);
  },

  fieldValue: function(object, fieldPath) {
    var result = object;
    fieldPath.forEach(function(field) {
      if (result) {
        result = result[field];
      }
    });
    return result;
  }
});
