# Teacher Finder v1.1 - Staff Exclusion Feature
## Changelog for Gareth

**Date:** 2025-01-26  
**Version:** 1.0 → 1.1  
**Feature:** Staff Exclusion System with Toggle View  
**Developer:** [Your Name]

---

## 🎯 Feature Overview

Added ability for users to **exclude staff members** from availability lists with a simple click, and toggle to **view/restore excluded staff**.

### What It Does:
1. ✅ Click **×** button on any teacher card in "Available Now" to exclude them
2. ✅ Excluded staff are hidden from all availability lists
3. ✅ Toggle **"Show Excluded"** checkbox to view excluded staff
4. ✅ When viewing excluded, click **×** again to restore them
5. ✅ Exclusions persist across page reloads (localStorage)
6. ✅ Count badge shows number of excluded staff

---

## 📝 Changes Made

### 1. **CSS Additions** (add to `<style>` section)

```css
/* ============================================
   EXCLUSION FEATURE STYLES
   ============================================ */

/* Exclude button on teacher cards */
.exclude-btn {
    background: #dc3545;
    color: white;
    border: none;
    padding: 2px 8px;
    border-radius: 50%;
    font-size: 0.9em;
    font-weight: 700;
    cursor: pointer;
    margin-left: 8px;
    transition: all 0.2s ease;
    width: auto;
    line-height: 1;
    min-width: 24px;
    height: 24px;
    display: inline-flex;
    align-items: center;
    justify-content: center;
}

.exclude-btn:hover {
    background: #c82333;
    transform: scale(1.1);
}

/* Re-include button (when showing excluded staff) */
.reinclude-btn {
    background: #28a745;
    color: white;
}

.reinclude-btn:hover {
    background: #218838;
}

/* Excluded staff visual indication */
.teacher-list li.excluded-staff {
    background: #dc3545;
    opacity: 0.7;
}

.teacher-list li.excluded-staff .teacher-name::before {
    content: "🚫 ";
}

/* Matrix mode for exclude buttons */
body.matrix-mode .exclude-btn {
    background: #ff0000;
    border: 1px solid #ff0000;
}

body.matrix-mode .exclude-btn:hover {
    background: #ff3333;
}

body.matrix-mode .reinclude-btn {
    background: #00ff00;
    border: 1px solid #00ff00;
    color: #000;
}

/* Exclusion count badge */
.exclusion-count {
    background: #dc3545;
    color: white;
    padding: 2px 8px;
    border-radius: 10px;
    font-size: 0.8em;
    min-width: 20px;
    text-align: center;
    margin-left: 10px;
}
```

### 2. **HTML Changes**

**FIND** this section (around line 1150):
```html
<h2 style="margin: 0;">✅ Available Right Now</h2>
<label class="toggle-container">
    <input type="checkbox" id="lessons-only-toggle">
    <span>Lessons Only Mode</span>
</label>
```

**REPLACE WITH**:
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

### 3. **JavaScript Additions**

#### A. Add Global State Variables (after line ~880):

```javascript
// ============================================================================
// EXCLUSION FEATURE - Global State
// ============================================================================

let excludedStaff = new Set(); // Set of excluded teacher names
let showExcludedMode = false;  // Whether we're showing excluded staff

/**
 * Load excluded staff from localStorage on page load
 */
function loadExcludedStaff() {
    try {
        const saved = localStorage.getItem('teacherFinder_excludedStaff');
        if (saved) {
            excludedStaff = new Set(JSON.parse(saved));
            console.log('[EXCLUSION] Loaded excluded staff:', Array.from(excludedStaff));
        }
    } catch (error) {
        console.error('[EXCLUSION] Error loading excluded staff:', error);
        excludedStaff = new Set();
    }
    updateExclusionBadge();
}

/**
 * Save excluded staff to localStorage
 */
function saveExcludedStaff() {
    try {
        localStorage.setItem('teacherFinder_excludedStaff', JSON.stringify(Array.from(excludedStaff)));
        console.log('[EXCLUSION] Saved excluded staff:', Array.from(excludedStaff));
    } catch (error) {
        console.error('[EXCLUSION] Error saving excluded staff:', error);
    }
}

/**
 * Toggle a teacher's exclusion status
 */
function toggleTeacherExclusion(teacherName) {
    if (excludedStaff.has(teacherName)) {
        excludedStaff.delete(teacherName);
        console.log('[EXCLUSION] Re-included:', teacherName);
    } else {
        excludedStaff.add(teacherName);
        console.log('[EXCLUSION] Excluded:', teacherName);
    }
    saveExcludedStaff();
    updateExclusionBadge();
    
    // Refresh displays
    updateAvailableNow();
    updateRecommendedForCover();
}

/**
 * Update the exclusion count badge
 */
function updateExclusionBadge() {
    const badge = document.getElementById('exclusion-count-badge');
    if (badge) {
        badge.textContent = excludedStaff.size;
    }
}

/**
 * Check if a teacher should be filtered out based on exclusion settings
 */
function shouldFilterExcluded(teacherName) {
    const isExcluded = excludedStaff.has(teacherName);
    
    if (showExcludedMode) {
        // In "Show Excluded" mode, ONLY show excluded staff
        return !isExcluded;
    } else {
        // In normal mode, hide excluded staff
        return isExcluded;
    }
}
```

