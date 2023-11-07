var express = require("express");
var cors = require("cors");
var app = express();

app.use( express.static("project1/pages")  );
app.use( express.json() );
app.use( express.urlencoded( {extended: true}) );
app.use(cors());

var fs = require("fs");
const mysql = require('mysql');
const { error, Console } = require("console");
const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'root',
  database: 'project1'
})
connection.connect();

app.listen(3000);
console.log("Web伺服器就緒，開始接受用戶端連線.");
console.log("「Ctrl + C」可結束伺服器程式.");

 async function getStrockesList(targetName) {
    let flag = true;
    let strockesList = [];
    let name5E = [];
    async function getDraw(name){
        let promise1 = new Promise(function (good,bad){
            connection.query(
                "select draw, fiveelement from chinesewords where words like ?",
                ["%"+name+"%"],
                function(err,rows){
                   if (rows.length<=0){
                        bad("nodata");
                        return;
                    }
                    if (err){
                        bad(err);
                        return;
                    }
                    draw = rows[0].draw;
                    tempName5E = rows[0].fiveelement;
                    result={
                        draw: draw,
                        tempName5E:tempName5E
                    }
                    good(result);
                }
                )
            })
            result = await promise1.catch(
                function (err) {
                }
            );
            return result;
    }
    
     for  (let i = 0; i < targetName.length; i++) {
		flag =false;
        result = await getDraw(targetName[i])
        if (result == undefined) {
            flag =true;
            continue;
        }
        strockesList.push(result.draw);
        name5E.push(result.tempName5E);
         
    }
    
    if (flag) {
        return "error";
    };
	let nameInfo = {
        strockesList: strockesList,
        name5E: name5E
    }
    return nameInfo;
}
async function get5EResult(sancai5E) {
    async function getName5Es(sancai5E){
        let promise1 = new Promise(function (good,bad) {
            connection.query(
                "select lucklevel, content from sancaidata where fiveelementcombination = ?",
                [sancai5E],
                function (err, rows) {
                    if (rows.length<=0){
                        bad("nodata");
                        return;
                    };
                    if (err){
                        bad(err);
                        return;
                    };
                    let name5EsLevel =rows[0].lucklevel;
                    let name5EsResult = rows[0].content;
                    let name5EsToClient ={
                        name5EsLevel:name5EsLevel,
                        name5EsResult:name5EsResult
                    }
                    good(name5EsToClient);
                })
            })
            let name5EsToClient = await promise1.catch(
                function (err) {
                }
            );
            return name5EsToClient;
    }
    let name5EsToClient = await getName5Es(sancai5E);
    return name5EsToClient;
}
function addColor(sancai5E) {
    let colorSancai5E = "";
    for (let i = 0; i < sancai5E.length; i++) {
        switch (sancai5E[i]) {
            case "金":
                colorSancai5E += "<span style='color:darkgoldenrod;'>金</span>"
                break;
            case "木":
                colorSancai5E += "<span style='color:darkgreen;'>木</span>"
                break;
            case "水":
                colorSancai5E += "<span style='color:blue;'>水</span>"
                break;
            case "火":
                colorSancai5E += "<span style='color:red;'>火</span>"
                break;
            case "土":
                colorSancai5E += "<span style='color:brown;'>土</span>"
                break;
            default:
                console.log("error")
                break;
        }
    }
    return colorSancai5E;
}
function getPara5E(temp,chinese5E) {
    let para5EList = [];
    for (let i = 0; i < temp.length; i++) {
        para5EList.push(chinese5E[temp[i] % 10])
    }
    return para5EList;

}
async function addParaScores(strockesList, chinese5E) {
    async function getparaScoresToClient(score){
        let promise1 = new Promise(function(good,bad){
            connection.query(
                "SELECT lucklevel,content FROM nameparameterscore WHERE draw = ?",
                [score],
                function (err, rows){
                    if (rows.length<=0){
                        bad("nodata");
                        return;
                    };
                    if (err){
                        bad(err);
                        return;
                    };
                    let scoreLevel =rows[0].lucklevel;
                    let scoreResult = rows[0].content;
                    let result ={
                        scoreLevel:scoreLevel,
                        scoreResult:scoreResult
                    }
                    good(result);
                }
            )
        })
        let result = await promise1.catch(
            function (err) {})
        return result;
    }
    let paraScoresToClient={
		skyScoreLevel:"",
		skyScoreResult:"",
		humanScoreLevel:"",
		humanScoreResult:"",
		groundScoreLevel:"",
		groundScoreResult:"",
		outScoreLevel:"",
		outScoreResult:"",
		totalScoreLevel:"",
		totalScoreResult:"",
        para5EList:"",
        color5eList:"",
        paras:""
	};
    if (strockesList.length == 4) {
        // 天人地外總
        var paras = [];
        paras.push(parseInt(strockesList[0]) + parseInt(strockesList[1]));
        paras.push(parseInt(strockesList[1]) + parseInt(strockesList[2]));
        paras.push(parseInt(strockesList[2]) + parseInt(strockesList[3]));
        paras.push(parseInt(strockesList[3]) + 1);
        paras.push(parseInt(strockesList[0]) + parseInt(strockesList[1]) + parseInt(strockesList[2]) + parseInt(strockesList[3]));
        paraScoresToClient.paras = paras;
        let targetList = ["sky","human","ground", "out", "total"];
        for (let i = 0; i < paras.length; i++) {
            let result = await getparaScoresToClient(paras[i]);
            tempTargetLevel = targetList[i]+"ScoreLevel";
            tempTargetResult = targetList[i]+"ScoreResult";
            paraScoresToClient[tempTargetLevel]=result.scoreLevel;
            paraScoresToClient[tempTargetLevel]=result.scoreResult; 
        }
        paraScoresToClient.para5EList = getPara5E(paras, chinese5E);
    } else {
// 天人地外總
        var paras = [];
        paras.push(parseInt(strockesList[0]) + 1);
        paras.push(parseInt(strockesList[0]) + parseInt(strockesList[1]));
        paras.push(parseInt(strockesList[1]) + parseInt(strockesList[2]));
        paras.push(parseInt(strockesList[2]) + 1);
        paras.push(parseInt(strockesList[0]) + parseInt(strockesList[1]) + parseInt(strockesList[2]));
        paraScoresToClient.paras = paras;
        let targetList = ["sky","human","ground", "out", "total"];
        for (let i = 0; i < paras.length; i++) {
            let result = await getparaScoresToClient(paras[i]);
            tempTargetLevel = targetList[i]+"ScoreLevel";
            tempTargetResult = targetList[i]+"ScoreResult";
            paraScoresToClient[tempTargetLevel]=result.scoreLevel;
            paraScoresToClient[tempTargetLevel]=result.scoreResult; 
        }
        paraScoresToClient.para5EList = getPara5E(paras, chinese5E);
    }
    let color5eList = []
    for (let i = 0; i < paraScoresToClient.para5EList.length; i++) {
        let temp = addColor(paraScoresToClient.para5EList[i]);
        color5eList.push(temp);
    };
    paraScoresToClient.color5eList = color5eList;
    return paraScoresToClient;
}
function getCombinations(strockes,sancai,paraScroes,chinese5E){
    let skyPara = strockes + 1;
    let sky5E = chinese5E[skyPara % 10];
    let combinationsinfo = []
    let sancaiKey = Object.keys(sancai);
    for (let i = 0; i < sancaiKey.length; i++) {
        if (sky5E == sancaiKey[i][0] && sancai[sancaiKey[i]].value >= 8) {
            for (let humanPara = strockes + 1; humanPara <= strockes + 26; humanPara++) {
                let human5E = chinese5E[humanPara % 10];
                if (human5E == sancaiKey[i][1]) {
                    let midstrockes = humanPara - strockes;
                    for (let groundPara = midstrockes + 1; groundPara <= midstrockes + 26; groundPara++) {
                        let ground5E = chinese5E[groundPara % 10];
                        if (ground5E == sancaiKey[i][2]) {
                            let endstrockes = groundPara - midstrockes;
                            let nameScore = getNameScore(strockes, midstrockes, endstrockes,paraScroes);
                            if (nameScore >= 80) {
                                combinationsinfo.push({
                                    "sancaiKey": sancaiKey[i],
                                    "value": nameScore,
                                    "top": strockes,
                                    "middle": midstrockes,
                                    "bottom": endstrockes
                                })
                                
                            }
                        }
                    }
                }

            }

        }
    }
    combinationsinfo.sort(function (a, b) {
        return b.value - a.value;
    });
    let combinationsinfoList=[]
    for (let i = 0; i < combinationsinfo.length; i++) {
        let temp = combinationsinfo[i].sancaiKey + ": " + combinationsinfo[i].top + "," + combinationsinfo[i].middle + "," + combinationsinfo[i].bottom + " (分數" + combinationsinfo[i].value + "分)";
        combinationsinfoList.push(temp);
    }
    return combinationsinfoList;
}
function getNameScore(strockes, midstrockes, endstrockes, paraScroes) {
    if (paraScroes[strockes + 1 - 1] == undefined) {
        return;
    }
    let nameScore = paraScroes[strockes + 1 - 1].value;
    nameScore += paraScroes[strockes + midstrockes - 1].value;
    nameScore += paraScroes[midstrockes + endstrockes - 1].value;
    nameScore += paraScroes[endstrockes + 1 - 1].value;
    nameScore += paraScroes[strockes + midstrockes + endstrockes - 1].value;
    nameScore *= 2;
    return nameScore;
}
function getWord(zodiacWords, strockesList, chineseCharacters) {
    let betterKey = Object.keys(zodiacWords.better);
    let betterMidWordList = []; //回傳!
    let betterMidRepeats={ //回傳重複字的INDEX清單!
            gold: betterMGold=[],
            tree: betterMTree=[],
            water: betterMWater=[],
            fire: betterMFire=[],
            ground: betterMGround=[]
        };
    let betterBotWordList = []; //回傳!
    let betterBotRepeats={ //回傳重複字的INDEX清單!
        gold: betterBGold=[],
        tree: betterBTree=[],
        water: betterBWater=[],
        fire: betterBFire=[],
        ground: betterBGround=[]
    };
    for (let i = 0; i < betterKey.length; i++) {
        if ("_" + strockesList[1] == betterKey[i]) {
            x = "_" + strockesList[1]
            for (let i = 0; i < zodiacWords.better[x].length; i++) {
                betterMidWordList.push(zodiacWords.better[x][i]);
            }
        }
        if ("_" + strockesList[2] == betterKey[i]) {
            x = "_" + strockesList[2]
            for (let i = 0; i < zodiacWords.better[x].length; i++) {
                betterBotWordList.push(zodiacWords.better[x][i]);
            }
        }
    };
    let badKey = Object.keys(zodiacWords.worse);
    let badMidWordList = []; //回傳
    let badMidRepeats={ //回傳重複字的INDEX清單
        gold: badMGold=[],
        tree: badMTree=[],
        water: badMWater=[],
        fire: badMFire=[],
        ground: badMGround=[]
    };
    let badBotWordList = []; //回傳
    let badBotRepeats={ //回傳重複字的INDEX清單
        gold: badBGold=[],
        tree: badBTree=[],
        water: badBWater=[],
        fire: badBFire=[],
        ground: badBGround=[]
    };
    for (let i = 0; i < badKey.length; i++) {
        if ("_" + strockesList[1] == badKey[i]) {
            x = "_" + strockesList[1]
            for (let i = 0; i < zodiacWords.worse[x].length; i++) {
                badMidWordList.push(zodiacWords.worse[x][i]);
            }
        } if ("_" + strockesList[2] == badKey[i]) {
            x = "_" + strockesList[2]
            for (let i = 0; i < zodiacWords.worse[x].length; i++) {
                badBotWordList.push(zodiacWords.worse[x][i]);
            }
        }
    };
    let normalMidWordList={//回傳
        goldMid: goldMid =[],
        treeMid: treeMid =[],
        waterMid: waterMid =[],
        fireMid: fireMid =[],
        groundMid: groundMid =[]
    };
    let normalBotWordList={//回傳
        goldBot: goldBot =[],
        treeBot: treeBot =[],
        waterBot: waterBot =[],
        fireBot: fireBot =[],
        groundBot: groundBot =[]
    };
    for (let i = 0; i < chineseCharacters.length; i++) {
        if (strockesList[1] == chineseCharacters[i].draw) {
            let charList = chineseCharacters[i].chars.split("");
            switch (chineseCharacters[i].fiveEle) {
                case "金":
                    for (let z = 0; z < charList.length; z++) {
                        if (betterMidWordList.indexOf(charList[z]) != -1 || badMidWordList.indexOf(charList[z]) != -1) {
                            betterMidRepeats.gold.push(betterMidWordList.indexOf(charList[z]));
                            badMidRepeats.gold.push(badMidWordList.indexOf(charList[z]));
                            continue;
                        }
                        normalMidWordList.goldMid.push(charList[z]);
                    }
                    break;
                case "木":
                    for (let z = 0; z < charList.length; z++) {
                        if (betterMidWordList.indexOf(charList[z]) != -1 || badMidWordList.indexOf(charList[z]) != -1) {
                            betterMidRepeats.tree.push(betterMidWordList.indexOf(charList[z]));
                            badMidRepeats.tree.push(badMidWordList.indexOf(charList[z]));
                            continue;
                        }
                        normalMidWordList.treeMid.push(charList[z]);                    }
                    break;
                case "水":
                    for (let z = 0; z < charList.length; z++) {
                        if (betterMidWordList.indexOf(charList[z]) != -1 || badMidWordList.indexOf(charList[z]) != -1) {
                            betterMidRepeats.water.push(betterMidWordList.indexOf(charList[z]));
                            badMidRepeats.water.push(badMidWordList.indexOf(charList[z]));
                            continue;
                        }
                        normalMidWordList.waterMid.push(charList[z]);                     }
                    break;
                case "火":
                    for (let z = 0; z < charList.length; z++) {
                        if (betterMidWordList.indexOf(charList[z]) != -1 || badMidWordList.indexOf(charList[z]) != -1) {
                            betterMidRepeats.fire.push(betterMidWordList.indexOf(charList[z]));
                            badMidRepeats.fire.push(badMidWordList.indexOf(charList[z]));
                            continue;
                        }
                        normalMidWordList.fireMid.push(charList[z]);                     }
                    break;
                case "土":
                    for (let z = 0; z < charList.length; z++) {
                        if (betterMidWordList.indexOf(charList[z]) != -1 || badMidWordList.indexOf(charList[z]) != -1) {
                            betterMidRepeats.ground.push(betterMidWordList.indexOf(charList[z]));
                            badMidRepeats.ground.push(badMidWordList.indexOf(charList[z]));
                            continue;
                        }
                        normalMidWordList.groundMid.push(charList[z]);                     }
                    break;
                default:
                    console.log("error")
                    break;

            }
        };
        if (strockesList[2] == chineseCharacters[i].draw) {
            let charList = chineseCharacters[i].chars.split("");
            switch (chineseCharacters[i].fiveEle) {
                case "金":
                    for (let z = 0; z < charList.length; z++) {
                        if (betterBotWordList.indexOf(charList[z]) != -1 || badBotWordList.indexOf(charList[z]) != -1) {
                            betterBotRepeats.gold.push(betterBotWordList.indexOf(charList[z]));
                            badBotRepeats.gold.push(badBotWordList.indexOf(charList[z]));
                            continue;
                        }
                        normalBotWordList.goldBot.push(charList[z]);
                    }
                    break;
                case "木":
                    for (let z = 0; z < charList.length; z++) {
                        if (betterBotWordList.indexOf(charList[z]) != -1 || badBotWordList.indexOf(charList[z]) != -1) {
                            betterBotRepeats.tree.push(betterBotWordList.indexOf(charList[z]));
                            badBotRepeats.tree.push(badBotWordList.indexOf(charList[z]));
                            continue;
                        }
                        normalBotWordList.treeBot.push(charList[z]);
                    }
                    break;
                case "水":
                    for (let z = 0; z < charList.length; z++) {
                        if (betterBotWordList.indexOf(charList[z]) != -1 || badBotWordList.indexOf(charList[z]) != -1) {
                            betterBotRepeats.water.push(betterBotWordList.indexOf(charList[z]));
                            badBotRepeats.water.push(badBotWordList.indexOf(charList[z]));
                            continue;
                        }
                        normalBotWordList.waterBot.push(charList[z]);
                    }
                    break;
                case "火":
                    for (let z = 0; z < charList.length; z++) {
                        if (betterBotWordList.indexOf(charList[z]) != -1 || badBotWordList.indexOf(charList[z]) != -1) {
                            betterBotRepeats.fire.push(betterBotWordList.indexOf(charList[z]));
                            badBotRepeats.fire.push(badBotWordList.indexOf(charList[z]));
                            continue;
                        }
                        normalBotWordList.fireBot.push(charList[z]);
                    }
                    break;
                case "土":
                    for (let z = 0; z < charList.length; z++) {
                        if (betterBotWordList.indexOf(charList[z]) != -1 || badBotWordList.indexOf(charList[z]) != -1) {
                            betterBotRepeats.ground.push(betterBotWordList.indexOf(charList[z]));
                            badBotRepeats.ground.push(badBotWordList.indexOf(charList[z]));
                            continue;
                        }
                        normalBotWordList.groundBot.push(charList[z]);
                    }
                    break;
                default:
                    console.log("error")
                    break;

            }
        }
    };
    let wordList = {
        betterMidWordList: betterMidWordList,
        betterMidRepeats: betterMidRepeats,
        betterBotWordList: betterBotWordList,
        betterBotRepeats: betterBotRepeats,
        badMidWordList: badMidWordList,
        badMidRepeats: badMidRepeats,
        badBotWordList: badBotWordList,
        badBotRepeats: badBotRepeats,
        normalMidWordList: normalMidWordList,
        normalBotWordList: normalBotWordList,
    };
    return wordList;
}

