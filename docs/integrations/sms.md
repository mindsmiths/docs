---
sidebar_position: 3
---

# SMS

Infobip Adapter enables sending and receiving SMS messages by using [Infobip's APIs](https://www.infobip.com/docs/api/channels/sms) and integrating it with the Platform. 
It can be used for facilitating communication with your users.

<details>
  <summary>Setup details</summary>
  <div>
    <div><p><b>Environment variables:</b></p>
        <ul>
            <li>INFOBIP_BASE_URL</li>
            <li>INFOBIP_API_KEY</li>
            <li>INFOBIP_PHONE_NUMBER</li>
            <li>INFOBIP_MESSAGE_RECEIVING_BASE_URL</li>
        </ul>
    </div>
    <div>
        <p><b>Installation:</b></p>
        <ul>
            <li><code>pip install "infobip-adapter[dev]~=5.2.1"</code></li>
        </ul>
    </div>
    <div>
        <p><b>Initialize setup:</b></p>
        <ul><li><p><code>infobip-adapter setup</code></p></li></ul>
    </div>
  </div>
</details>

## When to use Infobip Adapter?
If your project involves direct communication with your users and you want to use WhatsApp or SMS text messages as preferred chanel for communication, then integrating Infobip Adapter is the way to go.
Here you can find more about how to use it, what exactly can you use it for and how can you set it up in your project.

## Core features
- Sending fully-featured textual messages with or without shortening URL for the attached links to users
- Receiving delivery reports for messages sent (eg. PENDING, UNDELIVERABLE, DELIVERED, EXPIRED, REJECTED)

## Setup
Setting up Infobip Adapter is quick and easy, you'll just need to look for a couple of things on Infobip's portal. Follow the instructions bellow, and you'll be done with the setup in no time. 
### Installation
Start with pip installing the adapter with the following command:
```console
pip install "infobip-adapter[dev]~=5.2.1"
```
### Environment variables
Prepare the following data, you'll need to have it ready once you start with initializing the setup process.
#### INFOBIP_BASE_URL{#infobip-base-url}
Go to the [Infobip API docs](https://www.infobip.com/docs/api), log in to your account and there you'll find the base URL. Copy the `POST` request base URL (up to `.com`, eg.: `https://r529vy.api.infobip.com`)
#### INFOBIP_API_KEY{#infobip-api-key}
For retrieving the API key, go to the [Infobip Portal](https://portal.infobip.com/login/?callback=https%3A%2F%2Fportal.infobip.com%2Fdev%2Fapi-keys) and generate a new API key with role set to **Public API**.
#### INFOBIP_PHONE_NUMBER{#infobip-phone-num}
Add your phone number used as sender - go to the [Infobip Portal](https://portal.infobip.com/apps/sms) and copy your phone number (eg. 38598123456)
#### INFOBIP_MESSAGE_RECEIVING_BASE_URL{#infobip-message-receiving_base_url}
For receiving SMS messages and SMS delivery reports - make sure to set your receiving base URL here.

When you have everything ready, you can start with the setup:
```console
infobip-adapter setup
```

## How to use Infobip Adapter
Using **Infobip Adapter** is easy!
In the following example, we'll show you how to set up a simple rule for receiving an **SMS message** from a user, and replying to it with a **custom message** and a **link**.
Please note that the link **will not** be shortened by **default**, but you can use Infobip's URL shortener by adding **true** as the last parameter in the **sendSmsTextMessage** function.

<details>
  <summary>These event classes are used to represent incoming and outgoing SMS messages, as well as delivery reports.</summary>
  <div>
    <div><p><b>class InfobipSmsSentMessage(Event):</b></p>
        <ul>
            <li>from_: str = Field(None, alias='from')</li>
            <li>to: str</li>
            <li>messageId: str</li>
            <li>text: str</li>
            <li>callbackData: Optional[str] = None</li>
        </ul>
    </div>
    <div><p><b>class InfobipSmsReceivedMessage(Event):</b></p>
        <ul>
            <li>from_: str = Field(None, alias='from')</li>
            <li>to: str</li>
            <li>messageId: str</li>
            <li>text: str</li>
            <li>cleanText: str</li>
            <li>keyword: str</li>
            <li>receivedAt: datetime</li>
        </ul>
    </div>
    <div><p><b>class InfobipSmsReceivedReport(Event):</b></p>
        <ul>
            <li>to: str</li>
            <li>sentAt: datetime</li>
            <li>doneAt: datetime</li>
            <li>status: ReportStatus</li>
            <li>error: ReportError</li>
        </ul>
    </div>
  </div>
</details>
<details>
  <summary>These are Data Models for SMS Received Messages and Delivery Reports with Endpoints</summary>
  <div>
    <div><p><b>SMS messages that you receive will be directed to the endpoint /sms-received-message.</b></p>
    <p><b>class SmsReceivedMessage(DataModel):</b></p>
        <ul>
            <li>from_: str = Field(None, alias='from')</li>
            <li>to: str</li>
            <li>messageId: str</li>
            <li>text: str</li>
            <li>cleanText: str</li>
            <li>keyword: str</li>
            <li>receivedAt: datetime</li>
        </ul>
    </div>
    <div><p><b>Delivery reports will be directed to the endpoint /sms-delivery-report.</b></p>
    <p><b>class SmsReceivedReport(DataModel):</b></p>
        <ul>
            <li>messageId: str</li>
            <li>to: str</li>
            <li>sentAt: datetime</li>
            <li>doneAt: datetime</li>
            <li>status: ReportStatus</li>
            <li>error: ReportError</li>
        </ul>
    </div>
  </div>
</details>

To begin, it is important to outline certain guidelines regarding the process of **URL shortening**:

- Shortening your URLs is crucial as SMS messages have a **160-character limit**.
- Studies reveal that users are wary of long URLs with multiple parameters, which they deem untrustworthy and spammy, causing them to hesitate and decrease click-through rates.
- Infobip advises **against** using 3rd party URL shorteners, as they may be blacklisted by mobile network operators or spam filters, leading to your messages being blocked or labeled as spam.
- By default, the **shortenUrl** parameter is set to **false**, meaning that your URL will **not** be shortened.
- If a URL exceeds **23 characters**, simply add **true** as the last parameter when calling InfobipAdapterAPI.sendSmsTextMessage(phone, text, **true**).

```console
rule "Example rule for sending sms messages"
    when
        signal: InfobipSmsReceivedMessage() from entry-point "signals"
        ClientAgent(phone: getConnection("phone"))
    then

        String text = "This is a text message with a test link!! " + "https://media.licdn.com/dms/image/C560BAQHs7NgrupDBzA/company-logo_200_200/0/1585518354036?e=2147483647&v=beta&t=DP90UsvlwvWy78Hx4Herv82QLqVwtuptG1ZC8vLVQXM";
        InfobipAdapterAPI.sendSmsTextMessage(phone, text);
        delete(signal);
end
```