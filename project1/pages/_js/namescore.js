var targetName;
$(document).ready(async function () {
    $("#targetName").on("change", async function () {
        targetName = document.getElementById("targetName").value;
        if (targetName.length <= 1 || targetName.length >= 5 || targetName[1]== " ") {
            $.toast("還調皮啊!!!")
            return;
        };
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
        let result = await $.get(`/getresult/${targetName}`);
        if(result == "error"){
            $.toast("還調皮啊!!!");
            return;
        }
        if (result.strockesList.length == 4) {
            $("#tableSpecialTopWord").text(`${targetName[0]}`);
            $("#tableTopWord").text(`${targetName[1]}`);
            $("#tableMidWord").text(`${targetName[2]}`);
            $("#tableBotWord").text(`${targetName[3]}`);
            $("#tableSpecialTopStrocks").text(`${result.strockesList[0]}`);
            $("#tableTopStrocks").text(`${result.strockesList[1]}`);
            $("#tableMidStrocks").text(`${result.strockesList[2]}`);
            $("#tableBotStrocks").text(`${result.strockesList[3]}`);
        } else {
            if (result.strockesList[2] == "0") {
                $("#tableBotWord").text(``);
            } else {
                $("#tableBotWord").text(`${targetName[2]}`);
            };
            $("#tableSpecialTopWord").text(``);
            $("#tableTopWord").text(`${targetName[0]}`);
            $("#tableMidWord").text(`${targetName[1]}`);
            $("#tableSpecialTopStrocks").text(`1`);
            $("#tableTopStrocks").text(`${result.strockesList[0]}`);
            $("#tableMidStrocks").text(`${result.strockesList[1]}`);
            $("#tableBotStrocks").text(`${result.strockesList[2]}`);
        }
        $("#name5Es").html(result.colorSancai5E);
        $("#name5EsLevel").text(result.name5EsToClient.name5EsLevel);
        $("#name5EsResult").text(result.name5EsToClient.name5EsResult);
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
    });

});
