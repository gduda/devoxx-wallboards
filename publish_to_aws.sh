#!/bin/bash
cd ~/projects/work/devoxx/devoxx-wallboards
echo "Building distribution"
grunt build
echo "Publishing to AWS"
rm dist.zip
zip -r dist.zip dist

AWS_HOST=ec2-54-173-228-230.compute-1.amazonaws.com
AWS_USER=ec2-user
AWS_KEY=~/.ssh/DevoxxWallKeyPair2016.pem

scp -i $AWS_KEY dist.zip $AWS_USER@$AWS_HOST:~
ssh -i $AWS_KEY $AWS_USER@$AWS_HOST "rm -rf /www/data/dist_new/* && unzip ~/dist.zip -d /www/data/dist_new && rm -rf /www/data/dist/* && mv -f /www/data/dist_new/dist /www/data"

echo "Done"
