# build with latest mode set
all: build-docker-image test

BASE_PATH="$(shell pwd)/${shell dirname "$0"}"
PACKAGE_VERSION=$(shell scripts/get-version.sh)

# utils

build-docker-image:
	@echo "[i] Building Docker Image..."
	docker image build --platform linux/amd64 -t macchie/drone-matternotify:latest .

test:
	@echo "[i] Running Docker Image..."
	@docker run -it --rm \
		-e GIT_COMMITTER_NAME='John Doe' \
		-e GIT_COMMITTER_EMAIL='committer@example.com' \
		-e DRONE_REPO='ExampleTeam/example-repository' \
		-e DRONE_TAG='v1.0.0' \
		-e PLUGIN_DEBUG='true' \
		-e PLUGIN_WEBHOOK='https://example.matter.notify/hooks/123456567657567567' \
		-e PLUGIN_TITLE='A new hope on {{DRONE_REPO_OWNER}}/{{DRONE_REPO_NAME}}, version is now {{DRONE_TAG}}!' \
		-e PLUGIN_TITLE_LINK='https://github.com/{{DRONE_REPO_OWNER}}/{{DRONE_REPO_NAME}}/commit/{{DRONE_COMMIT}}' \
		-e PLUGIN_CHANNEL='#example-channel' \
		-e PLUGIN_USERNAME='MatterNotify Custom Username' \
		-e PLUGIN_ICON_URL='https://i.postimg.cc/VkyND0vs/bot.png' \
		-e PLUGIN_TEXT='Released by [{{GIT_COMMITTER_NAME}}](mailto:{{GIT_COMMITTER_EMAIL}}).' \
		-e PLUGIN_COLOR='#FF7700' \
		-e PLUGIN_MAILTO='team-manager@example.com' \
		-e PLUGIN_MAILTO_CC='quality@example.com,marketing@example.com' \
		-e PLUGIN_MAILTO_SUBJECT='Version is now {{DRONE_TAG}}!' \
		-e PLUGIN_MAILTO_LABEL='Share the Secret!' \
		macchie/drone-matternotify:latest

push: build-docker-image
	@echo "[i] Pushing Docker Image..."
	@docker image push macchie/drone-matternotify:latest