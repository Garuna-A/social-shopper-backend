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
                `You are an AI shopping assistant.

                Convert the user's request into an optimized eBay search.

                Return ONLY valid JSON.

                {
                "keywords":"",
                "maxPrice":"",
                "category":""
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