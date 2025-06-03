// app.js loaded sentinel
console.log("app.js loaded");

        let originalMainContentHTML = '';
        let isPreviewActive = false;
        let hoverTimeout = null; // To manage quick hovers
        let selectedTechniquesBeforePreview = []; // To store actual selections during preview
        let isViewingSheet = false;
        let mainContentBeforeView = '';

        // Comprehensive technique database (Categorized)
        const techniqueDatabase = {
            "Scales & Arpeggios": [
                "Major Scales (One Octave)",
                "Minor Scales (One Octave)",
                "Major Arpeggios (One Octave)",
                "Chromatic Scale (One Octave)",
                "Two Octave Major Scales",
                "Scales in Thirds"
            ],
            "Bowing Techniques": [
                "Detache",
                "Legato",
                "Staccato",
                "Spiccato",
                "Martelé",
                "Ricochet"
            ],
            "Left Hand Techniques": [
                "Finger Dexterity",
                "Shifting (Positions 1-3)",
                "Vibrato (Introduction)",
                "Double Stops (Basic)",
                "Trills",
                "Pizzicato (Left Hand)"
            ],
            "Rhythm & Timing": [
                "Basic Rhythms (Quarter, Half, Whole)",
                "Dotted Rhythms",
                "Syncopation (Simple)",
                "Tuplets (Triplets)",
                "Metronome Practice"
            ],
            "Musicality & Expression": [
                "Dynamics (p, mf, f)",
                "Phrasing (Simple Melodies)",
                "Articulation Accents",
                "Basic Music Theory (Key Signatures)"
            ]
        };

        // Flattened database with descriptions for preview
        const techniqueDatabaseFlat = [
            { name: "Major Scales (One Octave)", category: "Scales & Arpeggios", description: "Playing major scales through one octave helps develop finger patterns and intonation." },
            { name: "Minor Scales (One Octave)", category: "Scales & Arpeggios", description: "Minor scales introduce different tonal colors and fingerings." },
            { name: "Major Arpeggios (One Octave)", category: "Scales & Arpeggios", description: "Arpeggios outline chords and are crucial for understanding harmony and improving string crossing." },
            { name: "Chromatic Scale (One Octave)", category: "Scales & Arpeggios", description: "The chromatic scale uses all semitones and is excellent for finger precision and ear training." },
            { name: "Two Octave Major Scales", category: "Scales & Arpeggios", description: "Extending scales to two octaves requires shifting and consistent tone production across a wider range." },
            { name: "Scales in Thirds", category: "Scales & Arpeggios", description: "Playing scales in thirds enhances finger coordination and harmonic understanding." },
            { name: "Detache", category: "Bowing Techniques", description: "A fundamental bowing technique involving separate, smooth bow strokes for each note." },
            { name: "Legato", category: "Bowing Techniques", description: "Connecting multiple notes smoothly in a single bow stroke." },
            { name: "Staccato", category: "Bowing Techniques", description: "Short, detached bow strokes, creating separation between notes." },
            { name: "Spiccato", category: "Bowing Techniques", description: "A bouncing bow stroke where the bow naturally lifts off the string between notes." },
            { name: "Martelé", category: "Bowing Techniques", description: "A 'hammered' stroke with a sharp attack and clear separation." },
            { name: "Ricochet", category: "Bowing Techniques", description: "A series of rapid, bouncing notes performed in a single down or up bow." },
            { name: "Finger Dexterity", category: "Left Hand Techniques", description: "Exercises to improve the speed, accuracy, and independence of the left-hand fingers." },
            { name: "Shifting (Positions 1-3)", category: "Left Hand Techniques", description: "Moving the left hand smoothly between different positions on the fingerboard." },
            { name: "Vibrato (Introduction)", category: "Left Hand Techniques", description: "A subtle oscillation in pitch to add warmth and expressiveness to the tone." },
            { name: "Double Stops (Basic)", category: "Left Hand Techniques", description: "Playing two notes simultaneously on adjacent strings." },
            { name: "Trills", category: "Left Hand Techniques", description: "Rapid alternation between two adjacent notes." },
            { name: "Pizzicato (Left Hand)", category: "Left Hand Techniques", description: "Plucking the strings with the left-hand fingers, often used for special effects." },
            { name: "Basic Rhythms (Quarter, Half, Whole)", category: "Rhythm & Timing", description: "Understanding and accurately playing fundamental note durations." },
            { name: "Dotted Rhythms", category: "Rhythm & Timing", description: "Rhythms involving notes extended by half their value, creating a characteristic long-short pattern." },
            { name: "Syncopation (Simple)", category: "Rhythm & Timing", description: "Playing notes off the main beat, creating rhythmic interest." },
            { name: "Tuplets (Triplets)", category: "Rhythm & Timing", description: "Dividing a beat into a different number of equal parts, such as three notes in the space of two." },
            { name: "Metronome Practice", category: "Rhythm & Timing", description: "Using a metronome to develop a steady sense of time and rhythmic precision." },
            { name: "Dynamics (p, mf, f)", category: "Musicality & Expression", description: "Controlling the loudness and softness of the music (piano, mezzo-forte, forte)." },
            { name: "Phrasing (Simple Melodies)", category: "Musicality & Expression", description: "Shaping musical sentences to create a coherent and expressive performance." },
            { name: "Articulation Accents", category: "Musicality & Expression", description: "Emphasizing certain notes to give them prominence or a specific character." },
            { name: "Basic Music Theory (Key Signatures)", category: "Musicality & Expression", description: "Understanding how key signatures indicate the sharps or flats to be played throughout a piece." }
        ];

        // Sheet music database
        const sheetMusicDatabase = {
            'Legato': [
                { title: 'Kreutzer Etude No. 2', composer: 'R. Kreutzer', difficulty: 'Intermediate' },
                { title: 'Wohlfahrt Op. 45 No. 15', composer: 'F. Wohlfahrt', difficulty: 'Beginner' },
                { title: 'Sevcik Op. 1 Part 1', composer: 'O. Sevcik', difficulty: 'Advanced' }
            ],
            'Staccato': [
                { title: 'Kreutzer Etude No. 4', composer: 'R. Kreutzer', difficulty: 'Advanced' },
                { title: 'Mazas Op. 36 No. 12', composer: 'J. Mazas', difficulty: 'Intermediate' },
                { title: 'Dont Op. 37 No. 8', composer: 'J. Dont', difficulty: 'Advanced' }
            ],
            'Spiccato': [
                { title: 'Kreutzer Etude No. 9', composer: 'R. Kreutzer', difficulty: 'Advanced' },
                { title: 'Fiorillo No. 25', composer: 'F. Fiorillo', difficulty: 'Professional' },
                { title: 'Rode Caprice No. 6', composer: 'P. Rode', difficulty: 'Virtuoso' }
            ],
            'Scales': [
                { title: 'Hrimaly Scale Studies', composer: 'J. Hrimaly', difficulty: 'Intermediate' },
                { title: 'Flesch Scale System', composer: 'C. Flesch', difficulty: 'Advanced' },
                { title: 'Galamian Scale Studies', composer: 'I. Galamian', difficulty: 'Professional' }
            ],
            'Shifting': [
                { title: 'Sevcik Op. 8', composer: 'O. Sevcik', difficulty: 'Intermediate' },
                { title: 'Schradieck Position Studies', composer: 'H. Schradieck', difficulty: 'Advanced' },
                { title: 'Kreutzer Etude No. 8', composer: 'R. Kreutzer', difficulty: 'Advanced' }
            ]
        };

        // Global state
        let selectedTechniques = [];

        // Auto-resize textarea
        function autoResize(textarea) {
    // Reset height first to accurately calculate new height
    textarea.style.height = 'auto';
    
    // Calculate new height based on content
    const newHeight = Math.min(textarea.scrollHeight, 120); // Cap at max-height
    textarea.style.height = newHeight + 'px';
    
    // Apply different styles based on content length
    const chatInputWrapper = textarea.closest('.chat-input-wrapper');
    if (chatInputWrapper) {
        if (newHeight > 60) {
            chatInputWrapper.classList.add('expanded');
        } else {
            chatInputWrapper.classList.remove('expanded');
        }
    }
}

        function previewTechniqueContent(techniqueName) {
            // Disable hover previews if a sheet is currently open
            if (isViewingSheet) {
                return;
            }
            // If a preview is NOT YET active, check the *current* selectedTechniques (which are persistent user selections).
            // If it has items, don't start a new preview.
            if (!isPreviewActive && selectedTechniques.length > 0) {
                return; 
            }

            const mainContent = document.getElementById('mainContent');
            if (!mainContent) return;

            if (!isPreviewActive) { // Only save state if starting a new preview sequence
                originalMainContentHTML = mainContent.innerHTML;
                // At this point, if we passed the check above, selectedTechniques was empty when this function was called.
                // So selectedTechniquesBeforePreview will correctly be empty (or reflect the true state if the logic evolves).
                selectedTechniquesBeforePreview = [...selectedTechniques]; 
            }
            
            // If we are here, it's either:
            // 1. No persistent selections existed (and !isPreviewActive, so selectedTechniques.length was 0 initially)
            // 2. A preview is already active (isPreviewActive was true), so we're just switching the preview content.
            selectedTechniques = [techniqueName]; // Temporarily set to the technique being previewed
            updateMainContent(); // This will now use the fade effect
            
            isPreviewActive = true;
        }

        function clearTechniquePreview() {
            if (isPreviewActive) {
                const mainContent = document.getElementById('mainContent'); // Get mainContent inside the if block
                if (!mainContent) { // Check if mainContent exists
                    isPreviewActive = false; // Still reset flag if mainContent somehow missing
                    return;
                }

                selectedTechniques = [...selectedTechniquesBeforePreview]; // Restore actual selections first

                // Use the fade helper to restore the original content
                _updateMainContentWithFade(() => {
                    mainContent.innerHTML = originalMainContentHTML;
                });
                
                isPreviewActive = false;
            }
        }

        // Helper function to manage fade-out, content update, and fade-in
        function _updateMainContentWithFade(updateCallback) {
            const mainContent = document.getElementById('mainContent'); // This IS .content-body
            if (!mainContent) return;

            // Start fade-out
            mainContent.classList.add('fade-out');

            setTimeout(() => {
                // Update the content
                if (updateCallback) {
                    updateCallback(); // This changes mainContent.innerHTML
                }

                // Prepare for fade-in:
                // 1. Make the new content transparent (it currently has no 'fade-out' class but might be visible)
                mainContent.style.opacity = '0'; 
                
                // 2. Remove 'fade-out' class (which might have been on the old, now-gone content's representation)
                //    and ensure the base styles for transition are active.
                mainContent.classList.remove('fade-out'); 

                // 3. Force a reflow. This is a common trick to ensure the browser processes the style changes
                //    before applying the next ones, allowing the transition to trigger correctly.
                void mainContent.offsetHeight; // Reading an offsetHeight is a common way to trigger reflow

                // 4. Trigger the fade-in by setting opacity to 1. The CSS transition on .content-body will handle it.
                mainContent.style.opacity = '1';

            }, 300); // Match CSS transition duration for fade-out
        }

        function updateMainContent() {
            _updateMainContentWithFade(() => {
                const mainContent = document.getElementById('mainContent');
                if (!mainContent) return;

                if (selectedTechniques.length === 0) {
                    mainContent.innerHTML = `
                        <div class="empty-state">
                            <i class="fas fa-music"></i>
                            <h3>Welcome to Arco</h3>
                            <p>Search for techniques or select from the sidebar to get started with your practice session.</p>
                        </div>
                    `;
                } else {
                    let resultingSheets = [];

                    if (selectedTechniques.length > 0) {
                        // Get sheets for the first selected technique
                        const firstTechnique = selectedTechniques[0];
                        resultingSheets = sheetMusicDatabase[firstTechnique] || [
                            { title: `${firstTechnique} Study No. 1`, composer: 'Various', difficulty: 'Intermediate', tags: [firstTechnique] },
                            { title: `${firstTechnique} Exercise`, composer: 'Technical Studies', difficulty: 'Advanced', tags: [firstTechnique] },
                            { title: `${firstTechnique} Etude`, composer: 'Method Books', difficulty: 'Beginner', tags: [firstTechnique] }
                        ];

                        // If multiple techniques are selected, filter by intersection
                        if (selectedTechniques.length > 1) {
                            for (let i = 1; i < selectedTechniques.length; i++) {
                                const currentTechnique = selectedTechniques[i];
                                const currentTechniqueSheets = sheetMusicDatabase[currentTechnique] || [
                                    { title: `${currentTechnique} Study No. 1`, composer: 'Various', difficulty: 'Intermediate', tags: [currentTechnique] },
                                    { title: `${currentTechnique} Exercise`, composer: 'Technical Studies', difficulty: 'Advanced', tags: [currentTechnique] },
                                    { title: `${currentTechnique} Etude`, composer: 'Method Books', difficulty: 'Beginner', tags: [currentTechnique] }
                                ];
                                
                                // Assuming sheet titles are unique identifiers for comparison
                                const currentTechniqueSheetTitles = new Set(currentTechniqueSheets.map(sheet => sheet.title));
                                resultingSheets = resultingSheets.filter(sheet => currentTechniqueSheetTitles.has(sheet.title));
                            }
                        }
                    }

                    if (resultingSheets.length === 0) {
                        mainContent.innerHTML = `
                            <div class="empty-state">
                                <i class="fas fa-folder-open"></i>
                                <h3>No Results</h3>
                                <p>No sheet music found matching all selected techniques. Try a different combination.</p>
                            </div>
                        `;
                    } else {
                        mainContent.innerHTML = `
                            <div class="sheet-music-grid">
                                ${resultingSheets.map((sheet, index) => `
                                    <div class="sheet-item" data-title="${sheet.title}" data-composer="${sheet.composer}">
                                        <div class="sheet-thumbnail">
                                            <img src="assets/images/rode-01.png" alt="${sheet.title} thumbnail">
                                        </div>
                                        <div class="sheet-info">
                                            <div class="sheet-title">${sheet.title}</div>
                                            <div class="sheet-composer">${sheet.composer}</div>
                                        </div>
                                    </div>
                                `).join('')}
                            </div>
                        `;
                        attachSheetItemListeners();
                    }
                }
            });
        }

        function attachSheetItemListeners() {
            document.querySelectorAll('.sheet-item').forEach(item => {
                item.addEventListener('click', () => {
                    const title = item.dataset.title;
                    const composer = item.dataset.composer;
                    viewSheetMusic(title, composer);
                });
            });
        }

        function viewSheetMusic(title, composer) {
            const mainContent = document.getElementById('mainContent');
            mainContentBeforeView = mainContent.innerHTML;
            isViewingSheet = true;

            mainContent.innerHTML = `
                <div class="sheet-viewer">
                    <div style="text-align:center; margin-bottom:0.75rem;">
                        <span style="font-size:1.1rem; font-weight:500; color:var(--md-sys-color-on-surface);">${title}</span>
                        <span style="margin-left:0.5rem; color:var(--md-sys-color-on-surface-variant); font-size:0.875rem;">by ${composer}</span>
                    </div>
                    <div class="sheet-display">
                        <div class="pdf-toolbar">
                            <div class="pdf-controls-group">
                                <div id="page-controls">
                                    <button id="prev-page" class="pdf-control-btn"><i class="fas fa-chevron-left"></i></button>
                                    <span id="page-num">1</span> / <span id="page-count">1</span>
                                    <button id="next-page" class="pdf-control-btn"><i class="fas fa-chevron-right"></i></button>
                                </div>
                            </div>
                            <div class="pdf-controls-group">
                                <button id="zoom-in" class="pdf-control-btn" title="Zoom In"><i class="fas fa-search-plus"></i></button>
                                <button id="zoom-out" class="pdf-control-btn" title="Zoom Out"><i class="fas fa-search-minus"></i></button>
                                <button id="pdf-download" class="pdf-control-btn" title="Download"><i class="fas fa-download"></i></button>
                            </div>
                        </div>
                        <div id="pdf-container">
                            <canvas id="pdf-canvas"></canvas>
                        </div>
                    </div>
                    <!-- Bottom controls removed in favor of toolbar -->
                </div>
            `;
            
            // Initialize PDF rendering with PDF.js
            PDFViewer.init('assets/images/rode-01.pdf');
            document.getElementById('topBackBtn').style.display = 'inline-flex';

            const downloadBtn = document.getElementById('pdf-download');
            if (downloadBtn) {
                downloadBtn.addEventListener('click', () => window.open('assets/images/rode-01.pdf', '_blank'));
            }
        }

        function exitSheetView() {
            const mainContent = document.getElementById('mainContent');
            if (mainContentBeforeView) {
                mainContent.innerHTML = mainContentBeforeView;
                isViewingSheet = false;
                
                // Remove PDF-specific keyboard listeners when exiting the view
                PDFViewer.cleanup();
                document.getElementById('topBackBtn').style.display = 'none';
                // Reattach click handlers for sheet thumbnails
                attachSheetItemListeners();
            } else {
                // Fallback: regenerate content
                updateMainContent();
                isViewingSheet = false;
            }
        }

        function toggleTechniqueSelection(element, technique) {
            // If currently viewing a sheet, exit first so content refreshes properly
            if (isViewingSheet) {
                exitSheetView();
            }
            console.log(`[TOGGLE] Clicked: ${technique}, isPreviewActive: ${isPreviewActive}`);
            console.log('[TOGGLE] Before:', JSON.stringify(selectedTechniques), element.classList.contains('selected'));

            if (selectedTechniques.includes(technique)) {
                console.log('[TOGGLE] Deselecting...');
                selectedTechniques = selectedTechniques.filter(t => t !== technique);
                element.classList.remove('selected');
            } else {
                console.log('[TOGGLE] Selecting...');
                if (selectedTechniques.length < 3) {
                    selectedTechniques.push(technique);
                    element.classList.add('selected');
                } else {
                    console.log('[TOGGLE] Max selection reached.');
                    showTemporaryMessage('Maximum 3 techniques can be selected');
                    return;
                }
            }
            
            console.log('[TOGGLE] After:', JSON.stringify(selectedTechniques), element.classList.contains('selected'));
            updateSelectionCounter();
            console.log('[TOGGLE] Calling updateMainContent...');
            updateMainContent();
            console.log('[TOGGLE] updateMainContent call finished.');
        }

        function updateSelectionCounter() {
            const counter = document.getElementById('selectionCounter');
            const text = document.getElementById('selectionText');
            
            text.textContent = `${selectedTechniques.length}/3 techniques selected`;
            
            if (selectedTechniques.length > 0) {
                counter.classList.add('visible');
            } else {
                counter.classList.remove('visible');
            }
        }

        function populateTechniques() {
            const container = document.getElementById('techniqueContainer');
            container.innerHTML = '';

            Object.entries(techniqueDatabase).forEach(([section, techniques]) => {
                const sectionDiv = document.createElement('div');
                sectionDiv.className = 'technique-section';
                
                const title = document.createElement('div');
                title.className = 'section-title';
                title.textContent = section;
                
                const tagsDiv = document.createElement('div');
                tagsDiv.className = 'technique-tags';
                
                techniques.forEach(technique => {
                    const tag = document.createElement('div');
                    tag.className = 'technique-tag';
                    tag.textContent = technique;
                    tag.dataset.technique = technique;
                    tag.addEventListener('click', () => {
                        if (isPreviewActive) {
                            selectedTechniques = [...selectedTechniquesBeforePreview];
                            isPreviewActive = false; 
                        }
                        toggleTechniqueSelection(tag, technique);
                    });
                    tag.addEventListener('mouseover', () => {
                        clearTimeout(hoverTimeout); 
                        previewTechniqueContent(technique);
                    });
                    tagsDiv.appendChild(tag);
                });
                
                sectionDiv.appendChild(title);
                sectionDiv.appendChild(tagsDiv);
                container.appendChild(sectionDiv);
            });
        }

        function filterTechniques(searchQuery) { 
            const container = document.getElementById('techniqueContainer');
            container.innerHTML = '';
            let allTechniquesWithCategory = [];
            Object.entries(techniqueDatabase).forEach(([category, techniques]) => {
                techniques.forEach(techniqueName => {
                    allTechniquesWithCategory.push({ name: techniqueName, category: category });
                });
            });
            allTechniquesWithCategory.sort(() => 0.5 - Math.random());
            const numberOfTechniquesToShow = Math.floor(Math.random() * 5) + 3; 
            const randomTechniques = allTechniquesWithCategory.slice(0, numberOfTechniquesToShow);
            const techniquesBySection = {};
            randomTechniques.forEach(technique => {
                if (!techniquesBySection[technique.category]) {
                    techniquesBySection[technique.category] = [];
                }
                techniquesBySection[technique.category].push(technique.name);
            });
            Object.entries(techniquesBySection).forEach(([sectionName, techniqueNames]) => {
                const sectionDiv = document.createElement('div');
                sectionDiv.className = 'technique-section';
                const title = document.createElement('div');
                title.className = 'section-title';
                title.textContent = sectionName;
                const tagsDiv = document.createElement('div');
                tagsDiv.className = 'technique-tags';
                techniqueNames.forEach(technique => {
                    const tag = document.createElement('div');
                    tag.className = 'technique-tag';
                    tag.textContent = technique;
                    tag.dataset.technique = technique;
                    tag.addEventListener('click', () => {
                        if (isPreviewActive) {
                            selectedTechniques = [...selectedTechniquesBeforePreview];
                            isPreviewActive = false; 
                        }
                        toggleTechniqueSelection(tag, technique);
                    });
                    tag.addEventListener('mouseover', () => {
                        clearTimeout(hoverTimeout); 
                        previewTechniqueContent(technique);
                    });
                    tagsDiv.appendChild(tag);
                });
                sectionDiv.appendChild(title);
                sectionDiv.appendChild(tagsDiv);
                container.appendChild(sectionDiv);
            });
        }

        function performSearch(isResetAction = false) { 
            const searchInput = document.querySelector('.search-input');
            const query = searchInput.value.trim().toLowerCase();
            const resetBtn = document.getElementById('resetSearchBtn');

            clearTechniquePreview(); 

            const allTechniqueTagsBeforeFilter = document.querySelectorAll('.technique-tag');
            allTechniqueTagsBeforeFilter.forEach(tag => tag.classList.remove('selected'));
            selectedTechniques = [];

            if (!query) {
                populateTechniques(); 
                updateSelectionCounter();
                updateMainContent(); 
                if (!isResetAction) { // Only start new conversation if it's NOT a reset action from 'X' button
                    Chat.startConversation(''); 
                }
                if (resetBtn) resetBtn.style.display = 'none'; // Ensure reset button is hidden
                return;
            }

            // If there is a query, ensure reset button is visible (it should be if input has text)
            if (resetBtn && searchInput.value) resetBtn.style.display = 'block';

            filterTechniques(query); 
            updateSelectionCounter(); 
            updateMainContent();    
            Chat.startConversation(query); // Delegate new conversation to chat module
        }

        function setupEventListeners() { 
            const searchInput = document.querySelector('.search-input'); 
            const resetSearchBtn = document.getElementById('resetSearchBtn'); // New reset button
            const leftMinimizeBtn = document.getElementById('leftMinimizeBtn');
            const rightMinimizeBtn = document.getElementById('rightMinimizeBtn');
            const leftRestoreBtn = document.getElementById('leftRestoreBtn');
            const rightRestoreBtn = document.getElementById('rightRestoreBtn');

            if (searchInput) { 
                searchInput.addEventListener('input', function() {
                    // Show reset button if there is text, hide otherwise
                    if (resetSearchBtn) resetSearchBtn.style.display = this.value.trim() ? 'block' : 'none';
                });

                searchInput.addEventListener('keydown', function(e) {
                    if (e.key === 'Enter') {
                        e.preventDefault(); 
                        performSearch(); // isResetAction will be false by default
                    }
                });
            }

            if (resetSearchBtn) { 
                resetSearchBtn.addEventListener('click', () => {
                    searchInput.value = '';
                    performSearch(true); // Pass true to indicate it's a reset action from 'X' button
                    resetSearchBtn.style.display = 'none'; // Explicitly hide after click
                    searchInput.focus(); // Set focus back to search input
                });
            }

            if (leftMinimizeBtn) {
                leftMinimizeBtn.addEventListener('click', () => Sidebar.toggle('left'));
            }
            if (rightMinimizeBtn) {
                rightMinimizeBtn.addEventListener('click', () => Sidebar.toggle('right'));
            }
            if (leftRestoreBtn) {
                leftRestoreBtn.addEventListener('click', () => Sidebar.toggle('left'));
            }
            if (rightRestoreBtn) {
                rightRestoreBtn.addEventListener('click', () => Sidebar.toggle('right'));
            }
            
            // Add back button event listener
            const topBackBtn = document.getElementById('topBackBtn');
            if (topBackBtn) {
                topBackBtn.addEventListener('click', exitSheetView);
            }
        }

        // Initialize the application
        document.addEventListener('DOMContentLoaded', function() {
            const mainContent = document.getElementById('mainContent');
            if (mainContent) {
                originalMainContentHTML = mainContent.innerHTML; 
            }
            populateTechniques(); 

            const techniqueContainer = document.getElementById('techniqueContainer');
            if (techniqueContainer) {
                techniqueContainer.addEventListener('mouseleave', () => {
                    if (selectedTechniques.length === 0 && !isPreviewActive) { 
                         clearTechniquePreview(); 
                    }
                });
            }
            setupEventListeners(); 
        });
