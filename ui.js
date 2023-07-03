
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

const showRanking = (ranking) => {
    const rankingTable = ranking.map((link, index) => ({
        Rank: index+1,
        Link: link.node,
        Puntaje: link.rank
    }))
    console.table(rankingTable,tableConfig)
}

module.exports = {
    showMenu,
    showRanking
}