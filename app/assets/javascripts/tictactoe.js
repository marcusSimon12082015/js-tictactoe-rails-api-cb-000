var turn = 0;
var currentGame = 0;

function player()
{
  return (turn % 2 == 0) ? "X" : "O"
}

function setMessage(string)
{
    $("#message").html(string);
}

function updateState(tdElement)
{
  tdElement.innerHTML = player();
}

function checkCombinations(el1,el2,el3)
{
    return (el1 == el2) && (el1 == el3) && el1 !== ""
}

function createStateArray()
{
  var tttArray = new Array();
  $("table td").each(function(element){
    var el = $(this);
    tttArray.push(el.text());
  });
  return tttArray;
}

function checkWinner()
{
  var tttArray = createStateArray();

  var playerWon = ""
  //check for winner
  if(checkCombinations(tttArray[0],tttArray[1],tttArray[2])){
    playerWon = tttArray[0];
  }
  if(checkCombinations(tttArray[3],tttArray[4],tttArray[5])){
    playerWon = tttArray[3];
  }
  if(checkCombinations(tttArray[6],tttArray[7],tttArray[8])){
    playerWon = tttArray[6];
  }
  if(checkCombinations(tttArray[0],tttArray[4],tttArray[8])){
    playerWon = tttArray[0];
  }
  if(checkCombinations(tttArray[1],tttArray[4],tttArray[7])){
    playerWon = tttArray[1];
  }
  if(checkCombinations(tttArray[2],tttArray[5],tttArray[8])){
    playerWon = tttArray[2];
  }
  if(checkCombinations(tttArray[2],tttArray[4],tttArray[6])){
    playerWon = tttArray[2];
  }
  if(checkCombinations(tttArray[0],tttArray[3],tttArray[6])){
    playerWon = tttArray[0];
  }

  if(playerWon.length > 0){
    setMessage("Player "+playerWon+" Won!");
    saveGame();
    return true;
  }

  var count = turnCount();
  if(playerWon.length == 0 && count == 9){
    saveGame();
    setMessage("Tie game.");
  }

  return false;
}

function turnCount() {
  counter = 0
  for (var i = 0; i < 9; i++) {
    if ($("td")[i].innerHTML === "X" || $("td")[i].innerHTML === "O") {
      counter++
    }
  }
  return counter
}

function resetBoard(){
  for (var i = 0; i < 9; i++) {
    $("td")[i].innerHTML = "";
  }
}

function populateBoard(array){
  if (array.length === 0) {
    resetBoard();
  } else {
    for (var i = 0; i < array.length; i++) {
      $("td")[i].innerHTML = array[i];
    }
    turn = turnCount();    
  }
}

function doTurn(element){
  updateState(element);
  if(!checkWinner() && $("#message").text() === ""){
    turn++;
  }else{
    resetBoard();
    turn = 0;
    $("#message").text("");
  }
}

function clearGame()
{
  resetBoard();
  turn = 0;
  currentGame = 0;  
}

function previousGames()
{
  $.get("/games")
    .done(function(data){
      var $games = $("#games");
      $games.empty();
      $.each(data.data,function(index){
        $games.append("<button data-id="+data.data[index]["id"]+">"+data.data[index]["id"]+". game</button><br>");
      });
      $("button[data-id]").on("click",getGame);
    });  
}

function saveGame()
{
  var state = createStateArray();
  if (currentGame > 0) {
    $.ajax({
      method:"PATCH",
      url:"/games/"+currentGame,
      data:{state:state}
    });
  }else{
    $.post("/games",{state:state})
    .done(function(data){
      currentGame = parseInt(data.data["id"]);
    });
  }  
}

function getGame()
{
  $.get("/games/"+parseInt(this.dataset["id"]))
    .done(function(data){
      currentGame = parseInt(data.data["id"]);
      populateBoard(data.data["attributes"]["state"]);
    });    
}

function attachListeners()
{
  $("td").on("click",function(){
    if(this.innerHTML === "" && $("#message").text() === "" && !checkWinner()){
      doTurn(this);
    }
  });
  
  $("#clear").on("click",clearGame);

  $("#previous").on("click",previousGames);

  $("#save").on("click",saveGame);
  
}

$(function(){
  attachListeners();
});
