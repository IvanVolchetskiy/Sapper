var nbFlags;
var toDiscover;
var arrayMines = new Array();
var timer = false;
var count = 0;
var bombURL = "images/bomb1.jpg";
var flagURL = "images/flag1.jpg";



setInterval(function() {
  if (timer) {
    $('#score-time-count').html(("00" + count).slice(-3));
    count++;
  }
}, 1000);

function init() {
  $(document).bind("contextmenu", function(e) {
    return false;
  });
  $('#Mines').html('');
  columns = $("[name='columns']").val();
  if(columns < 8)
  {
    columns = 8;
    $("[name='columns']").val(columns);
  }
  lines = $("[name='lines']").val();
  if(lines < 8)
  {
    lines = 8;
    lines = $("[name='lines']").val(lines);
  }
  nbMines = $("[name='nbMines']").val();
  if(nbMines > (columns*lines))
  {
    nbMines = columns*lines;
    $("[name='nbMines']").val(nbMines);
  }

  let w = screen.width;

if(w>1010){
  nbFlags = nbMines;
  toDiscover = columns * lines - nbMines;
  count = 0;
  $('#Demineur').width(columns * 30);
  $('#Demineur').height(lines * 30 + 52);
  $('#score-bomb-count').html(("00" + nbFlags).slice(-3));
}
else{
  nbFlags = nbMines;
  toDiscover = columns * lines - nbMines;
  count = 0;
}



  //init table
  for (var i = 0; i < lines; i++) {
    arrayMines[i] = new Array();
    for (var j = 0; j < columns; j++) {
      arrayMines[i][j] = 0;
      $("#Mines").append("<input type='button' class='square' id=" + i + "_" + j + " value='' onclick='clickMine(" + i + "," + j + ")' oncontextmenu='switchFlag(" + i + "," + j + ")'/>");
    }
    $("#Mines").append('<br>');
  }

  //random put mines
  var i = 0;
  while (i < nbMines) {
    var x = Math.floor(Math.random() * lines);
    var y = Math.floor(Math.random() * columns);
    if (arrayMines[x][y] === 0) {
      arrayMines[x][y] = 1;
      i++;
    }
  }
  timer = true;
  count = 0;
}

function clickMine(i, j) {
  //alert ("Clicked: "+i+";"+j);
  //remove flag
  if (arrayMines[i][j] > 1) {
    switchFlag(i, j);
  } else if (arrayMines[i][j] == 1) {
    $("#" + i + "_" + j).addClass("active");
    timer = false;
    showBombs();
    alert("BOOM !" + "\nTIME: " + --count + ' SECONDS' + '\nUNDEFUSED BOMBS: ' + nbFlags );
       
      //init();        
    
  } else {
    $("#" + i + "_" + j).addClass("active");
    $("#" + i + "_" + j).attr('onclick', '');
    toDiscover--;
    var number = countMines(i, j);
    if (number !== 0)
    {
      $("#" + i + "_" + j).prop('value', number);
      // $("#" + i + "_" + j).css("font-size", "50px");
      if(number == 1)
        $("#" + i + "_" + j).css("color", "#110a6d");
        else if(number == 2)
          $("#" + i + "_" + j).css("color", "#efdf04");
          else if(number == 3)
            $("#" + i + "_" + j).css("color", "#1e9e04");
            else
              $("#" + i + "_" + j).css("color", "#ff0000");
    }
    else
      for (var x = Math.max(0, i - 1); x <= Math.min(lines - 1, i + 1); x++)
        for (var y = Math.max(0, j - 1); y <= Math.min(columns - 1, j + 1); y++)
          if (arrayMines[x][y] < 2 && !$("#" + x + "_" + y).hasClass('active')) clickMine(x, y);

    // Test victory
    checkVictory();
  }
}

function countMines(i, j) {
  var k = 0;
  for (var x = Math.max(0, i - 1); x <= Math.min(lines - 1, i + 1); x++)
    for (var y = Math.max(0, j - 1); y <= Math.min(columns - 1, j + 1); y++)
      if (arrayMines[x][y] == 1 || arrayMines[x][y] == 3) k++;
  return k;
}

function switchFlag(i, j) {
  if (!$("#" + i + "_" + j).hasClass('active')) {
    if (arrayMines[i][j] < 2) {
      if (nbFlags > 0) {
        arrayMines[i][j] += 2;
        $("#" + i + "_" + j).prop('value', "");
        $("#" + i + "_" + j).css("color", "#FF0000");
        $("#" + i + "_" + j).css('background-image', 'url(' + flagURL + ')');
        nbFlags--;
      }
    } else {
      arrayMines[i][j] -= 2;
      $("#" + i + "_" + j).prop('value', "");
      $("#" + i + "_" + j).css("color", "");
      $("#" + i + "_" + j).css('background-image', '');
      nbFlags++;
    }
  }
  $('#score-bomb-count').html(("00" + nbFlags).slice(-3));
}

function showBombs() {
  for (var i = 0; i < lines; i++)
    for (var j = 0; j < columns; j++) {
      if (arrayMines[i][j] == 1) {
        $("#" + i + "_" + j).prop('value', "");
        $("#" + i + "_" + j).css("font-size", "20px");
        $("#" + i + "_" + j).css('background-image', 'url(' + bombURL + ')');
      }
      $("#" + i + "_" + j).attr('onclick', 'init()');
    }
}

function checkVictory() {
  //alert (toDiscover);
  if (toDiscover === 0) {
    timer = false;
    for (var i = 0; i < lines; i++)
      for (var j = 0; j < columns; j++) {
        if (arrayMines[i][j] == 1) {
          $("#" + i + "_" + j).prop('value', "");
          $("#" + i + "_" + j).css("color", "#FF0000");
          $("#" + i + "_" + j).css('background-image', 'url(' + flagURL + ')');
        }
        $("#" + i + "_" + j).attr('onclick', 'init()');
      }
    alert("WELL DONE!"+ "\nTIME: " + --count + ' SECONDS');
    toDiscover = -1;
  } 
}