#!/bin/bash

# Get the repo
git clone https://gitlab.mitre.org/rthew/sequelize-typescript-example.git

# Go to particular branch
pushd ./sequelize-typescript-example
git checkout -b user_auth_rework

# Build it
npm install && npm run build && npm link
popd

# Now build this
npm install && npm link hdf-db-sequelize