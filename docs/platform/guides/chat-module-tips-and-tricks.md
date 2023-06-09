---
sidebar_position: 10
---

# GPT chat module: Tips and Tricks

This is a living document where we add guidelines and best practices for using the chat functionalities of our agents. Keep in mind that prompt tuning and domain restriction are very experimental in nature. The guidelines below are more of a good starting point than a silver bullet.


Best practices have been (and still are) created based on our experiences and some external resources.
You are all encouraged to keep experimenting as we go along, and add new insights.

## Knowledge base

### How to use it

The knowledge base contains documents you want to include as custom knowledge for your agaent (e.g. knowledge about the company, the team etc). You can upload files (txt, pdf, docx, xlsx, pptx, csv, md) through the dashboard (drag and drop through `File upload`, then click `Submit`).

Once the models are uploaded, make sure to quickly check the extracted text by clicking on the file in `Knowledge base`.

You will also see several actions you can run for documents:
- `Add to knowledge base` - creates embeddings from the document, which can then be added as agent's knowledge in `My assistants`
- `Remove from knowledge base` - removes the embeddings so they are no longer used as knowledge, but keeps the file
- `Delete selected files` - removes the embeddings and the uploaded file


### Tips and tricks

Here are some tips on how to get better results when retrieving relevant knowledge:

###### 1. Separate "semantic units" inside the uploaded text with a new line.

The texts you upload are segmented based on paragraphs before creating embeddings. However, we need to limit the amount of text that goes into embeddings to make them usable. That's why paragraphs get "subsegmented", and if you want to make sure you keep the integrity of certain pieces of information, it would be best to separate it out into a new paragraph, for example:

```
John Smith is our Vice President. John is a marketing professional with 20 years of experience in developing marketing, recruitment, sales, and admissions strategies in higher education. He has a passion for marketing through data analytics.

John Smith can be contacted via email johnsmith@email.com or you can call him at 0049 69 154008-181.
```

###### 2. Make sure the relevant info is included in the segments.

Related to the point above, you need to make sure the "relevant entities" are mentioned in each segment you separate out. For example, if the segment containing the contact said "He can be contacted..." with no reference to the name, the model will not be able to answer the question "What's John's phone number?" if there are multiple male persons in your database.

That's why you should take care to include the relevant info the user might be asking about in the text chunk.


###### 3. Write full sentences.

