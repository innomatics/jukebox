//var songList = [];
//var songFolder = '';
var two32 = 4294967295; // 2^32
var nowPlaying = '';
var spinnerDiv;
var buttonsDiv;
var canChangeTime = 10;
var canChangeNow = false;
var lastUpdateTime = 0;

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
  var timeLeft = document.getElementById('timeLeft' + id);

  if (nowPlaying == id)
  {
    audio.pause();
    nowPlaying = '';
    btn.classList.remove('nowPlaying');
    timeLeft.classList.remove('canChangeNow');
  }
  else if (nowPlaying == '')
  {
    audio.play();
    nowPlaying = id;
    btn.classList.add('nowPlaying');
    timeLeft.classList.remove('canChangeNow');
    canChangeNow = false;
  }
  else
  {
    var npa = document.getElementById('audio' + nowPlaying);
    if (canChangeNow == true)
    {
      audio.play();
      nowPlaying = id;
      btn.classList.add('nowPlaying');
      timeLeft.classList.remove('canChangeNow');
      canChangeNow = false;
    }
  }
}

function getTimeDisplay(t)
{
  var s = t % 60;
  var m = Math.floor(t / 60) % 60;
  s = s < 10 ? "0" + s : s;
  m = m < 10 ? "0" + m : m;
  return m + ":" + s;
}

function getRemianingTime(audio)
{
  var duration = parseInt(audio.duration, 10);
  var currentTime = parseInt(audio.currentTime, 10);
  var t = duration - currentTime;
  return t;
}

function drawPlayButton(id, parentElement, filename, artist, title, cover, file)
{
  var reader = new FileReader();
  reader.addEventListener('load', function ()
  {
    // hidden audio elements
    var sound = document.createElement('audio');
    sound.id = 'audio' + id;
    sound.src = reader.result;
    sound.type = 'audio/mpeg';
    //sound.preload = 'auto';
    sound.addEventListener('timeupdate',
      function ()
      {
        if ((sound.currentTime - lastUpdateTime) > 1)
        {
          lastUpdateTime = sound.currentTime;
          var timeLeftDiv = document.getElementById('timeLeft' + id);
          var timeRemaining = getRemianingTime(sound);
          timeLeftDiv.innerHTML = getTimeDisplay(timeRemaining);
          if (timeRemaining < canChangeTime)
          {
            canChangeNow = true;
            timeLeftDiv.classList.add('canChangeNow');
          }
        }

      }, false);

    sound.addEventListener('loadedmetadata',
      function ()
      {
        var timeLeft = document.createElement('div');
        timeLeft.id = 'timeLeft' + id;
        timeLeft.classList.add('timeLeft');
        timeLeft.innerHTML = getTimeDisplay(getRemianingTime(sound));
        var tile = document.getElementById('tile' + id);
        tile.appendChild(timeLeft);
        if ((id + 1) == songList.length)
        {
          spinnerDiv.classList.remove('unHiddenDiv');
          spinnerDiv.classList.add('hiddenDiv');
          buttonsDiv.classList.remove('hiddenDiv');
          buttonsDiv.classList.add('unHiddenDiv');
        }
      }, false)

    parentElement.appendChild(sound);

    // our actual buttons
    var tile = document.createElement('div');
    tile.id = 'tile' + id;
    tile.classList.add('tile');

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
    tile.style.color = '#' + t.toString(16);

    tile.appendChild(btn);
    parentElement.appendChild(tile);

  }, false);
  reader.readAsDataURL(file);
}

function drawButtons()
{
  if (songList.length == 0)
  {
    alert('No songs loaded!!');
  }
  else
  {
    var manageDiv = document.getElementById('manageDiv');
    manageDiv.classList.add('hiddenDiv');
    spinnerDiv = document.getElementById('spinnerDiv');
    spinnerDiv.classList.remove('hiddenDiv');
    spinnerDiv.classList.add('unHiddenDiv');

    buttonsDiv = document.getElementById('buttons');
    var result = '';
    for (var i = 0; i < songList.length; i++)
    {
      drawPlayButton(i, buttonsDiv,
        songList[i].filename,
        songList[i].artist,
        songList[i].title,
        songList[i].cover,
        songList[i].file);
    }
  }
}
