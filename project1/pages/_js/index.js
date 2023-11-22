var lastName = document.getElementById("lastName").value;
var name5E;

$(document).ready(async function () {
    $("#lastName").on("change", async function () {
        $("#combinationsinfo").find("option").remove();
        $("#combinationsinfo").append("<option value=''>請選擇筆畫</option>");
        lastName = document.getElementById("lastName").value;
        if (lastName.length <=0||lastName.length>=2||lastName ==" ") {
            $.toast("還調皮啊!!!")
            return;
        };
        let result = await $.get(`/getcombinations/${lastName}`);
        if (result == "error") {
            $.toast("還調皮啊!!!")
            return;
        };
        name5E = result.lastName5E;
        let combinationsinfo = result.combinationsinfoList;
        combinationsinfo.map((ele)=>{$("#combinationsinfo").append(`<option value='${ele}'>${ele}: </option>`);})
    });

    $("button[class^=zodiac]").on("click", async function () {
        let zodiacId = $(this).prop("id");
        $("button[class^=zodiac]").removeClass("btn-outline-dark");
        $(this).addClass("btn-outline-dark");
        if (lastName.length <=0||lastName.length>=2|| lastName == " ") {
            $.toast("還調皮啊!!!")
            return;
        };
        let combinationvalue = $("#combinationsinfo").val();
        if (combinationvalue.length<=0) {
            $.toast("選個組合吧!")
            return;
        }
        let result = await $.get(`/getwords/${zodiacId};${combinationvalue};${name5E}`);
        cleanData();
       
        $("#topword").text(lastName);
        $("#topstrocks").text(result.strockesList[0]);
        $("#midstrocks").text(result.strockesList[1]);
        $("#laststrocks").text(result.strockesList[2]);
        putGoodBadWords(result);
        addGoodBadWordsColor(result);
        addNormalMidWords(result);
        addNormalBotWords(result);
        addParaResult(result);
        // 土 rgb(165, 42, 42) 水 rgb(0, 0, 255)  火rgb(255, 0, 0) 金rgb(184, 134, 11) 木rgb(79, 209, 56)
       $("span[id^=betterMidWord]").sort(function(a, b){
            let atemp=0;
            let btemp=0;
               
            switch (a.style.color) {
                case "darkgoldenrod":
                    atemp = 1
                    break;
                case "rgb(79, 209, 56)":
                    atemp = 2
                    break;
                case "blue":
                    atemp = 3
                    break;
                case "red":
                    atemp = 4
                    break;
                case "brown":
                    atemp = 5
                    break;
                default:
                    break;
            };
            switch (b.style.color) {
                case "darkgoldenrod":
                    btemp = 1
                    break;
                case "rgb(79, 209, 56)":
                    btemp = 2
                    break;
                case "blue":
                    btemp = 3
                    break;
                case "red":
                    btemp = 4
                    break;
                case "brown":
                    btemp = 5
                    break;
                default:
                    break;
            };
    
           if(atemp<btemp){
            return -1;
           } 
            if(atemp>btemp){
            return 1;
           }
            return 0;
        }).appendTo("#goodMidWords");

       $("span[id^=badMidWord]").sort(function(a, b){
            let atemp=0;
            let btemp=0;
               
            switch (a.style.color) {
                case "darkgoldenrod":
                    atemp = 1
                    break;
                case "rgb(79, 209, 56)":
                    atemp = 2
                    break;
                case "blue":
                    atemp = 3
                    break;
                case "red":
                    atemp = 4
                    break;
                case "brown":
                    atemp = 5
                    break;
                default:
                    break;
            };
            switch (b.style.color) {
                case "darkgoldenrod":
                    btemp = 1
                    break;
                case "rgb(79, 209, 56)":
                    btemp = 2
                    break;
                case "blue":
                    btemp = 3
                    break;
                case "red":
                    btemp = 4
                    break;
                case "brown":
                    btemp = 5
                    break;
                default:
                    break;
            };
    
           if(atemp<btemp){
            return -1;
           } 
            if(atemp>btemp){
            return 1;
           }
            return 0;
        }).appendTo("#badMidWords");

       $("span[id^=betterBotWord]").sort(function(a, b){
            let atemp=0;
            let btemp=0;
               
            switch (a.style.color) {
                case "darkgoldenrod":
                    atemp = 1
                    break;
                case "rgb(79, 209, 56)":
                    atemp = 2
                    break;
                case "blue":
                    atemp = 3
                    break;
                case "red":
                    atemp = 4
                    break;
                case "brown":
                    atemp = 5
                    break;
                default:
                    break;
            };
            switch (b.style.color) {
                case "darkgoldenrod":
                    btemp = 1
                    break;
                case "rgb(79, 209, 56)":
                    btemp = 2
                    break;
                case "blue":
                    btemp = 3
                    break;
                case "red":
                    btemp = 4
                    break;
                case "brown":
                    btemp = 5
                    break;
                default:
                    break;
            };
    
           if(atemp<btemp){
            return -1;
           } 
            if(atemp>btemp){
            return 1;
           }
            return 0;
        }).appendTo("#goodBotWords");
       $("span[id^=badBotWord]").sort(function(a, b){
            let atemp=0;
            let btemp=0;
               
            switch (a.style.color) {
                case "darkgoldenrod":
                    atemp = 1
                    break;
                case "rgb(79, 209, 56)":
                    atemp = 2
                    break;
                case "blue":
                    atemp = 3
                    break;
                case "red":
                    atemp = 4
                    break;
                case "brown":
                    atemp = 5
                    break;
                default:
                    break;
            };
            switch (b.style.color) {
                case "darkgoldenrod":
                    btemp = 1
                    break;
                case "rgb(79, 209, 56)":
                    btemp = 2
                    break;
                case "blue":
                    btemp = 3
                    break;
                case "red":
                    btemp = 4
                    break;
                case "brown":
                    btemp = 5
                    break;
                default:
                    break;
            };
    
           if(atemp<btemp){
            return -1;
           } 
            if(atemp>btemp){
            return 1;
           }
            return 0;
        }).appendTo("#badBotWords");
        
     
        
    })

})
function addParaResult(result){
    $("#skyScoreLevel").text(result.paraScoresToClient.skyScoreLevel);
    $("#skyScoreResult").text(result.paraScoresToClient.skyScoreResult);
    $("#humanScoreLevel").text(result.paraScoresToClient.humanScoreLevel);
    $("#humanScoreResult").text(result.paraScoresToClient.humanScoreResult);
    $("#groundScoreLevel").text(result.paraScoresToClient.groundScoreLevel);
    $("#groundScoreResult").text(result.paraScoresToClient.groundScoreResult);
    $("#outScoreLevel").text(result.paraScoresToClient.outScoreLevel);
    $("#outScoreResult").text(result.paraScoresToClient.outScoreResult);
    $("#totalScoreLevel").text(result.paraScoresToClient.totalScoreLevel);
    $("#totalScoreResult").text(result.paraScoresToClient.totalScoreResult);
    $("#tableTop5E").html(`${lastName}(${result.top5EColor})<br>`);
    $("#tableTopStrocks").text(`${result.strockesList[0]}`);
    $("#tableMidStrocks").text(`${result.strockesList[1]}`);
    $("#tableBotStrocks").text(`${result.strockesList[2]}`);
    $("#skyScore").append(`${result.paraScoresToClient.color5eList[0]}<br>
    <span>筆劃: </span><span>${result.paraScoresToClient.paras[0]}</span>`);
    $("#tableSkyScore").html(`${result.paraScoresToClient.color5eList[0]}`);
    $("#humanScore").append(`${result.paraScoresToClient.color5eList[1]}<br>
    <span>筆劃: </span><span>${result.paraScoresToClient.paras[1]}</span>`);
    $("#tableHumanScore").html(`${result.paraScoresToClient.color5eList[1]}`);
    $("#groundScore").append(`${result.paraScoresToClient.color5eList[2]}<br>
    <span>筆劃: </span><span>${result.paraScoresToClient.paras[2]}</span>`);
    $("#tableGroundScore").html(`${result.paraScoresToClient.color5eList[2]}`);
    $("#outScore").append(`${result.paraScoresToClient.color5eList[3]}<br>
    <span>筆劃: </span><span>${result.paraScoresToClient.paras[3]}</span>`);
    $("#tableOutScore").html(`${result.paraScoresToClient.color5eList[3]}`);
    $("#totalScore").append(`${result.paraScoresToClient.color5eList[4]}<br>
    <span>筆劃: </span><span>${result.paraScoresToClient.paras[4]}</span>`);
    $("#tableTotalScore").html(`${result.paraScoresToClient.color5eList[4]}`);
    
    $("#name5Es").html(result.colorFiveElement);
    $("#name5EsLevel").text(result.name5EsToClient.name5EsLevel);
    $("#name5EsResult").text(result.name5EsToClient.name5EsResult);

};
function cleanData() {
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
};
function addNormalMidWords(result) {
    result.wordList.normalMidWordList[0].map((ele)=>{$("#goldMid").append(`<span class="h2" style='color:darkgoldenrod;'> ${ele} </span>`)});
    result.wordList.normalMidWordList[1].map((ele)=>{$("#treeMid").append(`<span class="h2" style='color:rgb(79, 209, 56);'> ${ele} </span>`)});
    result.wordList.normalMidWordList[2].map((ele)=>{$("#waterMid").append(`<span class="h2" style='color:blue;'> ${ele} </span>`)});
    result.wordList.normalMidWordList[3].map((ele)=>{$("#fireMid").append(`<span class="h2"  style='color:red;'> ${ele} </span>`)});
    result.wordList.normalMidWordList[4].map((ele)=>{$("#groundMid").append(`<span class="h2" style='color:brown;'> ${ele} </span>`)});
};
function addNormalBotWords(result) {
    result.wordList.normalBotWordList[0].map((ele)=>{$("#goldBot").append(`<span class="h2" style='color:darkgoldenrod;'> ${ele} </span>`)});
    result.wordList.normalBotWordList[1].map((ele)=>{$("#treeBot").append(`<span class="h2" style='color:rgb(79, 209, 56);'> ${ele} </span>`)});
    result.wordList.normalBotWordList[2].map((ele)=>{$("#waterBot").append(`<span class="h2" style='color:blue;'> ${ele} </span>`)});
    result.wordList.normalBotWordList[3].map((ele)=>{$("#fireBot").append(`<span class="h2"  style='color:red;'> ${ele} </span>`)});
    result.wordList.normalBotWordList[4].map((ele)=>{$("#groundBot").append(`<span class="h2" style='color:brown;'> ${ele} </span>`)});
};

