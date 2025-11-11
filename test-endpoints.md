# API Endpoints Testing Guide

## Base URL: http://localhost:3001

### Health Check
```bash
curl http://localhost:3001/api/health
```

### Authentication
```bash
# Login
curl -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@saikalpataruvidyalaya.com",
    "password": "admin123"
  }'

# Registration
curl -X POST http://localhost:3001/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@example.com", 
    "password": "test123"
  }'
```

### Classes (requires authentication)
```bash
# Get all classes (replace TOKEN with actual token from login)
curl http://localhost:3001/api/classes \
  -H "Authorization: Bearer TOKEN"

# Get specific class
curl http://localhost:3001/api/classes/1 \
  -H "Authorization: Bearer TOKEN"
```

### Practice Sessions
```bash
# Record practice session
curl -X POST http://localhost:3001/api/classes/1/practice \
  -H "Authorization: Bearer TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "duration": 30,
    "notes": "Great session today"
  }'
```
