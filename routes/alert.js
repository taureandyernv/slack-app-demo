const Axios = require("axios");
const fs = require('fs');
var express = require("express");
var router = express.Router();
var path = "qids.txt";

router.get("/", async function (req, res, next) {
	//Stack overflow api string 
	var soURL = 'https://api.stackexchange.com/2.2/search/advanced?order=desc&min='
	var soURLmid = '&sort=creation&q='; 
	var soURLend = '&site=stackoverflow';
	var d = new Date();
	var now = Math.round(d.getTime()/1000); //adjusts time to stackoverflow parameters
	var day = 86400;
	//1597688191

	var keywords = ["cudf","cuml","cugraph","cusignal","cuspatial","cuxfilter","rmm","rapidsai","rapids", "blazingsql"];
	console.log(keywords);
	new_questions = []; //this array contains unanswered questions to be sent to slack
	// Check to see if file exists.  If no, create a txt and an array to compare answers.  If yes, open file, then read question_ids from file
	fs.access(path, fs.F_OK, (err) => {
		if (err) {
			console.log("Qids.txt doesn't exists.  Creating...");
			question_ids = [] //Start new question_ids which will create the file later
			return
		}

		//file exists
		console.log("Qids.txt exists.");
		readMe = fs.readFileSync(path, 'utf8').split(',');
		question_ids = readMe.map(function (x) { 
		  return parseInt(x, 10); 
		});
	});
	//question_ids = []; //this array removes duplicate question alerts in the same search
	
	for(i=0; i<keywords.length; i++){
	  console.log(soURL+ (now-(10*day))+ soURLmid + keywords[i]+soURLend);
	  console.log("getting result");		
	  const result = await Axios.get(
		soURL+ (now-(20*day))+ soURLmid + keywords[i]+soURLend
	  );
	  /*const lastRefreshed = result.data.items[0].
	  //const lastClose = result.data.items[0].
		result.data["Time Series (Daily)"][lastRefreshed]["4. close"];*/
		if(result.data.items[0]){
			console.log(result.data.items[0].answer_count);
			console.log(result.data.items[0]);
		
			for(a = 0; a < result.data.items.length ; a++){
				if(question_ids.indexOf(result.data.items[a].question_id)== -1){					
					if(result.data.items[a].answer_count == 0 && result.data.items[a].is_answered == false){
						result.data.items[a].keyword = keywords[i];
						new_questions.push(result.data.items[a]);
						question_ids.push(result.data.items[a].question_id);
					}
				}
			}
		}
	}
	//Save new question_ids to file
	writeMe = fs.writeFileSync(path, question_ids);

	  
	  for(q=0; q<new_questions.length;q++){
	  console.log("<"+new_questions[q].question_id+">");
		  await Axios.post(
			`https://hooks.slack.com/services/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`,
			{
				"blocks": [
					{
						"type": "section",
						"text": {
							"type": "mrkdwn",
							"text": "We have a new, unanswered question about " + new_questions[q].keyword + " on StackOverflow:"
						}
					},
					{
						"type": "section",
						"block_id": "question_id",
						"text": {
							"type": "mrkdwn",
							"text": "Question ID" + new_questions[q].question_id
						}
					},
					{
						"type": "section",
						"block_id": "alert",
						"text": {
							"type": "mrkdwn",
							"text": "<"+new_questions[q].link+"| "+new_questions[q].title+"> "
						}
					},
					{
						"type": "section",
						"text": {
							"type": "mrkdwn",
							"text": "If you can answer, please respond in a thread (or just discuss if needed in thread).  Once you've answered, please add a Green Checkmark emoji to this post.  If someone else outside of RAPIDS answers, please add a White Checkmark emoji to this post."
						}
					}
				]
			}
		  );
	  }
	  

  res.json({
    new_questions,
    date: new Date().toISOString(),
  });
});

module.exports = router;
