var songList = [];
var songFolder = '';
var jsmediatags = window.jsmediatags;

function printSongList()
{
  var result = '';
  for (var i = 0; i < songList.length; i++)
  {
    result += songList[i].title + ' by ' + songList[i].artist + '<BR>'
  }
  document.getElementById('songList').innerHTML = result;
}

function addSong(filename, artist, title, cover)
{
  var newSong = {};
  newSong.filename = filename;
  newSong.artist = artist;
  newSong.title = title;
  newSong.cover = cover;
  songList.push(newSong);
  printSongList();
  localStorage.setItem('songList', JSON.stringify(songList));
}

function addFile(file)
{
  if (file)
  {

    jsmediatags.read(file,
    {
      onSuccess: function (tag)
      {
        console.log(tag);
        var artist = 'unknown';
        var title = file.name;
        var cover = null;
        if (tag.tags.hasOwnProperty('artist'))
        {
          artist = tag.tags.artist;
        }
        if (tag.tags.hasOwnProperty('title'))
        {
          title = tag.tags.title;
        }
        if (tag.tags.hasOwnProperty('picture'))
        {
          cover = tag.tags.picture;
        }
        addSong(file.name, artist, title, cover);
      },
      onError: function (error)
      {
        console.log(error);
      }
    });

    // Add file to local JSON
  }
}

function addFiles(e)
{
  if (songFolder.length == 0)
  {
    alert('Make sure to set the song folder first.');
  }
  else
  {
    songList = [];
    var files = e.target.files;
    for (var i = 0; i < files.length; i++)
    {
      addFile(files[i]);
    }
  }
}

function setFolder(e)
{
  songFolder = e.target.value;
  localStorage.setItem('songFolder', songFolder);
}

function AddListeners()
{
  document.getElementById('addFiles').addEventListener('change', addFiles, false);
  document.getElementById('songFolder').addEventListener('change', setFolder, false);
}

function appStart()
{
  AddListeners();
  songFolder = localStorage.getItem('songFolder');
  if (songFolder == null)
  {
    songFolder = document.getElementById('songFolder').value;
    localStorage.setItem('songFolder', songFolder);
  }
  songList = JSON.parse(localStorage.getItem('songList'));
  if (!songList)
  {
    songList = [];
  }
  printSongList();
}

(function ()
{
  window.onload = appStart;
})();
