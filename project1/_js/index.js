var chineseCharacters;
var lastName ;
var sancai;
var chinese5E = ["水", "木", "木", "火", "火", "土", "土", "金", "金", "水"];
var paraScroes;
var zodiacWords;
var lastName5E;

$(document).ready(async function () {
    // 取出三才資料
    sancai = await $.get("../data/Sancai.json")
    // 取出筆畫資訊
    chineseCharacters = await $.get("../data/ChineseCharacters.json")
    // 取出名字筆畫運氣
    paraScroes = await $.get("../data/EightyOne.json")
    $("#lastName").on("change", function () {
        $("#combinationsinfo").find("option").remove();
        $("#combinationsinfo").append("<option value=''>請選擇筆畫</option>");
        lastName = document.getElementById("lastName").value;
        // 取得chineseCharacters data
        let strockes = getStrockes(lastName);
        var combinationsinfo = getCombinations(strockes);
        combinationsinfo.sort(function (a, b) {
            return b.value - a.value;
        });
        showCombinationSelection(combinationsinfo);
        // 選單出現選擇
    });

    $("button[class^=zodiac]").on("click", async function () {
        let zodiacId = $(this).prop("id");
        if (lastName == "") {
            return
        }
        await $.get(`../data/${zodiacId}.json`, function (data) {
            zodiacWords = data;
        });
        let combinationvalue = $("#combinationsinfo").val();
        combination = combinationvalue.split(" ");
        // 取出五行組合
        let fiveElement = combination[0].slice(0, 3);
        let temp = combination[1];
        let strockesList = temp.split(",");
       
        getWord(zodiacWords, strockesList, paraScroes);
        get5EResult(fiveElement, sancai);
    })

})

