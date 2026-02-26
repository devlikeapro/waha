#!/bin/sh


#
# Calculate UV_THREADPOOL_SIZE based on number of CPUs
#
# Try to get CPU count using Node.js, fallback to 1 if it fails
cpus=$(node -e "const os = require('os'); console.log(os.cpus().length);" 2>/dev/null) || cpus=1
# Make sure cpus is a number, default to 1 if not
case $cpus in
  ''|*[!0-9]*) cpus=1 ;;
esac
uv_threadpool_size=$(($cpus * 2))

# Check if uv_threadpool_size is less than 4 (default), set it to 4 if it is
if [ "$uv_threadpool_size" -lt 4 ]; then
  uv_threadpool_size=4
fi

# Set UV_THREADPOOL_SIZE as an environment variable
export UV_THREADPOOL_SIZE="${UV_THREADPOOL_SIZE:-$uv_threadpool_size}"

#
# Handle API key hashing
#
# Save WHATSAPP_API_KEY or WAHA_API_KEY in a variable (WHATSAPP_API_KEY has priority)
if [ -n "$WHATSAPP_API_KEY" ]; then
  key="$WHATSAPP_API_KEY"
elif [ -n "$WAHA_API_KEY" ]; then
  key="$WAHA_API_KEY"
fi

# Unset both environment variables
unset WHATSAPP_API_KEY
unset WAHA_API_KEY

# Process the key if it exists
if [ -n "$key" ]; then
  # Check if key is already hashed
  if echo "$key" | grep -q "^sha512:"; then
    # If already hashed, use it as is
    export WAHA_API_KEY="$key"
  else
    # Hash the key using sha512sum
    HASHED_KEY=$(echo -n "$key" | sha512sum | awk '{print $1}')
    export WAHA_API_KEY="sha512:$HASHED_KEY"
  fi
fi

#
# xvfb-run
#
USE_XVFB=false

# Check WAHA_RUN_XVFB parameter - only test for "false" case, treat all others as True
if [ "$WAHA_RUN_XVFB" = "false" ] || [ "$WAHA_RUN_XVFB" = "False" ] || [ "$WAHA_RUN_XVFB" = "0" ]; then
  # Explicitly disabled by user
  echo "WAHA_RUN_XVFB value: $WAHA_RUN_XVFB - xvfb is disabled"
  USE_XVFB=false
else
  # Check engine and run test if it's WEBJS or not specified
  if [ -z "$WHATSAPP_DEFAULT_ENGINE" ] || [ "$WHATSAPP_DEFAULT_ENGINE" = "WEBJS" ]; then
    # Try to run xvfb-run with a test command
    if xvfb-run --auto-servernum echo "xvfb-run is working!"; then
      USE_XVFB=true
    else
      echo "xvfb-run test failed, do not run it"
      USE_XVFB=false
    fi
  fi
fi


#
# Start your application using node with exec to ensure proper signal handling
#
if [ "$USE_XVFB" = "true" ]; then
  echo "Executing node with xvfb-run..."
  exec xvfb-run --auto-servernum node dist/main
else
  echo "Executing node without xvfb-run..."
  exec node dist/main
fi
