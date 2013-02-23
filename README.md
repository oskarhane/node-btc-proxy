# node-btc-proxy
==============

A proxy server in nodejs for communication with bitcoind.
Good as a middleware for multi account wallets where you need to auth users to get the account names but you still want to give them JSON RPC access.

## Dependencies
nodejs
express

## SSL
### You have to create SSL certs
openssl genrsa -out server-key.pem 1024

openssl req -new -key server-key.pem -out server-csr.pem

openssl x509 -req -in server-csr.pem -signkey server-key.pem -out server-cert.pem

## Usage
Edit settings.json with your settings and SSL file names. Start with forever or similiar.
