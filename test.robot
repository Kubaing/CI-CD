*** Settings ***
Library           SeleniumLibrary
Library           DateTime
Suite Setup       Setup Browser
Suite Teardown    Close All Browsers
Test Teardown     Handle Test Teardown

*** Variables ***
${BROWSER}        chrome
${URL}            http://localhost:3000
${EMPLOYEE_USERNAME}    Automation
${EMPLOYEE_PASSWORD}    12345678
${ADMIN_USERNAME}       Apiwat
${ADMIN_PASSWORD}       12345678
${DEPARTMENT}     เทสระบบ
${TASK}           เทสระบบ
${HOURS}          8
${NEW_EMP_NAME}   Auto
${NEW_EMP_USERNAME}  Auto
${NEW_EMP_PASSWORD}  12345
${NEW_EMP_DEPARTMENT}  ออโต้
${NEW_EMP_PHONE}   0000000000
${NEW_EMP_EMAIL}   auto@gmail.com
${NEW_EMP_USERID}  1234567890123

*** Test Cases ***
Employee Login And Submit Work
    Login As Employee
    
    # Wait for Employee Work Form
    Wait Until Element Is Visible    xpath=//h1[contains(text(), 'แบบฟอร์มการลงงานและลางาน')]    timeout=10s
    
    # Get current date in proper format
    ${CURRENT_DATE}=    Get Current Date    result_format=%Y-%m-%d
    
    # Fill in the work form
    Wait Until Element Is Visible    xpath=//input[@type='date']    timeout=5s
    Input Text    xpath=//input[@type='date']    ${CURRENT_DATE}
    
    # Set times
    ${start_time}=    Set Variable    09:00
    ${end_time}=    Set Variable    17:00
    Wait Until Element Is Visible    xpath=//form//input[@type='time']    timeout=5s
    Input Text    xpath=(//form//input[@type='time'])[1]    ${start_time}
    Input Text    xpath=(//form//input[@type='time'])[2]    ${end_time}
    
    # Fill department and task in the correct fields
    Wait Until Element Is Visible    xpath=//label[contains(text(), 'แผนก')]//following-sibling::input    timeout=5s
    Input Text    xpath=//label[contains(text(), 'แผนก')]//following-sibling::input    ${DEPARTMENT}
    
    Wait Until Element Is Visible    xpath=//label[contains(text(), 'งานที่ต้องทำ')]//following-sibling::input    timeout=5s
    Input Text    xpath=//label[contains(text(), 'งานที่ต้องทำ')]//following-sibling::input    ${TASK}
    
    # Submit the form
    Wait Until Element Is Clickable    xpath=//button[contains(text(), 'ลงงาน')]    timeout=5s
    Click Button    xpath=//button[contains(text(), 'ลงงาน')]
    
    # Verify success message
    Wait Until Element Is Visible    xpath=//p[contains(text(), 'ลงงานสำเร็จ')]    timeout=10s
    
    # Navigate to logout
    Wait Until Element Is Clickable    xpath=//a[contains(@href, 'EmpUser')]    timeout=5s
    Click Element    xpath=//a[contains(@href, 'EmpUser')]
    
    # Logout
    Wait Until Element Is Visible    xpath=//button[contains(text(), 'ออกจากระบบ')]    timeout=10s
    Click Button    xpath=//button[contains(text(), 'ออกจากระบบ')]
    
    # Verify we're back at login page
    Wait Until Element Is Visible    xpath=//h2[contains(text(), 'เข้าสู่ระบบ')]    timeout=10s

Admin Login And Add Employee
    Login As Admin
    
    # Wait for Admin Dashboard
    Wait Until Element Is Visible    xpath=//h1[contains(text(), 'ข้อมูลพนักงาน')]    timeout=10s
    
    # Click Add Employee button
    Wait Until Element Is Clickable    xpath=//button[contains(text(), 'เพิ่มพนักงาน')]    timeout=5s
    Click Button    xpath=//button[contains(text(), 'เพิ่มพนักงาน')]
    
    # Wait for Add Employee form
    Wait Until Element Is Visible    xpath=//h2[contains(text(), 'เพิ่มพนักงานใหม่')]    timeout=10s
    
    # Fill in new employee details
    Wait Until Element Is Visible    xpath=//form//input[@name='name']    timeout=5s
    Input Text    xpath=//form//input[@name='name']    ${NEW_EMP_NAME}
    
    Wait Until Element Is Visible    xpath=//form//input[@name='username']    timeout=5s
    Input Text    xpath=//form//input[@name='username']    ${NEW_EMP_USERNAME}
    
    Wait Until Element Is Visible    xpath=//form//input[@name='password']    timeout=5s
    Input Text    xpath=//form//input[@name='password']    ${NEW_EMP_PASSWORD}
    
    Wait Until Element Is Visible    xpath=//form//input[@name='department']    timeout=5s
    Input Text    xpath=//form//input[@name='department']    ${NEW_EMP_DEPARTMENT}
    
    Wait Until Element Is Visible    xpath=//form//input[@name='phone']    timeout=5s
    Input Text    xpath=//form//input[@name='phone']    ${NEW_EMP_PHONE}
    
    Wait Until Element Is Visible    xpath=//form//input[@name='email']    timeout=5s
    Input Text    xpath=//form//input[@name='email']    ${NEW_EMP_EMAIL}
    
    Wait Until Element Is Visible    xpath=//form//input[@name='userId']    timeout=5s
    Input Text    xpath=//form//input[@name='userId']    ${NEW_EMP_USERID}
    
    # Submit the form
    Wait Until Element Is Clickable    xpath=//form//button[@type='submit']    timeout=5s
    Click Button    xpath=//form//button[@type='submit']
    
    # Handle alert if present
    Handle Alert If Present
    
    # Verify success (look for the new employee in the table)
    Wait Until Element Is Visible    xpath=//td[contains(text(), '${NEW_EMP_NAME}')]    timeout=10s

*** Keywords ***
Setup Browser
    Open Browser    ${URL}    ${BROWSER}
    Maximize Browser Window
    Set Selenium Implicit Wait    5s

Handle Test Teardown
    Run Keyword If Test Failed    Capture Page Screenshot

Login As Employee
    Wait Until Element Is Visible    xpath=//h2[contains(text(), 'เข้าสู่ระบบ')]    timeout=10s
    
    # Clear any existing values
    Clear Element Text    xpath=//input[@type='text']
    Clear Element Text    xpath=//input[@type='password']
    
    # Enter credentials
    Input Text    xpath=//input[@type='text']    ${EMPLOYEE_USERNAME}
    Input Text    xpath=//input[@type='password']    ${EMPLOYEE_PASSWORD}
    
    # Submit form
    Click Button    xpath=//button[@type='submit']

Login As Admin
    Wait Until Element Is Visible    xpath=//h2[contains(text(), 'เข้าสู่ระบบ')]    timeout=10s
    
    # Clear any existing values
    Clear Element Text    xpath=//input[@type='text']
    Clear Element Text    xpath=//input[@type='password']
    
    # Enter credentials
    Input Text    xpath=//input[@type='text']    ${ADMIN_USERNAME}
    Input Text    xpath=//input[@type='password']    ${ADMIN_PASSWORD}
    
    # Submit form
    Click Button    xpath=//button[@type='submit']

Clear Element Text
    [Arguments]    ${locator}
    ${is_visible}=    Run Keyword And Return Status    Element Should Be Visible    ${locator}
    Run Keyword If    ${is_visible}    Clear Text Field    ${locator}

Clear Text Field
    [Arguments]    ${locator}
    Wait Until Element Is Visible    ${locator}    timeout=5s
    Press Keys    ${locator}    CTRL+a    DELETE

Handle Alert If Present
    ${status}    ${message}=    Run Keyword And Ignore Error    Alert Should Be Present
    Run Keyword If    '${status}'=='PASS'    Accept Alert 