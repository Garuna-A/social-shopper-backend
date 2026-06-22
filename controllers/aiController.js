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

        const groupedResults = [];
        for(const item of aiResponse.shoppingList){
            const products = await searchEbayProducts(item.query);
            groupedResults.push({
                category:item.name,
                products: products.slice(0,2).map(product =>({
                    id:product.id,
                    title:product.title,
                    price:parseFloat(product.price?.value||0),
                    image:product.image?.imageUrl||"",
                    url:product.itemWebUrl
                }))
            });
        }

        res.json({
            title: aiResponse.title,
            sections: groupedResults
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