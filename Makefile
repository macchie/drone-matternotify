# build with latest mode set
all: build-docker-image

BASE_PATH="$(shell pwd)/${shell dirname "$0"}"

# utils

build-docker-image:
	@echo "[i] Building Docker Image..."
	docker image build --platform linux/amd64 -t macchie/drone-matternotify:latest .

push: build-docker-image
	@echo "[i] Pushing Docker Image..."
	@docker image push macchie/drone-matternotify:latest