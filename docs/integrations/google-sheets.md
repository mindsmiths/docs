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
- retrieving data from a given sheet in a form of list of dictionaries where every key represents a value like name, price, quantity, etc. and the values represent actual cell value
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
3. When enabled, click on **"Manage"**, and when inside choose **"Create credentials"**, select **"Application data"**, and then **"No, I'm not using them"**
4. Create service account details to your preferences, just keep in mind that you have to set the role to **"Editor"**
5. Credentials are now created, so let's find them. Go to **"Credentials"** and click on the service account you just created.
6. Click on **"Keys"** tab, then **"Add key"**, where you'll select **"Create new key"** and finally - choose **"JSON"**. This will download a file with your credentials.
7. You'll have to edit this downloaded file a bit - your `json` file will have to be all in one line, so that it can be processed by the Adapter during setup. Therefore, open the file in a text editor of your choosing, and remove all the line breaks.
8. This edited content will be used as your `GOOGLE_CLIENT_CREDENTIALS`.

Now you are one big step closer to have everything ready for initializing the setup.

#### GOOGLE_SPREADSHEET_ID {#google-spreadsheet-id}
Spreadsheet id is a `string` used for identifying which spreadsheet you want to use and gain access to.

1. Go to the Google Spreadsheet you want to use, and share the access to the service account you just created. You can find the email of the service account in the **"Service Accounts"** tab.
2. For every Google Sheet file, you can find this identifier in the URL of the given spreadsheet. For example, if the URL s `https://docs.google.com/spreadsheets/d/1X2Y3Z/edit#gid=0`, then the `GOOGLE_SPREADSHEET_ID` is `1X2Y3Z`. Usually, this id is much longer than this, you can read more about it on official [Google Sheets API Overview guide](https://developers.google.com/sheets/api/guides/concepts#spreadsheet).

In order of easier tracking all the ways of using the Google Sheet Adapter, we've created a simple [Google Spreadsheet](https://docs.google.com/spreadsheets/d/1PLeZOMswMquutGjnvPw7kXwnUcTDxYiY4ucHxuHXFUo/edit?usp=sharing) which we'll use as an example for all features demonstration.

We have a sheet `Goods` with 4 columns defined: `ID`, `PRODUCE`, `WEIGHT` and `PRICE`. 
The Google Sheet Adapter's main features are to **extract data** from a given spreadsheet and to **update** it with new data.

We should note that the provided spreadsheet is a template we created for the purposes of this setup, and you won't be able to change the values in it. Therefore, we encourage you to make your own spreadsheet, so you can use it as a base to follow along this tutorial.

If you have prepared both credentials and your Spreadsheet ID, you can initialize the setup in the console with:

```console
gsheets-adapter setup
```

## How to use Google Sheet Adapter
First, let's get familiar with the terminology. 
- `Spreadsheet` is the primary object in Google Sheets and can contain multiple sheets. Each has a unique `spreadsheetId` value, which you can find in a Google Sheets URL, the details are explained [here](/integrations/google-sheets#GOOGLE_SPREADSHEET_ID).
- `Sheet` is a page or a tab within a spreadsheet and can be differentiated by `sheetId`, which can also be found in a Google Sheets URL. For example, `https://docs.google.com/spreadsheets/d/aBC-123_xYz/edit#gid=sheetId`
- `Cell` is an individual field, text, or data within a sheet arranged in rows and columns. Each cell is identified with a corresponding row (represented by a number) and column (represented by a letter). Two different notations are used to define a cell or a range of cells. 
- A1 notation is a syntax that contains the sheet name with the addition of starting and ending cell coordinates using column letters and row numbers. Here are some examples from the official [Google Sheets API documentation](https://developers.google.com/sheets/api/guides/concepts).
- <details>
  <summary>A1 notation examples</summary>
  <div>
    <div><p><code>Sheet1!A1:B2</code> refers to the first two cells in the top two rows of Sheet1.</p></div>
    <div>
        <p><code>Sheet1!A:A</code> refers to all the cells in the first column of Sheet1.</p>
    </div>
    <div>
        <p><code>Sheet1!1:2</code> refers to all the cells in the first two rows of Sheet1.</p>
    </div>
    <div>
        <p><code>Sheet1!A5:A</code> refers to all the cells of the first column of Sheet 1, from row 5 onward.</p>
    </div>
      <div>
        <p><code>A1:B2</code> refers to the first two cells in the top two rows of the first visible sheet.</p>
    </div>
  <div><p><code>Sheet1</code> refers to all the cells in Sheet1</p></div>
  <div><p><code>MyCustomSheet!A:A</code> refers to all the cells in the first column of a sheet named "My Custom Sheet." Single quotes are required for sheet names with spaces, special characters, or an alphanumeric combination.</p></div>
  </div>
    <div><p><code>MyCustomSheet</code> refers to all the cells in 'My Custom Sheet'.</p></div>
</details>

- About the other one, R1C1 notation, you can learn more [here](https://developers.google.com/sheets/api/guides/concepts).

### Extracting data
Use the `getSpreadsheet()` method to extract data from a given spreadsheet. It takes two arguments: `spreadsheetId` and `range.`
Both are optional. As always, `spreadsheetId` is the ID you can retrieve from the Google Sheets URL, and `range`  is an argument for comma-separated sheet names from where to retrieve values. Here you can pass something like one of the [A1 notation examples](integrations/google-sheets#How-to-use-Google-Sheet-Adapter). 

If no `spreadsheetId` is provided, the default one (set in your environment) will be used. If no `range` is provided, the whole spreadsheet will be extracted.

This function returns a `Spreadsheet` object, which is an `Event` type with a dictionary of sheet titles and their values.
For example, let's say you have a spreadsheet with two sheets: `Customers` and `Goods`. 
The corresponding `Spreadsheet` object would have a map with two keys: `Customers` and `Goods`, and their values would be the data from the corresponding sheets.
This data is organized with list of maps, where each map represents a row in the sheet. 
The keys of the map are the column names, and the values are the values of the corresponding cells.
The whole Spreadsheet should look something like this:
```python
Spreadsheet = {
        "Customers": [{"NAME": "Bugs Bunny", "COMPANY": "Tune Squad"},
                      {"NAME": "Daffy Duck", "COMPANY": "Acme Corporation"},
                      {"NAME": "Porky Pig", "COMPANY": "Acme Corporation"}],
        
        "Goods": [{"ID": "JOj5xgcs", "PRODUCE": "Banana", "WEIGHT": 1, "PRICE": 0.99}, 
                  {"ID": "7huCnRB7", "PRODUCE": "Apple", "WEIGHT": 5, "PRICE": 2.49},
                  {"ID": "AimJC2o3", "PRODUCE": "Orange", "WEIGHT": 3, "PRICE": 3.29},
                  {"ID": "SLkU3g06", "PRODUCE": "Pear", "WEIGHT": 2, "PRICE": 1.99}]                 
}
```

#### Example
```java
import com.mindsmiths.gsheetsAdapter.GSheetsAdapterAPI
import com.mindsmiths.gsheetsAdapter.reply.Spreadsheet
...
rule "Process spreadsheet update request"
    when
        Heartbeat(now: timestamp) from entry-point "signals"
        agent: MyAgent(lastTableUpdate == null || lastTableUpdate before[180s] now)
    then
        modify(agent){ setLastTableUpdate(now) };
        GSheetsAdapterAPI.getSpreadsheet();
end

rule "Process spreadsheet"
    when
        spreadsheet: Spreadsheet() from entry-point "signals"
        agent: MyAgent()
    then
        agent.processSpreadsheet(spreadsheet);
        delete(spreadsheet);
end
```
In this example, you can see a one way of how to use the `getSpreadsheet()` method. 
Let's say we want to use the sheet data every 3 minutes. 
In the first rule, we are using the `GSheetsAdapter` and reaching for the `Spreadsheet` data by calling the `getSpreadsheet` method,
right after we made sure that the 3 minute timeslot has passed.

In the second rule, we are retrieving that `Spreadsheet` data and forwarding it to the `Agent` to process it.

Let's now take a look at the `Agent` class and see how it processes the `Spreadsheet` data.
```java
public class MyAgent extends Agent {
  ...

  public void processSpreadsheet(Spreadsheet spreadsheet) {
    updateItems(spreadsheet.getSheets().get("Goods"));
  }
  ...
}
```
Notice that we are using the `getSheets()` method to retrieve the data from the specific Sheet in the `Spreadsheet` object.
```java
public void updateItems(List<Map<String, String>> sheet) {
        
    Integer index = 1;
        
        for (Map<String, String> rawItem : sheet) {
            index++;
            String id = rawItem.get("ID");
            String item = rawItem.get("PRODUCE");
            String weight = rawItem.get("WEIGHT");
            String price = rawItem.get("PRICE");
            
            if(id != null && item != null && weight != null && price != null) {
                listOfItems.add(new Item(id, item, weight, price));
            } else {
                Log.warn("Missing some data for the item in row: " + index);
            }
        }
}
```
You can see that all you need for retrieving the data is a simple loop that iterates over the list of maps (representing rows) and retrieves the data from the corresponding cells.
We are storing the data in a list of `Item` objects, which is a simple class we created. Let's take a look at it:
```java

package models;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.io.Serializable;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Getter
public class Item implements Serializable {
    String ID;
    String item;
    String weight;
    String price;
}
```

### Changing values in a spreadsheet
To change values in a spreadsheet, you can use the `updateSheet()` method. 
It takes two arguments: `values` and `range`.

The `values` argument is a list of lists of strings, where each list of strings represents a row in the spreadsheet.
The `range` argument is the same as before. 

You'll need to set both `values` and `range`, they are not optional in this case.
With defining `range` you can specify the exact cells in the spreadsheet where you want to change the values.
Data that you put in the `values` argument will be written to the spreadsheet starting from the cell you specified in `range`.

Sheet update varies mostly depending on the `range` you define. Usually, there are three most common scenarios:
1. appending a new row to the sheet (e.g. adding a new item)
2. updating a specific cell (e.g. updating a item's price)
3. updating a specific row (e.g. completely updating item's data)

Once you define the `range`, you'll have to adjust `values` according to the range.
If you're updating a cell, then your `values` will be a list of lists with one element.
It will look something like this: `List.of(List.of("Banana"))`.
If you're updating a row, then your `values` will be a list of lists with more elements, with every element fitting the corresponding column. Bear in mind that **the order of elements is important**.
When updating the sheet, it's important to keep track of the order of the columns.

Also, what you'll want to keep in mind is defining how you will know which row you want to update. You can always get the latest data by first retrieving the data with `getSpreadsheet()` and then use it to find the row you want.
Other option is to keep track of the row number for each `Item` object in a `Map` on an `Agent`. You should always have n unique identifier for each row, so you can easily find the row you wish to update.

Here you can see an example of how to use the `updateSheet()` method. Let's say that we know the prices of our items are presented in a currency that doesn't fit our needs, and we want to update them to a different currency:
```java
    public void changeCurrency(Spreadsheet spreadsheet, double conversionRate) {
        String range = "Goods!D2:";
        Integer row = 1;
        List<List<String>> listOfNewPrices = new ArrayList<>();
        
        for (Map<String, String> rawItem : spreadsheet.getSheets().get("Goods")) {
            row++;
            double oldPrice = Double.parseDouble(rawItem.get("PRICE")) * conversionRate;
            listOfNewPrices.add(List.of(Double.toString(oldPrice)));
        }
        
        range += String.valueOf(row);
        GSheetsAdapterAPI.updateSheet(listOfNewPrices, range);
        }
```
You can see how we again iterate through a spreadsheet to find the row we want to update. With that, we can define the range, and simply call the `updateSheet()` method.

In the `MyAgent.drl` file, you can see how we use the `changeCurrency()` method. In our example, we are assuming that the current currency is `GBP` and we want to change it to `EUR` (at the time of writing this, the conversion rate is 0.88):
```java
rule "Change price currency"
    when
        spreadsheet: Spreadsheet() from entry-point "signals"
        agent: MyAgent(isUpdatedCurrency() == false)
    then
        modify(agent){
            setUpdatedCurrency(true)
        }
        agent.changeCurrency(spreadsheet, 0.88);
        delete(spreadsheet);
end
```
We also need to make sure that we don't update the currency every time we retrieve the data from the spreadsheet. That is why we have added a flag called `updatedCurrency` to the `MyAgent` class. 
Lastly, it is important to put the `"Change price currency"` rule above the `"Process spreadsheet"` rule, to make sure the rule will be fired once the Spreadsheet is loaded.