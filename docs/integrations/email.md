---
sidebar_position: 2
---

# Email
If your project requires sending emails, then Email Adapter is your friend. Setting up an Email Adapter is quick and easy. Just follow the instructions below, and you'll be done with the setup in no time.

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


## Prerequisites
Before we start with a setup process, you need to do a couple of things on your Google Account.

1. Go to your [Google Account Security](https://myaccount.google.com/security) page.
2. Under **"Signing in to Google"** click **"2-step authentication"** and enable it.
3. Now you can create an "App password". Go to the same section, **"Signing in to Google"**, and click on the **"App passwords"**.
4. From dropdown lists select **"Email"** and device you want to generate the app password for.  
5. A window with the password will pop up. Copy your password because it will be required for the setup process.


## Installment
First, install the adapter using the following command:
```console
pip install "email-adapter[dev]~=5.0.1"
```

## Setup
Now you can initialize setup process with the following command:
```console
email-adapter setup
```
When prompted, enter your **'email address'**, and **'App password'** generated with the steps described in the prerequisites.

And that's it! You can now send emails for the project via your Gmail account! 

## How to use Email Adapter
Putting an Email Adapter into practice is straightforward and easy. The best way to show you how this works is to demonstrate an example. Let's say that our java agent is named Smith. First, we will define a method on agent Smith as:
```java
import java.io.IOException;
import java.util.List;
import com.mindsmiths.emailAdapter.NewEmail;
import com.mindsmiths.emailAdapter.EmailAdapterAPI;
...
public void sendEmail(List<String> recipients, String emailTitle, String emailText) throws IOException {
        NewEmail email = new NewEmail();
        email.setRecipients(recipients);
        email.setSubject(emailTitle);
        email.setPlainText(emailText);

        EmailAdapterAPI.newEmail(email);
    }
```
Method `sendEmail` accepts three parameters: a list of strings `recipients`, i.e., a list of email addresses that will receive an email. The remaining two parameters are strings, `emailTitle` and `emailText`, whose names are self-explanatory. 

The code above can be broken into two parts. First, we create `NewEmail` class and set attributes. This class has multiple attributes (not all of them are required), such as:
```java
private java.util.List<java.lang.String> recipients;
private java.lang.String plainText;
private java.lang.String htmlText;
private java.util.List<java.lang.String> cc;
private java.lang.String subject;
...
```
The second part is sending an email using `EmailAdapterAPI.newEmail()` method. Lastly, do not forget to add `IOException`. Otherwise, the method won't work.

Now, writing a rule that calls the above-defined method remains. For example, let's say that Smith has a boolean `timeToSendEmail` flag, which will trigger the corresponding rule when the value of a flag is `true`:
```java
rule "Send email"
    when
        agent: Smith(timeToSendEmail == true)
    then
        agent.sendEmail(List.of('cool_guy@mindsmiths.com'), "This is very important email!", "Some cool text goes here");
        modify(agent) { setTimeToSendEmail(false) };
end
```
Note that after the rule was triggered, we set `timeToSendEmail` to `false` to prevent infinite rule triggering.

As you can see, there are more attributes on `NewEmail` class besides these three that we have used. If you feel confident enough, try sending an HTML template. In that way, you can customize the email to your liking.