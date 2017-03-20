var two32 = 4294967295; // 2^32
var READY_TO_PLAY = 4;

var songList = [];
var songFileList = [];
var songCount = 0;

var nowPlaying = null;
var nextPlaying = null;
var nowPlayingDiv = null;
var nextPlayingDiv = null;
var songListDiv = null;

var deck1 = null;
var deck2 = null;

var canChangeTime = 3; // Seconds before end when can start next tune

var maxRests = 1; // Number of plays song stays hidden after being played

var jsmediatags = window.jsmediatags;

var fileURLInput = null;
var music_http_folder = 'http://localhost:12345/';
