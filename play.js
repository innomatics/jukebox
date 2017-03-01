var songList = [];
var songFolder = '';

function drawPlayButton(parentElement, filename, artist, title, cover)
{
  var sound = document.createElement('audio');
  sound.id = 'audio-player';
  sound.controls = 'controls';
  sound.src = 'file://' + songFolder + filename;
  sound.type = 'audio/mpeg';
  parentElement.appendChild(sound);

}

function printSongList()
{
  songList = JSON.parse(localStorage.getItem('songList'));
  if (!songList)
  {
    alert('No songs loaded!!');
  }
  else
  {
    var buttons = document.getElementById('buttons');
    var result = '';
    for (var i = 0; i < songList.length; i++)
    {
      drawPlayButton(buttons,
        songList[i].filename,
        songList[i].artist,
        songList[i].title,
        songList[i].cover);

      result += songList[i].title + ' by ' + songList[i].artist + '<BR>'
    }
    document.getElementById('songList').innerHTML = result;
  }
}

function drawUI()
{
  // Read JSON from local storage
  printSongList();

  // Build audio html5 elements
}

function AddListeners()
{
  //document.getElementById('addFiles').addEventListener('change', addFiles, false);
}

function appStart()
{
  songFolder = localStorage.getItem('songFolder');
  AddListeners();
  drawUI();
}

(function ()
{
  window.onload = appStart;
  window.onbeforeunload = function ()
  {
    return "Are you sure?";
  };
})();
