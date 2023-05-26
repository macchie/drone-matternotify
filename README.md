# drone-matternotify

![Docker Pulls](https://img.shields.io/docker/pulls/macchie/drone-matternotify?style=for-the-badge) ![Docker Image Size (latest by date)](https://img.shields.io/docker/image-size/macchie/drone-matternotify?style=for-the-badge)


`drone-matternotify` is a Drone Plugin used to send notifications to `Mattermost` via `Incoming Webhooks`.

### Usage

Add a new Step in your `.drone.yml` file:

```yml
[...]

- name: MatterNotify
  image: macchie/drone-matternotify
  settings:
    webhook: "https://your.mattermost.hosted/hooks/123456567657567567"
    channel: "#example-channel"
    username: "MatterNotify Custom Username"
    icon_url: "https://i.postimg.cc/VkyND0vs/bot.png"
    title: "A new hope on {{DRONE_REPO_OWNER}}/{{DRONE_REPO_NAME}}, version is now {{DRONE_TAG}}!"
    title_link: "https://github.com/{{DRONE_REPO_OWNER}}/{{DRONE_REPO_NAME}}/commit/{{DRONE_COMMIT}}"
    text: ":rocket: Released by [{{DRONE_COMMIT_AUTHOR_NAME}}](mailto:{{DRONE_COMMIT_AUTHOR_EMAIL}})."
    mailto: "team-manager@example.com"
    mailto_subject: "Version is now {{DRONE_TAG}}!"
    mailto_label: "Share the Secret!"
    mailto_cc:
      - "quality@example.com"
      - "marketing@example.com"
      - "{{DRONE_COMMIT_AUTHOR_EMAIL}}"

[...]
```

### Parameters

- `webhook`: **mandatory**, your Mattermost Incoming WebHook URL
- `channel`: **mandatory**, your Mattermost Channel Name
- `username`: **optional**, depending on your Mattermost configuration this could either be forced on the WebHook definition or the default for your Mattermost setup
- `icon_url`: **optional**, depending on your Mattermost configuration this could either be forced on the WebHook definition or the default for your Mattermost setup
- `title`: **optional**, defaults to `New release of {{DRONE_REPO}}@{{DRONE_TAG}}!`
- `title_link`: **optional**
- `text`: **optional**, additional text to append to your Notification
- `mailto`: **optional**, if specified automatically prepends a link to the message to send an email to the specified address
- `mailto_cc`: **optional**, add cc recipients to your `mailto`
- `mailto_subject`: **optional**, customize your email subject, defaults to `title`
- `mailto_label`: **optional**, customize link text in message, defaults to `Send notification email`

##### About Variables Substitution

You are free to embed every environment variable in the following parameters:

- `title`
- `title_link`
- `text`
- `mailto_cc`
- `mailto_label`
- `mailto_subject`

Variables may be added inside text using the syntax `{{ENV_VARIABLE_NAME}}`, for example: `{{DRONE_REPO}}`.

Check Drone Docs for all the available Environment variables [here](https://docs.drone.io/pipeline/environment/reference/).