function getStrockes(lastName) {
    let flag = true
    for (let i = 0; i < chineseCharacters.length; i++) {
        temp = chineseCharacters[i].chars.split("");
        // temp1變成chars array
        for (let k = 0; k < temp.length; k++) {
            if (temp[k] == lastName) {
                strokes = chineseCharacters[i].draw;
                lastName5E = chineseCharacters[i].fiveEle;
                flag = false;
                break;
            }

        }
    }
    if (flag) {
        strokes = -1
        $.toast("還調皮啊!!!")
    };
    return strokes;
};
function getCombinations(strokes) {
    var skyPara = strokes + 1;
    var sky5E = chinese5E[skyPara % 10];
    var combinationsinfo = []
    let sancaiKey = Object.keys(sancai);
    for (let i = 0; i < sancaiKey.length; i++) {

        if (sky5E == sancaiKey[i][0] && sancai[sancaiKey[i]].value >= 8) {
            for (let humanPara = strokes + 1; humanPara <= strokes + 26; humanPara++) {
                let human5E = chinese5E[humanPara % 10];
                if (human5E == sancaiKey[i][1]) {
                    let midStrokes = humanPara - strokes;
                    for (let groundPara = midStrokes + 1; groundPara <= midStrokes + 26; groundPara++) {
                        let ground5E = chinese5E[groundPara % 10];
                        if (ground5E == sancaiKey[i][2]) {
                            let endStrokes = groundPara - midStrokes;
                            let nameScore = getNameScore(strokes, midStrokes, endStrokes);
                            if (nameScore >= 80) {
                                combinationsinfo.push({
                                    "sancaiKey": sancaiKey[i],
                                    "value": nameScore,
                                    "top": strokes,
                                    "middle": midStrokes,
                                    "bottom": endStrokes
                                })
                            }
                        }
                    }
                }

            }

        }
    }
    return combinationsinfo;
}
function getNameScore(strokes, midStrokes, endStrokes) {
    if (paraScroes[strokes + 1 - 1] == undefined) {
        return;
    }
    var nameScore = paraScroes[strokes + 1 - 1].value;
    nameScore += paraScroes[strokes + midStrokes - 1].value;
    nameScore += paraScroes[midStrokes + endStrokes - 1].value;
    nameScore += paraScroes[endStrokes + 1 - 1].value;
    nameScore += paraScroes[strokes + midStrokes + endStrokes - 1].value;
    nameScore *= 2;
    return nameScore;
}
function showCombinationSelection(combinationsinfo) {
    for (let i = 0; i < combinationsinfo.length; i++) {
        temp = combinationsinfo[i].sancaiKey + ": " + combinationsinfo[i].top + "," + combinationsinfo[i].middle + "," + combinationsinfo[i].bottom + " (分數" + combinationsinfo[i].value + "分)";

        $("#combinationsinfo").append(`<option value='${temp}'>${temp}: </option>`);
    }

}
function getWord(zodiacWords, strockesList, paraScroes) {
    $("#goodMidWords").find("span").remove();
    $("#badMidWords").find("span").remove();
    $("#goodBotWords").find("span").remove();
    $("#badBotWords").find("span").remove();
    $("#normalMidWords div").find("span").remove();
    $("#normalBotWords div").find("span").remove();
    $("#skyScore").find("span").remove();
    $("#skyScore").find("br").remove();
    $("#humanScore").find("span").remove();
    $("#humanScore").find("br").remove();
    $("#groundScore").find("span").remove();
    $("#groundScore").find("br").remove();
    $("#outScore").find("span").remove();
    $("#outScore").find("br").remove();
    $("#totalScore").find("span").remove();
    $("#totalScore").find("br").remove();
    $("#topword").text(lastName);
    $("#topstrocks").text(strockesList[0]);
    $("#midstrocks").text(strockesList[1]);
    $("#laststrocks").text(strockesList[2]);
    // 上各格的評價
    addParaScores(paraScroes,strockesList);
    let betterKey = Object.keys(zodiacWords.better);
    let betterMidWordList=[];
    let betterBotWordList=[];
    for (let i = 0; i < betterKey.length; i++) {
        if ("_" + strockesList[1] == betterKey[i]) {
            x = "_" + strockesList[1]
            for (let i = 0; i < zodiacWords.better[x].length; i++) {
                $("#goodMidWords").append(`<span id="betterMidWord${i}"> ${zodiacWords.better[x][i]} </span>`);
                betterMidWordList.push(zodiacWords.better[x][i]);
            }
        }
        if ("_" + strockesList[2] == betterKey[i]) {
            x = "_" + strockesList[2]
            for (let i = 0; i < zodiacWords.better[x].length; i++) {
                $("#goodBotWords").append(`<span id="betterBotWord${i}"> ${zodiacWords.better[x][i]} </span>`);
                betterBotWordList.push(zodiacWords.better[x][i]);
            }
        }
    }
    let badKey = Object.keys(zodiacWords.worse);
    let badMidWordList = [];
    let badBotWordList = [];
    for (let i = 0; i < badKey.length; i++) {
        if ("_" + strockesList[1] == badKey[i]) {
            x = "_" + strockesList[1]
            for (let i = 0; i < zodiacWords.worse[x].length; i++) {
                $("#badMidWords").append(`<span id="badMidWord${i}"> ${zodiacWords.worse[x][i]} </span>`);
                badMidWordList.push(zodiacWords.worse[x][i]);
            }
        } if ("_" + strockesList[2] == badKey[i]) {
            x = "_" + strockesList[2]
            for (let i = 0; i < zodiacWords.worse[x].length; i++) {
                $("#badBotWords").append(`<span id="badBotWord${i}"> ${zodiacWords.worse[x][i]} </span>`);
                badBotWordList.push(zodiacWords.worse[x][i]);
            }
        }
    }
    for (let i = 0; i < chineseCharacters.length; i++) {
        if (strockesList[1] == chineseCharacters[i].draw) {
            let charList = chineseCharacters[i].chars.split("");
            switch (chineseCharacters[i].fiveEle) {
                case "金":
                    for (let z = 0; z < charList.length; z++) {
                        if(betterMidWordList.indexOf(charList[z]) != -1 || badMidWordList.indexOf(charList[z]) != -1){
                            $(`#betterMidWord${betterMidWordList.indexOf(charList[z])}`).css("color","darkgoldenrod");
                            $(`#badMidWord${badMidWordList.indexOf(charList[z])}`).css("color","darkgoldenrod");
                            continue;
                        }
                         $("#goldMid").append(`<span style='color:darkgoldenrod;'> ${charList[z]} </span>`)
                    }
                    break;
                case "木":
                    for (let z = 0; z < charList.length; z++) {
                        if(betterMidWordList.indexOf(charList[z]) != -1 || badMidWordList.indexOf(charList[z]) != -1){
                            $(`#betterMidWord${betterMidWordList.indexOf(charList[z])}`).css("color","darkgreen");
                            $(`#badMidWord${badMidWordList.indexOf(charList[z])}`).css("color","darkgreen");
                            continue;
                        }
                        $("#treeMid").append(`<span style='color:darkgreen;'> ${charList[z]} </span>`)
                    }
                    break;
                case "水":
                    for (let z = 0; z < charList.length; z++) {
                        if(betterMidWordList.indexOf(charList[z]) != -1 || badMidWordList.indexOf(charList[z]) != -1){
                            $(`#betterMidWord${betterMidWordList.indexOf(charList[z])}`).css("color","blue");
                            $(`#badMidWord${badMidWordList.indexOf(charList[z])}`).css("color","blue");

                            continue;
                        }
                        $("#waterMid").append(`<span style='color:blue;'> ${charList[z]} </span>`)
                    }
                    break;
                case "火":
                    for (let z = 0; z < charList.length; z++) {
                        if(betterMidWordList.indexOf(charList[z]) != -1 || badMidWordList.indexOf(charList[z]) != -1){
                            $(`#betterMidWord${betterMidWordList.indexOf(charList[z])}`).css("color","red");
                            $(`#badMidWord${badMidWordList.indexOf(charList[z])}`).css("color","red");
                            continue;
                        }
                        $("#fireMid").append(`<span style='color:red;'> ${charList[z]} </span>`)
                    }
                    break;
                case "土":
                    for (let z = 0; z < charList.length; z++) {
                        if(betterMidWordList.indexOf(charList[z]) != -1 || badMidWordList.indexOf(charList[z]) != -1){
                            $(`#betterMidWord${betterMidWordList.indexOf(charList[z])}`).css("color","brown");
                            $(`#badMidWord${badMidWordList.indexOf(charList[z])}`).css("color","brown");
                            continue;
                        }
                        $("#groundMid").append(`<span style='color:brown;'> ${charList[z]} </span>`)
                    }
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
                        if(betterBotWordList.indexOf(charList[z]) != -1 || badBotWordList.indexOf(charList[z]) != -1){
                            $(`#betterBotWord${betterBotWordList.indexOf(charList[z])}`).css("color","darkgoldenrod");
                            $(`#badBotWord${badBotWordList.indexOf(charList[z])}`).css("color","darkgoldenrod");
                            continue;
                        }
                        $("#goldBot").append(`<span style='color:darkgoldenrod;'> ${charList[z]} </span>`)
                    }
                    break;
                case "木":
                    for (let z = 0; z < charList.length; z++) {
                        if(betterBotWordList.indexOf(charList[z]) != -1 || badBotWordList.indexOf(charList[z]) != -1){
                            $(`#betterBotWord${betterBotWordList.indexOf(charList[z])}`).css("color","darkgreen");
                            $(`#badBotWord${badBotWordList.indexOf(charList[z])}`).css("color","darkgreen");
                            continue;
                        }
                        $("#treeBot").append(`<span style='color:darkgreen;'> ${charList[z]} </span>`)
                    }
                    break;
                case "水":
                    for (let z = 0; z < charList.length; z++) {
                        if(betterBotWordList.indexOf(charList[z]) != -1 || badBotWordList.indexOf(charList[z]) != -1){
                            $(`#betterBotWord${betterBotWordList.indexOf(charList[z])}`).css("color","blue");
                            $(`#badBotWord${badBotWordList.indexOf(charList[z])}`).css("color","blue");
                            continue;
                        }
                        $("#waterBot").append(`<span style='color:blue;'> ${charList[z]} </span>`)
                    }
                    break;
                case "火":
                    for (let z = 0; z < charList.length; z++) {
                        if(betterBotWordList.indexOf(charList[z]) != -1 || badBotWordList.indexOf(charList[z]) != -1){
                            $(`#betterBotWord${betterBotWordList.indexOf(charList[z])}`).css("color","red");
                            $(`#badBotWord${badBotWordList.indexOf(charList[z])}`).css("color","red");
                            continue;
                        }
                        $("#fireBot").append(`<span style='color:red;'> ${charList[z]} </span>`)
                    }
                    break;
                case "土":
                    for (let z = 0; z < charList.length; z++) {
                        if(betterBotWordList.indexOf(charList[z]) != -1 || badBotWordList.indexOf(charList[z]) != -1){
                            $(`#betterBotWord${betterBotWordList.indexOf(charList[z])}`).css("color","brown");
                            $(`#badBotWord${badBotWordList.indexOf(charList[z])}`).css("color","brown");
                            continue;
                        }
                        $("#groundBot").append(`<span style='color:brown;'> ${charList[z]} </span>`)
                    }
                    break;
                default:
                    console.log("error")
                    break;

            }
        }
    }
}
function get5EResult(fiveElement, sancai) {
    let sancaiKey = Object.keys(sancai);
    let colorFiveElement = addColor(fiveElement);
    $("#name5Es").html(colorFiveElement);
    for (let i = 0; i < sancaiKey.length; i++) {
        if (fiveElement == sancaiKey[i]) {
            $("#name5EsLevel").text(sancai[sancaiKey[i]].text);
            $("#name5EsResult").text(sancai[sancaiKey[i]].content);
        }

    }
}
function addColor(fiveElement) {
    let colorFiveElement="";
    for (let i = 0; i < fiveElement.length; i++) {
       switch (fiveElement[i]) {
        case "金":
           colorFiveElement += "<span style='color:darkgoldenrod;'>金</span>" 
            break;
        case "木":
            colorFiveElement += "<span style='color:darkgreen;'>木</span>"
            break;
            case "水":
            colorFiveElement += "<span style='color:blue;'>水</span>"
            break;
            case "火":
            colorFiveElement += "<span style='color:red;'>火</span>"
            break;
            case "土":
            colorFiveElement += "<span style='color:brown;'>土</span>"
            break;
        default:
            console.log("error")
            break;
    }  
    }
    return colorFiveElement;
}
function addParaScores(paraScroes,strockesList){
    $("#humanScoreLevel").text(paraScroes[parseInt(strockesList[0]) + parseInt(strockesList[1]) - 1].text)
    $("#humanScoreResult").text(paraScroes[parseInt(strockesList[0]) + parseInt(strockesList[1]) - 1].content)
    $("#groundScoreLevel").text(paraScroes[parseInt(strockesList[1]) + parseInt(strockesList[2]) - 1].text)
    $("#groundScoreResult").text(paraScroes[parseInt(strockesList[1]) + parseInt(strockesList[2]) - 1].content)
    $("#skyScoreLevel").text(paraScroes[parseInt(strockesList[0]) + 1 - 1].text)
    $("#skyScoreResult").text(paraScroes[parseInt(strockesList[0]) + 1 - 1].content)
    $("#outScoreLevel").text(paraScroes[parseInt(strockesList[2]) + 1 - 1].text)
    $("#outScoreResult").text(paraScroes[parseInt(strockesList[2]) + 1 - 1].content)
    $("#totalScoreLevel").text(paraScroes[parseInt(strockesList[0]) + parseInt(strockesList[1]) + parseInt(strockesList[2]) - 1].text)
    $("#totalScoreResult").text(paraScroes[parseInt(strockesList[0]) + parseInt(strockesList[1]) + parseInt(strockesList[2]) - 1].content)
    // 天人地外總
    let temp = [];
    temp.push(parseInt(strockesList[0]) + 1);
    temp.push(parseInt(strockesList[0]) + parseInt(strockesList[1]));
    temp.push(parseInt(strockesList[1]) + parseInt(strockesList[2]));
    temp.push(parseInt(strockesList[2]) + 1);
    temp.push(parseInt(strockesList[0]) + parseInt(strockesList[1]) + parseInt(strockesList[2]));
    let para5EList = getPara5E(temp);
    let color5eList =[]
    for (let i = 0; i < para5EList.length; i++) {
        let temp = addColor(para5EList[i]);
        color5eList.push(temp);
    };
    let top5EColor = addColor(lastName5E);

    $("#tableTop5E").html(`${lastName}(${top5EColor})<br>`);
    $("#tableTopStrocks").text(`${strockesList[0]}`);
    $("#tableMidStrocks").text(`${strockesList[1]}`);
    $("#tableBotStrocks").text(`${strockesList[2]}`);
    $("#skyScore").append(`${color5eList[0]}<br>
    <span>筆劃: </span><span>${temp[0]}</span>`);
    $("#tableSkyScore").html(`${color5eList[0]}`);
    
    $("#humanScore").append(`${color5eList[1]}<br>
    <span>筆劃: </span><span>${temp[1]}</span>`);
    $("#tableHumanScore").html(`${color5eList[1]}`);
    
    $("#groundScore").append(`${color5eList[2]}<br>
    <span>筆劃: </span><span>${temp[2]}</span>`);
    $("#tableGroundScore").html(`${color5eList[2]}`);
    
    $("#outScore").append(`${color5eList[3]}<br>
    <span>筆劃: </span><span>${temp[3]}</span>`);
    $("#tableOutScore").html(`${color5eList[3]}`);
    
    $("#totalScore").append(`${color5eList[4]}<br>
    <span>筆劃: </span><span>${temp[4]}</span>`);
    $("#tableTotalScore").html(`${color5eList[4]}`);
}
function getPara5E(temp){
    let para5EList = [];
    for (let i = 0; i < temp.length; i++) {
        para5EList.push(chinese5E[temp[i]%10])
    }
    return para5EList;
   
}
