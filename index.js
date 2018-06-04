let SteamCommunity = require('steamcommunity'),
    SteamUser = require('steam-user'),
    TradeOfferManager = require("steam-tradeoffer-manager"),
    CONFIG = require("./CONFIG/config.js"),
    Users = {},
    Fs = require("fs");

let client = new SteamUser(), 
    manager = new TradeOfferManager({
                  "steam": client,
                  "language": "en",
                  "pollInterval": "10000",
                  "camcelTime": "7200000"}),
    community = new SteamCommunity();

fs.readFile("./UserData/Users.json", (ERR, DATA) => {
    if(ERR)
    {
        console.log("## An error ocurred while getting Users: "+ERR);
    }
    else
    {
        Users = JSON.parse(DATA);
    }
});

//Coloca aqui Utils.getCardsInSets

function SaveUsers(Users)
{
    Fs.writeFile("./UserData/Users.json", JSON.stringify(Users), (ERR) => {
        if(ERR)
        {
            console.log("## An error occurred while writing UserData file: "+ERR);
        }
    });
}

setInterval(() => {
    for(let i = 0; i < Object.keys(Users).length; i++)
    {
        if(User[Object.keys(Users)[i]].idleforhours >= CONFIG.MAXHOURSADDED)
        {
            client.chatMessage(Object.keys(Users)[i], "Hi, you have been inactive on my friends list for too long. If you wish to use this bot again re-add it.");
            client.removeFriend(Object.keys(Users)[i]);
            delete Users[Object.keys(Users)[i]];
            SaveUsers(Users);
        }
        else
        {
          Users[Object.keys(Users)[i]].idleforhours += 1;
          SaveUsers(Users);
        }
    }
}, 3600000);
