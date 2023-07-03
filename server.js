
const readline = require('readline')
const {showMenu, showRanking} = require('./ui')
const {start, rankPage} = require('./spiderRank');


const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
});

const startSpider = async (initPage) => {
    await start(initPage);
    showRanking(rankPage().slice(0,10));
    menu(initPage);
}

const menu = (initPage="") => {
    showMenu(initPage);
    rl.question("Selecciona una opcion: ", async (option) => {

        switch (option) {
            case '1':
                rl.question("Ingrese el link: ",(link) => {
                    initPage = link;
                    menu(initPage)
                })
            break;
            
            case '2':
                startSpider(initPage);
            break;
            
            case "3":
                showRanking(rankPage().slice(0,10));
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
                menu(initPage);
            break;
        }

    })
}

const main =  () => {
    menu();
}


main();

module.exports = {
    menu
}