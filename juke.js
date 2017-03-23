function setupConsoleLog()
{
  var old = console.log;
  logger = document.getElementById('logger');
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
  }
}

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
  for (var i = 0; i < songFileList.length; i++)
  {
    var song = songFileList[i];
    listHtml = listHtml + song.title + '<BR>';
  }
  fileList.innerHTML = listHtml;

}

function addSongFile(songFile)
{
  songFileList.push(songFile)
  console.log('Added new song: ' + songFile.filename);
  updateFileList();
}

function addFile(file, i)
{
  if (file)
  {
    var songFile = {};
    songFile.filename = file.name;
    songFile.artist = '';
    songFile.title = file.name.replace(/_/g, ' ');

    jsmediatags.read(file,
    {

      onSuccess: function (tag)
      {
        if (tag.tags.hasOwnProperty('artist'))
        {
          songFile.artist = tag.tags.artist;
        }
        if (tag.tags.hasOwnProperty('title'))
        {
          songFile.title = tag.tags.title;
        }
        if (tag.tags.hasOwnProperty('picture'))
        {
          //songFile.cover = tag.tags.picture;
        }
        addSongFile(songFile);
      },
      onError: function (error)
      {
        console.log(error);
        addSongFile(songFile);
      }
    });
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

function addJSON(e)
{
  var file = e.target.files[0];
  if (file)
  {
    reader = new FileReader();

    reader.onload = function (f)
    {
      localStorage.setItem('songFileList', f.target.result);
      songFileList = JSON.parse(localStorage.getItem('songFileList')) || [];
      updateFileList();
    }

    reader.readAsText(file);
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
  if (songFileList.length == 0)
  {
    alert('Add some song files first!');
  }
  else
  {
    maxRests = Math.min(10, songFileList.length / 2);
    var manage = document.getElementById('manage');
    songListDiv = document.getElementById('songListDiv');
    nowPlayingDiv = document.getElementById('nowPlayingDiv');
    nextPlayingDiv = document.getElementById('nextPlayingDiv');
    deck1 = new Audio(); //document.createElement('AUDIO');
    deck2 = new Audio(); //document.createElement('AUDIO');
    deck1.isLoaded = false;
    deck2.isLoaded = false;
    manage.classList.add('hiddenDiv');

    logger.innerHTML = '';
    console.log('HISTORY');
    console.log('=======');

    // Save to local storage
    localStorage.setItem('songFileList', JSON.stringify(songFileList));

    var downloadJSONLink = document.getElementById('downloadJSON');
    downloadJSONLink.removeAttribute('href');

    for (var i = 0; i < songFileList.length; i++)
    {
      var song = new Song(i, songFileList[i]);
      songList.push(song);
      song.drawButton(songListDiv);
    }
  }
}

function prepareJSONDownload()
{
  var downloadJSONLink = document.getElementById('downloadJSON');

  downloadJSONLink.setAttribute('href', 'data:text/plain;charset=utf-8,' +
    encodeURIComponent(localStorage.getItem('songFileList')));
}

function AddListeners()
{
  document.getElementById('addFiles').addEventListener('change', addFiles, false);
  document.getElementById('startPlayer').addEventListener('click', startPlayer, false);
  document.getElementById('addJSON').addEventListener('change', addJSON, false);
  prepareJSONDownload();
}

function appStart()
{
  songFileList = JSON.parse(localStorage.getItem('songFileList')) || [];
  updateFileList();
  AddListeners();
  setupConsoleLog();
}

(function ()
{
  window.onload = appStart;
  window.onbeforeunload = function ()
  {
    return "Are you sure?";
  };
})();
