# Proyecto-Hotel-Quinta

## Tech Stack Strategy
*   **Framework:** Next.js 14 (App Router) - *For speed and SEO.*
*   **Language:** TypeScript - *To prevent bugs during development.*
*   **Styling:** Tailwind CSS & Shadcn/UI - *For professional aesthetics.*
*   **Database:** PostgreSQL (via Supabase) - *For reliable data storage.*
*   **ORM:** Prisma - *For easy database interaction.*
*   **Payments:** Stripe - *For secure credit card processing.*

## Development Roadmap (8 Weeks)

### Phase 1: Foundation & Database (Weeks 1-2)
- [ ] Initialize Next.js project with TypeScript and Tailwind.
- [ ] Set up Supabase project and connect Prisma.
- [ ] Define Database Schema (Users, Rooms, Reservations).
- [ ] Implement Authentication (Login/Register).

### Phase 2: Core Booking Logic (Weeks 3-4)
- [ ] Create "Room List" page with image galleries.
- [ ] Build the "Room Detail" page.
- [ ] Implement the **Availability Search** logic (prevent double bookings).
- [ ] Create the Reservation flow (Select dates -> Summary).

### Phase 3: Payments & User Dashboard (Weeks 5-6)
- [ ] Integrate Stripe Checkout.
- [ ] Create Webhooks to handle successful payments.
- [ ] Build "My Reservations" page for users.
- [ ] Build a basic Admin Dashboard to view/cancel bookings.

### Phase 4: Polish & Performance (Weeks 7-8)
- [ ] Optimize images (Next/Image) and fonts.
- [ ] Add loading skeletons for better UX.
- [ ] Responsive design check (Mobile vs Desktop).
- [ ] Deployment (Vercel) and final testing.

## Database Model Idea
*   **User:** ID, Email, Name
*   **Room:** ID, Type, Price, Description, Images[]
*   **Reservation:** ID, UserID, RoomID, StartDate, EndDate, Status, PaymentID

## Prerequisites (Check this first!)

1.  **Node.js:** You must have Node.js installed to run these commands.
    *   Type `node -v` in your terminal.
    *   If you see an error or nothing happens, download the "LTS" version from nodejs.org.
    *   **Restart your computer** (or at least the terminal) after installing.

## Migration Instructions (How to start)

Since we are upgrading from HTML to Next.js, follow these steps in your terminal inside this folder:

1.  **Clean the Directory:**
    *   Create a folder named `BACKUP` **outside** of this project folder (e.g., in the parent directory).
    *   Move **all** files from this folder into that `BACKUP` folder.
    *   Ensure this current folder (`Proyecto-Hotel-Quinta`) is completely empty.

2.  **Install Framework:**
    Run this command (now that the folder is empty):
    ```bash
    npx create-next-app@latest
    ```
    *   When asked **"What is your project named?"**, type `.` (a single dot) and press Enter.
    *   Select **Yes** for TypeScript, ESLint, Tailwind CSS, and App Router.
    *   Select **No** for `src/` directory and import alias customization.

3.  **Restore Assets:**
    *   Copy your `img` folder from the external `BACKUP` folder into the new `public` folder created here.
    *   (Optional) Copy your old HTML files into a `_legacy` folder here for reference.

4.  **Install Database & Payments:**
    ```bash
    npm install prisma @prisma/client stripe @stripe/stripe-js
    npx prisma init
    ```

4.  **Copy the code:** Use the code provided in the `app/` and `prisma/` files below.
