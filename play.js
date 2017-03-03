//var songList = [];
//var songFolder = '';
var two32 = 4294967295; // 2^32
var nowPlaying = '';

String.prototype.hashCode = function ()
{
  var hash = 0;
  if (this.length == 0) return hash;
  for (i = 0; i < this.length; i++)
  {
    var char = this.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32bit integer
    hash += two32;
  }
  return hash;
}

function getRandomColor(title)
{
  var bigint = title.hashCode();
  var hex = bigint.toString(16);
  var smallhex = parseInt(hex, 16) % parseInt('0xffffff', 16);
  return smallhex.toString(16);
}

function songclick(e)
{
  var id = e.target.id;
  if (id == '')
  {
    id = e.target.parentElement.id;
  }
  id = id.replace(/\D/g, '');
  var audio = document.getElementById('audio' + id);
  var btn = document.getElementById('button' + id);

  if (nowPlaying == id)
  {
    audio.pause();
    nowPlaying = '';
    btn.classList.remove('nowPlaying');
  }
  else if (nowPlaying == '')
  {
    audio.play();
    nowPlaying = id;
    btn.classList.add('nowPlaying');
  }
}

function drawPlayButton(id, parentElement, filename, artist, title, cover, file)
{
  var reader = new FileReader();
  reader.addEventListener('load', function ()
  {

    // hidden audio elements
    var sound = document.createElement('audio');
    sound.id = 'audio' + id;
    // sound.src = 'file://' + songFolder + filename;
    sound.src = reader.result;
    sound.type = 'audio/mpeg';
    parentElement.appendChild(sound);

    // our actual buttons
    var btn = document.createElement('div');
    btn.id = 'button' + id;
    btn.innerHTML = '<span>' + artist + '<BR><BR>' + title + '</span>';
    btn.addEventListener('click', function (e)
    {
      songclick(e);
    }, false);
    btn.classList.add('playButton');
    var c = getRandomColor(title);
    btn.style.backgroundColor = '#' + c;
    t = 0xffffff ^ parseInt(c, 16);
    btn.style.color = '#' + t.toString(16);
    parentElement.appendChild(btn);
  }, false);
  reader.readAsDataURL(file);
}

function printSongList()
{
  //songList = JSON.parse(localStorage.getItem('songList'));
  if (songList.count == 0)
  {
    alert('No songs loaded!!');
  }
  else
  {
    var manageDiv = document.getElementById('manageDiv');
    manageDiv.classList.add('hiddenDiv');
    var buttons = document.getElementById('buttons');
    var result = '';
    for (var i = 0; i < songList.length; i++)
    {
      drawPlayButton(i, buttons,
        songList[i].filename,
        songList[i].artist,
        songList[i].title,
        songList[i].cover,
        songList[i].file);
    }
  }
}

/*
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
*/
