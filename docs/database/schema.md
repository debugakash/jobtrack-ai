# JobTrack AI Database Schema

## Overview

The application uses PostgreSQL as the primary relational database.

## Main Entities

- User
- Company
- Job
- Interview
- Document
- JobStatusHistory

## Relationships

User
│
├── Company
│ │
│ └── Job
│ │
│ ├── Interview
│ ├── Document
│ └── JobStatusHistory
