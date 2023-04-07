/**
 * Enum type for the connection status
 */
export enum ConnectionStatusType {
  CONNECTED = 'CONNECTED',
  DISCONNECTED = 'DISCONNECTED',
  NO_PORT_SELECTED = 'NO_PORT_SELECTED',
  NO_BAUD_RATE_SELECTED = 'NO_BAUD_RATE_SELECTED',
  PORT_ALREADY_OPEN = "PORT_ALREADY_OPEN",
  PORT_NOT_WRITABLE = "PORT_NOT_WRITABLE"
}
