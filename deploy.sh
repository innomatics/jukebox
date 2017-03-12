#!/bin/bash
source deploy.config
scp -P $SCP_PORT colors.js globals.js index.html jsmediatags.min.js juke.js song.js styles.css $SCP_SERVER_DIR 
