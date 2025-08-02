# ChatWoot Integration Security 

## Overview

By default, any session connected to ChatWoot can execute server commands like:
- `server status` - Get server version and status information
- `server reboot` - Gracefully reboot the server
- `server reboot force` - Force reboot the server

For security reasons, you may want to restrict these commands to only specific trusted sessions. This is especially the case when using the same instance for several customers and want to restrict sensitive commands to certain privileged sessions, or to avoid accidental server reboots that can disrupt the service level.

## Configuration

### Environment Variable

Use the `CHATWOOT_PRIVILEGED_SESSIONS` environment variable to specify which session IDs are allowed to execute privileged commands. Supports both exact matches and wildcard patterns. ****Wildcard `*` will only be accepted at the end of the session ID.****

```env
# Allow specific sessions and wildcard patterns to execute server commands
CHATWOOT_PRIVILEGED_SESSIONS=session1,session2,admins_*,monitoring_*

# Or leave empty/unset to allow all sessions (default behavior)
# CHATWOOT_PRIVILEGED_SESSIONS=
```

#### Pattern Matching

- **Exact Match**: `session1` - matches only "session1"
- **Wildcard Pattern**: `admins_*` - matches any session starting with "admins_" (e.g., "admins_john", "admins_mary", "admins_bot")
- **Mixed**: `session1,admins_*,monitoring_*` - combines exact matches and patterns

### Docker Compose

Add the environment variable to your `docker-compose.yaml`:

```yaml
version: '3'
services:
  waha:
    image: devlikeapro/waha:latest
    environment:
      - CHATWOOT_PRIVILEGED_SESSIONS=session1,session2
    # ... other configuration
```

### Docker Run

Pass the environment variable when running the container:

```bash
docker run -e CHATWOOT_PRIVILEGED_SESSIONS="session1,session2" devlikeapro/waha
```

## Behavior

### When Restricted
- Only sessions listed in `CHATWOOT_PRIVILEGED_SESSIONS` can execute `server status`, `server reboot`, and `server reboot force` commands
- Unauthorized sessions receive the message: "❌ You are not authorized to execute this server command."
- Access attempts are logged with a warning for security auditing

### When Unrestricted (Default)
- When `CHATWOOT_PRIVILEGED_SESSIONS` is empty or unset, all sessions can execute privileged commands
- This maintains backward compatibility with existing installations, until needed.

## Session Commands

### Non-Privileged Commands (Always Available)
These commands are available to all sessions regardless of the restriction:
- `status` - Get session status
- `restart` - Restart the session
- `start` - Start the session
- `stop` - Stop the session
- `logout` - Logout from the session
- `qr` - Get QR code for the session
- `screenshot` - Get screenshot of the session
- `help` - Show available commands

### Privileged Commands (Restricted)
These commands require session ID to be in `CHATWOOT_PRIVILEGED_SESSIONS`:
- `server status` - Get server version and status
- `server reboot` - Gracefully reboot the server
- `server reboot force` - Force reboot the server

## Example Scenarios

### Development Environment
```env
# Allow all sessions (default)
# CHATWOOT_PRIVILEGED_SESSIONS=
```

### Production Environment
```env
# Only allow admin and monitoring sessions
CHATWOOT_PRIVILEGED_SESSIONS=admin-session,monitoring-bot
```

### Multi-tenant Setup
```env
# Only allow specific tenant admin sessions
CHATWOOT_PRIVILEGED_SESSIONS=tenant1-admin,tenant2-admin,system-admin
```

### Wildcard Pattern Examples
```env
# Allow all admin sessions (admins_john, admins_mary, etc.)
CHATWOOT_PRIVILEGED_SESSIONS=admins_*

# Allow multiple patterns and specific sessions
CHATWOOT_PRIVILEGED_SESSIONS=admins_*,monitoring_*,support_*,emergency-session

# Department-based access
CHATWOOT_PRIVILEGED_SESSIONS=ops_*,devops_*,sysadmin_*
```

#### Pattern Matching Examples
| Pattern | Session ID | Match? | Explanation |
|---------|------------|--------|-------------|
| `admins_*` | `admins_john` | ✅ Yes | Starts with "admins_" |
| `admins_*` | `admins_mary_team` | ✅ Yes | Starts with "admins_" |
| `admins_*` | `admin_john` | ❌ No | Singular "admin" word |
| `admins_*` | `john_admin` | ❌ No | Doesn't start with "admins_" |
| `ops_*` | `ops_monitoring` | ✅ Yes | Starts with "ops_" |
| `session1` | `session1` | ✅ Yes | Exact match |
| `session1` | `session12` | ❌ No | Not exact match |

## Troubleshooting

### Command Rejected
If you receive "❌ You are not authorized to execute this server command.":
1. Check that your session ID is included in `CHATWOOT_PRIVILEGED_SESSIONS`
2. Verify the session ID matches exactly (case-sensitive, no extra spaces)
3. Restart the container after changing the environment variable

### Logs
Access denied attempts are logged as warnings:
```
WARN: Access denied: session mysession attempted privileged command server reboot
```

## Migration

This feature is backward compatible. Existing installations will continue to work without any changes. To enable restrictions, simply add the `CHATWOOT_PRIVILEGED_SESSIONS` environment variable with your desired session IDs.