// 回應程式區
// 姓名分析回應
app.get("/getresult/:targetName", async function (req, res) {
	let chinese5E = ["水", "木", "木", "火", "火", "土", "土", "金", "金", "水"];
	let colorSancai5E;
    let name5EsToClient;
    let paraScoresToClient;
	let targetName =req.params.targetName;
	let nameInfo = await getStrockesList(targetName);
	if (nameInfo == "error" || nameInfo.strockesList.length != targetName.length){
            res.send("error");
            return;
        };
    if (nameInfo.strockesList.length == 4) {
		let skyPara = nameInfo.strockesList[0] + nameInfo.strockesList[1];
		let humanPara = nameInfo.strockesList[1] + nameInfo.strockesList[2];
		let groundPara = nameInfo.strockesList[2] + nameInfo.strockesList[3];
		let sancai5E = chinese5E[skyPara % 10] + chinese5E[humanPara % 10] + chinese5E[groundPara % 10]
		 colorSancai5E = addColor(sancai5E); //回傳給前端$("#name5Es").html(colorSancai5E);
         name5EsToClient = await get5EResult(sancai5E); //回傳給前端$("#name5EsLevel").text(sancai[sancaiKey[i]].text);$("#name5EsResult").text(sancai[sancaiKey[i]].content);
		 paraScoresToClient = await addParaScores(nameInfo.strockesList, chinese5E);//回傳給前端
	} else {
		if (nameInfo.strockesList.length == 2) {
			nameInfo.strockesList.push("0");
		}
		let skyPara = nameInfo.strockesList[0] + 1;
		let humanPara = nameInfo.strockesList[0] + nameInfo.strockesList[1];
		let groundPara = nameInfo.strockesList[1] + nameInfo.strockesList[2];
		let sancai5E = chinese5E[skyPara % 10] + chinese5E[humanPara % 10] + chinese5E[groundPara % 10]
         colorSancai5E = addColor(sancai5E); //回傳給前端$("#name5Es").html(colorSancai5E);
		 name5EsToClient = await get5EResult(sancai5E); //回傳給前端$("#name5EsLevel").text(sancai[sancaiKey[i]].text);$("#name5EsResult").text(sancai[sancaiKey[i]].content);
		 paraScoresToClient = await addParaScores(nameInfo.strockesList, chinese5E);//回傳給前端
	}
    let result = {
        strockesList: nameInfo.strockesList,
        colorSancai5E: colorSancai5E,
        name5EsToClient: name5EsToClient,
        paraScoresToClient: paraScoresToClient
    }
    res.send(result);
});

