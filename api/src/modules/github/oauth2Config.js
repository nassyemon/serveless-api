
const config = {
  client: {
    id: process.env.GITHUB_OAUTH_CLIENT_ID,
    secret: process.env.GITHUB_OAUTH_CLIENT_SECRET,
  },
  auth: {
    authorizeHost: 'https://github.com',
    authorizePath: '/login/oauth/authorize',

    tokenHost: 'https://github.com',
    tokenPath: '/login/oauth/access_token'
  },
};

const scope = ['read:user', 'read:email', "gist"];

const redirect_uri = `https://${process.env.API_DOMAIN}/github/callback`;

module.exports = {
  config,
  scope,
  redirect_uri,
};