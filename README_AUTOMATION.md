# Automation Testing for Employee Management System

This repository contains Robot Framework automation tests for testing employee and admin functionalities in the Employee Management System.

## Prerequisites

Before running the automation tests, ensure you have the following installed:

1. Python (3.7 or higher)

## Quick Setup

For a quick setup, simply run:

```bash
python setup.py
```

This script will:
1. Install all required Python packages
2. Download and install WebDrivers for Chrome and Firefox
3. Set up your environment for running the tests

## Manual Installation

If you prefer to install dependencies manually:

### 1. Install Python

Download and install Python from [python.org](https://www.python.org/downloads/)

### 2. Install Required Packages

```bash
pip install -r requirements.txt
```

### 3. Install WebDriver

Download and install ChromeDriver or GeckoDriver (for Firefox):

- [ChromeDriver](https://sites.google.com/chromium.org/driver/)
- [GeckoDriver](https://github.com/mozilla/geckodriver/releases)

Make sure to add the WebDriver location to your system PATH.

## Running the Tests

### 1. Start the React Application

Ensure your React application is running:

```bash
npm start
```

The application should be accessible at `http://localhost:3000`.

### 2. Run the Automation Tests

To run all tests:

```bash
robot employee_admin_test.robot
```

To run a specific test case:

```bash
robot -t "Employee Login And Submit Work" employee_admin_test.robot
```

## Test Cases

The automation test includes the following test cases:

1. **Employee Login And Submit Work** - Logs in as an employee, submits work hours, and logs out
2. **Admin Login And Add Employee** - Logs in as an admin and adds a new employee

## Test Data

The test uses the following credentials:

- Employee:
  - Username: Automation
  - Password: 12345678

- Admin:
  - Username: Apiwat
  - Password: 12345678

- New Employee Data:
  - Name: Auto
  - Username: Auto
  - Password: 12345
  - Department: ออโต้
  - Phone: 0000000000
  - Email: auto@gmail.com
  - User ID: 1234567890123

## Test Reports

After running the tests, Robot Framework generates HTML reports in the project directory:
- `report.html` - Summary of test results
- `log.html` - Detailed log of each test step
- `output.xml` - XML data used to generate the reports

## Troubleshooting

If you encounter issues with the automation tests:

1. **Element not found** - Check if the XPath selectors match your application's UI
2. **WebDriver not found** - Run `python setup.py` to install WebDrivers automatically
3. **Timing issues** - Adjust the timeout values in the test case 