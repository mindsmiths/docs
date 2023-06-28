---
sidebar_position: 8
---

# Google Drive

## Overview

The GDrive Adapter is a tool that simplifies the integration of Google Drive with your application.


## Core features

<ul>
  <li>File Upload</li>
  <li>File Upload (from Cloud Storage)</li>
  <li>File Download</li>
  <li>File Download (to Cloud Storage)</li>
  <li>File Deletion</li>
  <li>Folder Creation</li>
  <li>Folder Deletion</li>
</ul>


## Setup

To install the adapter package, use the following command:

```shell
$ pip install "gdrive-adapter[dev]"
```

After installation, integrate the GDrive Adapter into your project using the command:

```shell
$ gdrive-adapter setup
```

Now you will be prompted to provide credentials.


### Credentials

<ol>
    <li>You'll want to create a <a href="https://console.cloud.google.com">Google Cloud</a> project, if you already don't have one. For additional help with creating a new project, check out Google's <a href="https://developers.google.com/workspace/guides/create-project">tutorial</a>.</li>
    <li>Next, you'll have to <a href="https://console.cloud.google.com/flows/enableapi?apiid=drive.googleapis.com">enable Google Drive APIs</a> in a chosen Google Cloud project.</li>
    <li>Then, navigate to <strong>"APIs & Service" -> "Credentials"</strong>, and click on <strong>"Create credentials"</strong>, select <strong>"Service account"</strong>, and follow the instructions to create a service account</li>
    <li>Go to <strong>"Credentials"</strong> and click on the service account you just created.</li>
    <li>Note the service account email (ends with `iam.gserviceaccount.com`) - you'll need it later</li>
    <li>Click on <strong>"Keys"</strong> tab, then <strong>"Add key"</strong>, where you'll select <strong>"Create new key"</strong> and finally - choose <strong>"JSON"</strong>. This will download a file with your credentials.</li>
    <li>Open the downloaded file, and minify the JSON within it (remove spaces and newlines) - there are many tools that can do this for you. Make sure you're not removing newlines (`\n`) within the private key!</li>
    <li>Paste the minified JSON as credentials.</li>
</ol>

:::note
If you're editing your `.env` file manually, make sure to wrap the credentials in single quotes.
:::

:::caution Store the credentials somewhere safe
You can only download the credentials once, so make sure to save them somewhere safe.

Also, make sure to keep your credentials secret, as it can be used to control your Drive.
:::


## Using the adapter

### Uploading a file to a specific folder

1. Navigate to the folder you want to upload the file to.
2. Right-click the folder and select "Share"
3. Enter the service account email you noted earlier, set the role to "Editor", and click "Done"
4. Double-click the folder to open it, and copy the ID from the URL - the part after https://drive.google.com/drive/folders/, looks something like `1zqceDnC52CuxqXh7uL2fGMgWU_o4Fjkw`
5. Use the following code to upload a file to the folder:
```python
from forge.utils.base import base64_encode
from gdrive_adapter.api import GDriveAdapterAPI

text = "Hello World!"

GDriveAdapterAPI.upload_file(
    "hello_world.txt",
    base64_encode(text),
    folderId="1zqceDnC52CuxqXh7uL2fGMgWU_o4Fjkw"
)
```

### Downloading a file

1. Make sure you have shared the file or folder with the service account email you noted earlier
2. Find out the file ID - right-click the file and select "Copy link". From the copied link, extract the file ID - the part after https://drive.google.com/file/d/, looks something like `1uOEA4U3O_g5Top8nio7AanmqMUBCy9mK`
3. Use the following code to download the file:
```python
from forge.utils.base import base64_decode
from gdrive_adapter.api import GDriveAdapterAPI

GDriveAdapterAPI.download_file("1uOEA4U3O_g5Top8nio7AanmqMUBCy9mK")

# You will get a FileDownloadResult object, which contains the fileBytes field (encoded with Base64)
# print(base64_decode(result.fileBytes))
```
