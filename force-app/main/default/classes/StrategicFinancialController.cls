public with sharing class StrategicFinancialController {
    public StrategicFinancialController() {

    }

    /*
        GET JSON data from URL
    */
    @AuraEnabled(cacheable=true)
    public static String queryDebtData() {
        HttpRequest req = new HttpRequest();
        req.setEndpoint('https://raw.githubusercontent.com/StrategicFS/Recruitment/master/data.json');
        req.setMethod('GET');
    
        Http http = new Http();
        HTTPResponse res = http.send(req);
        System.debug('    #### response:'+res.getBody());
        return res.getBody();
    }
}