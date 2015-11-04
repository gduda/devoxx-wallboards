#!/bin/bash
cd ~/projects/work/devoxx/devoxx-wallboards
echo "Building distribution"
grunt build
echo "Publishing to AWS"
rm dist.zip
zip -r dist.zip dist
scp -i ~/.ssh/DevoxxWallKeyPair2015.pem dist.zip ec2-user@ec2-52-31-48-79.eu-west-1.compute.amazonaws.com:~
echo "Done"
