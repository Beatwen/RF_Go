# API Documentation

## Vue d'ensemble

RF Go expose plusieurs APIs pour l'interaction avec les appareils et la gestion des données. Cette documentation couvre à la fois les APIs internes utilisées par l'application et les APIs externes pour l'intégration avec d'autres systèmes.

## APIs Internes

### Device API

```csharp
public interface IDeviceService
{
    Task<List<Device>> DiscoverDevicesAsync();
    Task<Device> GetDeviceAsync(string deviceId);
    Task UpdateDeviceAsync(Device device);
    Task DeleteDeviceAsync(string deviceId);
    Task<List<Frequency>> GetDeviceFrequenciesAsync(string deviceId);
    Task SetDeviceFrequencyAsync(string deviceId, Frequency frequency);
}
```

### Frequency API

```csharp
public interface IFrequencyService
{
    Task<List<Frequency>> GetAvailableFrequenciesAsync();
    Task<FrequencyAnalysis> AnalyzeFrequenciesAsync(List<Device> devices);
    Task<Frequency> AssignFrequencyAsync(Device device, FrequencyRange range);
    Task<bool> ValidateFrequencyAsync(Frequency frequency, List<Device> devices);
}
```

### Group API

```csharp
public interface IGroupService
{
    Task<List<Group>> GetGroupsAsync();
    Task<Group> CreateGroupAsync(Group group);
    Task UpdateGroupAsync(Group group);
    Task DeleteGroupAsync(string groupId);
    Task AddDeviceToGroupAsync(string groupId, string deviceId);
    Task RemoveDeviceFromGroupAsync(string groupId, string deviceId);
}
```

### Timeperiod API

```csharp
public interface ITimeperiodService
{
    Task<List<Timeperiod>> GetTimeperiodsAsync();
    Task<Timeperiod> CreateTimeperiodAsync(Timeperiod timeperiod);
    Task UpdateTimeperiodAsync(Timeperiod timeperiod);
    Task DeleteTimeperiodAsync(string timeperiodId);
    Task AssignDeviceToTimeperiodAsync(string timeperiodId, string deviceId);
    Task RemoveDeviceFromTimeperiodAsync(string timeperiodId, string deviceId);
}
```

## APIs Externes

### Device Protocols

#### Sennheiser Protocol

```http
GET /api/v1/devices
Host: device-ip:8080
Accept: application/json

Response:
{
    "id": "string",
    "name": "string",
    "type": "string",
    "frequencies": [
        {
            "value": "number",
            "unit": "string",
            "status": "string"
        }
    ]
}
```

#### Shure Protocol

```http
POST /api/v1/frequency
Host: device-ip:2202
Content-Type: application/json

{
    "frequency": {
        "value": "number",
        "unit": "string"
    }
}
```

### REST API

#### Authentication

```http
POST /api/auth/login
Content-Type: application/json

{
    "username": "string",
    "password": "string"
}

Response:
{
    "token": "string",
    "expiresIn": "number",
    "refreshToken": "string"
}
```

#### Devices

```http
GET /api/devices
Authorization: Bearer {token}

Response:
{
    "devices": [
        {
            "id": "string",
            "name": "string",
            "type": "string",
            "status": "string",
            "frequencies": [
                {
                    "value": "number",
                    "unit": "string",
                    "status": "string"
                }
            ]
        }
    ]
}
```

#### Groups

```http
POST /api/groups
Authorization: Bearer {token}
Content-Type: application/json

{
    "name": "string",
    "devices": ["string"],
    "settings": {
        "frequencyRange": {
            "min": "number",
            "max": "number"
        }
    }
}
```

## WebSocket API

### Real-time Updates

```javascript
const ws = new WebSocket('wss://api.rfgo.com/ws');

ws.onmessage = (event) => {
    const data = JSON.parse(event.data);
    switch (data.type) {
        case 'deviceUpdate':
            // Handle device update
            break;
        case 'frequencyUpdate':
            // Handle frequency update
            break;
        case 'groupUpdate':
            // Handle group update
            break;
    }
};
```

## Error Handling

### Error Responses

```json
{
    "error": {
        "code": "string",
        "message": "string",
        "details": {
            "field": "string",
            "reason": "string"
        }
    }
}
```

### Error Codes

- `400`: Bad Request
- `401`: Unauthorized
- `403`: Forbidden
- `404`: Not Found
- `409`: Conflict
- `500`: Internal Server Error

## Rate Limiting

- 100 requests per minute per IP
- 1000 requests per hour per user
- WebSocket connections: 10 per user

## Security

- All APIs require authentication
- HTTPS required for all endpoints
- JWT tokens for authentication
- Rate limiting to prevent abuse
- Input validation and sanitization
- CORS configuration for web clients

## Versioning

- API version in URL: `/api/v1/`
- Version header: `X-API-Version: 1.0`
- Backward compatibility maintained
- Deprecation notices in headers 