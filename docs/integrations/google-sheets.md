---
sidebar_position: 8
---

# Google Sheets

If you're ever in a need of syncing with your Google Sheets and want to automatize inputting and extracting the data from your spreadsheets, Google Sheet Adapter is the service you want to integrate with.
It's based on the Google's [Cloud Platform](https://console.cloud.google.com/) and [Sheets API](https://developers.google.com/sheets/api), a duo used for accessing the chosen spreadsheet in a safe way.

<details>
  <summary>Setup details</summary>
  <div>
    <div><p><b>Environment variables:</b></p>
        <ul>
            <li>GOOGLE_CLIENT_CREDENTIALS</li>
            <li>GOOGLE_SPREADSHEET_ID</li>
        </ul>
    </div>
    <div>
        <p><b>Installment:</b></p>
        <ul>
            <li><code>pip install "gsheets-adapter[dev]~=1.0"</code></li>
        </ul>
    </div>
    <div>
        <p><b>Initialize setup:</b></p>
        <ul><li><p><code>gsheets-adapter setup</code></p></li></ul>
    </div>
  </div>
</details>

## When to use Google Sheet Adapter?

This adapter makes the data sheet manipulation a piece of cake. With it, you can extract all the data you want from your Google spreadsheets, 
you can edit them by adding new data or replacing the old ones, and you can even clear all the data that you don't want to use no more.

In a nutshell, use it for any kind of Google Sheets data manipulation.

## Core features
- extracting the whole data from a given spreadsheet
- retrieving data from a given sheet in a form of list of dictionaries where every key represents a value like name, price, quantitty, etc. and the values represent actual cell value
- updating existing data with new cell values
- appending new values at the end of the table
- etc.

## Setup
There's a couple of things you'll have to prepare before initializing the setup process, all of them are explained in details as it follows:  
### Installment
First, you'll need to pip install the Adapter with the following command:
```console
pip install "gsheets-adapter[dev]~=1.0"
```
### Environment variables
Here you can find out what you'll need to prearrange for setting up the Google Sheet Adapter. 
#### GOOGLE_CLIENT_CREDENTIALS {#google-client-creds}
This data is a `json` that represents credentials to gain access to chosen Google Sheets file. 
You'll need to go through a bit of a hassle to finally get the credentials, so let's start right away.

1. You'll want to create a [Google Cloud](https://console.cloud.google.com/) project, if you already don't have one ready and waiting. For additional help with creating a new project, check out Google's [tutorial](https://developers.google.com/workspace/guides/create-project).
2. Next, you'll have to enable Google Sheet APIs in a chosen Google Cloud project. Go to the following links and enable [Google Sheets API](https://console.cloud.google.com/apis/library/sheets.googleapis.com) and [Google Drive API](https://console.cloud.google.com/apis/library/drive.googleapis.com) or check if they are already enabled.
3. Click on **"Create credentials"**, select **"Application data"**, and then **"No, I'm not using them"**
4. Create service account details to your preferences, just keep in mind that you have to set the role to **"Editor"**
5. Credentials are now created, so let's find them. Go to **"Credentials"** and click on the service account you just created.
6. Click on **"Keys"** tab, then **"Add key"**, where you'll select **"Create new key"** and finally - choose **"JSON"**. This will download a file with your credentials.
7. You'll have to edit this downloaded file a bit - **replace** all new lines (`\n`) with `` (an empty string).
8. This edited content will be used as your `GOOGLE_CLIENT_CREDENTIALS`.

Now you are one big step closer to have everything ready for initializing the setup.

#### GOOGLE_SPREADSHEET_ID {#google-spreadsheet-id}
Spreadsheet id is a `string` used for identifying which spreadsheet you want to use and gain access to.

1. Go to the Google Spreadsheat you want to use, and share the access to the service account you just created. You can find the email of the service account in the **"Service Accounts"** tab.
2. For every Google Sheet file, you can find this identifier in the URL of the given spreadsheet. For example, if the URL s `https://docs.google.com/spreadsheets/d/1X2Y3Z/edit#gid=0`, then the `GOOGLE_SPREADSHEET_ID` is `1X2Y3Z`. Usually, this id is much longer than this, you can read more about it on official [Google Sheets API Overview guide](https://developers.google.com/sheets/api/guides/concepts#spreadsheet).

If you have prepared both credentials and the spreadsheet id, you can initialize the setup in the console with:

```console
gsheets-adapter setup
```
