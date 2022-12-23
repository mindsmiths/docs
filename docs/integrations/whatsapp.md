---
sidebar_position: 2
---

# WhatsApp

Infobip Adapter enables sending [WhatsApp](https://www.whatsapp.com/) and SMS messages by using [Infobip's APIs](https://www.infobip.com/docs/api/channels/whatsapp/whatsapp-outbound-messages) and integrating it with the Platform. 
It can be used for facilitating communication with your users.

<details>
  <summary>Setup details</summary>
  <div>
    <div><p><b>Environment variables:</b></p>
        <ul>
            <li>INFOBIP_BASE_URL</li>
            <li>INFOBIP_API_KEY</li>
            <li>INFOBIP_PHONE_NUMBER</li>
        </ul>
    </div>
    <div>
        <p><b>Installment:</b></p>
        <ul>
            <li><code>pip install "infobip-adapter[dev]~=5.0.0b0"</code></li>
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
- sending WhatsApp text messages
- sending any [supported type](https://www.infobip.com/docs/api/channels/whatsapp/whatsapp-outbound-messages) of WhatsApp messages (eg. location, document, etc.) to the user
- sending [WhatsApp templates](https://www.infobip.com/docs/api/channels/whatsapp/whatsapp-outbound-messages/send-whatsapp-template-message) messages
- sending SMS messages to users

## Setup
Setting up Infobip Adapter is quick and easy, you'll just need to look for a couple of things on Infobip's portal. Follow the instructions bellow, and you'll be done with the setup in no time. 
### Installment
Start with pip installing the adapter with the following command:
```console
pip install "infobip-adapter[dev]~=5.0.0b0"
```
### Environment variables
Prepare the following data, you'll need to have it ready once you start with initializing the setup process.
#### INFOBIP_BASE_URL{#infobip-base-url}
Go to the [WhatsApp API docs](https://www.infobip.com/docs/api), log in to your account and there you'll find the base URL. Copy the `POST` request base URL (up to `.com`, eg.: `https://r529vy.api.infobip.com`)
#### INFOBIP_API_KEY{#infobip-api-key}
For retrieving the API key, go to the [Infobip Portal](https://portal.infobip.com/login/?callback=https%3A%2F%2Fportal.infobip.com%2Fdev%2Fapi-keys) and generate a new API key with role set to **Public API**.
#### INFOBIP_PHONE_NUMBER{#infobip-phone-num}
Add your phone number used as sender - go to the [Infobip Portal](https://portal.infobip.com/login/?callback=https%3A%2F%2Fportal.infobip.com%2Fapps%2Fwhatsapp%2Fsenders) and copy your phone number (eg. 38598123456)

When you have everything ready, you can start with the setup:
```console
infobip-adapter setup
```