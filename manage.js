var songList = [];
var songCount = 0;
var songFolder = '';
var jsmediatags = window.jsmediatags;

function addSong(file, artist, title, cover, i)
{
  var newSong = {};
  newSong.filename = file.name;
  newSong.artist = artist;
  newSong.title = title;
  newSong.cover = cover;
  newSong.file = file;

  songList.push(newSong);

  if (i == (songCount - 1))
  {
    printSongList();
  }
}

function addFile(file, i)
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
        addSong(file, artist, title, cover, i);
      },
      onError: function (error)
      {
        console.log(error);
      }
    });
  }
}

function addFiles(e)
{
  songList = [];
  var files = e.target.files;
  songCount = files.length;
  for (var i = 0; i < songCount; i++)
  {
    addFile(files[i], i);
  }
}

function AddListeners()
{
  document.getElementById('addFiles').addEventListener('change', addFiles, false);
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
