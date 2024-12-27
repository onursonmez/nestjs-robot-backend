# Fleet Manager API Documentation

This project provides a fleet management system with REST API, Socket.IO, and MQTT interfaces for managing robots and robot types.

## Getting Started

1. Make sure MongoDB is running on `mongodb://localhost:27017`
2. Make sure MQTT broker is running on `mqtt://localhost:1883`
3. Install dependencies: `npm install`
4. Start the server: `npm run start:dev`

The server will start on http://localhost:3000

## Testing

The project includes comprehensive test suites covering all three communication protocols:

### Running Tests

```bash
# Run all tests
npm test

# Run tests with watch mode
npm run test:watch

# Run tests with coverage
npm run test:cov
```

### Test Coverage

The tests cover:

1. REST API Tests (`robot.rest.spec.ts`)
   - Robot creation with robot type
   - Listing all robots
   - Robot deletion

2. Socket.IO Tests (`robot.socket.spec.ts`)
   - Initial connection and robot list broadcast
   - Robot creation via socket events
   - Robot deletion via socket events

3. MQTT Tests (`robot.mqtt.spec.ts`)
   - Robot creation notifications
   - Robot deletion notifications
   - All robots broadcast

Each test suite ensures proper functionality of:
- Database operations
- Event broadcasting
- Data validation
- Error handling
- Protocol-specific features

## API Documentation

### REST API Endpoints

#### Robots

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/robots` | Get all robots |
| GET | `/robots/:id` | Get a specific robot |
| POST | `/robots` | Create a new robot |
| PUT | `/robots/:id` | Update a robot |
| DELETE | `/robots/:id` | Delete a robot |

#### Robot Types

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/robot-types` | Get all robot types |
| GET | `/robot-types/:id` | Get a specific robot type |
| POST | `/robot-types` | Create a new robot type |
| PUT | `/robot-types/:id` | Update a robot type |
| DELETE | `/robot-types/:id` | Delete a robot type |

### Socket.IO Events

#### Emit Events (Client to Server)

| Event | Payload | Description |
|-------|---------|-------------|
| `findAllRobots` | - | Get all robots |
| `findOneRobot` | `id: string` | Get a specific robot |
| `createRobot` | `CreateRobotDto` | Create a new robot |
| `updateRobot` | `{ id: string, updateRobotDto: UpdateRobotDto }` | Update a robot |
| `removeRobot` | `id: string` | Delete a robot |

#### Listen Events (Server to Client)

| Event | Payload | Description |
|-------|---------|-------------|
| `allRobots` | `Robot[]` | Emitted when robots list is updated |
| `robotCreated` | `Robot` | Emitted when a new robot is created |
| `robotUpdated` | `Robot` | Emitted when a robot is updated |
| `robotDeleted` | `string` | Emitted when a robot is deleted |

### MQTT Topics

#### Subscribe Topics

| Topic | Payload | Description |
|-------|---------|-------------|
| `robots/all` | `Robot[]` | All robots data |
| `robots/created` | `Robot` | New robot created |
| `robots/updated` | `Robot` | Robot updated |
| `robots/deleted` | `string` | Robot ID deleted |

## Data Models

### Robot

```typescript
{
  serialNumber: string;     // Required
  url?: string;             // Optional
  jobId?: string;           // Optional
  status?: string;          // Optional
  connectionState?: string; // Optional
  type: string;             // Required - Robot Type ID
  password: string;         // Required if mqttClient provided

}
```

### Robot Type

```typescript
{
  name: string;  // Required
}
```

## Example Usage

### Creating a Robot Type

```bash
curl -X POST http://localhost:3000/robot-types \
  -H "Content-Type: application/json" \
  -d '{"name": "AGV"}'
```

### Creating a Robot

```bash
curl -X POST http://localhost:3000/robots \
  -H "Content-Type: application/json" \
  -d '{
    "serialNumber": "AGV-2023-001",
    "url": "http://192.168.1.100:8080",
    "status": "IDLE",
    "connectionState": "CONNECTED",
    "robotType": "65123abc789def0123456789",
    "mqttClient": {
      "clientId": "agv_001_client",
      "username": "agv_001",
      "password": "secret123"
    }
  }'
```

### Socket.IO Connection Example

```javascript
const socket = io('http://localhost:3000');

// Listen for all robots
socket.on('allRobots', (robots) => {
  console.log('All robots:', robots);
});

// Create a new robot
socket.emit('createRobot', {
  serialNumber: "AGV-2023-002",
  robotType: "65123abc789def0123456789"
});
```

### MQTT Connection Example

```javascript
const mqtt = require('mqtt');
const client = mqtt.connect('mqtt://localhost:1883');

// Subscribe to all robot updates
client.subscribe('robots/#');

// Listen for messages
client.on('message', (topic, message) => {
  console.log(`Received message on ${topic}:`, JSON.parse(message));
});
```