# SahayakAI Backend

Express API scaffold for the SahayakAI banking companion platform.

## Quick Start

```bash
npm install
npm start
```

Server runs on **http://localhost:5000**

## Health Check

```
GET /api/health
→ { "status": "ok", "service": "SahayakAI Backend" }
```

## Planned Endpoints

| Method | Route | Description |
|--------|-------|-------------|
| POST | `/api/jeevanscore` | Compute JeevanScore for a customer profile |
| GET | `/api/customers` | List customers with AI recommendations |
| POST | `/api/approve/:id` | Officer approves a loan recommendation |
| GET | `/api/scam-flags` | List active scam intercepts |
| POST | `/api/scam/report/:id` | Report scam to SBI Fraud Team |

## Environment

Create a `.env` file (optional):

```
PORT=5000
```