// 命名改名回應
//取得筆畫組合
app.get("/getcombinations/:lastName",function (req, res) {
    let chinese5E = ["水", "木", "木", "火", "火", "土", "土", "金", "金", "水"];
    let data = fs.readFileSync("./project1/pages/data/ChineseCharacters.json");
	let chineseCharacters = JSON.parse(data);
    let sancai = require("./project1/pages/data/Sancai.json");
	let paraScroes = require("./project1/pages/data/EightyOne.json");
    let lastName =req.params.lastName;
    let nameInfo = getStrockesList(lastName,chineseCharacters);
    let strokes = nameInfo.strockesList[0];
    let combinationsinfoList = getCombinations(strokes,sancai,paraScroes,chinese5E);
    
    let result = {
        nameInfo: nameInfo,
        strockes: strokes,
        lastName5E: nameInfo.name5E,
        combinationsinfoList: combinationsinfoList
    }
    res.send(result);
});
app.get("/getwords/:infos",function (req, res) {
    let chinese5E = ["水", "木", "木", "火", "火", "土", "土", "金", "金", "水"];
    let infos =req.params.infos;
    infos = infos.split(";");
    let zodiacId = infos[0];
    let combinationvalue =infos[1]
    let data = fs.readFileSync("./project1/pages/data/ChineseCharacters.json");
	let chineseCharacters = JSON.parse(data);
    let zodiacWords = require(`./project1/pages/data/${zodiacId}.json`);
    let paraScroes = require("./project1/pages/data/EightyOne.json");
    let sancai = require("./project1/pages/data/Sancai.json");

    combination = combinationvalue.split(" ");
        // 取出五行組合
    let fiveElement = combination[0].slice(0, 3);
    let name5EsToClient = get5EResult(fiveElement, sancai);
    let temp = combination[1];
    let strockesList = temp.split(",");
    let paraScoresToClient = addParaScores(paraScroes,strockesList,chinese5E);
    let top5EColor = addColor(infos[2]);
    let colorFiveElement = addColor(fiveElement);
    let wordList = getWord(zodiacWords,strockesList, chineseCharacters);
    
    let result = {
        colorFiveElement: colorFiveElement,
        name5EsToClient: name5EsToClient,
        top5EColor: top5EColor,
        strockesList:strockesList,
        zodiacWords: zodiacWords,
        combinationvalue: combinationvalue,
        paraScoresToClient: paraScoresToClient,
        wordList: wordList
    }
    res.send(result);
});

