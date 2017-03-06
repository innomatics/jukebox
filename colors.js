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

function getComplimentaryColor(color)
{
  var cc = 0xffffff ^ parseInt(color, 16);
  return cc;
}
