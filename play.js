var songList = [];

function printSongList()
{
  songList = JSON.parse(localStorage.getItem('songList'));
  if (!songList)
  {
    alert('No songs loaded!!');
  }
  else
  {
    var result = '';
    for (var i = 0; i < songList.length; i++)
    {
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
