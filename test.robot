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
${DELAY}          0.5s

*** Test Cases ***
Employee Login And Submit Work
    Login As Employee
    
    # Wait for Employee Work Form
    Wait Until Element Is Visible    xpath=//h1[contains(text(), 'แบบฟอร์มการลงงานและลางาน')]    timeout=15s
    Sleep    ${DELAY}
    
    # Get current date in proper format
    ${CURRENT_DATE}=    Get Current Date    result_format=%Y-%m-%d
    
    # Fill in the work form
    Wait Until Element Is Visible    xpath=//input[@type='date']    timeout=10s
    Input Text    xpath=//input[@type='date']    ${CURRENT_DATE}
    Sleep    ${DELAY}
    
    # Set times
    ${start_time}=    Set Variable    09:00
    ${end_time}=    Set Variable    17:00
    Wait Until Element Is Visible    xpath=//form//input[@type='time']    timeout=10s
    Input Text    xpath=(//form//input[@type='time'])[1]    ${start_time}
    Sleep    ${DELAY}
    Input Text    xpath=(//form//input[@type='time'])[2]    ${end_time}
    Sleep    ${DELAY}
    
    # Fill department and task in the correct fields
    Wait Until Element Is Visible    xpath=//label[contains(text(), 'แผนก')]//following-sibling::input    timeout=10s
    Input Text    xpath=//label[contains(text(), 'แผนก')]//following-sibling::input    ${DEPARTMENT}
    Sleep    ${DELAY}
    
    Wait Until Element Is Visible    xpath=//label[contains(text(), 'งานที่ต้องทำ')]//following-sibling::input    timeout=10s
    Input Text    xpath=//label[contains(text(), 'งานที่ต้องทำ')]//following-sibling::input    ${TASK}
    Sleep    ${DELAY}
    
    # Submit the form
    Wait Until Element Is Visible    xpath=//button[contains(text(), 'ลงงาน')]    timeout=10s
    Click Button    xpath=//button[contains(text(), 'ลงงาน')]
    
    # Verify success message - check for both popup and on-page message
    ${popup_present}=    Run Keyword And Return Status    Handle Alert If Present
    Run Keyword If    not ${popup_present}    Wait Until Page Contains Element    xpath=//*[contains(text(), 'ลงงานสำเร็จ')]    timeout=15s
    
    # Navigate to logout
    Sleep    2s
    Wait Until Element Is Visible    xpath=//a[contains(@href, 'EmpUser') or contains(text(), 'EmpUser')]    timeout=15s
    Click Element    xpath=//a[contains(@href, 'EmpUser') or contains(text(), 'EmpUser')]
    
    # Logout - check various possible button locations
    Sleep    2s
    ${logout_visible}=    Run Keyword And Return Status    Element Should Be Visible    xpath=//button[contains(text(), 'ออกจากระบบ')]
    Run Keyword If    ${logout_visible}    Click Button    xpath=//button[contains(text(), 'ออกจากระบบ')]
    ...    ELSE    Click Element    xpath=//*[contains(text(), 'ออกจากระบบ')]
    
    # Handle logout confirmation if present
    Sleep    1s
    ${confirm_logout}=    Run Keyword And Return Status    Element Should Be Visible    xpath=//button[contains(text(), 'ยืนยัน') or contains(text(), 'ตกลง') or contains(text(), 'ใช่')]
    Run Keyword If    ${confirm_logout}    Click Button    xpath=//button[contains(text(), 'ยืนยัน') or contains(text(), 'ตกลง') or contains(text(), 'ใช่')]
    
    # Verify we're back at login page
    Wait Until Element Is Visible    xpath=//h2[contains(text(), 'เข้าสู่ระบบ')]    timeout=15s

Admin Login And Add Employee
    # Make sure we're on the login page
    Go To    ${URL}
    Wait Until Element Is Visible    xpath=//h2[contains(text(), 'เข้าสู่ระบบ')]    timeout=15s
    
    Login As Admin
    
    # Wait for Admin Dashboard
    Wait Until Element Is Visible    xpath=//h1[contains(text(), 'ข้อมูลพนักงาน')]    timeout=15s
    Sleep    ${DELAY}
    
    # Click Add Employee button
    Wait Until Element Is Visible    xpath=//button[contains(text(), 'เพิ่มพนักงาน')]    timeout=10s
    Click Button    xpath=//button[contains(text(), 'เพิ่มพนักงาน')]
    
    # Wait for Add Employee form
    Wait Until Element Is Visible    xpath=//h2[contains(text(), 'เพิ่มพนักงานใหม่')]    timeout=15s
    Sleep    ${DELAY}
    
    # Fill in new employee details
    Wait Until Element Is Visible    xpath=//form//input[@name='name']    timeout=10s
    Input Text    xpath=//form//input[@name='name']    ${NEW_EMP_NAME}
    Sleep    ${DELAY}
    
    Wait Until Element Is Visible    xpath=//form//input[@name='username']    timeout=10s
    Input Text    xpath=//form//input[@name='username']    ${NEW_EMP_USERNAME}
    Sleep    ${DELAY}
    
    Wait Until Element Is Visible    xpath=//form//input[@name='password']    timeout=10s
    Input Text    xpath=//form//input[@name='password']    ${NEW_EMP_PASSWORD}
    Sleep    ${DELAY}
    
    Wait Until Element Is Visible    xpath=//form//input[@name='department']    timeout=10s
    Input Text    xpath=//form//input[@name='department']    ${NEW_EMP_DEPARTMENT}
    Sleep    ${DELAY}
    
    Wait Until Element Is Visible    xpath=//form//input[@name='phone']    timeout=10s
    Input Text    xpath=//form//input[@name='phone']    ${NEW_EMP_PHONE}
    Sleep    ${DELAY}
    
    Wait Until Element Is Visible    xpath=//form//input[@name='email']    timeout=10s
    Input Text    xpath=//form//input[@name='email']    ${NEW_EMP_EMAIL}
    Sleep    ${DELAY}
    
    Wait Until Element Is Visible    xpath=//form//input[@name='userId']    timeout=10s
    Input Text    xpath=//form//input[@name='userId']    ${NEW_EMP_USERID}
    Sleep    ${DELAY}
    
    # Submit the form
    Wait Until Element Is Visible    xpath=//form//button[@type='submit']    timeout=10s
    Click Button    xpath=//form//button[@type='submit']
    
    # Handle alert if present
    Sleep    1s
    Handle Alert If Present
    
    # Verify success (look for the new employee in the table)
    Wait Until Element Is Visible    xpath=//td[contains(text(), '${NEW_EMP_NAME}')]    timeout=15s

*** Keywords ***
Setup Browser
    Open Browser    ${URL}    ${BROWSER}
    Maximize Browser Window
    Set Selenium Implicit Wait    10s
    Set Selenium Speed    ${DELAY}

Handle Test Teardown
    Run Keyword If Test Failed    Capture Page Screenshot

Login As Employee
    Wait Until Element Is Visible    xpath=//h2[contains(text(), 'เข้าสู่ระบบ')]    timeout=15s
    Sleep    ${DELAY}
    
    # Clear any existing values
    Clear Element Text    xpath=//input[@type='text']
    Clear Element Text    xpath=//input[@type='password']
    Sleep    ${DELAY}
    
    # Enter credentials
    Input Text    xpath=//input[@type='text']    ${EMPLOYEE_USERNAME}
    Sleep    ${DELAY}
    Input Text    xpath=//input[@type='password']    ${EMPLOYEE_PASSWORD}
    Sleep    ${DELAY}
    
    # Submit form
    Click Button    xpath=//button[@type='submit']

Login As Admin
    Wait Until Element Is Visible    xpath=//h2[contains(text(), 'เข้าสู่ระบบ')]    timeout=15s
    Sleep    ${DELAY}
    
    # Clear any existing values
    Clear Element Text    xpath=//input[@type='text']
    Clear Element Text    xpath=//input[@type='password']
    Sleep    ${DELAY}
    
    # Enter credentials
    Input Text    xpath=//input[@type='text']    ${ADMIN_USERNAME}
    Sleep    ${DELAY}
    Input Text    xpath=//input[@type='password']    ${ADMIN_PASSWORD}
    Sleep    ${DELAY}
    
    # Submit form
    Click Button    xpath=//button[@type='submit']

Clear Element Text
    [Arguments]    ${locator}
    ${is_visible}=    Run Keyword And Return Status    Element Should Be Visible    ${locator}
    Run Keyword If    ${is_visible}    Clear Text Field    ${locator}

Clear Text Field
    [Arguments]    ${locator}
    Wait Until Element Is Visible    ${locator}    timeout=10s
    Press Keys    ${locator}    CTRL+a    DELETE

Handle Alert If Present
    ${status}    ${message}=    Run Keyword And Ignore Error    Alert Should Be Present
    Run Keyword If    '${status}'=='PASS'    Accept Alert
    RETURN    ${status}=='PASS' 