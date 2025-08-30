# Interview-prep
Created just for the interview preparation
# 15 leetcode pattern
https://blog.algomaster.io/p/15-leetcode-patterns
# 20 patterns to follow dynamic programming
https://blog.algomaster.io/p/20-patterns-to-master-dynamic-programming

# How to prevent XRR attack in NodeJS and ReactJS
✅ How to Prevent CSRF in Node.js and React
1. Use CSRF Tokens

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
```
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
```
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
```
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

