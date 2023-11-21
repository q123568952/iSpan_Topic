var express = require("express");
const puppeteer = require("puppeteer");
var cors = require("cors");
var app = express();

app.use(express.static("project1/pages"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

const mysql = require("mysql");
const { error, Console } = require("console");
const { resolve } = require("path");
const { rejects, ifError } = require("assert");
const { Resolver, resolve4 } = require("dns/promises");
const connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "root",
  database: "project1",
});
try {
  connection.connect((res) => {});
} catch (err) {
  console.log(err);
}

app.listen(8080);
console.log("Web伺服器就緒，開始接受用戶端連線.");
console.log("「Ctrl + C」可結束伺服器程式.");

// 通用模板
function asyncsql(sql, param) {
  return new Promise(function (res, rej) {
    connection.query(sql, param, function (err, rows) {
      if (err) {
        rej(err);
        return;
      }
      res(rows);
    });
  });
}

async function getStrockesList(targetName) {
  let flag = true;
  let strockesList = [];
  let name5E = [];

  async function getDraw(name) {
    try {
      const res = await asyncsql(
        "select draw, fiveelement from chinesewords where words like ?",
        ["%" + name + "%"]
      );
      if (res.length <= 0) {
        return "nodata";
      } else {
        draw = res[0].draw;
        tempName5E = res[0].fiveelement;
        result = {
          draw: draw,
          tempName5E: tempName5E,
        };
        return result;
      }
    } catch (err) {
      console.log(err);
    }
  }

  for (let i = 0; i < targetName.length; i++) {
    flag = false;
    let result = await getDraw(targetName[i]);
    if (result == undefined || result =="nodata") {
      flag = true;
      continue;
    }
    strockesList.push(result.draw);
    name5E.push(result.tempName5E);
  }

  if (flag) {
    return "error";
  }
  let nameInfo = {
    strockesList: strockesList,
    name5E: name5E,
  };
  return nameInfo;
}

async function get5EResult(sancai5E) {
  try {
    const res = await asyncsql(
      "select lucklevel, content from sancaidata where fiveelementcombination = ?",
      [sancai5E]
    );
    if (res.length <= 0) {
      return "nodata";
    } else {
      let name5EsLevel = res[0].lucklevel;
      let name5EsResult = res[0].content;
      let name5EsToClient = {
        name5EsLevel: name5EsLevel,
        name5EsResult: name5EsResult,
      };
      return name5EsToClient;
    }
  } catch (err) {
    console.log(err);
  }
}

function addColor(sancai5E) {
  let colorSancai5E = "";
  for (let i = 0; i < sancai5E.length; i++) {
    switch (sancai5E[i]) {
      case "金":
        colorSancai5E += "<span style='color:darkgoldenrod;'>金</span>";
        break;
      case "木":
        colorSancai5E += "<span style='color:darkgreen;'>木</span>";
        break;
      case "水":
        colorSancai5E += "<span style='color:blue;'>水</span>";
        break;
      case "火":
        colorSancai5E += "<span style='color:red;'>火</span>";
        break;
      case "土":
        colorSancai5E += "<span style='color:brown;'>土</span>";
        break;
      default:
        console.log("error");
        break;
    }
  }
  return colorSancai5E;
}
function getPara5E(temp, chinese5E) {
  let para5EList = temp.map((ele) => chinese5E[ele % 10]);
  return para5EList;
}
async function addParaScores(strockesList, chinese5E) {
  async function getparaScoresToClient(score) {
    try {
      let res = await asyncsql(
        "SELECT lucklevel,content FROM nameparameterscore WHERE draw = ?",
        [score]
      );
      if (res.length <= 0) {
        return "nodata";
      } else {
        let scoreLevel = res[0].lucklevel;
        let scoreResult = res[0].content;
        let result = {
          scoreLevel: scoreLevel,
          scoreResult: scoreResult,
        };
        return result;
      }
    } catch (err) {
      console.log(err);
    }
  }
  const paraScoresToClient = {};
  if (strockesList.length == 4) {
    // 天人地外總
    var paras = [];
    paras.push(parseInt(strockesList[0]) + parseInt(strockesList[1]));
    paras.push(parseInt(strockesList[1]) + parseInt(strockesList[2]));
    paras.push(parseInt(strockesList[2]) + parseInt(strockesList[3]));
    paras.push(parseInt(strockesList[3]) + 1);
    paras.push(
      parseInt(strockesList[0]) +
        parseInt(strockesList[1]) +
        parseInt(strockesList[2]) +
        parseInt(strockesList[3])
    );
    paraScoresToClient.paras = paras;
    let targetList = ["sky", "human", "ground", "out", "total"];
    for (let i = 0; i < paras.length; i++) {
      let result = await getparaScoresToClient(paras[i]);

      tempTargetLevel = targetList[i] + "ScoreLevel";
      tempTargetResult = targetList[i] + "ScoreResult";
      paraScoresToClient[tempTargetLevel] = result.scoreLevel;
      paraScoresToClient[tempTargetResult] = result.scoreResult;
    }
    paraScoresToClient.para5EList = getPara5E(paras, chinese5E);
  } else {
    // 天人地外總
    var paras = [];
    paras.push(parseInt(strockesList[0]) + 1);
    paras.push(parseInt(strockesList[0]) + parseInt(strockesList[1]));
    paras.push(parseInt(strockesList[1]) + parseInt(strockesList[2]));
    paras.push(parseInt(strockesList[2]) + 1);
    paras.push(
      parseInt(strockesList[0]) +
        parseInt(strockesList[1]) +
        parseInt(strockesList[2])
    );
    paraScoresToClient.paras = paras;
    let targetList = ["sky", "human", "ground", "out", "total"];
    for (let i = 0; i < paras.length; i++) {
      let result = await getparaScoresToClient(paras[i]);
      tempTargetLevel = targetList[i] + "ScoreLevel";
      tempTargetResult = targetList[i] + "ScoreResult";
      paraScoresToClient[tempTargetLevel] = result.scoreLevel;
      paraScoresToClient[tempTargetResult] = result.scoreResult;
    }
    paraScoresToClient.para5EList = getPara5E(paras, chinese5E);
  }
  paraScoresToClient.color5eList = paraScoresToClient.para5EList.map((ele) =>
    addColor(ele)
  );
  return paraScoresToClient;
}

