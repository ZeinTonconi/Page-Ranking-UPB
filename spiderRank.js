const axios = require("axios");
const cheerio = require('cheerio');


const d = 0.85;
const initRank = (1-d)


let G = [];
let nodes = new Set();
let lastRank = [];
let rank = [];

const ignore = [
    ".pdf", ".jpg", ".jpeg",".mp4",".mp3",".doc",".docx",".rar",".png",
    // "login", "register"
]

const init = () => {
    G = [];
    nodes = new Set();
    lastRank = [];
    rank = [];
}

const getURL = (url, host, protocol) => {

    if(!url){
        throw new Error("The tag <a></a> doesn't have href")
    }
    if (url.startsWith("http")) {
        return (new URL(url)).href;
    } else if (url.startsWith("/")) {
        return (new URL(`${protocol}//${host}${url}`)).href;
    } else {
        return (new URL(`${protocol}//${host}/${url}`)).href;
    }
}

const isFile = (url) => {
    const res = ignore.find((ext) => url.includes(ext));
    return res;
}

const webCrawler = async (start) => {

    const {protocol, host} = (new URL(start));
    

    const queueURL = [];
    
    queueURL.push(start);
    nodes.add(start);

    G[start] = new Set();

    //  const maxPage = 50;

    while(
        queueURL.length !== 0
        //  && nodes.size <= maxPage
        ){

        const activeURL = queueURL.pop();
        G[activeURL] = new Set();
        console.log(`Crawiling: ${activeURL}`)
        
        if(isFile(activeURL)){
            continue;
        }

        try {   
            const htmlPage = await axios.get(activeURL);
            const {data} = htmlPage;
            const $ = cheerio.load(data);   
            $("a").each((index,element) => {

                try {
                    // console.log($(element).attr());
                    const edgeURL = getURL($(element).attr("href"), host, protocol);

                    if((new URL(edgeURL)).host === host){
    
                        if(!nodes.has(edgeURL) ){
                            nodes.add(edgeURL);
                            queueURL.push(edgeURL);
                        }
    
                        if(!G[activeURL].has(edgeURL))   
                            G[activeURL].add(edgeURL);   
                    }  
                } catch (error) {
                    // console.log(error);
                }
                
                
            })  
        } catch (error) {
            // console.log(error);
            console.log(`No se pudo hacer GET a: ${activeURL}`)
        }

    }

}

const dfs = (node, visited) => {
    
    visited[node]=1;

    if(!G[node])
        return;
    
    G[node].forEach( edge => {
        if(!visited[edge]){
            dfs(edge, visited);
        }
        rank[edge] += d*(lastRank[node]/G[node].size);
    })
}

const rankPage = () => {

    nodes.forEach(node => {
        rank[node]=initRank;
    })

    const iterations = 10;
    for(let i=0;i<iterations;i++){
        const visited = [];
    
        nodes.forEach(node => {
            lastRank[node] = rank[node]
            rank[node]=initRank;
        })
    
        nodes.forEach(node => {
            if(!visited[node]){
                dfs(node,visited);
            }
        });
    }
    
    const ranking = [];
    
    nodes.forEach(node => {
        ranking.push({node,rank:rank[node]});
    })
    
    ranking.sort((pageA,pageB) => pageA.rank > pageB.rank? -1:0);
    
    return ranking;
}




const start = async (initPage) => {

    init();

    console.log(`Start crawling: ${initPage}`);
    try {
        await webCrawler(initPage); 
        console.log("Webing ended");
    } catch (error) {
        console.log("Asegurate que el link sea valido")    
    }
    
}

module.exports = {
    start,
    rankPage
}