#### B. Modify `shouldExcludeFromAvailability()` function (around line 1020):

**FIND**:
```javascript
function shouldExcludeFromAvailability(teacherName) {
    // Check manual exclusion list (completely hidden)
    if (MANUAL_EXCLUDE_LIST.has(teacherName)) {
        return true;
    }
```

**ADD AFTER THE MANUAL_EXCLUDE_LIST CHECK**:
```javascript
    // Check user-excluded staff (unless we're in "Show Excluded" mode)
    if (shouldFilterExcluded(teacherName)) {
        return true;
    }
```

#### C. Modify `displayAvailableList()` function (around line 1420):

**FIND** the function signature:
```javascript
function displayAvailableList(staffList, listElement, now, showAssignButton = false) {
```

**REPLACE THE ENTIRE FUNCTION WITH**:
```javascript
function displayAvailableList(staffList, listElement, now, showAssignButton = false) {
    listElement.innerHTML = '';
    
    if (staffList.length === 0) {
        return;
    }

    const nowMinutes = (now.getHours() * 60) + now.getMinutes();
    
    staffList.forEach(item => {
        const li = document.createElement('li');
        const teacher = item.teacher;
        const endTime = item.endTime;
        
        // Check if this teacher is excluded
        const isExcluded = excludedStaff.has(teacher);
        if (isExcluded && showExcludedMode) {
            li.classList.add('excluded-staff');
        }
        
        // Calculate duration available
        let durationText = '';
        let endTimeStr = '';
        if (endTime) {
            const durationMinutes = endTime - nowMinutes;
            const durationHours = Math.floor(durationMinutes / 60);
            const durationMins = durationMinutes % 60;
            endTimeStr = minutesToHHMM(endTime);
            
            if (durationHours > 0 && durationMins > 0) {
                durationText = `${durationHours}h ${durationMins}m until ${endTimeStr}`;
            } else if (durationHours > 0) {
                durationText = `${durationHours}h until ${endTimeStr}`;
            } else if (durationMins > 0) {
                durationText = `${durationMins}m until ${endTimeStr}`;
            } else {
                durationText = `until ${endTimeStr}`;
            }
        }
        
        // Build HTML with exclude/reinclude button
        let excludeButtonHtml = '';
        if (showExcludedMode) {
            // Show green "add back" button
            excludeButtonHtml = `<button class="exclude-btn reinclude-btn" data-teacher="${teacher}" title="Re-include this teacher">×</button>`;
        } else {
            // Show red "exclude" button
            excludeButtonHtml = `<button class="exclude-btn" data-teacher="${teacher}" title="Exclude this teacher">×</button>`;
        }
        
        // Optional Assign button (only for teaching staff in normal mode)
        let assignButtonHtml = '';
        if (showAssignButton && !showExcludedMode) {
            assignButtonHtml = `<button class="assign-cover-btn" data-teacher="${teacher}" data-end-time="${endTimeStr}">Assign</button>`;
        }
        
        li.innerHTML = `
            <span class="teacher-name">${teacher}</span>
            ${durationText ? `<span class="teacher-duration">(${durationText})</span>` : ''}
            ${excludeButtonHtml}
            ${assignButtonHtml}
        `;
        
        // Add click handler for Exclude/Re-include button
        const excludeBtn = li.querySelector('.exclude-btn, .reinclude-btn');
        if (excludeBtn) {
            excludeBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                toggleTeacherExclusion(teacher);
            });
        }
        
        // Add click handler for Assign button
        if (showAssignButton && !showExcludedMode) {
            const assignBtn = li.querySelector('.assign-cover-btn');
            if (assignBtn) {
                assignBtn.addEventListener('click', (e) => {
                    e.stopPropagation();
                    openAssignCoverModal(teacher, endTimeStr);
                });
            }
        }
        
        listElement.appendChild(li);
    });
}
```

