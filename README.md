# 15 leetcode pattern
https://blog.algomaster.io/p/15-leetcode-patterns
# 20 patterns to follow dynamic programming
https://blog.algomaster.io/p/20-patterns-to-master-dynamic-programming
# React-JS
# How to prevent XRR attack in NodeJS and ReactJS
✅ How to Prevent CSRF in Node.js and React
1. Use CSRF(Cross-Site request forgery) Tokens

The server generates a unique CSRF token for each session/request.

The token is embedded in forms or sent to the React frontend.

React sends it back in API requests (usually in headers).

The server validates it.

👉 In Express (Node.js) you can use csurf
:
```javascript
import express from "express";
import cookieParser from "cookie-parser";
import csurf from "csurf";

const app = express();
app.use(cookieParser());

// Setup CSRF protection middleware
const csrfProtection = csurf({ cookie: true });

app.get("/form", csrfProtection, (req, res) => {
  res.json({ csrfToken: req.csrfToken() });
});

app.post("/process", csrfProtection, (req, res) => {
  res.send("Data is valid and CSRF token matched!");
});
```

On the React side, fetch the CSRF token and send it in headers:
```js
const token = await fetch("/form").then(res => res.json());

fetch("/process", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    "CSRF-Token": token.csrfToken, // send token in header
  },
  body: JSON.stringify({ data: "test" })
});
```
2. Use SameSite Cookies

Set cookies with SameSite=strict or lax to prevent them from being sent on cross-origin requests.
```js
app.use(
  session({
    secret: "secret",
    cookie: {
      httpOnly: true,
      secure: true,      // true in production with HTTPS
      sameSite: "strict" // or "lax"
    }
  })
);
```
3. Use Double-Submit Cookie Pattern

Server sets a CSRF token in a cookie.

React reads it (from cookie or meta tag) and sends it in a custom header.

Server checks cookie value == header value.

4. Validate Origin & Referer Headers

Reject requests that don’t come from your own domain.

Example in Express:
```js
app.use((req, res, next) => {
  const allowedOrigin = "https://yourdomain.com";
  const origin = req.get("origin") || "";
  if (origin !== allowedOrigin) {
    return res.status(403).send("Invalid origin");
  }
  next();
});
```
5. Use JWT Instead of Cookies (Optional)

If using JWT with Authorization: Bearer <token> headers, CSRF risk is lower since tokens are not auto-sent by the browser like cookies.

But you must still prevent XSS, because XSS can steal JWTs.

🔐 Best Practice Checklist

✅ Enable CSRF tokens (csurf middleware).

✅ Set cookies with HttpOnly, Secure, and SameSite.

✅ Validate Origin / Referer headers.

✅ Use HTTPS everywhere.

✅ Avoid storing JWTs in localStorage (vulnerable to XSS). Prefer httpOnly cookies + CSRF token.

# How to design a large-scale React app (folder structure, atomic design).
"I usually structure React projects using a hybrid approach. For the UI, I follow Atomic Design — breaking components into atoms, molecules, organisms, templates, and pages, so the design system stays reusable and consistent. For the business logic, I use a feature-based structure where each domain, like auth or products, has its own components, hooks, services, and Redux slice. This keeps UI and logic clearly separated, makes the codebase easy to scale, and helps different teams work in parallel without conflicts."
<img width="479" height="262" alt="Screenshot 2025-08-30 at 3 58 28 PM" src="https://github.com/user-attachments/assets/64b456b2-361c-4c9e-9ff7-f3ad13cec62c" />

