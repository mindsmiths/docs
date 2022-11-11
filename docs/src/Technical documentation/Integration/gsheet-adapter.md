---
sidebar_position: 3
---

# Google Sheet Adapter

If you're ever in a need of syncing with your Google Sheets and want to automatize inputting and extracting the data from your spreadsheets, Google Sheet Adapter is the service you want to integrate with.
It's based on the Google's [Cloud Platform](https://console.cloud.google.com/) and [Sheets API](https://developers.google.com/sheets/api), a duo used for accessing the chosen spreadsheet in a safe way.

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
pip install "gsheets-adapter[dev]~=0.5.0"
```
### Environment variables
Here you can find out what you'll need to prearrange for setting up the Google Sheet Adapter. 
#### GOOGLE_CLIENT_CREDENTIALS {#google-client-creds}
This data is a `json` that represents credentials to gain access to chosen Google Sheets file. 
You'll need to go through a bit of a hassle to finally get the credentials, so let's start right away.

You'll want to create a [Google Cloud](https://console.cloud.google.com/) project, if you already don't have one ready and waiting. 
For additional help with creating a new project, check out Google's [tutorial]((https://developers.google.com/workspace/guides/create-project)).

Next, you'll have to enable Google Sheet API in a chosen Google Cloud project. Follow this [link](https://console.cloud.google.com/flows/enableapi?apiid=sheets.googleapis.com) to enable the API or to check if it's already enabled.
This is the process: 
- click on **"Create credentials"**
- select **"Application data"** and the option **"No, I'm not using them"**
- create service account details to your preferences, just keep in mind that you have to set the role to **"Editor"**


With this, you've created your credentials, so now you just have to access them:
- go to the **"Credentials"** and click on the service account you just created
- click on **"Keys"** tab, then **"Add key"** 
- select **"Create new key"** and choose **"JSON"**

This will download a file with your credentials. Last thing, you'll have to edit this downloaded file a bit - **replace** all new lines (`\n`) with `` (an empty string). 
This edited content will be used as your Google client credentials.

Now you are one big step closer to have everything ready for initializing the setup.

#### GOOGLE_SPREADSHEET_ID {#google-spreadsheet-id}
Spreadsheet id is a `string` used for identifying which spreadsheet you want to use and gain access to. For every Google Sheet file, you can find this identifier in the URL of the given spreadsheet.
For example, if the URL s `https://docs.google.com/spreadsheets/d/1X2Y3Z/edit#gid=0`, then the `GOOGLE_SPREADSHEET_ID` is `1X2Y3Z`. 
Usually, this id is much longer than this, you can read more about it on official [Google Sheets API Overview guide](https://developers.google.com/sheets/api/guides/concepts#spreadsheet).

If you have prepared both credentials and the spreadsheet id, you can initialize the setup in the console with:

```console
gsheets-adapter setup
```
