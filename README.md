# Trello Clone - Assignment 1

This project is a simplified Trello clone built with Next.js, Tailwind CSS, DaisyUI, and MongoDB.

## Functional Specification

### Features Implemented
- [x] **Collection of Boards** (3p)
  - List boards
  - Create/Edit/Delete boards
- [x] **Lists of Cards** (3p)
  - View lists in a board
  - Create/Edit/Delete lists
- [x] **Card Content** (3p)
  - Add cards to lists
  - View/Edit title and description
  - Delete cards
- [x] **Metrics Collection** (1p)
  - Integration with PostHog
  - **Why PostHog?** PostHog is an open-source product analytics platform. It allows us to track user interactions (page views, button clicks, form submissions) to understand how users are using the app.
  - **What we track:**
    - Page views (automatically)
    - Custom events can be added easily (e.g., 'board_created', 'card_moved')
  - **How it helps:**
    - Identify popular features vs unused ones.
    - Track user retention.
    - Debug issues by seeing user flows.
- [ ] **App Deployment** (Mandatory)
  - Deployed URL: [TBD]

## Tech Stack
- **Framework**: Next.js 14 (App Router)
- **Styling**: Tailwind CSS + DaisyUI
- **Database**: MongoDB (via Mongoose)
- **Analytics**: PostHog

## Setup
1. Clone repository
2. `npm install`
3. Set up environment variables in `.env.local`:
   ```env
   MONGODB_URI=mongodb://localhost:27017/trello-clone
   NEXT_PUBLIC_POSTHOG_KEY=phc_...
   NEXT_PUBLIC_POSTHOG_HOST=https://us.i.posthog.com
   ```
4. `npm run dev`