```
src/
 ├── api/                         
 │    ├── axiosClient.js          # Axios instance with interceptors
 │    └── authApi.js              # Example API service
 │
 ├── assets/                      
 │    ├── images/
 │    │    └── logo.png
 │    └── styles/
 │         └── global.css
 │
 ├── components/                  # Atomic Design UI (shared across app)
 │    ├── atoms/
 │    │    ├── Button.jsx
 │    │    ├── Input.jsx
 │    │    └── Avatar.jsx
 │    │
 │    ├── molecules/
 │    │    ├── SearchBar.jsx
 │    │    └── CardHeader.jsx
 │    │
 │    ├── organisms/
 │    │    ├── Navbar.jsx
 │    │    └── Sidebar.jsx
 │    │
 │    ├── templates/
 │    │    ├── AuthLayout.jsx
 │    │    └── DashboardLayout.jsx
 │    │
 │    └── pages/
 │         ├── HomePage.jsx
 │         ├── LoginPage.jsx
 │         └── NotFoundPage.jsx
 │
 ├── features/                    # Feature-based business logic
 │    ├── auth/
 │    │    ├── components/
 │    │    │    └── LoginForm.jsx
 │    │    ├── hooks/
 │    │    │    └── useAuth.js
 │    │    ├── services.js        # login/register API calls
 │    │    ├── slice.js           # authSlice (Redux Toolkit)
 │    │    └── index.jsx          # Export for routes
 │    │
 │    └── products/
 │         ├── components/
 │         │    └── ProductCard.jsx
 │         ├── hooks/
 │         │    └── useProducts.js
 │         ├── services.js
 │         ├── slice.js
 │         └── index.jsx
 │
 ├── hooks/                       
 │    ├── useDebounce.js
 │    └── useFetch.js
 │
 ├── routes/                      
 │    └── AppRoutes.jsx
 │
 ├── store/                       
 │    ├── store.js
 │    └── rootReducer.js
 │
 ├── utils/                       
 │    ├── constants.js
 │    └── formatDate.js
 │
 ├── App.jsx
 └── main.jsx                     
```
# React `useTransition` Hook

The `useTransition` hook in React (introduced in React 18) helps manage **state transitions without blocking the UI**.  
It’s useful when you want to separate **urgent updates** (like typing) from **non-urgent updates** (like rendering a huge list).

---

## Syntax

```jsx
const [isPending, startTransition] = useTransition();
```
isPending → A boolean flag that is true while the transition is ongoing.
startTransition(callback) → Wrap your non-urgent update inside this function.
```jsx
import React, { useState, useTransition } from "react";

export default function SearchFilter() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [isPending, startTransition] = useTransition();

  const items = Array.from({ length: 10000 }, (_, i) => `Item ${i}`);

  const handleChange = (e) => {
    const value = e.target.value;
    setQuery(value);

    // Wrap the heavy update in a transition
    startTransition(() => {
      const filtered = items.filter((item) => item.includes(value));
      setResults(filtered);
    });
  };

  return (
    <div>
      <input value={query} onChange={handleChange} placeholder="Search..." />
      {isPending && <p>Loading...</p>}
      <ul>
        {results.map((r) => (
          <li key={r}>{r}</li>
        ))}
      </ul>
    </div>
  );
}
```
## How It Works

- Urgent update → setQuery (keeps typing responsive).
- Non-urgent update → setResults (filtering a large dataset).
- startTransition lets React prioritize urgent updates and defer the heavy ones.

# React Interview Preparation – Accenture L9 (Application Developer)

This document provides a structured set of **React interview questions with sample answers** tailored for **Manager Level 9** interviews at Accenture.  
Focus areas: **React fundamentals, architecture, performance optimization, security, and leadership-level responsibilities.**

---

## 1. Core React Concepts

### Q: What is reconciliation in React, and how does the diffing algorithm work?  
**A:**  
Reconciliation is the process React uses to update the DOM efficiently. It compares the Virtual DOM with the previous render using a **diffing algorithm**. Instead of re-rendering the entire UI, React only updates nodes that have changed. The algorithm assumes:
- Elements with the same type are updated in place.  
- Keys help React match children in lists to avoid unnecessary re-renders.  

---

### Q: What is React Fiber architecture?  
**A:**  
Fiber is React’s new reconciliation engine (introduced in React 16).  
It breaks rendering into **units of work** and allows React to pause, prioritize, and resume rendering tasks.  
This enables features like **concurrent mode, Suspense, and better responsiveness** in large applications.

---

### Q: When to use `useMemo`, `useCallback`, and `React.memo`?  
**A:**  
- `useMemo`: Memoizes expensive calculations so they don’t re-run on every render.  
- `useCallback`: Memoizes a function reference to avoid re-creating it on every render (useful for child components).  
- `React.memo`: Prevents re-rendering of a functional component if props haven’t changed.  
They are mainly **performance optimizations** to avoid unnecessary renders.

---

## 2. State Management

### Q: Compare Redux vs Context API. When should you choose one?  
**A:**  
- **Context API**: Best for small apps or passing global data (theme, auth state). Lightweight, but re-renders consumers frequently.  
- **Redux**: Best for **large-scale apps** with complex state logic, middlewares, and debugging needs. Redux DevTools and middleware support make it ideal for enterprise apps.  
👉 At scale, I’d choose **Redux Toolkit** as it reduces boilerplate and enforces best practices.  

---

