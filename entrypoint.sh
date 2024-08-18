#!/bin/sh

# Calculate UV_THREADPOOL_SIZE based on number of CPUs
cpus=$(node -e "const os = require('os'); console.log(os.cpus().length);")
uv_threadpool_size=$(($cpus * 2))

# Set UV_THREADPOOL_SIZE as an environment variable
export UV_THREADPOOL_SIZE="${UV_THREADPOOL_SIZE:-$uv_threadpool_size}"

# Start your application using yarn
yarn start:prod
