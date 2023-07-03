const axios = require("axios");
const cheerio = require('cheerio');
const readline = require('readline')

const initRank = 1;

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
            dfs(edge,visited);
        }
        rank[edge] += lastRank[node]/G[node].size;
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

const showMenu = (link="") => {
    console.log("-----------------------------------------------------------------------------------------------------------");
    console.log("   ________     .__     /\\           _________      .__    .___          __________                __    ");
    console.log("  \\____    /____ |__| ___)/  ______  /   _____/_____ |__| __| _/__________\\______   \\_____    ____ |  | __");
    console.log("    /     // __ \\|  |/    \\ /  ___/  \\_____  \\\\____ \\|  |/ __ |/ __ \\_  __ \\       _/\\__  \\  /    \\|  |/ /");
    console.log("   /     /\\  ___/|  |   |  \\\\___ \\   /        \\  |_> >  / /_/ \\  ___/|  | \\/    |   \\ / __ \\|   |  \\    < ");
    console.log("  /_______ \\___  >__|___|  /____  > /_______  /   __/|__\\____ |\\___  >__|  |____|_  /(____  /___|  /__|_ \\");
    console.log("          \\/   \\/        \\/     \\/          \\/|__|           \\/    \\/             \\/      \\/     \\/     \\/");
    console.log("-----------------------------------------------------------------------------------------------------------");
    console.log("1. Ingresar link");
    console.log(`Link: ${link}`);
    console.log("2. Empezar Webcrawling")
    console.log("3. Mostrar Ranking")
    console.log("4. Salir")
}


const tableConfig = [ "Rank", "Link", "Puntaje"]

const showRanking = () => {
    const ranking = rankPage().slice(0,10);
    const rankingTable = ranking.map((link, index) => ({
        Rank: index+1,
        Link: link.node,
        Puntaje: link.rank
    }))
    console.table(rankingTable,tableConfig)
}

const start = async (initPage) => {

    init();

    console.log(`Start crawling: ${initPage}`);

    await webCrawler(initPage);
    console.log("Webing ended");

    showRanking();
    menu(initPage);
}


const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
});

const menu = (initPage="") => {
    showMenu(initPage);
    rl.question("Selecciona una opcion: ", (option) => {

        switch (option) {
            case '1':
                rl.question("Ingrese el link: ",(link) => {
                    initPage = link;
                    menu(initPage)
                })
            break;
            
            case '2':
                start(initPage);
            break;
            
            case "3":
                showRanking();
                rl.question("Presione Enter para continuar...", () => {
                    menu(initPage);
                })
            break

            case '4':
                console.log("Bye :3")
                rl.close();
            break;

            default:
                console.log("No ingresaste una opcion correcta")
            break;
        }

    })
}

const main =  () => {
    menu();

}


main();
