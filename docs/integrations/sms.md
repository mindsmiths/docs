---
sidebar_position: 3
---

# SMS

Infobip Adapter enables sending and receiving SMS messages by using [Infobip's APIs](https://www.infobip.com/docs/api/channels/sms) and integrating it with the Platform. 
It can be used for facilitating communication with your users. 

:::note

Remember, it's crucial to ensure you don't get blacklisted or filtered. To do this, you should use and [register](https://www.infobip.com/docs/10dlc/10dlc-registration) the [appropriate type of number](https://www.infobip.com/docs/api/platform/numbers). 
We particularly suggest the use of A2P 10DLC for those operating within the United States. 

:::

<details>
  <summary>Setup details</summary>
  <div>
    <div><p><b>Environment variables:</b></p>
        <ul>
            <li>INFOBIP_BASE_URL</li>
            <li>INFOBIP_API_KEY</li>
            <li>INFOBIP_PHONE_NUMBER</li>
            <li>INFOBIP_ADAPTER_BASE_URL</li>
            <li>INFOBIP_SMS_DELIVERY_REPORTING_ENABLED</li>
        </ul>
<p>
If no value is set, INFOBIP_SMS_DELIVERY_REPORTING_ENABLED will default to False.
</p>
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
If your project involves direct communication with your users and you want to use WhatsApp or SMS text messages as preferred channel for communication, then integrating Infobip Adapter is the way to go.
Here you can find more about how to use it, what exactly can you use it for and how can you set it up in your project.

## Core features
- Sending SMS textual messages with URL shortening
- Sending SMS textual messages without URL shortening 
- Receiving SMS textual messages from users
- Receiving delivery reports for messages sent to user(eg. PENDING, UNDELIVERABLE, DELIVERED, EXPIRED, REJECTED)

:::tip

If `INFOBIP_SMS_DELIVERY_REPORTING_ENABLED` has no value set, it will default to **false** and will **not** 
shorten the **URL** inside the text body of the SMS message.

:::

:::tip

**Number Formatting**

It is **strongly recommended** to use the **E.164** number format. **E.164** numbers are internationally standardized to a **15-digit max. length**.

Phone numbers must start with a **country code**, followed by a **network code**, then the **subscriber number**. **Plus prefixes +** are **not** required.

Phone numbers that are not **E.164** formatted may work, depending on the handset or network.

Example: a **Croatian number** is formatted as **385981234567**, while a **UK number** is formatted as **447712345678**.

:::

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
#### INFOBIP_ADAPTER_BASE_URL{#infobip-adapter-base-url}
Set your receiving base URL for SMS messages and delivery reports to: INFOBIP_MESSAGE_RECEIVING_BASE_URL.

When you have everything ready, you can start with the setup:
```console
infobip-adapter setup
```

## How to use Infobip Adapter
Using **Infobip Adapter** is easy!
In the following example, we'll show you how to set up a simple rule for receiving an **SMS message** from a user, and replying to it with a **custom message** and a **link**.

:::note

Please note that the link **will not** be shortened by **default**, but you can use Infobip's URL shortener by adding **true** as the last parameter in the **sendSmsTextMessage** function.
For more information on the domains used to shorten your links, please visit [Default URL Shortening](https://www.infobip.com/docs/url-shortening#default-url-shortening-how-url-shortening-works)

:::

```console
rule "Example rule for replying to received SMS messages"
    when
        signal: InfobipSmsReceivedMessage() from entry-point "signals"
        ClientAgent(phone: getConnection("phone"))
    then

        String text = "This is a text message with a test link!! " + "https://media.licdn.com/dms/image/C560BAQHs7NgrupDBzA/company-logo_200_200/0/1585518354036?e=2147483647&v=beta&t=DP90UsvlwvWy78Hx4Herv82QLqVwtuptG1ZC8vLVQXM";
        InfobipAdapterAPI.sendSmsTextMessage(phone, text);
        delete(signal);
end
```
:::caution

**It is important to outline certain guidelines regarding the process of URL shortening**:

- Shortening your URLs is crucial as SMS messages have a **160-character limit**.
- Studies reveal that users are wary of long URLs with multiple parameters, which they deem untrustworthy and spammy, causing them to hesitate and decrease click-through rates.
- Infobip **advises against** using **3rd party URL shorteners**, as they may be blacklisted by mobile network operators or spam filters, leading to your messages being blocked or labeled as spam.
- By default, the **shortenUrl** parameter is set to **false**, meaning that your URL will **not** be shortened.
- If a URL exceeds **23 characters**, simply add **true** as the last parameter when calling

```console
InfobipAdapterAPI.sendSmsTextMessage(phone, text, true)
```

:::

<details>
<summary>These event classes are used to represent incoming and outgoing SMS messages, as well as delivery reports.</summary>

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
</details>

**These are Data Models for SMS Received Messages and Delivery Reports with Endpoints.**

<details>
<summary>SMS messages that you receive will be directed to the endpoint /sms-received-message</summary>

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
</details>

<details>
<summary>Delivery reports will be directed to the endpoint /sms-delivery-report</summary>

```console
class SmsReceivedReport(DataModel):
    messageId: str
    to: str
    sentAt: datetime
    doneAt: datetime
    status: ReportStatus
    error: ReportError

```
</details>

To receive text messages from a specific number on Infobip, you need to create a **webhook URL**. This URL is created by combining your **INFOBIP_ADAPTER_BASE_URL** with **/sms-received-message** endpoint.

For example, if your **INFOBIP_ADAPTER_BASE_URL** is **https://infobip_adapter_base_url.com**, then your webhook URL would be **https://infobip_adapter_base_url.com/sms_received_message**.

After creating your webhook URL, set it up on Infobip's platform for the specific number you want to receive messages from. You can do this by accessing the [Infobip portal](https://portal.infobip.com/apps/sms).

:::info

**Push Retry Cycle**

If your **INFOBIP_ADAPTER_BASE_URL** is **unavailable** for any reason, forward attempts will be made according to formula:
**1min + (1min * retryNumber * retryNumber)**. Examples for first few retry attempts are shown in the list below.

**Retry 0:** The **initial attempt** is made. If **unsuccessful**, the **first retry** occurs after **1 minute**. **Cumulative time: 1 minute.**

**Retry 1:** The **second** retry is scheduled **2 minutes** after the **first**. **Cumulative time: 3 minutes.**

**Retry 2:** The **third** retry takes place **5 minutes** after the **second**. **Cumulative time: 8 minutes.**

**Retry 3:** The **fourth** retry happens **10 minutes** after the **third**. **Cumulative time: 18 minutes.**

**Retry 4:** The **fifth** retry is initiated **17 minutes** after the **fourth**. **Cumulative time: 35 minutes.**

**Retry 5:** The **sixth** retry occurs **26 minutes** after the **fifth**. **Cumulative time: 1 hour and 1 minute.**

**Retry 6:** The **seventh** retry takes place **37 minutes** after the **sixth**. **Cumulative time: 1 hour and 38 minutes.**

Please note that this process continues up to the **20th** retry. If the **INFOBIP_ADAPTER_BASE_URL** remains **unavailable** for the **entire retry period**, the **data** will unfortunately be **lost**. The **final retry** is scheduled **41 hours** and **30 minutes** after the **initial attempt**.

:::