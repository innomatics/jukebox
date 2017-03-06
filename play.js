//var songList = [];
//var songFolder = '';

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

        // our actual buttons
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
          //spinnerDiv.style.visibility = 'visible';
          spinnerDiv.classList.remove('hiddenDiv');
          spinnerDiv.classList.add('unHiddenDiv');

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
