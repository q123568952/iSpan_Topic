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
        for (let i = 0; i < combinationsinfo.length; i++) {
            temp = combinationsinfo[i];
            $("#combinationsinfo").append(`<option value='${temp}'>${temp}: </option>`);
        };
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
    for (let z = 0; z < result.wordList.normalMidWordList.goldMid.length; z++) {
        $("#goldMid").append(`<span class="h1" style='color:darkgoldenrod;'> ${result.wordList.normalMidWordList.goldMid[z]} </span>`)
    };
    for (let z = 0; z < result.wordList.normalMidWordList.treeMid.length; z++) {
        $("#treeMid").append(`<span class="h1" style='color:darkgreen;'> ${result.wordList.normalMidWordList.treeMid[z]} </span>`)
    };
    for (let z = 0; z < result.wordList.normalMidWordList.waterMid.length; z++) {
        $("#waterMid").append(`<span class="h1" style='color:blue;'> ${result.wordList.normalMidWordList.waterMid[z]} </span>`)
    };
    for (let z = 0; z < result.wordList.normalMidWordList.fireMid.length; z++) {
        $("#fireMid").append(`<span class="h1" style='color:red;'> ${result.wordList.normalMidWordList.fireMid[z]} </span>`)
    };
    for (let z = 0; z < result.wordList.normalMidWordList.groundMid.length; z++) {
        $("#groundMid").append(`<span class="h1" style='color:brown;'> ${result.wordList.normalMidWordList.groundMid[z]} </span>`)
    };
};
function addNormalBotWords(result) {
    for (let z = 0; z < result.wordList.normalBotWordList.goldBot.length; z++) {
        $("#goldBot").append(`<span class="h1" style='color:darkgoldenrod;'> ${result.wordList.normalBotWordList.goldBot[z]} </span>`)
    };
    for (let z = 0; z < result.wordList.normalBotWordList.treeBot.length; z++) {
        $("#treeBot").append(`<span class="h1" style='color:darkgreen;'> ${result.wordList.normalBotWordList.treeBot[z]} </span>`)
    };
    for (let z = 0; z < result.wordList.normalBotWordList.waterBot.length; z++) {
        $("#waterBot").append(`<span class="h1" style='color:blue;'> ${result.wordList.normalBotWordList.waterBot[z]} </span>`)
    };
    for (let z = 0; z < result.wordList.normalBotWordList.fireBot.length; z++) {
        $("#fireBot").append(`<span class="h1" style='color:red;'> ${result.wordList.normalBotWordList.fireBot[z]} </span>`)
    };
    for (let z = 0; z < result.wordList.normalBotWordList.groundBot.length; z++) {
        $("#groundBot").append(`<span class="h1" style='color:brown;'> ${result.wordList.normalBotWordList.groundBot[z]} </span>`)
    };
};

