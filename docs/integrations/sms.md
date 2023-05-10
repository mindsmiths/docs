---
sidebar_position: 3
---

# SMS

Infobip Adapter enables sending and receiving SMS messages by using [Infobip's APIs](https://www.infobip.com/docs/api/channels/sms) and integrating it with the Platform. 
It can be used for facilitating communication with your users. Keep in mind that in order to avoid blacklisting and filtering, [appropriate number type](https://www.infobip.com/docs/api/platform/numbers) should be used and [registered](https://www.infobip.com/docs/api/platform/numbers/number-registration).
We recommend using A2P 10DLC for US.

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
- Sending fully-featured SMS textual messages with or without shortening URL for the attached links to users
- Receiving SMS textual messages from users
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
Set your receiving base URL for SMS messages and delivery reports to: INFOBIP_MESSAGE_RECEIVING_BASE_URL.

When you have everything ready, you can start with the setup:
```console
infobip-adapter setup
```

## How to use Infobip Adapter
Using **Infobip Adapter** is easy!
In the following example, we'll show you how to set up a simple rule for receiving an **SMS message** from a user, and replying to it with a **custom message** and a **link**.
Please note that the link **will not** be shortened by **default**, but you can use Infobip's URL shortener by adding **true** as the last parameter in the **sendSmsTextMessage** function.
For more information on the domains used to shorten your links, please visit [Default URL Shortening](https://www.infobip.com/docs/url-shortening#default-url-shortening-how-url-shortening-works)

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

**It is important to outline certain guidelines regarding the process of URL shortening**:

- Shortening your URLs is crucial as SMS messages have a **160-character limit**.
- Studies reveal that users are wary of long URLs with multiple parameters, which they deem untrustworthy and spammy, causing them to hesitate and decrease click-through rates.
- Infobip **advises against** using **3rd party URL shorteners**, as they may be blacklisted by mobile network operators or spam filters, leading to your messages being blocked or labeled as spam.
- By default, the **shortenUrl** parameter is set to **false**, meaning that your URL will **not** be shortened.
- If a URL exceeds **23 characters**, simply add **true** as the last parameter when calling 
```console
InfobipAdapterAPI.sendSmsTextMessage(phone, text, true)
```

**These event classes are used to represent incoming and outgoing SMS messages, as well as delivery reports.**
```console
class InfobipSmsSentMessage(Event):
    from_: str = Field(None, alias='from')
    to: str
    messageId: str
    text: str
    callbackData: Optional[str] = None
```
```console
class InfobipSmsReceivedMessage(Event):
    from_: str = Field(None, alias='from')
    to: str
    messageId: str
    text: str
    cleanText: str
    keyword: str
    receivedAt: datetime
```
```console
class InfobipSmsReceivedReport(Event):
    to: str
    sentAt: datetime
    doneAt: datetime
    status: ReportStatus
    error: ReportError
```

**These are Data Models for SMS Received Messages and Delivery Reports with Endpoints.**

**SMS messages** that you receive will be directed to the endpoint /sms-received-message
```console
class SmsReceivedMessage(DataModel):
    from_: str = Field(None, alias='from')
    to: str
    messageId: str
    text: str
    cleanText: str
    keyword: str
    receivedAt: datetime
```

**Delivery reports** will be directed to the endpoint /sms-delivery-report
```console
class SmsReceivedReport(DataModel):
    messageId: str
    to: str
    sentAt: datetime
    doneAt: datetime
    status: ReportStatus
    error: ReportError
```
