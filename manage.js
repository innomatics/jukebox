function addFile(file)
{
  if (file)
  {
    var reader = new FileReader();
    reader.onload = function ()
    {
      alert(this.result);
    }
    reader.readAsDataURL(file);
    alert(file.name);

    // Add file to local JSON
  }
}

function addFiles(e)
{
  var files = e.target.files;
  for (var i=0; i<files.length; i++)
  {
    addFile(files[i]);
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
