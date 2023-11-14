import { LightningElement, track, api } from 'lwc';
import createLabelRecords from '@salesforce/apex/ImportCSVHandler.createLabelRecords';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';

export default class ImportLabelCsv extends LightningElement {

    fileName = '';
    showLoadingSpinner = false;
    filesUploaded = [];
    file;
    fileContents;
    fileReader;
    //Equivalente a 1 mb e mezzo
    MAX_FILE_SIZE = 1500000;
    isTrue = true;

    handleFilesChange(event) {
        console.log('[JS] ImportLabelCsv handleFilesChange [START]');
        this.filesUploaded = event.target.files;
        if(this.filesUploaded[0].size > this.MAX_FILE_SIZE){
            this.fileName = 'File size is too large!';
            this.isTrue = true;
        }
        else{
            this.isTrue = false;
            this.fileName = event.target.files[0].name;
        }
        console.log('[JS] ImportLabelCsv handleFilesChange [END]');
    }

    ReadFile() {
        console.log('[JS] ImportLabelCsv ReadFile [START]');
        createLabelRecords({ base64Data: JSON.stringify(this.fileContents)})
        .then(result => {
            console.log('result --> ' + result);
            this.showLoadingSpinner = false;
            if(result != null){
                if(result){
                    this.isTrue = true;
                    this.fileName = '';
                    this.dispatchEvent(new ShowToastEvent({
                        title: 'Success!',
                        message: this.file.name + ' - Insert Successfully!',
                        variant: 'success'}));
                }
                else{
                    this.dispatchEvent(new ShowToastEvent({
                        title: 'Error',
                        message: this.file.name + ' - Check the data with the Header or custom labels already present!',
                        variant: 'error'}));
                }
            }
            else{
                this.showLoadingSpinner = false;
                this.dispatchEvent(new ShowToastEvent({
                    title: 'Error',
                    message: this.file.name + ' - No data in file or the data does not match the Header!',
                    variant: 'error'}));
            }
        })
        .catch(error => {
            console.log('error --> '+error.message);
            this.showLoadingSpinner = false;
            this.dispatchEvent(new ShowToastEvent({
                title: 'Invalid data found in file',
                message: error.message,
                variant: 'error'}));
        });
        console.log('[JS] ImportLabelCsv ReadFile [END]');
    }

    handleSave(){
        console.log('[JS] ImportLabelCsv handleSave [START]');

        this.file = this.filesUploaded[0];
        this.showLoadingSpinner = true;
        this.fileReader= new FileReader();
        this.fileReader.onloadend = (() => {
            this.fileContents = this.fileReader.result;
            this.ReadFile();
        });
        this.fileReader.readAsText(this.file);

        console.log('[JS] ImportLabelCsv handleSave [END]');
    }

    downloadClick() {
        console.log('[JS] ImportLabelCsv downloadClick [START]');

        let data = 'Value (required),Category,Language,isProtected (boolean),DeveloperName,Name (required)';
        let self = this;
        // Creating anchor element to download
        let downloadElement = document.createElement('a');
        // This  encodeURI encodes special characters, except: , / ? : @ & = + $ # (Use encodeURIComponent() to encode these characters).
        downloadElement.href = 'data:text/json;charset=utf-8,' + encodeURI(data);
        downloadElement.target = '_self';
        // CSV File Name
        downloadElement.download = 'Custom Label.csv';
        // below statement is required if you are using firefox browser
        document.body.appendChild(downloadElement);
        // click() Javascript function to download CSV file
        downloadElement.click();
        this.dispatchEvent(new ShowToastEvent({
            title: 'Success',
            message: 'Download file successfully!',
            variant: 'success'}));
        self.isExecuting = false;
        console.log('[JS] ImportLabelCsv downloadClick [END]');
    }
}