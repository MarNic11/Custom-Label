/**
 * Created by Mario on 31/10/2023.
 */

@IsTest
global class Mock_Test_LabelUtils implements HttpCalloutMock{

    global HttpResponse respond(HttpRequest req){
        HttpResponse res = new HttpResponse();
        res.setHeader('Content-Type','application/json');
        res.setBody('{"size":1,"totalSize":1,"done":true,"queryLocator":null,"entityTypeName":"ExternalString","records":[{"attributes":{"type":"ExternalString","url":"/services/data/v59.0/tooling/sobjects/ExternalString/1012o000002MkUoAAK"},"Id":"1012o000002MkUoAAK"}]}');
        res.setStatusCode(200);
        return res;
    }
}
