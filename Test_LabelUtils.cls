//Created by Damiano Strano and Mario Nicolosi on 24/10/2023.

@IsTest
global class Test_LabelUtils{

    @IsTest
    static void testLabels(){

        Test.setMock(HttpCalloutMock.class, new Mock_Test_LabelUtils());

        Test.startTest();
        String ls = JSON.serialize('Test,,,,,Test 2_');
        LabelUtils.createLabelRecords(ls);
        Test.stopTest();
    }

    @IsTest
    static void getLabels(){

        Test.setMock(HttpCalloutMock.class, new Mock_Test_LabelUtils());

        Test.startTest();
        String res = LabelUtils.getSingleLabel('Test');
        Test.stopTest();
    }

    @IsTest
    static void insertLabel(){

        String ls = 'Test,,,,,Test';
        List<LabelUtils.LabelWrapper> mr = LabelUtils.makeLabelListFromCSV(ls);
        Test.setMock(HttpCalloutMock.class, new Mock_Test_LabelUtils());

        Test.startTest();
        String res = LabelUtils.insertLabel(mr[0]);
        Test.stopTest();
    }

    @IsTest
    static void translationLabel(){

        String ls = 'Test,,,,,Test';
        List<LabelUtils.LabelWrapper> mr = LabelUtils.makeLabelListFromCSV(ls);
        Test.setMock(HttpCalloutMock.class, new Mock_Test_LabelUtils());

        Test.startTest();
        String res = LabelUtils.translationLabel('1015o002002MkUoAAK',mr[0]);
        Test.stopTest();
    }
}
