#!/bin/bash
cd /Users/jankeesvanandel/projects/work/devoxx/devoxx-wallboards
echo "Building distribution"
grunt build
echo "Publishing to AWS"
rm dist.zip
zip -r dist.zip dist
scp -i ~/.ssh/DevoxxWallKeyPair.pem dist.zip ubuntu@ec2-54-93-181-193.eu-central-1.compute.amazonaws.com:~
echo "Done"