// 網頁網址
app.get("/naming", function (req,res) {
    res.sendFile("C:/Users/Tang/Desktop/Ispan_class/小專/project1_plus/project1/pages/naming.html");
});
app.get("/namescore", function (req,res) {
    res.sendFile("C:/Users/Tang/Desktop/Ispan_class/小專/project1_plus/project1/pages/namescore.html");
});


//老師資料
// app.get("/todo/item/:id", function (req, res) {
// 	var data = fs.readFileSync("./pages/data/ChineseCharacters.json");
// 	var todoList = JSON.parse(data);

// 	var targetIndex = -1;
// 	for (let i = 0; i < todoList.length; i++) {
// 		if (todoList[i].todoTableId.toString() == req.params.id.toString()) {
// 			targetIndex = i;
// 			break;
// 		}
// 	}
//     if ( targetIndex < 0 ) {
//         res.send("not found");
//         return;
//     }

// 	res.set('Content-Type', 'application/json');
//     res.send( JSON.stringify(todoList[targetIndex]) );
// })

// app.post("/todo/create", function (req, res) {
// 	var data = fs.readFileSync(dataFileName);
// 	var todoList = JSON.parse(data);
// 	var item = {
// 		"todoTableId": new Date().getTime(),
// 		"title": req.body.title,
// 		"isComplete": req.body.isComplete
// 	};
// 	todoList.push(item);
// 	fs.writeFileSync("./data.json", JSON.stringify(todoList, null, "\t"));
// 	res.send("row inserted.");
// })

