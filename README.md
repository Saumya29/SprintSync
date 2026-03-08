# SprintSync

A lightweight sprint tracker where engineers log work and an LLM helps estimate and plan the next sprint.

## Demo

<video src="demo.mp4" width="100%" autoplay loop muted playsinline></video>

![Demo](demo.gif)

## Why I built this

Every sprint planning meeting felt like guesswork. How many points can we take on? What keeps getting carried over? I wanted a tracker that actually learns from past sprints and helps plan the next one - not just a board to move cards around.

## What it does

- **Sprint board** - Kanban-style task tracking with To Do, In Progress, Done columns
- **Work logging** - Engineers log tasks with story points and time tracking
- **AI planning** - Gemini analyzes your team's velocity and recommends capacity, carry-overs, and risk flags for the next sprint
- **Team collaboration** - Multiple engineers on the same sprint with assignee tracking

## Stack

**Frontend:** React, Tailwind CSS, shadcn/ui, React Router
**Backend:** Node.js, Express, PostgreSQL, Prisma
**AI:** Google Gemini
**Deployment:** Vercel (frontend), Render (backend + database)

## Running locally

```bash
# Backend
cd backend
npm install
npm run dev

# Frontend
cd frontend
npm install
npm start
```

## License

MIT
