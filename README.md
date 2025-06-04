# GPT E-commerce Sample

This repository contains a minimal e-commerce website built with Node.js and Express.

## Setup

Install dependencies and start the server:

```bash
npm install
node server.js
```

Visit `http://localhost:3000` in your browser.

## Shorten GitHub Repo URL

This project includes a small helper script for creating a short link to a GitHub
repository using the [Rebrandly](https://www.rebrandly.com/) API. You need a
Rebrandly API key to use it.

```bash
# Basic usage
node scripts/shorten-url.js <repo-url> --apikey YOUR_API_KEY

# Custom alias
node scripts/shorten-url.js <repo-url> --alias myAlias --apikey YOUR_API_KEY

# The API key can also be provided through the REBRANDLY_API_KEY environment variable.
```