// app.put("/todo/item", function (req, res) {
// 	var data = fs.readFileSync(dataFileName);
// 	var todoList = JSON.parse(data);
// 	for (let i = 0; i < todoList.length; i++) {
// 		if (todoList[i].todoTableId == req.body.todoTableId) {
// 			todoList[i].title = req.body.title;
// 			todoList[i].isComplete = req.body.isComplete;
// 			break;
// 		}
// 	}
// 	fs.writeFileSync("./data.json", JSON.stringify(todoList, null, "\t"));	
// 	res.send("row updated."); 
// })

// app.delete("/todo/delete/:id", function (req, res) {
// 	var data = fs.readFileSync(dataFileName);
// 	var todoList = JSON.parse(data);

// 	var deleteIndex = -1;
// 	for (let i = 0; i < todoList.length; i++) {
// 		if (todoList[i].todoTableId.toString() == req.params.id.toString()) {
// 			deleteIndex = i;
// 			break;
// 		}
// 	}
//     if ( deleteIndex < 0 ) {
//         res.send("not found");
//         return;
//     }

//     todoList.splice(deleteIndex, 1);
//     fs.writeFileSync("./data.json", JSON.stringify(todoList, null, "\t"));	
//     res.send("row deleted.");
// })

// test database connecttion
// app.get("/lab1", function (req,res){
// 	connection.query('show databases', (err, rows, fields) => {
// 		if (err) throw err
// 		res.set('Content-type', 'application/json');
// 		res.send( JSON.stringify(rows) );
// 	  })
// })

