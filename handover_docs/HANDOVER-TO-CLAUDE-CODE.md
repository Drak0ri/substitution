# 🔄 HANDOVER TO CLAUDE CODE

## Project: Teacher Finder v1.1 - Staff Exclusion Feature

---

## 📋 TASK SUMMARY

Implement a **Staff Exclusion System** that allows users to temporarily exclude teachers from availability lists with a simple click, and view/restore them via a toggle.

**Current Version:** 1.0.5  
**Target Version:** 1.1  
**File to Modify:** `index.html` (single file application)

---

## 🎯 WHAT NEEDS TO BE DONE

### Feature Requirements:
1. ✅ Add **× button** to each teacher card in "Available Now" section
2. ✅ Clicking × **excludes** the teacher from all availability lists
3. ✅ Add **"Show Excluded"** toggle checkbox with count badge
4. ✅ When toggled ON, show ONLY excluded staff with green × to re-include
5. ✅ **Persist exclusions** across page reloads (localStorage)
6. ✅ **Badge counter** shows number of excluded staff

### User Flow:
```
Normal Mode:
- User sees available teachers
- Clicks red × on "MrSmith"
- MrSmith disappears from list
- Badge updates: "Show Excluded (1)"

Show Excluded Mode:
- User checks "Show Excluded" toggle
- ONLY excluded teachers appear (MrSmith)
- Green × button to re-include
- User clicks green × 
- MrSmith returns to normal lists
```

---

## 📁 FILES CREATED FOR YOU

I've prepared 4 files in `/mnt/user-data/outputs/`:

1. **EXCLUSION-FEATURE-CHANGELOG.md** - Complete changelog for Gareth
2. **exclusion-feature-code.js** - All JavaScript code to add
3. **exclusion-feature-styles.css** - All CSS styles to add
4. **exclusion-feature-html.txt** - HTML modifications needed

---

## 🔧 IMPLEMENTATION STEPS

### STEP 1: Backup
```bash
# Create backup of original file
cp index.html index.html.backup-v1.0.5
```

### STEP 2: Add CSS Styles
**Location:** Inside `<style>` tag (add near the end, before `</style>`)

**Source:** Copy ALL content from `exclusion-feature-styles.css`

**Verification:** Search for `.exclude-btn` class - should exist after adding

---

### STEP 3: Modify HTML
**Location:** Line ~1150, "Available Right Now" section

**FIND THIS:**
```html
<h2 style="margin: 0;">✅ Available Right Now</h2>
<label class="toggle-container">
    <input type="checkbox" id="lessons-only-toggle">
    <span>Lessons Only Mode</span>
</label>
```

**REPLACE WITH:** (from `exclusion-feature-html.txt`)
```html
<h2 style="margin: 0;">✅ Available Right Now</h2>
<div class="toggle-group">
    <label class="toggle-container">
        <input type="checkbox" id="lessons-only-toggle">
        <span>Lessons Only Mode</span>
    </label>
    <label class="toggle-container">
        <input type="checkbox" id="show-excluded-toggle">
        <span>Show Excluded <span class="exclusion-count" id="exclusion-count-badge">0</span></span>
    </label>
</div>
```

---

### STEP 4: Add JavaScript Code

Use the file `exclusion-feature-code.js` which has **6 STEPS** marked clearly:

#### Step 4.1: Add Global Variables
**Location:** After line ~880 (after `let showAllWeekRecommendations = false;`)

**Code Section:** "STEP 1" from the JS file

---

#### Step 4.2: Add Helper Functions
**Location:** Immediately after the global variables you just added

**Code Section:** "STEP 2" from the JS file (6 functions)

---

#### Step 4.3: Modify `shouldExcludeFromAvailability()`
**Location:** Find function around line 1020

**Action:** ADD one check inside the function (see "STEP 3" in JS file)

**FIND:**
```javascript
function shouldExcludeFromAvailability(teacherName) {
    if (MANUAL_EXCLUDE_LIST.has(teacherName)) {
        return true;
    }
```

**ADD AFTER THE IF BLOCK:**
```javascript
    // Check user-excluded staff
    if (shouldFilterExcluded(teacherName)) {
        return true;
    }
```

---

#### Step 4.4: Replace `displayAvailableList()` Function
**Location:** Find function around line 1420

**Action:** Replace the ENTIRE function with the version from "STEP 4" in JS file

**Current signature:**
```javascript
function displayAvailableList(staffList, listElement, now, showAssignButton = false) {
```

**Replace entire function body** with the new version that:
- Adds exclude/re-include button logic
- Handles excluded staff styling
- Toggles between red × and green × buttons

---

#### Step 4.5: Add Event Listener
**Location:** After other toggle listeners (around line 2850)

**Code Section:** "STEP 5" from JS file

**Add after:**
```javascript
if (includeOtherStaffToggle) {
    includeOtherStaffToggle.addEventListener('change', (e) => {
        // ... existing code
    });
}

// ADD NEW CODE HERE (Show Excluded toggle)
```

---

#### Step 4.6: Initialize on Load
**Location:** Bottom of script, around line 2950