async function getCombinations(strockes, chinese5E) {
  let skyPara = strockes + 1;
  let sky5E = chinese5E[skyPara % 10];
  let combinationsinfo = [];
  let res = await asyncsql(
    "select fiveelementcombination from sancaidata where (fiveelementcombination like ? and value >= 8)",
    [sky5E + "%"]
  );
  if (res.length <= 0) {
    return "nodata";
  } else {
    //  test
    for (let z = 0; z < res.length; z++) {
      let temp5ecombe = res[z].fiveelementcombination;
      for (
        let humanPara = strockes + 1;
        humanPara <= strockes + 26;
        humanPara++
      ) {
        let human5E = chinese5E[humanPara % 10];
        if (human5E == temp5ecombe[1]) {
          let midstrockes = humanPara - strockes;
          for (
            let groundPara = midstrockes + 1;
            groundPara <= midstrockes + 26;
            groundPara++
          ) {
            let ground5E = chinese5E[groundPara % 10];
            if (ground5E == temp5ecombe[2]) {
              let endstrockes = groundPara - midstrockes;
              let nameScore = await getNameScore(
                strockes,
                midstrockes,
                endstrockes
              );
              if (nameScore >= 80) {
                combinationsinfo.push({
                  sancaiKey: temp5ecombe,
                  value: nameScore,
                  top: strockes,
                  middle: midstrockes,
                  bottom: endstrockes,
                });
              }
            }
          }
        }
      }
    }
    combinationsinfo.sort(function (a, b) {
      return b.value - a.value;
    });
    let combinationsinfoList = [];
    for (let i = 0; i < combinationsinfo.length; i++) {
      let temp =
        combinationsinfo[i].sancaiKey +
        ": " +
        combinationsinfo[i].top +
        "," +
        combinationsinfo[i].middle +
        "," +
        combinationsinfo[i].bottom +
        " (分數" +
        combinationsinfo[i].value +
        "分)";
      combinationsinfoList.push(temp);
    }
    return combinationsinfoList;
  }
}
async function getNameScore(strockes, midstrockes, endstrockes) {
  let res = await asyncsql(
    "select value from nameparameterscore where draw in (?,?,?,?,?) ",
    [
      strockes + 1,
      strockes + midstrockes,
      midstrockes + endstrockes,
      endstrockes + 1,
      strockes + midstrockes + endstrockes
    ]
  );
  let nameScore =
    res
      .map((ele) => {
        return ele.value;
      })
      .reduce((x, y) => {
        return x + y;
      }) * 2;
  return nameScore;
}
async function getWord(zodiacId, strockesList) {
  async function cookData(rawdata) {
    if (rawdata.length <= 0) {
      return [];
    } else {
      return rawdata[0].words.split("");
    }
  }
  async function cooknormalData(rawdata, site) {
    if (rawdata.length <= 0) {
      return [];
    } else {
      let temp = {
      };
      rawdata.map((ele) => {
        switch (ele.fiveelement) {
          case "金":
            temp["gold" + site] = ele.words.split("");
            break;
          case "木":
            temp["tree" + site] = ele.words.split("");
            break;
          case "水":
            temp["water" + site] = ele.words.split("");
            break;
          case "火":
            temp["fire" + site] = ele.words.split("");
            break;
          case "土":
            temp["ground" + site] = ele.words.split("");
            break;
          default:
            break;
        }
      });
      if(temp["gold" + site]==undefined){temp["gold" + site]=[]};
      if(temp["tree" + site]==undefined){temp["tree" + site]=[]};
      if(temp["water" + site]==undefined){temp["water" + site]=[]};
      if(temp["fire" + site]==undefined){temp["fire" + site]=[]};
      if(temp["ground" + site]==undefined){temp["ground" + site]=[]};
      return temp;
    }
  }
  let betterMidWordList = await cookData(
    await asyncsql(
      "select words from zodiacword where (zodiac = ? and draw = ?) and preferences = 1 ",
      [zodiacId, strockesList[1]]
    )
  );
  let betterBotWordList = await cookData(
    await asyncsql(
      "select words from zodiacword where (zodiac = ? and draw = ?) and preferences = 1 ",
      [zodiacId, strockesList[2]]
    )
  );
  let badMidWordList = await cookData(
    await asyncsql(
      "select words from zodiacword where (zodiac = ? and draw = ?) and preferences = 0 ",
      [zodiacId, strockesList[1]]
    )
  );
  let badBotWordList = await cookData(
    await asyncsql(
      "select words from zodiacword where (zodiac = ? and draw = ?) and preferences = 0 ",
      [zodiacId, strockesList[2]]
    )
  );

  let normalMidWordList = await cooknormalData(
    await asyncsql(
      "select words, fiveelement from chinesewords where fiveelement in ('金','木','水','火','土') and draw = ?",
      [strockesList[1]]
    ),
    "Mid"
  );
  let normalBotWordList = await cooknormalData(
    await asyncsql(
      "select words, fiveelement from chinesewords where fiveelement in ('金','木','水','火','土') and draw = ?",
      [strockesList[2]]
    ),
    "Bot"
  );

  let betterMidRepeats = {
    //回傳重複字的INDEX清單!
    gold: (betterMGold = []),
    tree: (betterMTree = []),
    water: (betterMWater = []),
    fire: (betterMFire = []),
    ground: (betterMGround = []),
  };
  let betterBotRepeats = {
    //回傳重複字的INDEX清單!
    gold: (betterBGold = []),
    tree: (betterBTree = []),
    water: (betterBWater = []),
    fire: (betterBFire = []),
    ground: (betterBGround = []),
  };
  let badMidRepeats = {
    //回傳重複字的INDEX清單
    gold: (badMGold = []),
    tree: (badMTree = []),
    water: (badMWater = []),
    fire: (badMFire = []),
    ground: (badMGround = []),
  };
  let badBotRepeats = {
    //回傳重複字的INDEX清單
    gold: (badBGold = []),
    tree: (badBTree = []),
    water: (badBWater = []),
    fire: (badBFire = []),
    ground: (badBGround = []),
  };
  //重複字去除

  // test


  for (let z = normalMidWordList.goldMid.length - 1; z >= 0; z--) {
    if (
      betterMidWordList.indexOf(normalMidWordList.goldMid[z]) != -1 ||
      badMidWordList.indexOf(normalMidWordList.goldMid[z]) != -1
    ) {
      betterMidRepeats.gold.push(
        betterMidWordList.indexOf(normalMidWordList.goldMid[z])
      );
      badMidRepeats.gold.push(
        badMidWordList.indexOf(normalMidWordList.goldMid[z])
      );
      normalMidWordList.goldMid.splice(z, 1);
    }
  }
  for (let z = normalMidWordList.treeMid.length - 1; z >= 0; z--) {
    if (
      betterMidWordList.indexOf(normalMidWordList.treeMid[z]) != -1 ||
      badMidWordList.indexOf(normalMidWordList.treeMid[z]) != -1
    ) {
      betterMidRepeats.tree.push(
        betterMidWordList.indexOf(normalMidWordList.treeMid[z])
      );
      badMidRepeats.tree.push(
        badMidWordList.indexOf(normalMidWordList.treeMid[z])
      );
      normalMidWordList.treeMid.splice(z, 1);
    }
  }

  for (let z = normalMidWordList.waterMid.length - 1; z >= 0; z--) {
    if (
      betterMidWordList.indexOf(normalMidWordList.waterMid[z]) != -1 ||
      badMidWordList.indexOf(normalMidWordList.waterMid[z]) != -1
    ) {
      betterMidRepeats.water.push(
        betterMidWordList.indexOf(normalMidWordList.waterMid[z])
      );
      badMidRepeats.water.push(
        badMidWordList.indexOf(normalMidWordList.waterMid[z])
      );
      normalMidWordList.waterMid.splice(z, 1);
    }
  }

  for (let z = normalMidWordList.fireMid.length - 1; z >= 0; z--) {
    if (
      betterMidWordList.indexOf(normalMidWordList.fireMid[z]) != -1 ||
      badMidWordList.indexOf(normalMidWordList.fireMid[z]) != -1
    ) {
      betterMidRepeats.fire.push(
        betterMidWordList.indexOf(normalMidWordList.fireMid[z])
      );
      badMidRepeats.fire.push(
        badMidWordList.indexOf(normalMidWordList.fireMid[z])
      );
      normalMidWordList.fireMid.splice(z, 1);
    }
  }

  for (let z = normalMidWordList.groundMid.length - 1; z >= 0; z--) {
    if (
      betterMidWordList.indexOf(normalMidWordList.groundMid[z]) != -1 ||
      badMidWordList.indexOf(normalMidWordList.groundMid[z]) != -1
    ) {
      betterMidRepeats.ground.push(
        betterMidWordList.indexOf(normalMidWordList.groundMid[z])
      );
      badMidRepeats.ground.push(
        badMidWordList.indexOf(normalMidWordList.groundMid[z])
      );
      normalMidWordList.groundMid.splice(z, 1);
    }
  }

  //    名字二
  for (let z = normalBotWordList.goldBot.length - 1; z >= 0; z--) {
    if (
      betterBotWordList.indexOf(normalBotWordList.goldBot[z]) != -1 ||
      badBotWordList.indexOf(normalBotWordList.goldBot[z]) != -1
    ) {
      betterBotRepeats.gold.push(
        betterBotWordList.indexOf(normalBotWordList.goldBot[z])
      );
      badBotRepeats.gold.push(
        badBotWordList.indexOf(normalBotWordList.goldBot[z])
      );
      normalBotWordList.goldBot.splice(z, 1);
    }
  }
  for (let z = normalBotWordList.treeBot.length - 1; z >= 0; z--) {
    if (
      betterBotWordList.indexOf(normalBotWordList.treeBot[z]) != -1 ||
      badBotWordList.indexOf(normalBotWordList.treeBot[z]) != -1
    ) {
      betterBotRepeats.tree.push(
        betterBotWordList.indexOf(normalBotWordList.treeBot[z])
      );
      badBotRepeats.tree.push(
        badBotWordList.indexOf(normalBotWordList.treeBot[z])
      );
      normalBotWordList.treeBot.splice(z, 1);
    }
  }

  for (let z = normalBotWordList.waterBot.length - 1; z >= 0; z--) {
    if (
      betterBotWordList.indexOf(normalBotWordList.waterBot[z]) != -1 ||
      badBotWordList.indexOf(normalBotWordList.waterBot[z]) != -1
    ) {
      betterBotRepeats.water.push(
        betterBotWordList.indexOf(normalBotWordList.waterBot[z])
      );
      badBotRepeats.water.push(
        badBotWordList.indexOf(normalBotWordList.waterBot[z])
      );
      normalBotWordList.waterBot.splice(z, 1);
    }
  }

  for (let z = normalBotWordList.fireBot.length - 1; z >= 0; z--) {
    if (
      betterBotWordList.indexOf(normalBotWordList.fireBot[z]) != -1 ||
      badBotWordList.indexOf(normalBotWordList.fireBot[z]) != -1
    ) {
      betterBotRepeats.fire.push(
        betterBotWordList.indexOf(normalBotWordList.fireBot[z])
      );
      badBotRepeats.fire.push(
        badBotWordList.indexOf(normalBotWordList.fireBot[z])
      );
      normalBotWordList.fireBot.splice(z, 1);
    }
  }

  for (let z = normalBotWordList.groundBot.length - 1; z >= 0; z--) {
    if (
      betterBotWordList.indexOf(normalBotWordList.groundBot[z]) != -1 ||
      badBotWordList.indexOf(normalBotWordList.groundBot[z]) != -1
    ) {
      betterBotRepeats.ground.push(
        betterBotWordList.indexOf(normalBotWordList.groundBot[z])
      );
      badBotRepeats.ground.push(
        badBotWordList.indexOf(normalBotWordList.groundBot[z])
      );
      normalBotWordList.groundBot.splice(z, 1);
    }
  }

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
  let targetName = req.params.targetName;
  let nameInfo = await getStrockesList(targetName);
  if (
    nameInfo == "error" ||
    nameInfo.strockesList.length != targetName.length
  ) {
    res.send("error");
    return;
  }
  if (nameInfo.strockesList.length == 4) {
    let skyPara = nameInfo.strockesList[0] + nameInfo.strockesList[1];
    let humanPara = nameInfo.strockesList[1] + nameInfo.strockesList[2];
    let groundPara = nameInfo.strockesList[2] + nameInfo.strockesList[3];
    let sancai5E =
      chinese5E[skyPara % 10] +
      chinese5E[humanPara % 10] +
      chinese5E[groundPara % 10];
    colorSancai5E = addColor(sancai5E); //回傳給前端$("#name5Es").html(colorSancai5E);
    name5EsToClient = await get5EResult(sancai5E); //回傳給前端$("#name5EsLevel").text(sancai[sancaiKey[i]].text);$("#name5EsResult").text(sancai[sancaiKey[i]].content);
    paraScoresToClient = await addParaScores(nameInfo.strockesList, chinese5E); //回傳給前端
  } else {
    if (nameInfo.strockesList.length == 2) {
      nameInfo.strockesList.push("0");
    }
    let skyPara = nameInfo.strockesList[0] + 1;
    let humanPara = nameInfo.strockesList[0] + nameInfo.strockesList[1];
    let groundPara = nameInfo.strockesList[1] + nameInfo.strockesList[2];
    let sancai5E =
      chinese5E[skyPara % 10] +
      chinese5E[humanPara % 10] +
      chinese5E[groundPara % 10];
    colorSancai5E = addColor(sancai5E); //回傳給前端$("#name5Es").html(colorSancai5E);
    name5EsToClient = await get5EResult(sancai5E); //回傳給前端$("#name5EsLevel").text(sancai[sancaiKey[i]].text);$("#name5EsResult").text(sancai[sancaiKey[i]].content);
    paraScoresToClient = await addParaScores(nameInfo.strockesList, chinese5E); //回傳給前端
  }
  let result = {
    strockesList: nameInfo.strockesList,
    colorSancai5E: colorSancai5E,
    name5EsToClient: name5EsToClient,
    paraScoresToClient: paraScoresToClient,
  };
  res.send(result);
});

