#!/usr/bin/env node

// Script to create a short link for a GitHub repo using Rebrandly API
// Usage: node scripts/shorten-url.js <repo-url> [--alias customAlias] [--apikey YOUR_API_KEY]

const args = process.argv.slice(2);
if (args.length === 0) {
  console.error('Usage: node scripts/shorten-url.js <repo-url> [--alias customAlias] [--apikey YOUR_API_KEY]');
  process.exit(1);
}

const repoUrl = args[0];
let alias;
let apiKey;

for (let i = 1; i < args.length; i++) {
  if (args[i] === '--alias' && i + 1 < args.length) {
    alias = args[i + 1];
    i++;
  } else if (args[i] === '--apikey' && i + 1 < args.length) {
    apiKey = args[i + 1];
    i++;
  }
}

if (!apiKey) {
  apiKey = process.env.REBRANDLY_API_KEY;
}

if (!apiKey) {
  console.error('Error: Rebrandly API key not provided. Use --apikey or set REBRANDLY_API_KEY env variable.');
  process.exit(1);
}

(async () => {
  try {
    const body = {
      destination: repoUrl,
      domain: { fullName: 'rebrand.ly' }
    };
    if (alias) {
      body.slashtag = alias;
    }

    const response = await fetch('https://api.rebrandly.com/v1/links', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': apiKey
      },
      body: JSON.stringify(body)
    });

    if (!response.ok) {
      const text = await response.text();
      throw new Error(`${response.status} ${response.statusText} - ${text}`);
    }

    const data = await response.json();
    console.log(`Short URL: https://${data.shortUrl}`);
  } catch (err) {
    console.error('Failed to create short URL:', err.message);
    process.exit(1);
  }
})();
