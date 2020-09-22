#!/bin/bash
mkdir -p public
cp colors.js globals.js index.html jsmediatags.min.js juke.js play.js song.js styles.css public
aws s3 sync public s3://junior-juke/
