---
sidebar_position: 2
---

# Email
If your project requires sending emails, then Email Adapter is your friend. In the next few minutes, you will find out
how to install and set it up. Setting up an Email Adapter is quick and easy. Just follow the instructions below, and you'll be done with the setup in no time.

<details>
  <summary>Setup details</summary>
  <div>
    <div><p><b>Environment variables:</b></p>
        <ul>
            <li>Email address to use (sender)</li>
            <li>App password of corresponding Google Account</li>
        </ul>
    </div>
    <div>
        <p><b>Installment:</b></p>
        <ul>
            <li><code>pip install "email-adapter[dev]~=5.0.1"</code></li>
        </ul>
    </div>
    <div>
        <p><b>Initialize setup:</b></p>
        <ul><li><p><code>email-adapter setup</code></p></li></ul>
    </div>
  </div>
</details>


## Installment
First, install the adapter using the following command:
```console
pip install "email-adapter[dev]~=5.0.1"
```
## Preparation for Setup process
Before we start with a setup process a few things are required to be done on your Google Account.

1. Go to your [Google Account Security](https://myaccount.google.com/security) page.
2. Under **"Signing in to Google"** click **"2-step authentication"** and enable it.
3. Now you can create an "App password". Go to the same section, **"Signing in to Google"**, and click on the **"App passwords"**.
4. From dropdown lists select **"Email"** and device you want to generate the app password for.  
5. A window with the password will pop up. Copy your password because it will be required for the setup process.

## Setup
Now you can initialize setup process with the following command:
```console
email-adapter setup
```
When prompted, enter your **'email address'**, and **'App password'** generated with the steps above.