// 插資料進入資料庫

// 插入生肖字
// app.get("/lab2", function (req,res){
// 	var zodiacList=["1_mouse","2_cow","3_tiger","4_rabbit","5_dragon","6_snake","7_horse","8_sheep","9_monkey","10_chicken","11_dog","12_pig"]
// 	var chineseZodiacList=["鼠","牛","虎","兔","龍","蛇","馬","羊","猴","雞","狗","豬"]
// 	for (let z = 0; z < zodiacList.length; z++) {
// 		var data = require(`./pages/data/${zodiacList[z]}.json`);
// 	var tempBetterWorkObject = data.better;
// 	var wordBetterkeys = Object.keys(data.better);
// 	var wordworsekeys = Object.keys(data.worse);
// 	var tempWorseWorkObject = data.worse;

// 	for (let i = 0; i < wordBetterkeys.length; i++) {
// 		let wordList = tempBetterWorkObject[wordBetterkeys[i]]//文字的array
// 		let draws = wordBetterkeys[i];
// 		draws = draws.replace("_","");
// 		draws = parseInt(draws);//轉int
// 		let words = "";
// 		for (let d = 0; d < wordList.length; d++) {
// 			words+=wordList[d]//把文字array轉字串
// 		}
// 		connection.query(`insert into zodiacword(draw, preferences, words, zodiac) values (${draws}, 1, "${words}", "${chineseZodiacList[z]}")`, (err, rows, fields) => {
// 			if (err) throw err
// 		  })
// 	};
// 	for (let i = 0; i < wordworsekeys.length; i++) {
// 		let wordList = tempWorseWorkObject[wordworsekeys[i]]
// 		let draws = wordworsekeys[i];
// 		draws = draws.replace("_","");
// 		draws = parseInt(draws);
// 		let words = "";
// 		for (let d = 0; d < wordList.length; d++) {
// 			words+=wordList[d]
// 		}
// 		connection.query(`insert into zodiacword(draw, preferences, words, zodiac) values (${draws}, 0, "${words}", "${chineseZodiacList[z]}")`, (err, rows, fields) => {
// 			if (err) throw err
// 		  })
// 	};
		
