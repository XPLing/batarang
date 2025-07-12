# AngularJS Batarang MV3 Testing Guide

## Pre-Testing Setup

### 1. Ensure Chrome Version
- Chrome 88+ is required for Manifest V3
- Check version: `chrome://version/`

### 2. Load Extension in Developer Mode

1. Open Chrome and go to `chrome://extensions/`
2. Enable "Developer mode" (toggle in top right)
3. Click "Load unpacked"
4. Select the project directory: `/mnt/e/practice/Google Extensions/angularJSBatarang`
5. Verify the extension loads without errors

### 3. Check Extension Status
- Extension should appear in the extensions list
- Icon should be visible in the extensions toolbar
- No error messages should be displayed

## Testing Scenarios

### Test 1: Basic Extension Loading
**Expected**: Extension loads successfully in Chrome extensions page

**Steps**:
1. Navigate to `chrome://extensions/`
2. Verify "AngularJS Batarang" appears in the list
3. Check that the status shows "Enabled"
4. Look for any error messages (should be none)

### Test 2: Test Page Functionality
**Expected**: AngularJS app with debug cookie triggers Batarang

**Steps**:
1. Open the test page: `file:///mnt/e/practice/Google Extensions/angularJSBatarang/test_page.html`
2. Verify the page loads with AngularJS content
3. Check that `__ngDebug=true` cookie is set
4. Look for Batarang activity in extension

### Test 3: DevTools Panel Creation
**Expected**: AngularJS panel appears in Chrome DevTools

**Steps**:
1. On the test page, open DevTools (F12)
2. Look for "AngularJS" tab in the DevTools panel list
3. Click on the AngularJS tab
4. Verify the panel loads without errors

### Test 4: Scope Inspection
**Expected**: Scope tree displays in the AngularJS panel

**Steps**:
1. In DevTools AngularJS panel, navigate to "Scopes" tab
2. Verify scope hierarchy is displayed
3. Check that scope data is visible
4. Interact with the page (click buttons, change inputs)
5. Verify scope updates are reflected in real-time

### Test 5: Elements Panel Integration
**Expected**: $scope sidebar appears in Elements panel

**Steps**:
1. In DevTools, go to "Elements" panel
2. Select an element with ng-controller
3. Look for "$scope" in the right sidebar
4. Verify scope properties are displayed

### Test 6: Performance Monitoring
**Expected**: Performance data is captured and displayed

**Steps**:
1. Navigate to "Performance" tab in AngularJS panel
2. Interact with the application
3. Verify performance metrics are being collected
4. Check for any timing data

## Validation Checklist

### ✅ Extension Loading
- [ ] Extension appears in chrome://extensions/
- [ ] No error messages on extension load
- [ ] Extension icon visible in toolbar

### ✅ DevTools Integration
- [ ] AngularJS panel appears in DevTools
- [ ] Panel loads without JavaScript errors
- [ ] $scope sidebar appears in Elements panel

### ✅ Core Functionality
- [ ] Scope tree displays correctly
- [ ] Real-time scope updates work
- [ ] Performance monitoring active
- [ ] Message passing between components works

### ✅ Manifest V3 Features
- [ ] Service worker background script runs
- [ ] chrome.storage.session used for data persistence
- [ ] chrome.action API working (replaces pageAction)
- [ ] Host permissions properly configured

## Debugging Common Issues

### Extension Won't Load
- Check manifest.json syntax with JSON validator
- Verify all referenced files exist
- Check Chrome console for error messages

### DevTools Panel Missing
- Verify devtoolsBackground.js loads correctly
- Check if chrome.devtools.panels API is available
- Ensure test page has Angular and debug cookie

### Scope Data Not Showing
- Confirm __ngDebug=true cookie is set
- Verify inject.js is executing on the page
- Check background script for message passing errors

### Service Worker Issues
- Check chrome://extensions/ for service worker errors
- Verify chrome.storage.session API is working
- Use chrome://serviceworker-internals/ for debugging

## Test Results Log

Date: ___________
Tester: ___________

| Test | Status | Notes |
|------|--------|-------|
| Extension Loading | ⭕ Pass / ❌ Fail | |
| DevTools Panel | ⭕ Pass / ❌ Fail | |
| Scope Inspection | ⭕ Pass / ❌ Fail | |
| Elements Integration | ⭕ Pass / ❌ Fail | |
| Performance Monitoring | ⭕ Pass / ❌ Fail | |
| Real-time Updates | ⭕ Pass / ❌ Fail | |

## Additional Notes

_Space for any additional observations or issues encountered during testing._