function putGoodBadWords(result) {
    result.wordList.betterMidWordList.map((ele, i)=>{$("#goodMidWords").append(`<span class="h2" id="betterMidWord${i}"> ${ele} </span>`)});
    result.wordList.badMidWordList.map((ele, i)=>{$("#badMidWords").append(`<span class="h2" id="badMidWord${i}"> ${ele} </span>`)});
    result.wordList.betterBotWordList.map((ele, i)=>{$("#goodBotWords").append(`<span class="h2" id="betterBotWord${i}"> ${ele} </span>`)});
    result.wordList.badBotWordList.map((ele, i)=>{$("#badBotWords").append(`<span class="h2" id="badBotWord${i}"> ${ele} </span>`)});
};
function addGoodBadWordsColor(result) {
    //名一好字上色
    result.wordList.betterMidRepeats.gold.map((ele)=>{$(`#betterMidWord${ele}`).css("color", "darkgoldenrod");});
    result.wordList.betterMidRepeats.tree.map((ele)=>{$(`#betterMidWord${ele}`).css("color", "rgb(79, 209, 56)");});
    result.wordList.betterMidRepeats.water.map((ele)=>{$(`#betterMidWord${ele}`).css("color", "blue");});
    result.wordList.betterMidRepeats.fire.map((ele)=>{$(`#betterMidWord${ele}`).css("color", "red");});
    result.wordList.betterMidRepeats.ground.map((ele)=>{$(`#betterMidWord${ele}`).css("color", "brown");});
    //名一壞字上色
    result.wordList.badMidRepeats.gold.map((ele)=>{$(`#badMidWord${ele}`).css("color", "darkgoldenrod");});
    result.wordList.badMidRepeats.tree.map((ele)=>{$(`#badMidWord${ele}`).css("color", "rgb(79, 209, 56)");});
    result.wordList.badMidRepeats.water.map((ele)=>{$(`#badMidWord${ele}`).css("color", "blue");});
    result.wordList.badMidRepeats.fire.map((ele)=>{$(`#badMidWord${ele}`).css("color", "red");});
    result.wordList.badMidRepeats.ground.map((ele)=>{$(`#badMidWord${ele}`).css("color", "brown");});

    //名二好字上色
    result.wordList.betterBotRepeats.gold.map((ele)=>{$(`#betterBotWord${ele}`).css("color", "darkgoldenrod");});
    result.wordList.betterBotRepeats.tree.map((ele)=>{$(`#betterBotWord${ele}`).css("color", "rgb(79, 209, 56)");});
    result.wordList.betterBotRepeats.water.map((ele)=>{$(`#betterBotWord${ele}`).css("color", "blue");});
    result.wordList.betterBotRepeats.fire.map((ele)=>{$(`#betterBotWord${ele}`).css("color", "red");});
    result.wordList.betterBotRepeats.ground.map((ele)=>{$(`#betterBotWord${ele}`).css("color", "brown");});
   
    //名二壞字上色
    result.wordList.badBotRepeats.gold.map((ele)=>{$(`#badBotWord${ele}`).css("color", "darkgoldenrod");});
    result.wordList.badBotRepeats.tree.map((ele)=>{$(`#badBotWord${ele}`).css("color", "rgb(79, 209, 56)");});
    result.wordList.badBotRepeats.water.map((ele)=>{$(`#badBotWord${ele}`).css("color", "blue");});
    result.wordList.badBotRepeats.fire.map((ele)=>{$(`#badBotWord${ele}`).css("color", "red");});
    result.wordList.badBotRepeats.ground.map((ele)=>{$(`#badBotWord${ele}`).css("color", "brown");});
};