// 	}
	
// 	res.send("good");
// })

// 插入五行中文字
// app.get("/lab3", function (req,res){
	
// 	var data =fs.readFileSync(`./pages/data/ChineseCharacters.json`);
// 	var tempObject = JSON.parse(data);
// 	for (let i = 0; i < tempObject.length; i++) {
// 		let draw = tempObject[i].draw; //int
// 		let fiveElement = tempObject[i].fiveEle; //string
// 		let words = tempObject[i].chars; //int
// 		connection.query(`insert into chinesewords(draw, fiveelement, words) values (${draw}, '${fiveElement}', '${words}')`,(err, rows, fields) => {
// 			if (err) throw err;
			
// 		  })
// 	}


// 		res.send()
// 	}
	
// )

// 插入個格筆畫評分
// app.get("/lab4", function (req,res){
// 	var data =require(`./pages/data/EightyOne.json`);
// 	var tempObject = data;
// 	for (let i = 0; i < tempObject.length; i++) {
// 		let draw = tempObject[i].draw; //int
// 		let content = tempObject[i].content; //string
// 		let value = tempObject[i].value; //int
// 		let lucklevel = tempObject[i].text; //string
// 		connection.query(`insert into nameparameterscore(draw, content, value,lucklevel) values (${draw}, '${content}', ${value}, '${lucklevel}')`,(err, rows, fields) => {
// 			if (err) throw err;
			
// 		  })
// 	}


// 		res.send("good");
// 	}
	
// )

// 插入三才資料
// app.get("/lab5", function (req,res){
// 	var data = require(`./pages/data/Sancai.json`);
// 	var sancaikeys = Object.keys(data);
// 	for (let i = 0; i < sancaikeys.length; i++) {
// 		let fiveelementcombination =sancaikeys[i];
// 		let content = data[sancaikeys[i]].content;
// 		let lucklevel = data[sancaikeys[i]].text;
// 		 let value = data[sancaikeys[i]].value;
		
// 		connection.query(`insert into sancaidata(fiveelementcombination , content, lucklevel, value) values ('${fiveelementcombination}', '${content}', '${lucklevel}', ${value})`, (err, rows, fields) => {
// 			if (err) throw err
// 		  })
// 	};	
// 	res.send("good");
// })