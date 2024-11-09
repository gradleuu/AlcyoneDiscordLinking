import crypto from 'crypto';
import fetch from 'node-fetch';
import * as storage from './storage.js';
import config from './config.js';

const myId = process.argv[2] || 'myId';

async function main() {
  try {
    // Step 1: Get OAuth URL to start the flow
    const { state, url } = getOAuthUrl();
    console.log(`Authorize your bot by visiting this URL: ${url}`);

    // Step 2: Simulate authorization code received from Discord
    const authorizationCode = await promptUserForAuthorizationCode();
    
    // Step 3: Exchange authorization code for tokens
    const tokens = await getOAuthTokens(authorizationCode);
    
    // Step 4: Fetch user data
    const userData = await getUserData(tokens);
    const userId = myId;

    // Step 5: Update metadata
    const metadata = { example_key: 'example_value' };
    await pushMetadata(userId, tokens, metadata);
    console.log('Metadata updated successfully!');
    
    // Step 6: Optionally, fetch metadata to verify
    const fetchedMetadata = await getMetadata(userId, tokens);
    console.log('Fetched Metadata:', fetchedMetadata);
  } catch (error) {
    console.error('An error occurred:', error.message);
  }
}

// Simulate user input for authorization code
async function promptUserForAuthorizationCode() {
  // In a real app, this code would be retrieved from the redirect URL query string.
  return 'your_authorization_code_here';
}

// Utility functions
function getOAuthUrl() {
  const state = crypto.randomUUID();
  const url = new URL('https://discord.com/api/oauth2/authorize');
  url.searchParams.set('client_id', config.DISCORD_CLIENT_ID);
  url.searchParams.set('redirect_uri', config.DISCORD_REDIRECT_URI);
  url.searchParams.set('response_type', 'code');
  url.searchParams.set('state', state);
  url.searchParams.set('scope', 'role_connections.write identify');
  url.searchParams.set('prompt', 'consent');
  return { state, url: url.toString() };
}

async function getOAuthTokens(code) {
  const url = 'https://discord.com/api/v10/oauth2/token';
  const body = new URLSearchParams({
    client_id: config.DISCORD_CLIENT_ID,
    client_secret: config.DISCORD_CLIENT_SECRET,
    grant_type: 'authorization_code',
    code,
    redirect_uri: config.DISCORD_REDIRECT_URI,
  });

  const response = await fetch(url, {
    body,
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
  });
  if (!response.ok) {
    throw new Error(`Error fetching OAuth tokens: [${response.status}] ${response.statusText}`);
  }
  return await response.json();
}

async function getAccessToken(userId, tokens) {
  if (Date.now() > tokens.expires_at) {
    const url = 'https://discord.com/api/v10/oauth2/token';
    const body = new URLSearchParams({
      client_id: config.DISCORD_CLIENT_ID,
      client_secret: config.DISCORD_CLIENT_SECRET,
      grant_type: 'refresh_token',
      refresh_token: tokens.refresh_token,
    });
    const response = await fetch(url, {
      body,
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    });
    if (!response.ok) {
      throw new Error(`Error refreshing access token: [${response.status}] ${response.statusText}`);
    }
    const newTokens = await response.json();
    newTokens.expires_at = Date.now() + newTokens.expires_in * 1000;
    await storage.storeDiscordTokens(userId, newTokens);
    return newTokens.access_token;
  }
  return tokens.access_token;
}

async function getUserData(tokens) {
  const url = 'https://discord.com/api/v10/oauth2/@me';
  const response = await fetch(url, {
    headers: {
      Authorization: `Bearer ${tokens.access_token}`,
    },
  });
  if (!response.ok) {
    throw new Error(`Error fetching user data: [${response.status}] ${response.statusText}`);
  }
  return await response.json();
}

async function pushMetadata(userId, tokens, metadata) {
  const url = `https://discord.com/api/v10/users/@me/applications/${config.DISCORD_CLIENT_ID}/role-connection`;
  const accessToken = await getAccessToken(userId, tokens);
  const body = {
    platform_name: 'Somnacreare',
    metadata,
  };
  const response = await fetch(url, {
    method: 'PUT',
    body: JSON.stringify(body),
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
  });
  if (!response.ok) {
    throw new Error(`Error pushing discord metadata: [${response.status}] ${response.statusText}`);
  }
}

async function getMetadata(userId, tokens) {
  const url = `https://discord.com/api/v10/users/@me/applications/${config.DISCORD_CLIENT_ID}/role-connection`;
  const accessToken = await getAccessToken(userId, tokens);
  const response = await fetch(url, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
  if (!response.ok) {
    throw new Error(`Error getting discord metadata: [${response.status}] ${response.statusText}`);
  }
  return await response.json();
}