// 命名改名回應
//取得筆畫組合
app.get("/getcombinations/:lastName", async function (req, res) {
  let chinese5E = ["水", "木", "木", "火", "火", "土", "土", "金", "金", "水"];
  let lastName = req.params.lastName;
  let nameInfo = await getStrockesList(lastName);
  let strokes = nameInfo.strockesList[0];
  let combinationsinfoList = await getCombinations(strokes, chinese5E);

  let result = {
    nameInfo: nameInfo,
    strockes: strokes,
    lastName5E: nameInfo.name5E,
    combinationsinfoList: combinationsinfoList,
  };
  res.send(result);
});
app.get("/getwords/:infos", async function (req, res) {
  let chinese5E = ["水", "木", "木", "火", "火", "土", "土", "金", "金", "水"];
  let infos = req.params.infos;
  infos = infos.split(";");
  let zodiacId = infos[0];
  let combinationvalue = infos[1];
  combination = combinationvalue.split(" ");
  // 取出五行組合
  let fiveElement = combination[0].slice(0, 3);
  let name5EsToClient = await get5EResult(fiveElement);
  let temp = combination[1];
    let strockesList = temp.split(",");
  let paraScoresToClient = await addParaScores(strockesList, chinese5E);
  let top5EColor = addColor(infos[2]);
  let colorFiveElement = addColor(fiveElement);
  let wordList = await getWord(zodiacId, strockesList);

  let result = {
    colorFiveElement: colorFiveElement,
    name5EsToClient: name5EsToClient,
    top5EColor: top5EColor,
    strockesList: strockesList,
    combinationvalue: combinationvalue,
    paraScoresToClient: paraScoresToClient,
    wordList: wordList,
  };
  res.send(result);
});

// 網頁網址
app.get("/naming", function (req, res) {
  res.sendFile("./project1/pages/naming.html", { root: __dirname });
});
app.get("/namescore", function (req, res) {
  res.sendFile("./project1/pages/namescore.html", { root: __dirname });
});
app.get("/sendfiles", function (req, res) {
  res.sendFile("./project1/pages/小專.pptx", { root: __dirname });
});
app.get("/okok",function (req,res){
  res.send("https://drive.google.com/drive/folders/1UYBp_bP27ogMnM_nL8hf3EvKZZ6nW16L?usp=sharing");
});