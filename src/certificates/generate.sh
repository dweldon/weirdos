#!/bin/bash
set -e
openssl genrsa -out localhost.key 2048
openssl req -new -x509 -key localhost.key -out localhost.crt -days 365 -subj "/CN=localhost"
chmod 600 localhost.key
chmod 644 localhost.crt
