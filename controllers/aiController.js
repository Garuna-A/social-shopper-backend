const { APIPromise } = require('openai/index.js');
const convertToSearch = require('../aiSearch');
const searchEbayProducts = require('../ebaySearch');

const aiSearch = async(req,res)=>{
    try{
        const {prompt} = req.body;
        if(!prompt){
            return res.status(400).json({
                message:"Prompt is required"
            });
        }

        const aiResponse = await convertToSearch(prompt);
        console.log("AI Response: ",aiResponse);

        const ebayResults = await searchEbayProducts(aiResponse.keywords);
        res.json({
            generatedQuery: aiResponse,
            products: ebayResults
        });
    }
    catch(err){
        console.error(err);
        res.status(500).json({
            message:"AI Search failed"
        });
    }
};
module.exports = {
    aiSearch
};