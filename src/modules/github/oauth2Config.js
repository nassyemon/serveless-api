
const config = {
    client: {
      id: '9a389c6a2de9c93b5853',
      secret: 'c00c5c179ead6dc139f68233fd58280bfe425ab0'
    },
    auth: {
      authorizeHost: 'https://github.com',
      authorizePath: '/login/oauth/authorize',
   
      tokenHost: 'https://github.com',
      tokenPath: '/login/oauth/access_token'
    },
  };
  
const scope = ['read:user', 'read:email', "gist"];

const redirect_uri = 'https://x4hf6p4ze1.execute-api.ap-northeast-1.amazonaws.com/dev/github/callback';

module.exports = {
  config,
  scope,
  redirect_uri,
};