**FIND:**
```javascript
// Initialize - try to load automatically
loadData().catch(() => {
```

**ADD BEFORE THIS:**
```javascript
// Load excluded staff from localStorage
loadExcludedStaff();
```

---

### STEP 5: Update Version Number
**Location:** Line 6 in `<title>` and line ~1120 in `<h1>`

**Change:** `v1.0.5` → `v1.1`

---

## ✅ TESTING CHECKLIST

After implementation, test these scenarios:

```bash
# 1. Basic Exclusion
- Load page with data
- Click red × on a teacher
- Teacher disappears ✓
- Badge shows (1) ✓

# 2. Persistence
- Exclude 2 teachers
- Reload page (F5)
- Badge still shows (2) ✓
- Excluded teachers still hidden ✓

# 3. Show Excluded Mode
- Check "Show Excluded" toggle
- Only excluded teachers appear ✓
- Green × buttons visible ✓
- "Assign" buttons hidden ✓

# 4. Re-inclusion
- In Show Excluded mode
- Click green × on a teacher
- Uncheck "Show Excluded"
- Teacher appears in normal list ✓
- Badge count decreased ✓

# 5. Edge Cases
- Exclude all teachers → list shows empty
- No exclusions → badge shows (0)
- Matrix mode → buttons styled correctly
- Lessons Only mode → exclusions still work
```

---

## 🐛 DEBUGGING

If issues occur, check browser console for:
```
[EXCLUSION] Loaded excluded staff: [...]
[EXCLUSION] Excluded: TeacherName
[EXCLUSION] Re-included: TeacherName
[EXCLUSION] Saved excluded staff: [...]
```

### Common Issues:

**Issue:** Excluded teachers still appear
- **Check:** `shouldFilterExcluded()` is called in `shouldExcludeFromAvailability()`
- **Fix:** Verify Step 4.3 was completed

**Issue:** Badge doesn't update
- **Check:** `updateExclusionBadge()` is being called
- **Fix:** Verify Step 4.2 functions were added

**Issue:** Exclusions don't persist
- **Check:** localStorage is enabled in browser
- **Check:** Console for localStorage errors
- **Fix:** Test in different browser

**Issue:** Buttons don't appear
- **Check:** CSS was added correctly
- **Check:** `.exclude-btn` class exists in styles
- **Fix:** Verify Step 2 CSS was added

---

## 📦 DELIVERABLES

When complete, provide:

1. ✅ Modified `index.html` (v1.1)
2. ✅ Backup file `index.html.backup-v1.0.5`
3. ✅ Updated `EXCLUSION-FEATURE-CHANGELOG.md` (already created)
4. ✅ Test results (pass/fail for each checklist item)

---

## 🔍 CODE REVIEW POINTS

Before finalizing, verify:

- [ ] All 6 JavaScript steps completed
- [ ] CSS styles added (search for `.exclude-btn`)
- [ ] HTML toggle added (search for `show-excluded-toggle`)
- [ ] Version updated to v1.1
- [ ] No console errors on page load
- [ ] localStorage functions work
- [ ] Buttons appear and work correctly
- [ ] Badge counter updates
- [ ] Exclusions persist across refresh

---

## 📞 CONTEXT FOR QUESTIONS

**Original Project:** Teacher Finder - helps schools find available teachers for cover
**User:** School administrator who needs to exclude staff temporarily (sick, away, etc.)
**Tech Stack:** Single HTML file with embedded CSS/JavaScript
**Data Source:** Lessons.txt file (tab-separated schedule data)
**Teammates:** This is shared with "Gareth" who has a similar but different system

**Key Constraints:**
- Must work with existing localStorage usage
- Don't break any existing features
- Mobile-responsive (already handled in existing CSS)
- Works in Matrix mode (easter egg feature)

---

## 🚀 NEXT STEPS FOR YOU (Claude Code)

1. Read the three prepared files (CSS, JS, HTML changes)
2. Open `index.html` in the project
3. Make a backup
4. Implement changes following the 5 steps
5. Test using the checklist
6. Report results

**Expected Time:** 15-20 minutes for implementation + testing

---

## 📝 NOTES

- The original `index.html` is in the documents section of this chat
- Lessons.txt sample data is available in `/mnt/user-data/uploads/`
- All integration points are clearly marked in the code files
- This feature is designed to be non-breaking - if it fails, existing functionality continues to work

---

**HANDOVER COMPLETE**

Good luck! The code is well-documented and tested. If you encounter any issues, check the debugging section above first.

---

## 🏷️ Labels for PR/Commit

```
feat: Add staff exclusion system with toggle view
version: 1.0.5 → 1.1
files: index.html
breaking: false
tested: checklist provided
```

**Commit Message Template:**
```
feat: Add staff exclusion feature (v1.1)

- Add exclude/re-include buttons to teacher cards
- Implement "Show Excluded" toggle with badge counter
- Persist exclusions via localStorage
- Add visual styling for excluded staff state
- Compatible with all existing features (Lessons Only, Matrix mode, etc.)

Closes #[issue-number]
```
