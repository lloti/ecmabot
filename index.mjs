import Discord from 'discord.js';
import evil from './evil';
import config from './config';
import gist from 'snekgist';
import request from 'snekfetch';

const client = new Discord.Client();

const cblockre = /(^```js)|(```$)/g;

async function send(channel, content) {
  if (content.length > 1985) {
    const { html_url } = await gist({ 'out.js': { content } });
    const location = await request
      .post('https://git.io')
      .attach('url', html_url)
      .then((r) => r.headers.location);
    return channel.send(`**Output was too long and was uploaded to ${location}**`);
  } else {
    return channel.send(content, { code: 'js' });
  }
}

client.on('message', async (message) => {
  const prefix = client.user.toString();
  if (!message.content.startsWith(prefix))
    return;
  let content = message.content.replace(client.user.toString(), '').trim();

  if (cblockre.test(content))
    content = content.replace(cblockre, '').trim();

  const out = await evil(content);
  send(message.channel, out);
});

client.on('error', (err) => {
  // eslint-disable-next-line no-console
  console.log('CLIENT ERROR', err);
});

client.login(config.token);
