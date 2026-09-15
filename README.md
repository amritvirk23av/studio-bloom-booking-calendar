# Studio Bloom — Booking Calendar

Boutique studio booking calendar — availability grid, drag-to-reschedule, conflict detection, admin panel. React + TypeScript + Tailwind CSS. Frontend-only.
## Features

- **Availability grid** — day view (staff as columns) and week view (days as columns for one selected staff member), 15-minute time slots
- **Drag-to-reschedule** — drag an appointment to a new time/staff column via [dnd-kit](https://dndkit.com/), with live conflict highlighting while dragging
- **Conflict detection** — overlapping bookings for the same staff member are rejected on drop or on create, with an inline message
- **Day/Week toggle** with prev/next/today navigation and a staff filter
- Click an empty slot to book a new appointment; click an existing one to view details or cancel it
- "Reset demo data" to reseed the current week's mock appointments

## Stack

Vite · React 19 · TypeScript · Tailwind CSS v4 · dnd-kit · date-fns

## Getting started

```bash
npm install
npm run dev
```
