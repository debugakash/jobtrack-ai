# JobTrack AI - Entity Relationship Diagram

## Entities

- User
- Company
- Job
- Recruiter
- Interview
- Document
- Reminder
- StatusHistory

## Relationships

User (1) -------- (\*) Company

Company (1) ----- (\*) Job

Job (1) --------- (\*) Recruiter

Job (1) --------- (\*) Interview

Job (1) --------- (\*) Document

Job (1) --------- (\*) Reminder

Job (1) --------- (\*) StatusHistory
