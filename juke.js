//example easing functions
function linearEase(currentIteration, startValue, changeInValue, totalIterations)
{
  return changeInValue * currentIteration / totalIterations + startValue;
}

function easeOutCubic(currentIteration, startValue, changeInValue, totalIterations)
{
  return changeInValue * (Math.pow(currentIteration / totalIterations - 1, 3) + 1) + startValue;
}

function scrollToItemId(containerId, scrollToId)
{

  var scrollContainer = document.getElementById(containerId);
  var item = document.getElementById(scrollToId);

  //with animation
  var from = scrollContainer.scrollTop;
  var by = item.offsetTop - scrollContainer.scrollTop;
  if (from < item.offsetTop)
  {
    if (item.offsetTop > scrollContainer.scrollHeight - scrollContainer.clientHeight)
    {
      by = (scrollContainer.scrollHeight - scrollContainer.clientHeight) - scrollContainer.scrollTop;
    }
  }

  var currentIteration = 0;

  /**
   * get total iterations
   * 60 -> requestAnimationFrame 60/second
   * second parameter -> time in seconds for the animation
   **/
  var animIterations = Math.round(60 * 0.5);

  (function scroll()
  {
    var value = easeOutCubic(currentIteration, from, by, animIterations);
    scrollContainer.scrollTop = value;
    currentIteration++;
    if (currentIteration < animIterations)
    {
      requestAnimationFrame(scroll);
    }
  })();

  //without animation
  //scrollContainer.scrollTop = item.offsetTop;

}

function updateFileList()
{
  var fileList = document.getElementById('fileList');

  var listHtml = '';
  for (var i = 0; i < songList.length; i++)
  {
    var song = songList[i];
    listHtml = listHtml + song.title + '<BR>';
  }
  fileList.innerHTML = listHtml;
}

function addFile(file, i)
{
  if (file)
  {
    var song = new Song(i, file, updateFileList);
    songList.push(song);
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
  if (songList.length == 0)
  {
    alert('Add some song files first!');
  }
  else
  {
    maxRests = songList.length / 2;
    var buttons = document.getElementById('buttons');
    var manage = document.getElementById('manage');
    manage.classList.add('hiddenDiv');

    for (var i = 0; i < songList.length; i++)
    {
      var song = songList[i];
      song.drawButton(buttons);
      song.loadAudio();
    }
  }
}

function AddListeners()
{
  document.getElementById('addFiles').addEventListener('change', addFiles, false);
  document.getElementById('startPlayer').addEventListener('click', startPlayer, false);
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
