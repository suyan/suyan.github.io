#!/bin/bash
sudo docker info &> /dev/null || sudo docker -d &
#Before run this shell you should computer USERID same to  docker USERID is 1000
#App will use this USERID to run and manage code.
sudo docker run --rm -it -p 4000:4000 -v $(pwd):/source schickling/jekyll
