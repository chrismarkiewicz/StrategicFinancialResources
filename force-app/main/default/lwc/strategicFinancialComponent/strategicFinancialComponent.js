import { LightningElement, wire, track } from 'lwc';
import queryDebtDataImport from '@salesforce/apex/StrategicFinancialController.queryDebtData';

export default class StrategicFinancialComponent extends LightningElement {

    @track debtList = [];
    @track debtTotal = 0;

    @wire(queryDebtDataImport)
    wiredApptTypeData({data, error}) {
        if(data){
            var dataAsJSON = JSON.parse(data);
            this.debtList = dataAsJSON;
            this.calculateDebtTotal();
        } 
        else if(error) {
            console.log("    #### error wiredApptTypeData: "+error);
        }
    }

    // Remove Debt button clicked
    handleRemoveDebt() {
        var newDebtList = [];
        let allInputList = this.template.querySelectorAll('lightning-input');    
        for(let i = 0; i < allInputList.length; i++) {
            if (allInputList[i].type != 'checkbox' || allInputList[i].value === 'allCheck') {
                continue;
            }
            if(allInputList[i].checked ) {
                // no action
            } 
            else {
                var debtRow = this.debtList.filter(row => row.id == allInputList[i].value);
                if (debtRow.length == 1) {
                    newDebtList.push(debtRow[0]);
                }
            }
        }
        this.debtList = newDebtList;
        this.calculateDebtTotal();
        
    }

    // Add Debt button clicked
    handleAddDebt() {
        // get new Id value
        var maxId = 1;
        for (let i=0; i<this.debtList.length; i++) {
            if (this.debtList[i].id > maxId) {
                maxId = this.debtList[i].id;
            }
        }
        var newDebtRow = {
            "id": maxId+1,
            "creditorName": "",
            "firstName": "",
            "lastName": "",
            "minPaymentPercentage": 0,
            "balance": 0};
        this.debtList.push(newDebtRow);
        this.calculateDebtTotal();
    }

    // Creditor Name field updated
    handleCreditorNameChange(event) {
        var updatedRowArray = this.debtList.filter(row => row.id == (event.target.dataset.id).toString());
        var updatedRow = updatedRowArray[0];
        updatedRow.creditorName = event.target.value;
        
        var newDebtList = [];
        // create new Debt List, replacing old row with new one
        for (var i=0; i<this.debtList.length; i++) {
            if (this.debtList[i].id == event.target.dataset.id) {
                newDebtList.push(updatedRow);
            }
            else {
                newDebtList.push(this.debtList[i]);
            }
        }
        this.debtList = newDebtList;
        this.calculateDebtTotal();

    }

    calculateDebtTotal() {
        var debtTotalLocal = 0;
        for (var i=0; i<this.debtList.length; i++) {
            debtTotalLocal += this.debtList[i].balance;
        }
        this.debtTotal = debtTotalLocal;

    }


}