function putGoodBadWords(result) {
    for (let i = 0; i < result.wordList.betterMidWordList.length; i++) {
        $("#goodMidWords").append(`<span class="h1" id="betterMidWord${i}"> ${result.wordList.betterMidWordList[i]} </span>`);
    }
    for (let i = 0; i < result.wordList.badMidWordList.length; i++) {
        $("#badMidWords").append(`<span class="h1" id="badMidWord${i}"> ${result.wordList.badMidWordList[i]} </span>`);
    }
    for (let i = 0; i < result.wordList.betterBotWordList.length; i++) {
        $("#goodBotWords").append(`<span class="h1" id="betterBotWord${i}"> ${result.wordList.betterBotWordList[i]} </span>`);
    }
    for (let i = 0; i < result.wordList.badBotWordList.length; i++) {
        $("#badBotWords").append(`<span class="h1" id="badBotWord${i}"> ${result.wordList.badBotWordList[i]} </span>`);
    }
};
function addGoodBadWordsColor(result) {
    //名一好字上色
    for (let i = 0; i < result.wordList.betterMidRepeats.gold.length; i++) {
        $(`#betterMidWord${result.wordList.betterMidRepeats.gold[i]}`).css("color", "darkgoldenrod");
    }
    for (let i = 0; i < result.wordList.betterMidRepeats.tree.length; i++) {
        $(`#betterMidWord${result.wordList.betterMidRepeats.tree[i]}`).css("color", "darkgreen");
    }
    for (let i = 0; i < result.wordList.betterMidRepeats.water.length; i++) {
        $(`#betterMidWord${result.wordList.betterMidRepeats.water[i]}`).css("color", "blue");
    }
    for (let i = 0; i < result.wordList.betterMidRepeats.fire.length; i++) {
        $(`#betterMidWord${result.wordList.betterMidRepeats.fire[i]}`).css("color", "red");
    }
    for (let i = 0; i < result.wordList.betterMidRepeats.ground.length; i++) {
        $(`#betterMidWord${result.wordList.betterMidRepeats.ground[i]}`).css("color", "brown");
    }
    //名一壞字上色
    for (let k = 0; k < result.wordList.badMidRepeats.gold.length; k++) {
        $(`#badMidWord${result.wordList.badMidRepeats.gold[k]}`).css("color", "darkgoldenrod");
    }
    for (let k = 0; k < result.wordList.badMidRepeats.tree.length; k++) {
        $(`#badMidWord${result.wordList.badMidRepeats.tree[k]}`).css("color", "darkgreen");
    }
    for (let k = 0; k < result.wordList.badMidRepeats.water.length; k++) {
        $(`#badMidWord${result.wordList.badMidRepeats.water[k]}`).css("color", "blue");
    }
    for (let k = 0; k < result.wordList.badMidRepeats.fire.length; k++) {
        $(`#badMidWord${result.wordList.badMidRepeats.fire[k]}`).css("color", "red");
    }
    for (let k = 0; k < result.wordList.badMidRepeats.ground.length; k++) {
        $(`#badMidWord${result.wordList.badMidRepeats.ground[k]}`).css("color", "brown");
    }
    //名二好字上色
    for (let i = 0; i < result.wordList.betterBotRepeats.gold.length; i++) {
        $(`#betterBotWord${result.wordList.betterBotRepeats.gold[i]}`).css("color", "darkgoldenrod");
    }
    for (let i = 0; i < result.wordList.betterBotRepeats.tree.length; i++) {
        $(`#betterBotWord${result.wordList.betterBotRepeats.tree[i]}`).css("color", "darkgreen");
    }
    for (let i = 0; i < result.wordList.betterBotRepeats.water.length; i++) {
        $(`#betterBotWord${result.wordList.betterBotRepeats.water[i]}`).css("color", "blue");
    }
    for (let i = 0; i < result.wordList.betterBotRepeats.fire.length; i++) {
        $(`#betterBotWord${result.wordList.betterBotRepeats.fire[i]}`).css("color", "red");
    }
    for (let i = 0; i < result.wordList.betterBotRepeats.ground.length; i++) {
        $(`#betterBotWord${result.wordList.betterBotRepeats.ground[i]}`).css("color", "brown");
    }
    //名二壞字上色
    for (let k = 0; k < result.wordList.badBotRepeats.gold.length; k++) {
        $(`#badBotWord${result.wordList.badBotRepeats.gold[k]}`).css("color", "darkgoldenrod");
    }
    for (let k = 0; k < result.wordList.badBotRepeats.tree.length; k++) {
        $(`#badBotWord${result.wordList.badBotRepeats.tree[k]}`).css("color", "darkgreen");
    }
    for (let k = 0; k < result.wordList.badBotRepeats.water.length; k++) {
        $(`#badBotWord${result.wordList.badBotRepeats.water[k]}`).css("color", "blue");
    }
    for (let k = 0; k < result.wordList.badBotRepeats.fire.length; k++) {
        $(`#badBotWord${result.wordList.badBotRepeats.fire[k]}`).css("color", "red");
    }
    for (let k = 0; k < result.wordList.badBotRepeats.ground.length; k++) {
        $(`#badBotWord${result.wordList.badBotRepeats.ground[k]}`).css("color", "brown");
    }
};


