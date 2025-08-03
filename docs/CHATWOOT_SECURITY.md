# ChatWoot Integration Security 

## Overview

By default, any session connected to ChatWoot can execute server commands like:
- `server status` - Get server version and status information
- `server reboot` - Gracefully reboot the server
- `server reboot force` - Force reboot the server

For security reasons, you may want to restrict these commands. This is especially important when using the same instance for multiple customers or to prevent accidental server reboots that can disrupt service.

## Configuration

### Per-App Configuration (Dashboard)

Each ChatWoot app can be configured individually through the WAHA dashboard. This provides granular control and better security isolation.

#### Dashboard Configuration

1. **Navigate to App Configuration**: Go to the WAHA dashboard and access "App Configuration"
2. **Select ChatWoot App**: Choose the ChatWoot integration you want to configure
3. **Toggle Server Commands**: Use the "Disable Server Commands" setting:
   - `false` (default): Server commands are allowed
   - `true`: Server commands are disabled for this app

#### Configuration Field

The ChatWoot app configuration includes:
```typescript
disableServerCommands: boolean = false  // Default: allow server commands
```

## Behavior

### When Server Commands are Enabled (Default)
- All sessions can execute `server status`, `server reboot`, and `server reboot force` commands
- This maintains backward compatibility with existing installations

### When Server Commands are Disabled
- Attempts to execute server commands will be blocked
- Users receive the message: "❌ Server commands are disabled for this ChatWoot integration."
- Access attempts are logged with a warning for security auditing

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

### Server Commands (Can be Restricted)
These commands can be disabled per ChatWoot app:
- `server status` - Get server version and status
- `server reboot` - Gracefully reboot the server
- `server reboot force` - Force reboot the server

## Example Scenarios

### Development Environment
- **Setting**: `disableServerCommands: false`
- **Result**: All server commands available for testing and development

### Production Environment - Customer Facing
- **Setting**: `disableServerCommands: true` 
- **Result**: Customers cannot accidentally reboot the server

### Production Environment - Admin Access
- **Setting**: `disableServerCommands: false`
- **Result**: Admin teams retain full server control

### Multi-tenant Setup
Create separate ChatWoot apps for different access levels:
- **Customer Apps**: `disableServerCommands: true`
- **Admin Apps**: `disableServerCommands: false`
- **Monitoring Apps**: `disableServerCommands: false`

## API Configuration

You can also configure this programmatically when creating or updating ChatWoot apps:

```json
{
  "url": "https://chatwoot.example.com",
  "accountId": 12345,
  "accountToken": "your-account-token",
  "inboxId": 67890,
  "inboxIdentifier": "your-inbox-token",
  "locale": "en-US",
  "disableServerCommands": true
}
```

## Troubleshooting

### Command Rejected
If you receive "❌ Server commands are disabled for this ChatWoot integration.":
1. Check the ChatWoot app configuration in the dashboard
2. Verify if `disableServerCommands` is set to `true`
3. Update the setting if you need server command access

### Logs
When server commands are blocked, you'll see:
```
WARN: Server command server reboot is disabled for session mysession
```

## Migration

This feature is backward compatible:
- **Existing Apps**: Continue working unchanged (`disableServerCommands: false` by default) and has validations on DTO and DIContainer.
- **New Apps**: Can be configured with restrictions as needed
- **No Breaking Changes**: All existing functionality remains intact

## Security Best Practices

1. **Principle of Least Privilege**: Only enable server commands for apps that truly need them
2. **Separate Apps by Role**: Create different ChatWoot apps for different user types
3. **Monitor Access**: Review logs for any blocked command attempts
4. **Regular Audits**: Periodically review which apps have server command access
5. **Environment Isolation**: Use stricter settings in production environments

## Benefits of Per-App Configuration

- **Granular Control**: Configure each ChatWoot integration independently
- **Multi-tenant Safe**: Different customers can have different access levels
- **Easy Management**: Control through the familiar dashboard interface
- **Audit Trail**: Clear logging of configuration changes and access attempts
- **No Environment Variables**: No need to manage complex environment variable lists
