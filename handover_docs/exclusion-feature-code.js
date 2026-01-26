// ============================================================================
// STAFF EXCLUSION FEATURE - JAVASCRIPT CODE
// Teacher Finder v1.1
// Add this code to your existing index.html <script> section
// ============================================================================

// ============================================================================
// STEP 1: ADD THESE GLOBAL VARIABLES (after line ~880, with other globals)
// ============================================================================

let excludedStaff = new Set(); // Set of excluded teacher names
let showExcludedMode = false;  // Whether we're showing excluded staff

// ============================================================================
// STEP 2: ADD THESE HELPER FUNCTIONS (after the global variables)
// ============================================================================

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

// ============================================================================
// STEP 3: MODIFY shouldExcludeFromAvailability() FUNCTION
// Find this function (around line 1020) and add this check AFTER the
// MANUAL_EXCLUDE_LIST check:
// ============================================================================

/*
function shouldExcludeFromAvailability(teacherName) {
    // Check manual exclusion list (completely hidden)
    if (MANUAL_EXCLUDE_LIST.has(teacherName)) {
        return true;
    }

    // *** ADD THIS NEW CHECK HERE ***
    // Check user-excluded staff (unless we're in "Show Excluded" mode)
    if (shouldFilterExcluded(teacherName)) {
        return true;
    }
    
    // ... rest of function continues as before ...
*/

// ============================================================================
// STEP 4: REPLACE displayAvailableList() FUNCTION
// Find this function (around line 1420) and replace the ENTIRE function:
// ============================================================================

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

// ============================================================================
// STEP 5: ADD EVENT LISTENER FOR "SHOW EXCLUDED" TOGGLE
// Add this code after the other toggle listeners (around line 2850):
// ============================================================================

// Show Excluded toggle
const showExcludedToggle = document.getElementById('show-excluded-toggle');
if (showExcludedToggle) {
    showExcludedToggle.addEventListener('change', (e) => {
        showExcludedMode = e.target.checked;
        console.log('[EXCLUSION] Show excluded mode:', showExcludedMode);
        updateAvailableNow();
        
        // Update toggle label dynamically
        const label = showExcludedToggle.parentElement.querySelector('span');
        if (label) {
            if (showExcludedMode) {
                label.innerHTML = `Showing Excluded <span class="exclusion-count" id="exclusion-count-badge">${excludedStaff.size}</span>`;
            } else {
                label.innerHTML = `Show Excluded <span class="exclusion-count" id="exclusion-count-badge">${excludedStaff.size}</span>`;
            }
        }
    });
}

// ============================================================================
// STEP 6: INITIALIZE ON PAGE LOAD
// Find the initialization code at the bottom (around line 2950) and ADD:
// ============================================================================

// Load excluded staff from localStorage (ADD THIS LINE)
loadExcludedStaff();

// Initialize - try to load automatically
loadData().catch(() => {
    // If fetch fails, user will need to use file input
});

// ============================================================================
// END OF EXCLUSION FEATURE CODE
// ============================================================================