The database is searched using normal text (i.e. the user's question). It will therefore give back best results if structured as text, and not bullet lists, tabular data etc. For example:
```
*bad example: bullet*

Link: https://mindsmiths.com

*good example: full sentence*

You can find more information at our website on the following link: https://mindsmiths.com

```

When it comes to tabular data (e.g. excel sheets), try to write our the data row by row, at least using the column headers:
```
*bad example: header and table row*

Product, Manufacturer and registration owner, Registration number, Registered use, Expiry date for sale, Expiry date for use, Active substances, Registered for crop, Waiting period
BORDOKA JUHA CAFFARO 20 WP, Gowan Crop Protection Limited, UP/I-320-20/04-01/155, 38176 - 45291, 45291, 45291, Copper compounds: Bordeaux mixture = 200 g/kg, Apple ( lat. Malus sylvestris),  Secured by the time of application for BORDOKA JUHA CAFFARO 20 WP


*good example: header included in the written-out row*

Manufacturer and registration owner for product BORDOKA JUHA CAFFARO 20 WP is company Gowan Crop Protection Limited. The registration number for BORDOKA JUHA CAFFARO 20 WP is UP/I-320-20/04-01/155.,BORDOKA JUHA CAFFARO 20 WP is registered for use between 38176 and 45291 and has expire date for sale 45291 and expiry date for use 45291.,BORDOKA JUHA CAFFARO 20 WP contains following active substances: Copper compounds: Bordeaux mixture = 200 g/kg.,BORDOKA JUHA CAFFARO 20 WP is registered for crop:Apple ( in latin is Malus sylvestris) .,Waiting period is Secured by the time of application for BORDOKA JUHA CAFFARO 20 WP.


```

That way you have what each column refers to in each row, and the format is more readable to the model trying to answer the question "What active substances does bordoka juha contain?"

Generally, it would also be good to separate the rows with newlines, to ensure the integrity of the data in each row.

:::note
Keep in mind that you can use GPT to generate varied short paragraphs for the tabular data, just specify the data and format you want, e.g.:
```
Please write a description for the following AirBnb Listing in english:
Name: {name}
Neighbourhood: {neighbourhood}
Neighbourhood Group: {neighbourhood_group}
Latitude: {latitude}
Longitude: {longitude}
Room Type: {room_type}
Price: {price}
Minimum Nights: {minimum_nights}
Number of Reviews: {number_of_reviews}
Last Review: {last_review}
Reviews per Month: {reviews_per_month}
Calculated Host Listings Count: {calculated_host_listings_count}
Availability_365: {availability_365}


Do not make up any information about the property in your description.
```
:::


###### 4. Texts retrieved from embeddings will bias your model output - use it to your advantage.

If you are creating the content from scratch, write it in a way that reflects your desired tone of voice. Again, GPT is your friend here.

The role of embeddings in shaping your model's response is very apparent for languages other than English - if you use high-quality texts in Croatian, your assistant's language will be ostensibly better when replying in Croatian.


###### 5. Last but not least: make sure the data you upload is relevant.

When creating a knowledge base, try to identify a fixed set of topics your assistant can talk about, and that you will cover thoroughly in your knowledge base. It is easier to extend the base as the need arises, instead of dealing with loads of missing information and edge cases. Formatting the documets also get easier once you have some pracitce handling smaller amounts of data, and getting them to work really well.

:::note
Keep in mind that the best embeddings in the world won't save you from the GPT model including made-up information in its responses. We aim to control this part in the next section on prompts. 
:::


## GPT Prompt

### How to use it

You can add a new assistant under `My Assistants`, by definig these basic elements:

- `Persona`: in this part, you tell the assistant who it is, who is it talking to, which organisation it's representing etc.
- `Instructions`: here you specify how the assistant should behave. Most often, you will instruct it to answer the user's question in some way, to stick to the context found in the knowlede base etc.

Both of these are used as prompts for the model. Always aim to reflect your desired tone of voice even in the words you choose for writing the persona and instruction prompts.

You can add the files you've uploaded to the assistant knowledge base by selecting them in `Knowledge base`. At each user question, the knowledge base is searched and paragraphs of texts relevant for the question are retrieved and added to the prompt as "Context".

Finally, you can switch to the `Configuration` tab to switch between LLMs you want to use to generate the answer, and tweak some basic parameters, such as response length (`max_tokens`) and creativity (tweaking either `temperature` or `top p`). The values are already set to decent defaults, so you don't need to tweak them unless you want to.


### Tips and tricks

###### 1. Keep things short and sweet.

There's no need to write extremely long prompts with tons of instructions for specific cases, as those might just confuse the model instead of helping it.

###### 2. Set the conversational conext for the model.

GPT models can be used for a wide variety of purposes. If you're using it for chatting with the users, it's useful to help the model out by telling it that.

Include something like "You are talking to the user {{ client.firstName }} over WhatsApp.", so the model would have a sense of roles inside the conversation, and the general messaging setting.

###### 3. Try using formulations "act as" for identity and "will-future" for instructions.

Instead of saying "You are Nola, an AI assistant.", try specifying the agent's identity by saying "Act as Nola, a digital persona designed by the startup Mindsmiths". Also, set the context for the model by writing in terms of what will happen: "When answering the user question, you will aim to personify the university's dedication to excellence, innovation, and creating a sense of community."

###### 4. Domain restriction - using the knowledge base.

Unfortunately, we don't have a fail-safe method for limiting the model to reply to factual questions strictly using the retrieved knowledge from the knowledge base. However, there are several methods you can use to incline the model to use the knowledge base data:

a. Restrict the topics the model should talk about, e.g. "You will only answer about topics related to whole life insurance, universal life insurance, premium financing, and the ARI Financial Group team." 

b. Tell the model explicitly to use only the retreived knowledge base data and info used in the prompt, e.g. "Summarize the context above to answer the user question. If the answer cannot be found in the context or information you have about the user, you will politely explain that you're not the best person to answer that."

Notice that we use "summarize" - this biases the model a bit more firmly to rely on the retrieved context, instead of generating a response regardless whether there is support for it in the embeddings or not.

:::note
GPT-4 seems to be much better at following instructions. So if it's very important for your assistant to adhere to the instruction to stick to the retrieved context, consider using GPT-4.
::: 

You can find many more instructions in the official OpenAI guidelines [here](https://platform.openai.com/docs/guides/gpt-best-practices).

## General advice: experiment!

This pipeline includes different models, each with their own strong and weak points. All in all, it's a lot of moving parts and no straightforward recipes.

When debugging the behaviour of your agent, it's useful to check both the prompt and the retrieved embeddings when it generates a response, to know which step of the process you to focus your efforts on.