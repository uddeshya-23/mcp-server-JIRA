#!/bin/bash
# Remove redundant directories
rm -rf src/config
rm -rf src/handlers
rm -rf src/middleware
rm -rf src/routes
rm -rf src/sdk
rm -rf src/transport
rm -rf src/utils

# Remove redundant files
rm -f src/server.ts
rm -f src/config.ts