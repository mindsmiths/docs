---
sidebar_position: 1
---

#  Quickguide to service integrations

Here you can find a quick explanation of how to integrate any of the existing internal services.

First, you'll find a list of all **environment variables** that'll be added to add to your `.env` file.
If you're not completely sure what a specific environment variable stands for, or you don't know where to find the value for it, a simple click on a variable will lead you to the part of service documentation where you can find more details about it.

Next, take a look how to **install** the chosen service, after which you can check out how to continue with the rest of the **setup**.

<details>
  <summary>Armory</summary>
<div>
    <div><p>Environment variables:</p>
        <ul>
            <li>SECRET_KEY</li>
            <li>DEBUG</li>
            <li>ALLOW_EVERYONE</li>
            <li>SITE_URL</li>
            <li>INTERNAL_SITE_URL</li>
        </ul>
    </div>
    <div>
        <p>Installment:</p>
        <ul>
            <li><code>pip install "armory[dev]~=5.0.0b0"</code></li>
        </ul>
    </div>
    <div>
        <p>To start setup, write the following command to terminal:</p>
        <ul><li><p><code>armory setup</code></p></li></ul>
    </div>
  </div>
</details>

<details>
  <summary>Discord Adapter</summary>
<div>
    <div><p>Environment variables:</p>
        <ul>
            <li>DISCORD_BOT_TOKEN</li>
        </ul>
    </div>
    <div>
        <p>Installment:</p>
        <ul>
            <li><code>pip install "discord-adapter[dev]~=5.0.0b0"</code></li>
        </ul>
    </div>
    <div>
        <p>To start setup, write the following command to terminal:</p>
        <ul><li><p><code>discord-adapter setup</code></p></li></ul>
    </div>
  </div>
</details>

<details>
  <summary>Google Email Adapter</summary>
  <div>
    <div><p>Environment variables:</p>
        <ul>
            <li>PROJECT_EMAIL_NAME</li>
            <li>PROJECT_EMAIL_ADDRESS</li>
            <li>PROJECT_EMAIL_PASSWORD</li>
            <li>SMTP_SERVER</li>
            <li>IMAP_SERVER</li>
        </ul>
    </div>
    <div>
        <p>Installment:</p>
        <ul>
            <li><code>pip install "email-adapter[dev]==5.0.0b0"</code></li>
        </ul>
    </div>
    <div>
        <p>To start setup, write the following command to terminal:</p>
        <ul><li><p><code>email-adapter setup</code></p></li></ul>
    </div>
  </div>
</details>

<details>
  <summary>Google Sheets Adapter</summary>
  <div>
    <div><p>Environment variables:</p>
        <ul>
            <li><a href="/docs/src/Technical%20documentation/Integration/gsheet-adapter#google-client-creds">GOOGLE_CLIENT_CREDENTIALS</a></li>
            <li><a href="/docs/src/Technical%20documentation/Integration/gsheet-adapter#google-spreadsheet-id">GOOGLE_SPREADSHEET_ID</a></li>
        </ul>
    </div>
    <div>
        <p>Installment:</p>
        <ul>
            <li><code>pip install "gsheets-adapter[dev]~=0.5.0"</code></li>
        </ul>
    </div>
    <div>
        <p>To start setup, write the following command to terminal:</p>
        <ul><li><p><code>gsheets-adapter setup</code></p></li></ul>
    </div>
  </div>
</details>

<details>
  <summary>Infobip Adapter</summary>
  <div>
    <div>This is the detailed content</div>
  </div>
</details>

<details>
  <summary>Mitems</summary>
  <div>
    <div>This is the detailed content</div>
  </div>
</details>

<details>
  <summary>Telegram Adapter</summary>
  <div>
    <div><p><b>Environment variables:</b></p>
        <ul>
            <li><a href="/docs/src/Technical%20documentation/Integration/telegram_adapter#tgrm-tkn">TELEGRAM_BOT_TOKEN</a></li>
        </ul>
    </div>
    <div>
        <p><b>Installment:</b></p>
        <ul>
            <li><code>pip install "telegram-adapter[dev]==5.0.0b0"</code></li>
        </ul>
    </div>
    <div>
        <p><b>Initialize setup:</b></p>
        <ul><li><p><code>telegram-adapter setup</code></p></li></ul>
    </div>
    <div>
        <p><b>Running the service:</b></p>
        <ul>
            <li>
                <p>Start with <code>forge init</code>, that should install every package and module that Telegram Adapter is using</p>
            </li>
            <li>
                <p>For running the service alone: <code>forge run-service telegram-adapter</code></p>
            </li>
            <li>
                <p>For running whole project: <code>forge run</code></p>
            </li>
        </ul>
    </div>
  </div>
</details>

