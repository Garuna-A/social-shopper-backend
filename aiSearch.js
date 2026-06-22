require("dotenv").config();
const { response } = require("express");
const OpenAi = require("openai");

const client = new OpenAi({
    apiKey:process.env.GROQ_API_KEY,
    baseURL:"https://api.groq.com/openai/v1"
});

async function convertToSearch(userinput) {
    const completion = await client.chat.completions.create({
        model:"llama-3.3-70b-versatile",
        response_format:{
            type:"json_object"
        },
        messages:[
            {
                role:"system",
                content:
                `You are an AI shopping planner.

                Given a user's request, generate a shopping checklist.

                Return ONLY valid JSON.

                {
                "title":"",
                "shoppingList":[
                    {
                    "name":"",
                    "query":""
                    }
                ]
                }

                Rules:

                - Return 3-6 shopping items.
                - Each item should represent a different product category.
                - Queries should be concise and optimized for eBay.
                - Do not repeat similar items.
                - Think like an experienced shopping assistant.

                Example

                User:
                Winter trip to North Pole

                Output:

                {
                "title":"Winter Essentials",
                "shoppingList":[
                {"name":"Winter Jacket","query":"winter jacket"},
                {"name":"Snow Boots","query":"snow boots"},
                {"name":"Thermal Gloves","query":"thermal gloves"},
                {"name":"Thermal Socks","query":"thermal socks"},
                {"name":"Wool Scarf","query":"wool scarf"}
                ]
                }`
            },
            {
                role:"user",
                content:userinput
            }
        ],
        temperature:0.2
    });
    return JSON.parse(completion.choices[0].message.content);
}
module.exports = convertToSearch;