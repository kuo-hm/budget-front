# Missing API Endpoints & Features

The following features were planned but are currently blocked by missing API endpoints in the backend. This document serves as a reference for future backend development tasks.

## 1. Receipt Management
- **Feature:** Uploading and viewing receipts for transactions.
- **Status:** **BLOCKED**
- **Missing Endpoints:**
    - `POST /transactions/{id}/receipt` (Upload receipt file)
    - `GET /transactions/{id}/receipt` (Get receipt URL/file)
    - `DELETE /transactions/{id}/receipt` (Remove receipt)

## 2. Authentication Flows
- **Feature:** Improving the robustness of the auth system.
- **Status:** **PARTIAL**
- **Missing Endpoints:**
    - `POST /auth/resend-otp` (Resend verification code if expired/lost)
    - `POST /auth/password-reset` (Request password reset email) - *Check if exists, assumed blocking*

## 3. Budget Sharing
- **Feature:** Collaboration on budgets with other users.
- **Status:** **DEFERRED**
- **Missing Endpoints:**
    - `POST /budgets/{id}/share` (Invite user)
    - `GET /budgets/{id}/users` (List collaborators)
    - `DELETE /budgets/{id}/users/{userId}` (Remove collaborator)

## 4. Bulk Actions
- **Feature:** Deleting multiple items at once.
- **Status:** **DEFERRED**
- **Missing Endpoints:**
    - `DELETE /transactions/bulk` (Bulk delete transactions)