#### D. Add Event Listener for "Show Excluded" Toggle (around line 2850):

**ADD AFTER the other toggle listeners**:
```javascript
// Show Excluded toggle
const showExcludedToggle = document.getElementById('show-excluded-toggle');
if (showExcludedToggle) {
    showExcludedToggle.addEventListener('change', (e) => {
        showExcludedMode = e.target.checked;
        console.log('[EXCLUSION] Show excluded mode:', showExcludedMode);
        updateAvailableNow();
        
        // Update toggle label
        const label = showExcludedToggle.parentElement.querySelector('span');
        if (showExcludedMode) {
            label.innerHTML = `Showing Excluded <span class="exclusion-count" id="exclusion-count-badge">${excludedStaff.size}</span>`;
        } else {
            label.innerHTML = `Show Excluded <span class="exclusion-count" id="exclusion-count-badge">${excludedStaff.size}</span>`;
        }
    });
}
```

#### E. Initialize on Page Load (in the `loadData()` function):

**FIND** (around line 2950):
```javascript
// Initialize - try to load automatically
loadData().catch(() => {
    // If fetch fails, user will need to use file input
});
```

**ADD BEFORE THIS**:
```javascript
// Load excluded staff from localStorage
loadExcludedStaff();
```

---

## 🧪 Testing Checklist

- [ ] Click × on a teacher in "Available Now" - they disappear
- [ ] Reload page - excluded staff stay excluded
- [ ] Check "Show Excluded" toggle - only excluded staff appear
- [ ] Click × on an excluded teacher - they're re-included
- [ ] Badge count updates correctly
- [ ] Works in both "Lessons Only" modes
- [ ] Exclusions persist across page refreshes
- [ ] Matrix mode styling works for exclude buttons

---

## 🔧 Integration Instructions

1. **Backup your current `index.html`**
2. **Add CSS** from Section 1 to your `<style>` block
3. **Modify HTML** from Section 2 
4. **Add JavaScript** from Section 3 in the order specified
5. **Test** using the checklist above
6. **Version bump**: Change `v1.0.5` to `v1.1` in title

---

## 📊 Technical Details

### Data Storage
- **localStorage key**: `teacherFinder_excludedStaff`
- **Format**: JSON array of teacher name strings
- **Persistence**: Survives page reloads, browser restarts
- **Cleared by**: Browser cache clear, or manual deletion

### Logic Flow
1. User clicks × button → `toggleTeacherExclusion()`
2. Name added/removed from `excludedStaff` Set
3. Saved to localStorage → `saveExcludedStaff()`
4. Displays refreshed → `updateAvailableNow()`
5. Filtering happens in → `shouldFilterExcluded()`

### Integration Points
- Hooks into existing `shouldExcludeFromAvailability()` function
- Uses existing `displayAvailableList()` function (modified)
- Works with existing toggle system
- Compatible with all existing features

---

## 🐛 Known Limitations

1. **No conflict with ADMIN_STAFF**: Excluded staff can still appear in Admin column (by design)
2. **No undo history**: Once excluded and re-included, no history is kept
3. **No export/import**: Cannot export exclusion list to share with others
4. **Browser-specific**: Exclusions don't sync across browsers

---

## 🚀 Future Enhancement Ideas

- Add "Clear All Exclusions" button
- Export/Import exclusion list
- Temporary exclusions (expire after X hours)
- Exclusion reasons/notes
- Undo/redo functionality

---

## 📞 Support

If you encounter issues:
1. Check browser console for `[EXCLUSION]` log messages
2. Verify localStorage is enabled in browser
3. Clear localStorage and try again: `localStorage.removeItem('teacherFinder_excludedStaff')`

---

**END OF CHANGELOG**
