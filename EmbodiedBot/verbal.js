/* verbal part */
var state = "initial"
var slowBreathInc = 0.1
var fastBreathInc = 0.6
var slowTimeBetweenBlinks = 4000
var fastTimeBetweenBlinks = 500
var lingua = "en-US"

function startDictation() {

  if (window.hasOwnProperty('webkitSpeechRecognition')) {

    var recognition = new webkitSpeechRecognition();

    /* Nonverbal actions at the start of listening */
    setTimeBetweenBlinks(fastTimeBetweenBlinks);
    setBreathInc(slowBreathInc);

    recognition.continuous = false;
    recognition.interimResults = false;

    recognition.lang = lingua;
    recognition.start();


    recognition.onresult = function(e) {
      document.getElementById('transcript').value
                               = e.results[0][0].transcript;
      var user_said = e.results[0][0].transcript;
      recognition.stop();

      /* Nonverbal actions at the end of listening */
      setTimeBetweenBlinks(slowTimeBetweenBlinks);
      jump(); //perform a nonverbal action from nonverbal.js

      var bot_response = decide_response(user_said)
      speak(bot_response)

      //`document.getElementById('labnol').submit();
    };

    recognition.onerror = function(e) {
      recognition.stop();
    }

  }
}

/* decide what to say.
 * input: transcription of what user said
 * output: what bot should say
 */
function decide_response(user_said) {
  var response;
  // var play_re = /play\s(.+)/i;  // creating a regular expression
  // var play_parse_array = user_said.match(play_re) // parsing the input string with the regular expression
  
  // console.log(play_parse_array) // let's print the array content to the console log so we understand 
                                // what's inside the array.

  if (user_said.toLowerCase().includes("make") && user_said.toLowerCase().includes("gin and tonic") && state === "initial") {
      response = "ok, making iu a gin and tonic";
    } else if (user_said.toLowerCase().includes("make") && user_said.toLowerCase().includes("old fashioned") && state === "initial") {
      response = "ok, making iu an old fashioned";
    } else if (user_said.toLowerCase().includes("hello") && state === "initial") {
      response = "Oi! My name is Ze Carioca. Ai can make a gin and tonic, or an old fashioned. iu can also speak to me in portugues!";
      state = "initial"
    } else if (user_said.toLowerCase().includes("portuguese")) {
      response = "You want to speak portugues?";
      state = "lang_confirm"
    } else if (user_said.toLowerCase().includes("yes") && state === "lang_confirm") {
      lingua = "pt-BR"
      response = "Então vamos!";
      state = "initial-pt"
    } else if (user_said.toLowerCase().includes("no") && state === "lang_confirm") {
      response = "Ok. Let's keep speaking English!";
      state = "initial"
    } else if (user_said.toLowerCase().includes("tudo bem") && state === "initial-pt") {
      response = "Tudo otimo! E voce?";
      state = "feeling-pt"
    } else if (user_said.toLowerCase().includes("bem") && state === "feelings-pt") {
      response = "Que bom!";
      state = "initial"
    } else if (user_said.toLowerCase().includes("mal") && state === "feelings-pt") {
      response = "Sinto muito!";
      state = "initial"
    } else if (user_said.toLowerCase().includes("make") && state === "initial") {
      response = "What kind of drink should I make?";
      state = "make_drink"
    } else if (user_said.toLowerCase().includes("gin and tonic") && state === "make_drink") {
      response = "ok, making iu a gin and tonic";
      state = "initial"
    } else if (state === "make_drink") {
      response = "Ai don't know how to make that. Try asking for something else.";
      state = "make_drink"
    } else {
      response = "Ai deed not understand. uai dont iu ask for a drink?";
      lingua = "en-US"
      state = "initial"
    }
    return response;
  }

/* Load and print voices */
// function printVoices() {
  // Fetch the available voices.
  var voices = speechSynthesis.getVoices();

/* 
 *speak out some text 
 */
function speak(text, callback) {

  /* Nonverbal actions at the start of robot's speaking */
  setBreathInc(fastBreathInc); 

  var u = new SpeechSynthesisUtterance();
    u.text = text;
    u.lang = lingua;
    // u.volume = 1 //between 0 and 1
    u.pitch = 1.2 //between 0 and 2
    u.rate = 0.7 //between 0.1 and 5-ish
    u.voice = speechSynthesis.getVoices().filter(function(voice) { return voice.name == "Jorge"; })[0]; //pick a voice

  u.onend = function () {
      
      /* Nonverbal actions at the end of robot's speaking */
      setBreathInc(slowBreathInc); 

      if (callback) {
          callback();
      }
  };


  u.onerror = function (e) {
      if (callback) {
          callback(e);
      }
  };

  speechSynthesis.speak(u);
}
