const axios = require("axios");
const cheerio = require('cheerio');

const initRank = 1;

const G = [];
const nodes = new Set();
const lastRank = [];
const rank = [];

const webCrawler = async () => {

    const initilPage = "https://codeforces.com";
    const host = (new URL(initilPage)).host;
    console.log({host});

    

    const queueURL = [];
    
    queueURL.push(initilPage);
    nodes.add(initilPage);

    // const maxPage = 50;


    while(queueURL.length !== 0 ){
        const activeURL = queueURL.pop();

        console.log(activeURL)
        try {
            
        } catch (error) {
            
        }

        const htmlPage = await axios.get(activeURL);
        const $ = cheerio.load(htmlPage.data);   
        $("a").each((index,element) => {
            
            let neighbour;
            neighbour = $(element).attr("href");
            if(neighbour && neighbour.endsWith('/')){
                neighbour = neighbour.replace(/.$/,'');
            }
            if(neighbour && neighbour.startsWith('/')){
                neighbour = host + neighbour;
            }
            try {
                const neighHost = (new URL(neighbour)).host;
                if(neighHost === host){

                    if(!nodes.has(neighbour) ){
                        nodes.add(neighbour);
                        queueURL.push(neighbour);
                    }

                    if(!G[activeURL]){
                        G[activeURL]=new Set();
                    }
                    if(!G[activeURL].has(neighbour))   
                        G[activeURL].add(neighbour);   
                }
            } catch (error) {
                
            }

        }) 
    }

}

const dfs = (node, visited) => {
    

    visited[node]=1;

    if(!G[node])
        return;
    
    G[node].forEach( neigh => {
        if(!visited[neigh]){
            //console.log(lastRank[node]);
            dfs(neigh,visited);
        }
        rank[neigh] += lastRank[node]/G[node].size;
    })
}

const rankPage = () => {

    nodes.forEach(node => {
        rank[node]=initRank;
    })

    const iterations = 10;
    for(let i=0;i<iterations;i++){
        const visited = [];
        nodes.forEach(node => lastRank[node] = rank[node])
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

const main = async () => {
    await webCrawler();
    console.log("Termino el webbing");
    const ranking = rankPage().slice(0,10);
    console.log("RankPage")
    console.log(ranking)

    // nodes.forEach(node => {
    //     if(G[node] && !G[node].has("https://scrapeme.live")){
    //         console.log({node,edge:G[node]});
    //     }
    // })
}


main();