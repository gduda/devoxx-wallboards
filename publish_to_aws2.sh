#!/bin/bash
cd ~/projects/work/devoxx/devoxx-wallboards
echo "Building distribution"
grunt build
echo "Publishing to AWS"

aws deploy push --application-name devoxx-wallboards --s3-location s3://<bucket-name>/dist.zip --source dist/ --profile jankeesvanandel
aws deploy create-deployment --application-name devoxx-wallboards --s3-location bucket=<bucket-name>,key=dist.zip,bundleType=zip --deployment-group-name devoxx-wallboards --profile jankeesvanandel

echo "Done"
