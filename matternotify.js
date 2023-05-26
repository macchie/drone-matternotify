#!/usr/bin/env node

const emailRegex = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;

class MatterNotify {

  static async execute() {
    if (process.env.PLUGIN_DEBUG === 'true') {
      console.log(``)
      console.log(process.env)
      console.log(``)
    }

    if (!process.env.PLUGIN_WEBHOOK) {
      console.log(`PLUGIN_WEBHOOK ENV variable not set!`);
      return;
    }

    if (!process.env.PLUGIN_CHANNEL) {
      console.log(`PLUGIN_CHANNEL ENV variable not set!`);
      return;
    }

    if (!process.env.PLUGIN_MODE) {
      process.env.PLUGIN_MODE = 'NOTIFICATION';
    }

    let _title = process.env.PLUGIN_TITLE || `New release of ${process.env.DRONE_REPO}@${process.env.DRONE_TAG}!`;
    let _titleLink = process.env.PLUGIN_TITLE_LINK || ``;
    let _text = process.env.PLUGIN_TEXT || ``;
    let _mailToSubject = process.env.PLUGIN_MAILTO_SUBJECT || _title;
    let _mailToLabel = process.env.PLUGIN_MAILTO_LABEL || `Send notification email`;
    let _mailtoCC = process.env.PLUGIN_MAILTO_CC || ``;

    _text = _text.replace(/\\n/gm, `\n`);

    for (const key in process.env) {
      if (process.env.hasOwnProperty(key)) {
        _title = _title.replace(`{{${key}}}`, process.env[key]);
        _titleLink = _titleLink.replace(`{{${key}}}`, process.env[key]);
        _text = _text.replace(`{{${key}}}`, process.env[key]);
        _mailToSubject = _mailToSubject.replace(`{{${key}}}`, process.env[key]);
        _mailToLabel = _mailToLabel.replace(`{{${key}}}`, process.env[key]);
        _mailtoCC = _mailtoCC.replace(`{{${key}}}`, process.env[key]);
      }
    }

    const body = { 
      channel: process.env.PLUGIN_CHANNEL,
      username: process.env.PLUGIN_USERNAME,
      icon_url: process.env.PLUGIN_ICON_URL || 'https://i.postimg.cc/G2J204Ls/notification-bell.png',
    }

    switch (process.env.PLUGIN_MODE) {
      case 'NOTIFICATION':
        _text = MatterNotify.getMailToMarkdown(_mailToLabel, _mailToSubject, _mailtoCC) + _text;
        body.attachments = [
          {
            color: process.env.PLUGIN_COLOR || "#1bba56",
            title: _title,
            title_link: _titleLink,
            text: _text,
          },
        ];
        break;
      default:
        body.text = _text;
        break;
    }

    const resp = await fetch(
      process.env.PLUGIN_WEBHOOK, 
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      }
    );

    console.log(`Sending Mattermost Notification...`)
    console.log(body)
    console.log(``)

    console.log(`Mattermost Response: ${resp.statusText}`);
  }

  static getMailToMarkdown(_mailtoLabel, _mailtoSubject, _mailtoCC) {
    let _text = ``;

    if (process.env.PLUGIN_MAILTO && emailRegex.test(process.env.PLUGIN_MAILTO)) {
      let _ccAddrs = [];

      if (_mailtoCC) {
        for (const _cc of _mailtoCC.split(',')) {
          if (emailRegex.test(_cc) && _cc !== process.env.PLUGIN_MAILTO) {
            _ccAddrs.push(_cc);
          }
        }
      }

      _text = `:email: [${_mailtoLabel}](mailto:${process.env.PLUGIN_MAILTO}?subject=${encodeURIComponent(_mailtoSubject)}&cc=${_ccAddrs.join(',')})\n\n`;
    }

    return _text;
  }
}

try {
  MatterNotify.execute();
} catch (error) {
  console.log(`Mattermost Send Error:`, error);
}