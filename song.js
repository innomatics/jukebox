// song.js
/**
 * Returns a random integer between min (inclusive) and max (inclusive)
 * Using Math.round() will give you a non-uniform distribution!
 */
function getRandomInt(min, max)
{
  return Math.floor(Math.random() * (max - min + 1)) + min;
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

function Song(id, file, afterLoaded)
{
  this.id = id;
  this.file = file;
  this.filename = file.name;

  this.isPlaying = false; // Song currently playing
  this.isFinishing = false; // Song nearly finished
  this.isHidden = false; // Song hidden as was played already
  this.restCount = 0;

  this.parent = {};
  this.audio = {};
  this.tile = {};
  this.button = {};
  this.timeDisplay = {};
  this.lastUpdateTime = 0;
  this.totalTime = 0;

  this.title = file.name;
  this.artist = 'unknown';
  this.cover = null;

  var song = this;

  jsmediatags.read(this.file,
  {
    onSuccess: function (tag)
    {
      if (tag.tags.hasOwnProperty('artist'))
      {
        song.artist = tag.tags.artist;
      }
      if (tag.tags.hasOwnProperty('title'))
      {
        song.title = tag.tags.title;
      }
      if (tag.tags.hasOwnProperty('picture'))
      {
        song.cover = tag.tags.picture;
      }
      afterLoaded();
    },
    onError: function (error)
    {
      console.log(error);
    }
  });
}

Song.prototype.hide = function ()
{
  this.isHidden = true;
  this.tile.classList.remove('tile');
  this.button.classList.remove('nowPlaying');
  this.timeDisplay.classList.remove('isFinishing');
  this.tile.classList.add('hiddenDiv');

  this.lastUpdateTime = 0;
};

Song.prototype.unHide = function ()
{
  this.isHidden = false;
  this.tile.classList.remove('hiddenDiv');
  this.tile.classList.add('tile');
  this.restCount = 0;
  this.updateTimeDisplay(this.totalTime);
}

Song.prototype.play = function ()
{
  this.audio.play();
  this.button.classList.remove('nextPlaying');
  this.button.classList.add('nowPlaying');
  this.isFinishing = false;
  this.isPlaying = true;
  nowPlaying = this;
  nextPlaying = null;

  // insert at top
  this.parent.removeChild(this.tile);
  this.parent.insertBefore(this.tile, this.parent.firstChild);
  window.scrollTo(0, 0);
}

Song.prototype.drawButton = function (parent)
{
  this.parent = parent;
  this.tile = document.createElement('div');
  this.tile.id = 'tile' + this.id;
  this.tile.classList.add('tile');

  this.button = document.createElement('div');
  this.button.id = 'button' + this.id;
  this.button.innerHTML = '<span>' + this.artist + '<BR><BR>' + this.title + '</span>';
  this.button.classList.add('playButton');

  var c = getRandomColor(this.title);
  this.button.style.backgroundColor = '#' + c;
  t = getComplimentaryColor(c);
  this.button.style.color = '#' + t.toString(16);
  this.tile.style.color = '#' + t.toString(16);

  this.tile.appendChild(this.button);
  parent.appendChild(this.tile);

  var song = this;
  this.button.addEventListener('click', function (e)
  {
    if (nowPlaying)
    {
      if (nowPlaying == song)
      {
        // You can't stop it once you start!
      }
      else if (!nextPlaying && nowPlaying)
      {
        // Choosing the next song
        nextPlaying = song;
        nextPlaying.button.classList.add('nextPlaying');
        song.parent.removeChild(song.tile);
        song.parent.insertBefore(song.tile, song.parent.firstChild.nextSibling);
        window.scrollTo(0, 0);
      }
      else
      {
        // next song already chosen
      }
    }
    else
    {
      // choosing the next song
      song.play();
    }
  }, false);
}

Song.prototype.updateTimeDisplay = function (timeRemaining)
{
  this.timeDisplay.innerHTML = getTimeDisplay(timeRemaining);
}

Song.prototype.loadAudio = function (parent)
{
  var reader = new FileReader(this.file);
  var song = this;
  reader.addEventListener('load', function ()
  {
    song.audio = document.createElement('audio');
    song.audio.id = 'audio' + song.id;
    song.audio.src = this.result;
    song.audio.type = 'audio/mpeg';

    song.audio.addEventListener('timeupdate',
      function ()
      {
        if ((this.currentTime - song.lastUpdateTime) > 1)
        {
          song.lastUpdateTime = this.currentTime;
          var timeRemaining = getRemianingTime(this);
          song.updateTimeDisplay(timeRemaining);
          if (timeRemaining < canChangeTime)
          {
            song.isFinishing = true;
            song.timeDisplay.classList.add('isFinishing');
          }
        }

      }, false);

    song.audio.addEventListener('loadedmetadata',
      function ()
      {
        song.timeDisplay = document.createElement('div');
        song.timeDisplay.id = 'timeDisplay' + song.id;
        song.timeDisplay.classList.add('timeDisplay');
        song.totalTime = getRemianingTime(this);
        song.updateTimeDisplay(song.totalTime);

        song.tile.appendChild(song.timeDisplay);
      }, false);

    song.audio.addEventListener('ended',
      function ()
      {
        if (nextPlaying)
        {
          // Next song already chosen
          nextPlaying.play();
        }
        else
        {
          // get random next unhidden song
          var r = getRandomInt(0, (songList.length - 1));
          while (songList[r].isHidden || songList[r] == nowPlaying)
          {
            r = (r + 1) % songList.length;
          }
          songList[r].play();
        }

        song.hide();
        song.isPlaying = false;

        // unhide any songs that have rested long enough
        for (var i = 0; i < songList.length; i++)
        {
          var otherSong = songList[i];
          if (otherSong.isHidden)
          {
            otherSong.restCount++;
            if (otherSong.restCount > maxRests)
            {
              otherSong.unHide();
            }
          }
        }

      }, false);
  }, false);
  reader.readAsDataURL(this.file);
}
