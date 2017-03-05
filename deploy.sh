#!/bin/bash
source deploy.config
scp -P $SCP_PORT deploy.sh index.html jsmediatags.min.js manage.js play.js styles.css $SCP_SERVER_DIR
