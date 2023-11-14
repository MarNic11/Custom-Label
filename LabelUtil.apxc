//Created by Damiano Strano and Mario Nicolosi on 24/10/2023.

public with sharing class LabelUtils  {

    private final static String Session_Id = getSessionId();

    public static String getSessionId() {
        String Session_Id;
        if(!Test.isRunningTest()) {
            Session_Id = Page.SessionIdVisualforce.getContent().toString();
        }
        return Session_Id;
    }

    @AuraEnabled
    public static Boolean createLabelRecords(String base64Data) {
        System.debug('[APEX] LabelUtils createLabelRecords [START]');

        Boolean returnValue;
        String data = JSON.deserializeUntyped(base64Data).toString();
        List<LabelUtils.LabelWrapper> labels = LabelUtils.makeLabelListFromCSV(data);
        if(labels.size() > 0){
            returnValue = LabelUtils.createLabels(labels);
            if(returnValue == null){
                System.debug('[APEX] LabelUtils createLabelRecords [END]');
                return null;
            }
            if(returnValue){
                System.debug('[APEX] LabelUtils createLabelRecords [END]');
                return true;
            }
            else{
                System.debug('[APEX] LabelUtils createLabelRecords [END]');
                return false;
            }
        }
        else{
            System.debug('[APEX] LabelUtils createLabelRecords [END]');
            return null;
        }
    }

    public static List<LabelWrapper> makeLabelListFromCSV(String textBlock) {
        System.debug('[APEX] LabelUtils makeLabelListFromCSV [START]');

        List<LabelWrapper> labels = new List<LabelWrapper>();
        List<String> lines = textBlock.split('[\r\n]');
        //System.debug('lines --> '+lines);
        for (String line : lines) {
            //if(lines.indexOf(line) != 0){
            //}
            if(line.length() > 0){
                List<String> fields = line.split('[;,]');
                LabelWrapper label = new LabelWrapper();
                if (String.isEmpty(fields[3])) {
                    fields[3] = 'false';
                }
                if(fields[3].equalsIgnoreCase('true') || fields[3].equalsIgnoreCase('false')){
                    label.name = fields[5];
                    label.masterLabel = fields[4];
                    label.value = fields[0];
                    label.language = fields[2];
                    label.category = fields[1];
                    label.isProtected = fields[3].toLowerCase();
                    labels.add(label);
                }
            }
        }
        //System.debug('labels --> ' + labels);
        System.debug('[APEX] LabelUtils makeLabelListFromCSV [END]');
        return labels;
    }

    public static Boolean createLabels(List<LabelWrapper> labels) {
        System.debug('[APEX] LabelUtils createLabels [START]');

        List<String> result = new List<String>();
        String translation;
        List<LabelWrapper> labelsOK = new List<LabelWrapper>();
        List<LabelWrapper> labelsKO = new List<LabelWrapper>();
        for (LabelWrapper label : labels) {

            if (String.isEmpty(label.language)) {
                label.language = 'en_US';
            }
            if (label.name.contains(' ')) {
                label.name = label.name.replaceAll(' ', '_');
            }
            if(label.name.endsWith('_')){
                label.name = label.name.removeEnd('_');
            }
            if (String.isEmpty(label.masterLabel)) {
                label.masterLabel = label.name;
            }
            if (label.masterLabel.contains(' ')) {
                label.masterLabel = label.masterLabel.replaceAll(' ', '_');
            }
            if(label.masterLabel.endsWith('_')){
                label.masterLabel = label.masterLabel.removeEnd('_');
            }
            if (String.isEmpty(label.name) || String.isEmpty(label.masterLabel) || String.isEmpty(label.value)) {
                labelsKO.add(label);
            }
            else {
                labelsOK.add(label);
            }
            //System.debug(label);
        }

        if (labelsOK.size() > 0) {
            for (LabelWrapper label : labelsOK) {

                String value, value1;
                value1 = getSingleLabel(label.masterLabel);
                translation = value1.substringBefore(' (');
                if(!translation.contains('KO') && !translation.equalsIgnoreCase('false')){
                    value = translationLabel(translation, label);
                    result.add(value.substringBefore(' ('));
                }
                if(translation.equalsIgnoreCase('false')){
                    value = insertLabel(label);
                    result.add(value.substringBefore(' ('));
                }
                if(translation.contains('KO')){
                    labelsKO.add(label);
                }
                System.debug('Creazione della label ' + label.name + ': '+ value);
            }
        }
        if (labelsKO.size() > 0) {
            System.debug('Le seguenti ' + labelsKO.size() + ' label non sono state create:');
            for (LabelWrapper label : labelsKO) {
                System.debug(label.name + ' - ' + label.masterLabel + ' - ' + label.value + ' - ' + label.isProtected);
            }
        }

        if(result.contains('KO') && result.contains('OK')){
            System.debug('[APEX] LabelUtils createLabels [END]');
            return false;
        }
        if(result.contains('OK') && !result.contains('KO')){
            System.debug('[APEX] LabelUtils createLabels [END]');
            return true;
        }
        else{
            System.debug('[APEX] LabelUtils createLabels [END]');
            return null;
        }
    }

    public static String insertLabel(LabelWrapper label) {
        System.debug('[APEX] LabelUtils insertLabel [START]');

        HttpRequest req = new HttpRequest();
        String labelStr = '{"Name":"' + label.name + '","MasterLabel":"' + label.masterLabel + '","Value":"' + label.value + '","isProtected":"' + label.isProtected + '","Language":"' + label.language + '","Category":"' + label.category + '"}';

        // System.debug('Label string: ' + labelStr);
        req.setHeader('Authorization', 'Bearer ' + Session_Id);
        req.setHeader('Content-Type', 'application/json');
        req.setEndpoint(Url.getOrgDomainUrl().toExternalForm()+'/services/data/v59.0/tooling/sobjects/ExternalString');
        req.setMethod('POST');
        req.setBody(labelStr);

        Http http = new Http();
        HttpResponse res = http.send(req);
        
        if (res.getStatusCode() == 200 || res.getStatusCode() == 201){
            System.debug('[APEX] LabelUtils insertLabel [END]');
            return 'OK';
        }
        else {
            System.debug('[APEX] LabelUtils insertLabel [END]');
            return 'KO (' + res.getStatusCode() + ' ' + res.getStatus() + ' | ' +  res.getBody() + ')';
        }
    }

    public static String getSingleLabel(String developerName) {
        System.debug('[APEX] LabelUtils getSingleLabel [START]');

        Integer i;
        String present = '';
        HttpRequest req = new HttpRequest();

        req.setHeader('Authorization', 'Bearer ' + Session_Id);
        req.setHeader('Content-Type', 'application/json');
        req.setEndpoint(Url.getOrgDomainUrl().toExternalForm()+'/services/data/v59.0/tooling/query/?q=Select+id+from+CustomLabel+Where+MasterLabel=\''+developerName+'\'');
        req.setMethod('GET');

        Http http = new Http();
        HttpResponse res = http.send(req);

        if (res.getStatusCode() == 200 || res.getStatusCode() == 201){

            Map<String, Object> deserialized = (Map<String, Object>)JSON.deserializeUntyped(res.getBody());
            i = (Integer) deserialized.get('size');

            if(i > 0){
                present = deserialized.get('records').toString();
                present = present.substringAfter('Id=');
                present = present.substringBefore(',');
                //System.debug('present --> ' + present);
                System.debug('[APEX] LabelUtils getSingleLabel [END]');
                return present;
            }
            else{
                System.debug('[APEX] LabelUtils getSingleLabel [END]');
                return 'false';
            }
        }
        else {
            System.debug('Qualcosa è andato storto!\n (' +  res.getBody() + ')');
            System.debug('[APEX] LabelUtils getSingleLabel [END]');
            return 'KO (' + res.getStatusCode() + ' ' + res.getStatus() + ' | ' +  res.getBody() + ')';
        }
    }

    public static String translationLabel(String idLabel, LabelWrapper label) {
        System.debug('[APEX] LabelUtils translationLabel [START]');

        HttpRequest req = new HttpRequest();
        String labelStr = '{"ExternalStringId":"' + idLabel + '","Value":"' + label.value + '","Language":"' + label.language + '"}';

        // System.debug('Label string: ' + labelStr);
        req.setHeader('Authorization', 'Bearer ' + Session_Id);
        req.setHeader('Content-Type', 'application/json');
        req.setEndpoint(Url.getOrgDomainUrl().toExternalForm()+'/services/data/v59.0/tooling/sobjects/ExternalStringLocalization');
        req.setMethod('POST');
        req.setBody(labelStr);

        Http http = new Http();
        HttpResponse res = http.send(req);
        if (res.getStatusCode() == 200 || res.getStatusCode() == 201){
            System.debug('[APEX] LabelUtils translationLabel [END]');
            return 'OK';
        }
        else {
            System.debug('[APEX] LabelUtils translationLabel [END]');
            return 'KO (' + res.getStatusCode() + ' ' + res.getStatus() + ' | ' +  res.getBody() + ')';
        }
    }

    public class LabelWrapper {
        public String name;
        public String masterLabel;
        public String value;
        public String isProtected;
        public String language;
        public String category;
    }
}
