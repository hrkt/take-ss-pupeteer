NAME     := take-ss-pupeteer
VERSION  := 0.1.0
REVISION := $(shell git rev-parse --short HEAD)

LABEL=take-ss-pupeteer:latest

build-container:
	sudo docker build -t $(LABEL) . 

run-container:
	sudo docker run -p 8080:8080 $(LABEL)

clean-container:
	sudo docker image prune
	sudo docker container prune

check-container:
	curl http://localhost:8080/bin/date

push-container:
	sudo docker push $(LABEL) hrkt/$(LABEL)
