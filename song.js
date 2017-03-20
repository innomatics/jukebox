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

function audioTimeUpdate(e)
{
  var source = e.target;
  var song = source.song;
  if ((source.currentTime - song.lastUpdateTime) > 1)
  {
    song.lastUpdateTime = source.currentTime;
    var timeRemaining = getRemianingTime(source);
    song.updateTimeDisplay(timeRemaining);
    if (timeRemaining < canChangeTime && !song.isFinishing)
    {
      song.isFinishing = true;
      song.timeDisplay.classList.add('isFinishing');

      if (!nextPlaying)
      {
        // Choose the next song
        // get random next unhidden song
        var r = getRandomInt(0, (songList.length - 1));
        while (songList[r].isHidden || songList[r] == nowPlaying)
        {
          r = (r + 1) % songList.length;
        }
        nextPlaying = songList[r];
      }
      // Start playing the next song
      nextPlaying.play();
    }
  }

}

function audioCanPlay(e)
{
  var source = e.target;
  var song = source.song;
  song.totalTime = getRemianingTime(source);
  song.updateTimeDisplay(song.totalTime);
  song.play();
}

function audioEnded(e)
{
  var source = e.target;
  var song = source.song;

  song.hide();
  song.isPlaying = false;
  song.unLoadAudio();

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
}

function Song(id, songFile)
{
  this.id = id;
  this.filename = songFile.filename;

  this.isPlaying = false; // Song currently playing
  this.isFinishing = false; // Song nearly finished
  this.isHidden = false; // Song hidden as was played already
  this.restCount = 0;
  this.playCount = 0;

  this.parent = {};
  this.audio = null;
  this.tile = {};
  this.button = {};
  this.timeDisplay = null;
  this.lastUpdateTime = 0;
  this.totalTime = 0;

  this.title = songFile.title;
  this.artist = songFile.artist;
}

Song.prototype.hide = function ()
{
  this.isHidden = true;
  this.isFinishing = false;
  this.tile.classList.remove('tile');
  this.button.classList.remove('nowPlaying');
  this.timeDisplay.classList.remove('isFinishing');
  this.tile.classList.add('hiddenDiv');

  this.parent.removeChild(this.tile);
  songListDiv.insertBefore(this.tile, songListDiv.lastChild.nextSibling);
  this.parent = songListDiv;

  this.lastUpdateTime = 0;
}

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
  if (this.audio)
  {
    if (this.audio.isLoaded)
    {
      this.audio.play();
      this.button.classList.remove('nextPlaying');
      this.button.classList.add('nowPlaying');
      this.isFinishing = false;
      this.isPlaying = true;
      nowPlaying = this;
      nextPlaying = null;

      this.playCount++;

      console.log(this.title + ' (' + this.playCount + ')');
      // insert at top
      this.parent.removeChild(this.tile);
      nowPlayingDiv.insertBefore(this.tile, nowPlayingDiv.lastChild.nextSibling);
      this.parent = nowPlayingDiv;
      window.scrollTo(0, 0);
    }
  }
  else
  {
    this.loadAudio();
  }
}

Song.prototype.drawButton = function (parent)
{
  this.parent = parent;
  this.tile = document.createElement('div');
  this.tile.id = 'tile' + this.id;
  this.tile.classList.add('tile');

  this.button = document.createElement('div');
  this.button.id = 'button' + this.id;

  var buttonText = '<span>';
  if (this.artist)
  {
    buttonText += this.artist + '<BR><BR>';
  }
  buttonText += this.title + '</span>';
  this.button.innerHTML = buttonText;

  this.button.classList.add('playButton');

  this.timeDisplay = document.createElement('div');
  this.timeDisplay.id = 'timeDisplay' + this.id;
  this.timeDisplay.classList.add('timeDisplay');

  var c = getRandomColor(this.title);
  this.button.style.backgroundColor = '#' + c;
  t = getComplimentaryColor(c);
  this.button.style.color = '#' + t.toString(16);
  this.tile.style.color = '#' + t.toString(16);

  this.tile.appendChild(this.button);
  this.tile.appendChild(this.timeDisplay);
  parent.appendChild(this.tile);

  var song = this;
  this.button.addEventListener('click', function songClicked(e)
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
        song.button.classList.add('nextPlaying');
        song.parent.removeChild(song.tile);
        nextPlayingDiv.insertBefore(song.tile, nextPlayingDiv.lastChild.nextSibling);
        song.parent = nextPlayingDiv;
        window.scrollTo(0, 0);
      }
      else
      {
        // next song already chosen do nothing
      }
    }
    else
    {
      // choosing the first song
      song.play();
    }
  }, false);
}

Song.prototype.updateTimeDisplay = function (timeRemaining)
{
  this.timeDisplay.innerHTML = getTimeDisplay(timeRemaining);
}

Song.prototype.unLoadAudio = function ()
{
  this.audio.isLoaded = false;
  this.audio.removeEventListener('timeupdate', audioTimeUpdate);
  this.audio.removeEventListener('canplay', audioCanPlay);
  this.audio.removeEventListener('ended', audioEnded);
  this.audio = null;
}

Song.prototype.loadAudio = function ()
{
  var song = this;

  song.audio = deck1.isLoaded ? deck2 : deck1;
  song.audio.isLoaded = true;
  song.audio.type = 'audio/mpeg';
  song.audio.song = this;

  song.audio.src = music_http_folder + this.filename;

  song.audio.addEventListener('timeupdate', audioTimeUpdate, false);
  song.audio.addEventListener('canplay', audioCanPlay, false);
  song.audio.addEventListener('ended', audioEnded, false);
}