### Q: How do you handle async actions in Redux?  
**A:**  
- **Redux Thunk**: Middleware for handling async calls inside actions.  
- **Redux Saga**: More scalable, manages complex async workflows using generator functions.  
- **RTK Query**: Built-in data fetching & caching in Redux Toolkit, reduces boilerplate.  
👉 I prefer **RTK Query** for modern apps as it simplifies API management.

---

## 3. Performance Optimization

### Q: How do you optimize rendering of large lists?  
**A:**  
Use **windowing/virtualization** libraries like `react-window` or `react-virtualized`.  
Instead of rendering all items, only the visible portion of the list is rendered.  
This reduces DOM nodes drastically and improves performance.

---

### Q: How do you troubleshoot a React app that became slow in production?  
**A:**  
1. Use **React Profiler** to detect slow components.  
2. Check unnecessary re-renders (missing `useMemo`, `React.memo`).  
3. Audit API calls (debouncing, caching with React Query).  
4. Use **code splitting** for large bundles.  
5. Run Lighthouse/Chrome DevTools for bottlenecks (e.g., blocking scripts).  
👉 In production, I’d also use **Sentry/Datadog** to monitor performance regressions.

---

## 4. Architecture & Design

### Q: How would you design a scalable React project?  
**A:**  
- Use **Atomic Design** principles (atoms → molecules → organisms → pages).  
- Implement **feature-based folder structure** instead of monolithic components.  
- Use **Redux Toolkit / React Query** for state management.  
- Enforce standards with **ESLint, Prettier, TypeScript**.  
- Implement CI/CD with unit tests and integration tests.  
👉 This ensures maintainability and scalability for enterprise projects.

---

### Q: How do you handle micro-frontends in React?  
**A:**  
- Split app into independently deployable modules (e.g., Module Federation in Webpack).  
- Each team owns its micro-frontend (auth, dashboard, payments).  
- Use **shared design systems** for consistency.  
- Ensure **independent deployments** but maintain **integration contracts**.  
👉 This enables parallel development and scalability in large organizations.

---

## 5. Security

### Q: How do you prevent XSS in React?  
**A:**  
- By default, React escapes values to prevent injection.  
- Avoid using `dangerouslySetInnerHTML`. If needed, sanitize input using libraries like `DOMPurify`.  
- Use security headers (Content Security Policy).  
👉 Ensure backend also validates/sanitizes inputs.

---

### Q: How do you handle authentication & authorization in React?  
**A:**  
- Use **JWT** or **OAuth 2.0** for authentication.  
- Store tokens securely (HTTP-only cookies preferred).  
- Implement **role-based access control (RBAC)** in routes.  
- Protect sensitive routes with **private route wrappers**.  

---

## 6. Advanced Topics

### Q: What is Suspense in React?  
**A:**  
Suspense allows React to **pause rendering** while waiting for data or resources.  
Example: Show a fallback (spinner) while data is loading.  
Future use cases include **data fetching (with React Query / Relay)**.  
👉 It improves user experience by making loading states predictable.

---

### Q: What are Error Boundaries?  
**A:**  
- Special React components that catch JavaScript errors in children.  
- Prevent the entire app from crashing.  
- Implemented using `componentDidCatch` and `getDerivedStateFromError`.  
👉 Example: Show a fallback UI if a widget fails to load.  

---

## 7. Leadership & Managerial Focus

### Q: How do you ensure code quality in a React team?  
**A:**  
- Define **coding standards** (ESLint, Prettier).  
- Implement **PR reviews and pair programming**.  
- Use **Storybook** for reusable UI components.  
- Automate testing (Jest, React Testing Library, Cypress).  
- Monitor production apps with Sentry/Datadog.  

---

### Q: Tell me about a time you mentored junior developers in React.  
**A:**  
- Conducted knowledge-sharing sessions on React hooks & Redux.  
- Reviewed code to ensure best practices.  
- Introduced **pair programming** to improve onboarding.  
- Helped juniors debug performance issues by using React Profiler.  
👉 Result: Faster onboarding, fewer bugs, higher team productivity.  

---

## 8. Quick Reference – Key Tools & Libraries
- **State Management:** Redux Toolkit, Context API, React Query, SWR  
- **Performance:** React Profiler, react-window, memoization hooks  
- **Styling:** CSS Modules, Styled Components, Tailwind CSS  
- **Security:** Helmet, DOMPurify, JWT handling best practices  
- **Monitoring:** Lighthouse, Sentry, LogRocket, Datadog  

---

✅ **Tip for Accenture L9 Interviews:**  
Don’t just answer **what** or **how** — also explain **why** (trade-offs, scalability, maintainability).  
They expect a **leader mindset**: balancing technical depth with team and product impact.

