# SaveIQ – Smart Savings

SaveIQ is a simple savings-goal dashboard built with **Google Apps Script**, **HTML**, **CSS**, and **JavaScript**. It helps users create savings goals and view their total savings, target amounts, and overall progress in one place. Google Sheets is used as the data store.

## Features

- **Savings dashboard** with active goal count, total saved, total target, and overall progress.
- **Create savings goals** with a name, target amount, amount already saved, deadline, and category.
- **Goal progress cards** showing the amount saved, target amount, and percentage completed.
- **Overall progress ring** with saved and remaining amounts.
- **Google Sheets storage** for goals and supporting tables.
- **Responsive layout** for desktop and smaller screens.
- Currency values are currently formatted in Indian rupees (₹).

> **Current project status:** The core dashboard and savings-goal workflow are implemented. AI insights currently display a placeholder message. Transaction management and settings screens are not yet implemented, although their spreadsheet table definitions are included.

## Tech Stack

- Google Apps Script (server-side functions and web app hosting)
- HTML
- CSS
- JavaScript
- Google Sheets (database)

## Project Structure

| File | Purpose |
|---|---|
| `Code.gs` | Serves the web app and includes reusable HTML files. |
| `Database.gs` | Sets up Google Sheets tables, reads goals, creates goals, and calculates dashboard totals. |
| `index.html` | Main dashboard layout and savings-goal modal. |
| `Styles.html` | Styling, layout, progress ring, cards, and responsive rules. |
| `Script.html` | Client-side interactions, form validation, dashboard loading, and goal rendering. |
| `AI.gs` | Reserved for future AI functionality; currently contains an empty placeholder function. |
| `Notifications.gs` | Reserved for future notifications; currently contains an empty placeholder function. |

## Prerequisites

- A Google account
- Access to [Google Apps Script](https://script.google.com/)
- A Google spreadsheet to store application data

## Setup and Installation

### 1. Create a Google Spreadsheet

1. Create a new spreadsheet in Google Sheets.
2. Copy its spreadsheet ID from the URL. The ID is the part between `/d/` and `/edit`.

### 2. Create the Apps Script project

1. Open [Google Apps Script](https://script.google.com/).
2. Create a new project.
3. Add the files from this project, keeping the filenames exactly as shown in **Project Structure**.
4. Copy each file's contents into its corresponding Apps Script file. For HTML files, create HTML files named `index`, `Styles`, and `Script` (the `.html` extension is handled by Apps Script).

### 3. Configure the spreadsheet ID

1. In the Apps Script editor, open **Project Settings**.
2. Under **Script Properties**, add a property:
   - **Property:** `SPREADSHEET_ID`
   - **Value:** your Google spreadsheet ID
3. Save the property.

The application reads this property in `Database.gs`. It will show an error if the property is missing.

### 4. Initialize the database

1. In the Apps Script editor, select `setupDatabase` from the function list.
2. Click **Run**.
3. Review and grant the requested Google Sheets permissions.
4. Confirm that the spreadsheet contains the `Users`, `Goals`, `Transactions`, and `Settings` sheets.

The application creates these sheets and adds header rows when needed. It does not overwrite existing non-empty sheets.

### 5. Test the database connection

Select `testDatabase` and click **Run**. The execution log should report the spreadsheet name and number of goals found. This is a basic connection test.

### 6. Deploy as a web app

1. Click **Deploy → New deployment**.
2. Choose **Web app** as the deployment type.
3. Set **Execute as** according to your intended ownership and access model. For a personal project, executing as yourself is common, but it means the app accesses the spreadsheet with your permissions.
4. Choose who can access the app. Only allow the access level appropriate for your use case.
5. Click **Deploy**, complete any authorization prompts, and open the web app URL.

When you make changes later, create a new deployment version or update the existing deployment to use the latest code.

## How to Use

1. Open the deployed SaveIQ web app.
2. Click **New Goal** or **Add goal**.
3. Enter a goal name and a target amount greater than zero.
4. Optionally enter an amount already saved, a deadline, and a category.
5. Click **Create Goal**.
6. The dashboard refreshes to show the new goal and updated totals.

## Data Model

The app uses the following Google Sheets tables:

- **Users:** `userId`, `name`, `email`, `currency`, `createdAt`
- **Goals:** `goalId`, `userId`, `name`, `targetAmount`, `savedAmount`, `deadline`, `category`, `createdAt`, `status`
- **Transactions:** `transactionId`, `goalId`, `amount`, `type`, `date`, `note`
- **Settings:** `key`, `value`

Currently, new goals are assigned to the placeholder user ID `default-user`. The `Transactions` and `Settings` sheets are prepared for future functionality but are not yet used for transaction entry or settings management.

## Validation and Notes

- Goal names are required.
- Target amounts must be greater than zero.
- Saved amounts cannot be negative.
- Overall progress is calculated from total saved divided by total target and capped at 100% for display.
- The dashboard currently displays values in Indian rupees, regardless of the `currency` column in the Users sheet.
- The current project does not implement authentication or separate data access per real user. Do not treat it as a secure multi-user finance application without adding authentication, authorization, and appropriate data validation.
- The AI insights button is a placeholder and does not currently call an AI service.

## Troubleshooting

**Error: `SPREADSHEET_ID is missing.`**

Add the `SPREADSHEET_ID` Script Property in Project Settings and verify that its value is the correct spreadsheet ID.

**The dashboard does not load data.**

- Run `testDatabase` in the Apps Script editor and check the execution log.
- Verify that the script has permission to access the spreadsheet.
- Open the web app's browser console and check for errors.
- Make sure the latest code has been deployed.

**A goal is not saved.**

- Check that the goal name is filled in.
- Ensure the target amount is greater than zero and the saved amount is not negative.
- Check Apps Script executions for server-side errors.

## Future Improvements

- Implement AI-powered savings suggestions.
- Add deposits and withdrawals through the Transactions table.
- Add user authentication and user-specific goal access.
- Implement settings and currency selection.
- Add goal editing, deletion, search, and filtering.
- Add stronger validation and automated tests.

## License

No license is specified in the supplied project. Add a `LICENSE` file before distributing or reusing the project if you want to define its usage terms.
