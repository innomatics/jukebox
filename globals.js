var two32 = 4294967295; // 2^32

var songList = [];
var songCount = 0;

var nowPlaying = null;
var nextPlaying = null;
var canChangeTime = 20;

var maxRests = 1; // Number of plays song stays hidden after being played

var jsmediatags = window.jsmediatags;
