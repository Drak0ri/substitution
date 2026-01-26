# ⚡ QUICK REFERENCE CARD - Staff Exclusion Feature

## 📍 FILE LOCATIONS
```
/mnt/user-data/outputs/
├── HANDOVER-TO-CLAUDE-CODE.md     ← START HERE (main instructions)
├── EXCLUSION-FEATURE-CHANGELOG.md ← For Gareth (documentation)
├── exclusion-feature-code.js      ← JavaScript to add
├── exclusion-feature-styles.css   ← CSS to add
└── exclusion-feature-html.txt     ← HTML modification
```

## 🎯 5-STEP IMPLEMENTATION

```
1. ADD CSS     → Copy from exclusion-feature-styles.css
2. MODIFY HTML → Replace toggle section (line ~1150)
3. ADD JS VARS → Global variables (after line ~880)
4. ADD JS CODE → 6 functions + modifications
5. UPDATE VER  → Change v1.0.5 to v1.1
```

## 🔍 FIND & REPLACE QUICK GUIDE

### Location 1: CSS (in <style> section)
```css
/* ADD AT END OF <style> SECTION */
.exclude-btn { ... }
```

### Location 2: HTML (line ~1150)
```html
<!-- REPLACE THIS -->
<label class="toggle-container">
    <input type="checkbox" id="lessons-only-toggle">

<!-- WITH THIS -->
<div class="toggle-group">
    <label class="toggle-container">
        <input type="checkbox" id="lessons-only-toggle">
    <label class="toggle-container">
        <input type="checkbox" id="show-excluded-toggle">
```

### Location 3: JavaScript Global Vars (line ~880)
```javascript
// ADD AFTER: let showAllWeekRecommendations = false;
let excludedStaff = new Set();
let showExcludedMode = false;
```

### Location 4: JavaScript Function Modification (line ~1020)
```javascript
// IN: shouldExcludeFromAvailability()
// ADD AFTER: MANUAL_EXCLUDE_LIST check
if (shouldFilterExcluded(teacherName)) {
    return true;
}
```

### Location 5: JavaScript Function Replacement (line ~1420)
```javascript
// REPLACE ENTIRE FUNCTION
function displayAvailableList(staffList, listElement, now, showAssignButton = false) {
    // NEW CODE FROM FILE
}
```

### Location 6: JavaScript Event Listener (line ~2850)
```javascript
// ADD AFTER: includeOtherStaffToggle listener
const showExcludedToggle = document.getElementById('show-excluded-toggle');
if (showExcludedToggle) { ... }
```

### Location 7: JavaScript Initialization (line ~2950)
```javascript
// ADD BEFORE: loadData().catch()
loadExcludedStaff();
```

## ✅ TEST COMMANDS

```javascript
// In browser console:

// Check if excluded staff loaded
console.log(excludedStaff);

// Check localStorage
localStorage.getItem('teacherFinder_excludedStaff');

// Manually exclude someone
toggleTeacherExclusion('TestName');

// Clear all exclusions (if needed)
localStorage.removeItem('teacherFinder_excludedStaff');
location.reload();
```

## 🎨 VISUAL RESULT

```
BEFORE:
✅ Available Right Now    [✓] Lessons Only Mode
┌──────────────────────────────────┐
│ MrSmith (2h) [Assign]            │
│ MsJones (1h) [Assign]            │
└──────────────────────────────────┘

AFTER:
✅ Available Right Now    [✓] Lessons Only  [ ] Show Excluded (0)
┌──────────────────────────────────┐
│ MrSmith (2h) [×] [Assign]        │  ← Red × button added
│ MsJones (1h) [×] [Assign]        │  ← Red × button added
└──────────────────────────────────┘

AFTER CLICKING × on MrSmith:
✅ Available Right Now    [✓] Lessons Only  [ ] Show Excluded (1)
┌──────────────────────────────────┐
│ MsJones (1h) [×] [Assign]        │  ← MrSmith disappeared
└──────────────────────────────────┘

WHEN "Show Excluded" CHECKED:
✅ Available Right Now    [✓] Lessons Only  [✓] Show Excluded (1)
┌──────────────────────────────────┐
│ 🚫 MrSmith (2h) [×]              │  ← Green × button, no Assign
└──────────────────────────────────┘
```

## 🐛 QUICK TROUBLESHOOTING

| Problem | Solution |
|---------|----------|
| × buttons don't appear | Check CSS was added |
| Clicking × does nothing | Check JS functions added |
| Badge shows NaN | Check `updateExclusionBadge()` exists |
| Exclusions don't save | Check localStorage enabled |
| Console errors | Check function order in JS |
| Teachers still appear | Check `shouldFilterExcluded()` call |

## 📊 EXPECTED CHANGES

```
Lines of Code Added:
- CSS: ~90 lines
- JavaScript: ~150 lines
- HTML: 10 lines modified

Total Changes: ~250 lines
File Size Change: +8KB (approx)
Performance Impact: Negligible
Breaking Changes: None
```

## 🎯 SUCCESS CRITERIA

- [ ] Red × buttons appear on teacher cards
- [ ] Clicking × removes teacher from list
- [ ] Badge counter updates correctly
- [ ] "Show Excluded" toggle works
- [ ] Green × buttons appear in excluded view
- [ ] Exclusions persist after page reload
- [ ] No console errors
- [ ] Existing features still work

## ⏱️ TIME ESTIMATE

```
Implementation: 10-15 minutes
Testing: 5 minutes
Documentation: Already complete
Total: 15-20 minutes
```

## 📞 IF YOU GET STUCK

1. Check `/mnt/user-data/outputs/HANDOVER-TO-CLAUDE-CODE.md`
2. Review console for `[EXCLUSION]` log messages
3. Verify each of the 7 locations was modified
4. Test in fresh browser window (clear cache)
5. Compare against the three code files provided

---

**Ready to implement? Start with `HANDOVER-TO-CLAUDE-CODE.md`**
