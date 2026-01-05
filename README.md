# LiquorStore OS - Product Requirements & Specifications

## 1. Product Requirements Document (PRD)

**Goal:** Create a lightweight, mobile-first management operating system for a single retail liquor store that centralizes task management, employee requests, and knowledge retrieval.

**Users & Roles:**
*   **Owner/Admin:** Full system control, edits SOPs, manages all departments.
*   **Manager:** Assigns tasks, approves requests, updates daily logs.
*   **Employee:** Views department tasks, executes work, requests time off/products, queries AI.

**Key Flows:**
1.  **Daily Shift:** Employee logs in → Checks "My Tasks" → Marks tasks "In Progress" → Completes tasks with optional photo proof.
2.  **Manager Routine:** Checks Dashboard for completion rates → Approves Time Off/Reorders.
3.  **Automation:** System auto-generates tasks at 11:00 AM based on templates.
4.  **AI Assistance:** Employee asks "How to reverse stock?" → AI retrieves SOP section → Answers.

**Success Metrics:**
*   100% of recurring tasks generated on time.
*   Reduction in "How do I do this?" texts to the owner (handled by AI).
*   Zero lost time-off requests.

## 2. Data Model

**Entities:**

*   **User:** `{ id, name, role, departmentId, email, phone }`
*   **Department:** `{ id, name, type (Retail/Backend), sopContent }`
*   **Task:** `{ id, title, departmentId, assignedToId, status, priority, frequency, dueDate, completedAt, instructions }`
*   **TimeOffRequest:** `{ id, userId, type, dates, reason, status, managerNote }`
*   **ReorderRequest:** `{ id, userId, product, category, quantity, urgency, status }`
*   **KnowledgeBase:** (Derived from SOPs + Product Catalog constants)

## 3. Automation Engine Spec

*   **Recurring Creation:**
    *   *Trigger:* App initialization or explicit "Refresh" action (Client-side simulation).
    *   *Logic:* Checks `lastGeneratedDate` in local storage. If `Today != lastGenerated` and `Time >= 11:00`, generate tasks from `TASK_TEMPLATES`.
*   **Overdue Detection:**
    *   *Logic:* Tasks where `status != Done` and `dueDate < Now`.
    *   *Action:* Highlights row in red. (Backend would trigger Email/SMS via SendGrid/Twilio).
*   **Completion:**
    *   *Action:* Moving status to "Done" automatically sets `completedAt` timestamp.

## 4. AI Assistant Spec (RAG)

*   **Approach:** Client-side RAG (Retrieval-Augmented Generation).
*   **Knowledge Source:** The `DEPARTMENTS` constant (SOPs) and `PRODUCT_CATALOG`.
*   **Flow:**
    1.  User query: "Where is backstock wine?"
    2.  System retrieves text chunks from Wine Department SOP.
    3.  System constructs prompt: "Context: [SOP Content]... Answer user question: [Query]."
    4.  Gemini API (`gemini-3-flash-preview` or `gemini-2.5-flash-latest`) generates response.
*   **Safety:** System instruction enforces "If not found in context, say 'I don't know, ask a manager'."

## 5. Implementation & Stack

*   **Core:** React 18, TypeScript, Tailwind CSS.
*   **State:** React Context (Simulating a database for this MVP).
*   **AI:** Google GenAI SDK (`@google/genai`).
*   **Icons:** Lucide React.
*   **Charts:** Recharts.
