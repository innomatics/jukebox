function drawUI() {
  // Read JSON from local storage

  // Build audio html5 elements
}
function AddListeners()
{
  document.getElementById('addFiles').addEventListener('change', addFiles, false);
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
