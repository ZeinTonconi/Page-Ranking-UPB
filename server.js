const axios = require("axios");
const cheerio = require('cheerio');



const main = async () => {
    // Link to visit
    const htmlPage = await axios.get("https://scrapeme.live/shop/")
    const $ = cheerio.load(htmlPage.data)    
    // Busca todos los elementos de la clase page-numbers y que sean a
    // Aqui se pone que elemento quiero buscar con selectores de CSS
    $(".page-numbers a").each((index, element) => {
        const paginationURL = $(element).attr("href");
        //console.log(paginationURL);
    })
    // retrieving the product URLs 
    $("li.product a.woocommerce-LoopProduct-link").each((index, element) => { 
        const productURL = $(element).attr("href") 
        //console.log(productURL)
    })

     $("a").each((index, element) => { 
        const productURL = $(element).attr("href") 
        console.log(productURL)
    })

}
main();