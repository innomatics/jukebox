(function ()
{
  var old = console.log;
  var logger = document.getElementById('logger');
  console.log = function (message)
  {
    if (typeof message == 'object')
    {
      logger.innerHTML += (JSON && JSON.stringify ? JSON.stringify(message) : message) + '<br />';
    }
    else
    {
      logger.innerHTML += message + '<br />';
    }
    old(message); // log normally as well
  }
})();

//example easing functions
function linearEase(currentIteration, startValue, changeInValue, totalIterations)
{
  return changeInValue * currentIteration / totalIterations + startValue;
}

function easeOutCubic(currentIteration, startValue, changeInValue, totalIterations)
{
  return changeInValue * (Math.pow(currentIteration / totalIterations - 1, 3) + 1) + startValue;
}

function updateFileList()
{
  var fileList = document.getElementById('fileList');

  var listHtml = '';
  for (var i = 0; i < songList.length; i++)
  {
    var song = songList[i];
    listHtml = listHtml + song.title + '<BR>';
  }
  fileList.innerHTML = listHtml;
}

function addFile(file, i)
{
  if (file)
  {
    var song = new Song(i, file, updateFileList);
    songList.push(song);
  }
}

function addFiles(e)
{
  var files = e.target.files;
  songCount = files.length;
  for (var i = 0; i < songCount; i++)
  {
    addFile(files[i], i);
  }
}

function hideDiv(div)
{
  div.classList.add('hiddenDiv');
}

function unHideDiv(div)
{
  div.classList.remove('hiddenDiv');
}

function startPlayer()
{
  if (songList.length == 0)
  {
    alert('Add some song files first!');
  }
  else
  {
    maxRests = songList.length / 2;
    var manage = document.getElementById('manage');
    songListDiv = document.getElementById('songListDiv');
    nowPlayingDiv = document.getElementById('nowPlayingDiv');
    nextPlayingDiv = document.getElementById('nextPlayingDiv');
    deck1 = new Audio(); //document.createElement('AUDIO');
    deck2 = new Audio(); //document.createElement('AUDIO');
    deck1.isLoaded = false;
    deck2.isLoaded = false;
    manage.classList.add('hiddenDiv');

    for (var i = 0; i < songList.length; i++)
    {
      var song = songList[i];
      song.drawButton(songListDiv);
      //song.loadAudio();
    }
  }
}

function AddListeners()
{
  document.getElementById('addFiles').addEventListener('change', addFiles, false);
  document.getElementById('startPlayer').addEventListener('click', startPlayer, false);
}

function appStart()
{
  AddListeners();
}

(function ()
{
  window.onload = appStart;
  window.onbeforeunload = function ()
  {
    return "Are you sure?";
  };
})();
