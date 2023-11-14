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
// 		var data = require(`./project1/pages/data_bak/${zodiacList[z]}.json`);
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
// 		connection.query(`insert into zodiactroubleshooting(draw, preferences, words, zodiac) values (${draws}, 1, "${words}", "${chineseZodiacList[z]}")`, (err, rows, fields) => {
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
// 		connection.query(`insert into zodiactroubleshooting(draw, preferences, words, zodiac) values (${draws}, 0, "${words}", "${chineseZodiacList[z]}")`, (err, rows, fields) => {
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

function delay(time) {
    return new Promise(function (resolve) {
      setTimeout(resolve, time);
    });
  }
  // 比對缺少屬性資訊的字
  // app.get("/miss", async function (req,res){
  //  let allWordsList = await asyncsql("select words from zodiacword","")
  //  let words="";
  //  allWordsList.forEach(element => {
  //         words += element.words;
  //     });
  //   words = words.split("");
  //   words.sort();
  //   temp = new Set(words);
  
  // //   生肖喜忌所有字
  //   words = [...temp];
  //   let wordsNeedToCheck=[];
  //     for (let i = 0; i < words.length; i++) {
  //         let result = await asyncsql("select count(*) yesno from chinesewords where words like ?",["%"+words[i] +"%"]);
  //         if (result[0].yesno == 0){
  //             wordsNeedToCheck.push(words[i]);//完成所有有問題的字清單
  //         }
  //     };
  //     //尚未有屬性的喜忌字
  //     fs.writeFile("wordsNeedToCheck2.txt",wordsNeedToCheck.toString(),function () {
  //         console.log("good");
  //     })
  // })
  
  //取得需要修改的字清單
  // app.get("/wstrocked", async function (req,res){
  
  //     let alldrawwordsraw = await asyncsql("select draw, words from zodiacword","")//帶draw:X,words:XXXX
  //     let needtocheckList = [];
  //     let QQ=0;
  //     for (let i = 0; i < alldrawwordsraw.length; i++) {
  //         let needtocheck ={
  //             words: [],
  //         };
  //         let tempdraw = alldrawwordsraw[i].draw;
  //         let tempwords =alldrawwordsraw[i].words;
  //         needtocheck.draw = tempdraw;
  //         tempwords = tempwords.split("");
  //         for (let z = 0; z < tempwords.length; z++) {
  //             let checkit = await asyncsql(`select count(*) yesno from chinesewords where (draw = ? and words like ?)`,[tempdraw, "%"+tempwords[z]+"%"]);
  //             if (checkit[0].yesno == 0){
  //                 needtocheck.words.push(tempwords[z]);
  
  //             }
  //         }
  //         if(needtocheck.words.length > 0){
  //             needtocheckList.push(needtocheck);
  //             QQ++
  //         }
  //     }
  
  //     console.log(QQ);
  
  //     res.send(JSON.stringify(needtocheckList));
  //    })
  
  //自動處理字
  // app.get("/autostrocked", async function (req,res){
  //     const browser = await puppeteer.launch({headless: false});
  //     const page = await browser.newPage();
  //     await page.goto("https://www.chinesewords.org/character/");
  //     await delay(2000);
  //     let flag = true;
  //     while(flag){
  //     let alldrawwordsraw = await asyncsql("select draw, words, preferences from zodiacword ","")//帶draw:X,words:XXXX
  //     let needtocheckList = [];
  //     for (let i = 0; i < alldrawwordsraw.length; i++) {
  //         let needtocheck ={
  //             words: [],
  //         };
  //         let tempdraw = alldrawwordsraw[i].draw;
  //         let tempwords =alldrawwordsraw[i].words;
  //         let temppreferences=alldrawwordsraw[i].preferences;
  //         needtocheck.draw = tempdraw;
  //         needtocheck.preferences = temppreferences;
  //         tempwords = tempwords.split("");
  //         for (let z = 0; z < tempwords.length; z++) {
  //             let checkit = await asyncsql(`select count(*) yesno from chinesewords where (draw = ? and words like ?)`,[tempdraw, "%"+tempwords[z]+"%"]);
  //             if (checkit[0].yesno == 0){
  //                 needtocheck.words.push(tempwords[z]);
  
  //             }
  //         }
  //         if(needtocheck.words.length > 0){
  //             needtocheckList.push(needtocheck);
  //         }
  //     }
  //     console.log(needtocheckList);
  //     if(needtocheckList.length<=0){
  //         flag=false;
  //        return console.log("我做完了");
  //     }
  
  //     tistimewedoit=[{
  //         draw: needtocheckList[0].draw,
  //         words: needtocheckList[0].words,
  //         preferences:needtocheckList[0].preferences
  //     }]
  //     let tempdraw = tistimewedoit[0].draw;
  //     let tempwords =tistimewedoit[0].words;
  //     let temppreferences=tistimewedoit[0].preferences;
  //         if (tempwords >1){
  //             tempwords = tempwords.split("");
  //         }
  //         for (let z = 0; z < tempwords.length; z++) {
  //             let checkit = await asyncsql(`select count(*) yesno from chinesewords where (draw = ? and words like ?)`,[tempdraw, "%"+tempwords[z]+"%"]);
  //             if (checkit[0].yesno == 0){
  //                 await page.focus("input[name='input']");
  //                 await page.keyboard.type(`${tempwords[z]}`);
  //                 await delay(1000);
  //                  (await page.$("button[type='submit']")).click();
  //                  await delay(2000);
  //                  let getstrockeselement =  await page.waitForSelector("#basic > div.txt.div-box > div.col2 > ul > li:nth-child(3) > span");
  //                  let getelement= await page.waitForSelector("#basic > div.txt.div-box > div.col2 > ul > li:nth-child(6) > span");
  //                  let strockes = await page.evaluate(body =>{
  //                     return body.innerHTML;
  //                 },getstrockeselement)
  
  //                 let element = await page.evaluate(body =>{
  //                     return body.innerHTML;
  //                 },getelement)
  //                 let findword = await asyncsql(`select draw, fiveelement from chinesewords where words like ?`,["%"+tempwords[z]+"%"]);
  
  //                 let chdraw = findword[0].draw;
  //                 let chfiveE = findword[0].fiveelement;
  //                 if(parseInt(strockes) != chdraw || element !=chfiveE){
  //                     await asyncsql(`UPDATE chinesewords set words = REPLACE(words, ?,"") WHERE words like ? `,[tempwords[z],"%"+tempwords[z]+"%"]);
  //                     await asyncsql(`UPDATE chinesewords set words = concat(words, ?) WHERE (draw = ? and fiveelement = ?) `,[tempwords[z],parseInt(strockes),element]);
  //                 }
  //                 await asyncsql(`UPDATE zodiacword set words = REPLACE(words, ?,"") WHERE words like ?`,[tempwords[z],"%"+tempwords[z]+"%"]);
  //                 await asyncsql(`UPDATE zodiacword set words = concat(words, ?) WHERE (draw = (select draw from chinesewords where words LIKE ?) and preferences = ?) `,[tempwords[z],"%"+tempwords[z]+"%",temppreferences]);
  
  //             }
  //         }
  //     }
  //     }
  //    )
  
  // 處理不小心喜忌都有的字#後面有點問題
  // app.get("/trouble", async function (req,res){
  //     var chineseZodiacList=["鼠","牛","虎","兔","龍","蛇","馬","羊","猴","雞","狗","豬"]
  //         let wordsgg=[];
  //         for (let i = 0; i < 45; i++) {
  //             for (let z = 0; z < chineseZodiacList.length; z++) {
  //                 let  yesnowords= await asyncsql("SELECT draw, words FROM `zodiacword` WHERE draw = ? and zodiac = ?",[i,chineseZodiacList[z]]);
  //                 if(yesnowords.length <=1){
  //                     continue;
  //                 }
  //                 console.log(yesnowords);
  //                 let tempfwordlist = yesnowords[0].words;
  //                         tempfwordlist = tempfwordlist.split("");
  
  //                         for (let j = 0; j < tempfwordlist.length; j++) {
  //                             let tempswordlist = yesnowords[1].words;
  //                             if(tempswordlist.indexOf(tempfwordlist[j])!= -1){
  //                                 wordsgg.push(tempfwordlist[j]);
  //                             }
  
  //                         }
  
  //                     }
  //                 }
  //                 let temp = new Set(wordsgg);
  //                 wordsgg = [...temp];
  //                 console.log(wordsgg);
  
  // //                 for (let h = 0; h < wordsgg.length; h++) {
  // //                     let  goodorbad= await asyncsql("SELECT DISTINCT preferences FROM `zodiactroubleshooting` WHERE words like ?",["%"+wordsgg[h]+"%"]);
  // //                     console.log(goodorbad[0].preferences)
  // //                 await asyncsql(`UPDATE zodiacword set words = REPLACE(words, ?,"") WHERE preferences not like ?`,[wordsgg[h],goodorbad[0].preferences]);
  
  // //                 }
  
  //             })
  
  //處理不小心把他加進去12生肖全部的字
  // app.get("/trouble2", async function(req,res){
  //     let allwordsraw = await asyncsql("select words from zodiactroubleshooting ","")//帶draw:X,zodiac
  //     let allworkds=[]
  //     for (let i = 0; i < allwordsraw.length; i++) {
  //         tempwords = allwordsraw[i].words;
  //         wordslist = tempwords.split("");
  //         for (let k = 0; k < wordslist.length; k++) {
  //             allworkds.push(wordslist[k]);
  //         }
  //     }
  //     let qqq = new Set(allworkds);
  //     allworkds =[...qqq];
  // let resultList = [];
  //     for (let k = 0; k < allworkds.length; k++) {
  
  //         let gzpraw = await asyncsql("select zodiac from zodiactroubleshooting where words like ? and preferences = 1 ",["%"+allworkds[k]+"%"])
  //         if(gzpraw.length > 0){
  //             let result ={};
  //             result.word = allworkds[k];
  //             result.preferences = 1;
  //             result.zodiac = [];
  //             for (let z = 0; z < gzpraw.length; z++) {
  //                 result.zodiac.push(gzpraw[z].zodiac)
  //             }
  //             resultList.push(result);
  //         }
  //         let bzpraw = await asyncsql("select zodiac from zodiactroubleshooting where words like ? and preferences = 0 ",["%"+allworkds[k]+"%"])
  //         if(bzpraw.length > 0){
  //             let result ={};
  //             result.word = allworkds[k];
  //             result.preferences = 0;
  //             result.zodiac = [];
  //             for (let j = 0; j < bzpraw.length; j++) {
  //                 result.zodiac.push(bzpraw[j].zodiac)
  //             }
  //             resultList.push(result);
  //         }
  //     }
  //     // 拿到所有字囉
  //  let qwqw=0;
  //     for (let i = 0; i < resultList.length; i++) {
  //         tempword = resultList[i].word;//正確
  //         temppreferences = resultList[i].preferences;//正確
  //         tempzodiac=resultList[i].zodiac; //正確
  //         let check = await asyncsql("select zodiac from zodiacword where words like ? and preferences = ? ",["%"+tempword+"%",temppreferences]);
  //         let wronglist = [];
  //         for (let k = 0; k < check.length; k++) {
  //             if(tempzodiac.indexOf(check[k].zodiac) == -1){
  //                 wronglist.push(check[k].zodiac);
  //             }
  //         }
  
  //         if(wronglist.length>0){
  
  //             console.log(tempword);
  //             await asyncsql(`UPDATE zodiacword set words = REPLACE(words, ?,"") WHERE words like ? and zodiac in (?)`,[tempword,"%"+tempword+"%",wronglist]);
  //             qwqw++
  //         }
  
  //     }
  
  //     console.log(qwqw);
  
  // })
  