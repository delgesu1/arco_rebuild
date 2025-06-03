// app.js loaded sentinel
console.log("app.js loaded");
if (window.pdfjsLib) { pdfjsLib.GlobalWorkerOptions.workerSrc = "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.7.107/pdf.worker.min.js"; }

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
        let currentConversationId = null;
        let conversations = {};
        let inDepthMode = false;

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
                                    <div class="sheet-item" onclick="viewSheetMusic('${sheet.title}', '${sheet.composer}')">
                                        <div class="sheet-thumbnail">
                                            <img src="public/images/rode-01.png" alt="${sheet.title} thumbnail">
                                        </div>
                                        <div class="sheet-info">
                                            <div class="sheet-title">${sheet.title}</div>
                                            <div class="sheet-composer">${sheet.composer}</div>
                                        </div>
                                    </div>
                                `).join('')}
                            </div>
                        `;
                    }
                }
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
                                <button id="pdf-download" class="pdf-control-btn" title="Download" onclick="window.open('public/images/rode-01.pdf', '_blank')"><i class="fas fa-download"></i></button>
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
            initPDFViewer('public/images/rode-01.pdf');
            document.getElementById('topBackBtn').style.display = 'inline-flex';
        }

        // PDF.js viewer initialization
        let pdfDoc = null,
            pageNum = 1,
            pageRendering = false,
            pageNumPending = null,
            scale = 1.25;

        function initPDFViewer(url) {
            // Reset state in case the viewer was previously used
            pageNum = 1;
            scale = 1.25;
            
            // Load the PDF
            pdfjsLib.getDocument(url).promise.then(function(pdf) {
                pdfDoc = pdf;
                document.getElementById('page-count').textContent = pdf.numPages;
                
                // Initial/first page rendering
                renderPage(pageNum);
                
                // Setup pagination controls
                document.getElementById('prev-page').addEventListener('click', onPrevPage);
                document.getElementById('next-page').addEventListener('click', onNextPage);
                
                // Setup zoom controls
                document.getElementById('zoom-in').addEventListener('click', function() {
                    scale += 0.25;
                    renderPage(pageNum);
                });
                
                document.getElementById('zoom-out').addEventListener('click', function() {
                    if (scale > 0.5) {
                        scale -= 0.25;
                        renderPage(pageNum);
                    }
                });
                
                // Setup keyboard navigation
                document.addEventListener('keydown', pdfKeyboardHandler);
            }).catch(function(error) {
                console.error('Error loading PDF:', error);
                document.getElementById('pdf-container').innerHTML = `
                    <div style="padding: 2rem; text-align: center;">
                        <p>Unable to load PDF. Please try again later.</p>
                        <a href="${url}" target="_blank" class="control-btn">Download PDF</a>
                    </div>
                `;
            });
        }

        function renderPage(num) {
            pageRendering = true;
            
            // Show loading indicator
            const pdfContainer = document.getElementById('pdf-container');
            const existingCanvas = document.getElementById('pdf-canvas');
            
            // Add loading state
            pdfContainer.style.position = 'relative';
            let loadingIndicator = document.getElementById('pdf-loading');
            if (!loadingIndicator) {
                loadingIndicator = document.createElement('div');
                loadingIndicator.id = 'pdf-loading';
                loadingIndicator.style.position = 'absolute';
                loadingIndicator.style.top = '50%';
                loadingIndicator.style.left = '50%';
                loadingIndicator.style.transform = 'translate(-50%, -50%)';
                loadingIndicator.style.background = 'rgba(0,0,0,0.7)';
                loadingIndicator.style.color = 'white';
                loadingIndicator.style.padding = '10px 20px';
                loadingIndicator.style.borderRadius = '4px';
                loadingIndicator.style.zIndex = '1000';
                loadingIndicator.textContent = 'Loading page...';
                pdfContainer.appendChild(loadingIndicator);
            } else {
                loadingIndicator.style.display = 'block';
            }
            
            // Using promise to fetch the page
            pdfDoc.getPage(num).then(function(page) {
                // Calculate the optimal scale for viewing - adjust to fit width
                const pdfContainerWidth = pdfContainer.clientWidth - 40; // 40px for padding
                const rawViewport = page.getViewport({scale: 1});
                const widthScale = pdfContainerWidth / rawViewport.width;
                const adjustedScale = scale * widthScale;
                
                const viewport = page.getViewport({scale: adjustedScale});
                const canvas = document.getElementById('pdf-canvas');
                const context = canvas.getContext('2d');
                
                // Set canvas dimensions
                canvas.height = viewport.height;
                canvas.width = viewport.width;
                
                // Render PDF page into canvas context
                const renderContext = {
                    canvasContext: context,
                    viewport: viewport
                };
                const renderTask = page.render(renderContext);
                
                // Wait for rendering to finish
                renderTask.promise.then(function() {
                    pageRendering = false;
                    if (loadingIndicator) loadingIndicator.style.display = 'none';
                    
                    if (pageNumPending !== null) {
                        // New page rendering is pending
                        renderPage(pageNumPending);
                        pageNumPending = null;
                    }
                }).catch(function(error) {
                    console.error('Error rendering PDF page:', error);
                    if (loadingIndicator) loadingIndicator.style.display = 'none';
                    pageRendering = false;
                });
            }).catch(function(error) {
                console.error('Error getting PDF page:', error);
                if (loadingIndicator) loadingIndicator.style.display = 'none';
                pageRendering = false;
            });
            
            // Update page counters
            document.getElementById('page-num').textContent = num;
        }
        
        function queueRenderPage(num) {
            if (pageRendering) {
                pageNumPending = num;
            } else {
                renderPage(num);
            }
        }
        
        function onPrevPage() {
            if (pageNum <= 1) {
                return;
            }
            pageNum--;
            queueRenderPage(pageNum);
        }
        
        function onNextPage() {
            if (pageNum >= pdfDoc.numPages) {
                return;
            }
            pageNum++;
            queueRenderPage(pageNum);
        }

        function exitSheetView() {
            const mainContent = document.getElementById('mainContent');
            if (mainContentBeforeView) {
                mainContent.innerHTML = mainContentBeforeView;
                isViewingSheet = false;
                
                // Remove PDF-specific keyboard listeners when exiting the view
                // (they will be reattached when entering the view again)
                document.removeEventListener('keydown', pdfKeyboardHandler);
                document.getElementById('topBackBtn').style.display = 'none';
            } else {
                // Fallback: regenerate content
                updateMainContent();
                isViewingSheet = false;
            }
        }

        // Separated keyboard handler for PDF viewing
        function pdfKeyboardHandler(e) {
            if (!isViewingSheet) return;
            
            if (e.key === 'ArrowRight' || e.key === 'PageDown') {
                onNextPage();
            } else if (e.key === 'ArrowLeft' || e.key === 'PageUp') {
                onPrevPage();
            } else if (e.key === '+') {
                if (scale < 3) {
                    scale += 0.25;
                    renderPage(pageNum);
                }
            } else if (e.key === '-') {
                if (scale > 0.5) {
                    scale -= 0.25;
                    renderPage(pageNum);
                }
            } else if (e.key === 'h' || e.key === '?') {
                // Show keyboard shortcuts help
                const helpElement = document.getElementById('pdf-shortcuts-help');
                if (helpElement) {
                    helpElement.style.display = helpElement.style.display === 'none' ? 'flex' : 'none';
                } else {
                    const helpDiv = document.createElement('div');
                    helpDiv.id = 'pdf-shortcuts-help';
                    helpDiv.style.position = 'absolute';
                    helpDiv.style.top = '50%';
                    helpDiv.style.left = '50%';
                    helpDiv.style.transform = 'translate(-50%, -50%)';
                    helpDiv.style.background = 'var(--md-sys-color-surface-container-high)';
                    helpDiv.style.color = 'var(--md-sys-color-on-surface)';
                    helpDiv.style.padding = '20px';
                    helpDiv.style.borderRadius = '8px';
                    helpDiv.style.zIndex = '2000';
                    helpDiv.style.boxShadow = '0 4px 20px rgba(0,0,0,0.3)';
                    helpDiv.style.display = 'flex';
                    helpDiv.style.flexDirection = 'column';
                    helpDiv.style.gap = '10px';
                    helpDiv.style.maxWidth = '400px';
                    
                    helpDiv.innerHTML = `
                        <div style="display:flex; justify-content:space-between; align-items:center;">
                            <h3 style="margin:0;">Keyboard Shortcuts</h3>
                            <button onclick="this.parentElement.parentElement.style.display='none'" 
                                style="background:none; border:none; cursor:pointer; color:var(--md-sys-color-on-surface);">
                                <i class="fas fa-times"></i>
                            </button>
                        </div>
                        <hr style="border-color:var(--md-sys-color-outline-variant); margin:0;">
                        <div style="display:grid; grid-template-columns:auto 1fr; gap:10px; align-items:center;">
                            <span><kbd>←</kbd> or <kbd>PageUp</kbd></span>
                            <span>Previous page</span>
                            <span><kbd>→</kbd> or <kbd>PageDown</kbd></span>
                            <span>Next page</span>
                            <span><kbd>+</kbd></span>
                            <span>Zoom in</span>
                            <span><kbd>-</kbd></span>
                            <span>Zoom out</span>
                            <span><kbd>h</kbd> or <kbd>?</kbd></span>
                            <span>Show/hide this help</span>
                        </div>
                    `;
                    
                    document.getElementById('pdf-container').appendChild(helpDiv);
                }
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

        // Function definitions previously here were corrupted or deleted. Restoring them.

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

        function updateChatSendButton() {
            const chatInput = document.querySelector('.chat-input');
            const chatSendBtn = document.querySelector('.chat-send-btn');
            
            if (chatInput && chatSendBtn) {
                if (chatInput.value.trim() !== '') {
                    chatSendBtn.classList.add('active');
                    chatSendBtn.classList.add('pulse');
                    setTimeout(() => chatSendBtn.classList.remove('pulse'), 600);
                } else {
                    chatSendBtn.classList.remove('active');
                }
            }
        }

        function simulateAIResponse(query, conversationId) {
            if (currentConversationId !== conversationId) return;

            showTypingIndicator();
            setTimeout(() => {
                if (currentConversationId !== conversationId) {
                    hideTypingIndicator(); 
                    return;
                }
                hideTypingIndicator();
                const response = generateInitialAIResponse(query); 
                addMessage('assistant', response, true); 
            }, 1500); 
        }

        function startNewConversation(query) {
            currentConversationId = Date.now().toString();
            conversations[currentConversationId] = [];
            inDepthMode = false;
            
            addMessage('user', query);
            
            if (query) simulateAIResponse(query, currentConversationId);
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
                    startNewConversation(''); 
                }
                if (resetBtn) resetBtn.style.display = 'none'; // Ensure reset button is hidden
                return;
            }

            // If there is a query, ensure reset button is visible (it should be if input has text)
            if (resetBtn && searchInput.value) resetBtn.style.display = 'block';

            filterTechniques(query); 
            updateSelectionCounter(); 
            updateMainContent();    
            startNewConversation(query); // This is for actual search queries with content
        }

        function setupEventListeners() { 
            const searchInput = document.querySelector('.search-input'); 
            const resetSearchBtn = document.getElementById('resetSearchBtn'); // New reset button
            const chatInput = document.querySelector('.chat-input');
            const chatSendBtn = document.querySelector('.chat-send-btn');
            const aiChatSidebar = document.getElementById('aiChatSidebar');
            const minimizeChatBtn = document.getElementById('minimizeChat');
            const restoreChatBtn = document.getElementById('restoreChatBtn');
            const chatHistoryBtn = document.getElementById('chatHistoryBtn');
            // const inDepthAnalysisBtn = document.querySelector('.in-depth-btn'); // This button is dynamically added

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
                resetSearchBtn.onclick = () => {
                    searchInput.value = '';
                    performSearch(true); // Pass true to indicate it's a reset action from 'X' button
                    resetSearchBtn.style.display = 'none'; // Explicitly hide after click
                    searchInput.focus(); // Set focus back to search input
                };
            }

            // Event listeners for chat functionality (remains largely the same)
            if (chatInput) {
                autoResize(chatInput); 
                chatInput.addEventListener('input', function() {
                    autoResize(this);
                    updateChatSendButton();
                });
                chatInput.addEventListener('focus', function() {
                    this.closest('.chat-input-wrapper').classList.add('focused');
                });
                chatInput.addEventListener('blur', function() {
                    this.closest('.chat-input-wrapper').classList.remove('focused');
                });
                chatInput.addEventListener('keydown', function(event) {
                    if (event.key === 'Enter' && !event.shiftKey) {
                        event.preventDefault();
                        const btn = document.querySelector('.chat-send-btn');
                        if (btn.classList.contains('active')) {
                            btn.classList.add('sending');
                            setTimeout(() => btn.classList.remove('sending'), 300);
                            sendChatMessage();
                        } else {
                            this.closest('.chat-input-wrapper').classList.add('shake');
                            setTimeout(() => this.closest('.chat-input-wrapper').classList.remove('shake'), 400);
                        }
                    }
                });
            }

            if (chatSendBtn) {
                chatSendBtn.onclick = () => sendChatMessage();
            }

            if (minimizeChatBtn) {
                minimizeChatBtn.onclick = () => toggleSidebar('right');
            }
            if (restoreChatBtn) {
                restoreChatBtn.onclick = () => toggleSidebar('right');
            }
            if (chatHistoryBtn) {
                chatHistoryBtn.onclick = () => toggleChatHistory();
            }
            // The inDepthAnalysisBtn event listener is added when the button is created in addMessage

            updateChatSendButton();
            // updateMainContent(); // Not needed here, performSearch or populateTechniques will handle it.
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

        function generateInitialAIResponse(query) {
            // Generate contextual advice based on the query
            const lowerQuery = query.toLowerCase();
            let advice = '';
            
            if (lowerQuery.includes('bowing') || lowerQuery.includes('bow')) {
                advice = 'For bowing technique development, focus on straight bow movement and consistent contact point. Start with long, slow bows to establish muscle memory.';
            } else if (lowerQuery.includes('shift') || lowerQuery.includes('position')) {
                advice = 'Position shifting requires precise finger placement and smooth thumb movement. Practice scales with marked position changes to build confidence.';
            } else if (lowerQuery.includes('vibrato')) {
                advice = 'Vibrato should be developed gradually, starting with arm vibrato before progressing to wrist and finger vibrato. Keep the motion relaxed and consistent.';
            } else if (lowerQuery.includes('scale') || lowerQuery.includes('arpeggio')) {
                advice = 'Scale practice is fundamental for intonation and finger independence. Use a metronome and practice in different rhythmic patterns.';
            } else if (lowerQuery.includes('staccato') || lowerQuery.includes('spiccato')) {
                advice = 'Articulated bowing techniques require precise bow control and timing. Start slowly and gradually increase tempo while maintaining clarity.';
            } else if (lowerQuery.includes('double stops') || lowerQuery.includes('harmony')) {
                advice = 'Double stops require careful intonation and bow distribution. Practice each interval separately before combining them.';
            } else if (lowerQuery.includes('trill') || lowerQuery.includes('ornament')) {
                advice = 'Ornaments should enhance the musical line. Start trills slowly and gradually increase speed while maintaining evenness.';
            } else {
                advice = 'Focus on fundamentals: posture, bow hold, and left hand position. Consistent daily practice with attention to detail will yield the best results.';
            }
            
            return advice;
        }

        function addMessage(sender, content, isInitial = false) {
            const messagesContainer = document.getElementById('chatMessages');
            
            // Remove empty state if present
            const emptyState = messagesContainer.querySelector('.empty-state');
            if (emptyState) {
                emptyState.remove();
            }
            
            const messageDiv = document.createElement('div');
            messageDiv.className = `message ${sender}`;
            
            const now = new Date();
            const timeStr = now.toLocaleTimeString('en-US', { 
                hour: 'numeric', 
                minute: '2-digit',
                hour12: true 
            });
            
            let messageHTML = `
                <div class="message-bubble">${content}</div>
                <div class="message-time">${timeStr}</div>
            `;
            
            if (isInitial && sender === 'assistant') {
                messageHTML += `
                    <button class="in-depth-btn" onclick="requestInDepthAnalysis()">
                        <i class="fas fa-brain"></i>
                        Get In-Depth Analysis
                    </button>
                `;
            }
            
            messageDiv.innerHTML = messageHTML;
            messagesContainer.appendChild(messageDiv);
            messagesContainer.scrollTop = messagesContainer.scrollHeight;
            
            // Store in conversation
            if (conversations[currentConversationId]) {
                conversations[currentConversationId].push({
                    sender,
                    content,
                    timestamp: now,
                    isInitial
                });
            }
        }

        function requestInDepthAnalysis() {
            inDepthMode = true;
            
            // Remove the in-depth button
            const inDepthBtn = document.querySelector('.in-depth-btn');
            if (inDepthBtn) {
                inDepthBtn.remove();
            }
            
            // Show typing indicator
            showTypingIndicator();
            
            // Simulate detailed AI response
            setTimeout(() => {
                hideTypingIndicator();
                const detailedResponse = generateInDepthResponse();
                addMessage('assistant', detailedResponse);
                
                // Enable chat input for continued conversation
                enableChatInput();
            }, 2000);
        }

        function generateInDepthResponse() {
            return `Here's a comprehensive analysis of your practice focus:

**Technical Foundation:**
- Establish proper posture and bow hold before advancing to complex techniques
- Use a mirror to monitor your form and bow path
- Record yourself playing to identify areas for improvement

**Practice Strategy:**
- Start with slow, deliberate movements to build muscle memory
- Use a metronome to ensure rhythmic accuracy
- Break complex passages into smaller, manageable segments

**Progressive Development:**
- Begin with foundational exercises before attempting advanced repertoire
- Gradually increase tempo only after achieving technical accuracy
- Focus on one technical aspect at a time to avoid overwhelming your practice

Would you like specific exercises for any particular technique? I can provide detailed practice routines tailored to your current level.`;
        }

        function enableChatInput() {
            const chatInput = document.querySelector('.chat-input');
            chatInput.placeholder = 'Continue the conversation...';
            chatInput.disabled = false;
        }

        function sendChatMessage() {
            const chatInput = document.querySelector('.chat-input');
            const message = chatInput.value.trim();
            
            if (!message || !currentConversationId) return;
            
            // Add user message
            addMessage('user', message);
            
            // Clear input and update UI
            chatInput.value = '';
            autoResize(chatInput);
            updateChatSendButton();
            
            // Show typing indicator
            showTypingIndicator();
            
            // Simulate AI response with variable timing based on message length
            const responseDelay = 800 + Math.min(message.length * 20, 1500) + (Math.random() * 800);
            setTimeout(() => {
                hideTypingIndicator();
                const response = generateChatResponse(message);
                addMessage('assistant', response);
            }, responseDelay);
        }

        function generateChatResponse(message) {
            const responses = [
                "That's a great question! For that technique, I recommend starting with basic finger exercises to build strength and independence.",
                "Excellent point! Try practicing that passage in different rhythmic patterns to improve your timing and coordination.",
                "I suggest breaking that down into smaller sections. Focus on intonation first, then add the bowing technique.",
                "That's a common challenge! Make sure to keep your shoulder relaxed and maintain consistent bow pressure.",
                "Good observation! Try using a slower tempo and gradually increase speed as you become more comfortable.",
                "That technique requires patience. Focus on the fundamentals and the advanced aspects will follow naturally."
            ];
            
            return responses[Math.floor(Math.random() * responses.length)];
        }

        function showTypingIndicator() {
            const messagesContainer = document.getElementById('chatMessages');
            const typingDiv = document.createElement('div');
            typingDiv.className = 'message assistant typing-message';
            typingDiv.innerHTML = `
                <div class="typing-indicator">
                    <span>AI is thinking</span>
                    <div class="typing-dots">
                        <div class="typing-dot"></div>
                        <div class="typing-dot"></div>
                        <div class="typing-dot"></div>
                    </div>
                </div>
            `;
            messagesContainer.appendChild(typingDiv);
            messagesContainer.scrollTop = messagesContainer.scrollHeight;
        }

        function hideTypingIndicator() {
            const typingMessage = document.querySelector('.typing-message');
            if (typingMessage) {
                typingMessage.remove();
            }
        }

        function toggleSidebar(side) {
            const sidebar = document.getElementById(side + 'Sidebar');
            const restoreBtn = document.getElementById(side + 'RestoreBtn');
            
            if (sidebar.classList.contains('minimized')) {
                sidebar.classList.remove('minimized');
                restoreBtn.style.display = 'none';
            } else {
                sidebar.classList.add('minimized');
                restoreBtn.style.display = 'flex';
            }
        }

        function toggleChatHistory() {
            // Create a simple modal or dropdown for chat history
            const existingModal = document.querySelector('.chat-history-modal');
            if (existingModal) {
                existingModal.remove();
                return;
            }

            const modal = document.createElement('div');
            modal.className = 'chat-history-modal';
            modal.innerHTML = `
                <div class="modal-content">
                    <div class="modal-header">
                        <h3>Conversation History</h3>
                        <button class="modal-close" onclick="this.closest('.chat-history-modal').remove()">
                            <i class="fas fa-times"></i>
                        </button>
                    </div>
                    <div class="modal-body">
                        <div class="history-list">
                            ${Object.keys(conversations).length > 0 ? 
                                Object.keys(conversations).map(id => `
                                    <div class="history-item" onclick="loadConversation('${id}')">
                                        <div class="history-title">Conversation ${id}</div>
                                        <div class="history-preview">${conversations[id][0]?.content.substring(0, 50) || 'No messages'}...</div>
                                    </div>
                                `).join('') : 
                                '<div class="no-history">No conversation history yet</div>'
                            }
                        </div>
                    </div>
                </div>
                <div class="modal-backdrop" onclick="this.closest('.chat-history-modal').remove()"></div>
            `;
            document.body.appendChild(modal);
        }

        function loadConversation(conversationId) {
            if (conversations[conversationId]) {
                currentConversationId = conversationId;
                const messagesContainer = document.getElementById('chatMessages');
                messagesContainer.innerHTML = '';
                
                conversations[conversationId].forEach(msg => {
                    addMessage(msg.sender, msg.content, false, msg.isInitial);
                });
                
                showTemporaryMessage(`Loaded conversation ${conversationId}`);
                document.querySelector('.chat-history-modal')?.remove();
            }
        }

        function showTemporaryMessage(message) {
            // Create temporary notification
            const notification = document.createElement('div');
            notification.style.cssText = `
                position: fixed;
                top: 2rem;
                right: 2rem;
                background: var(--md-sys-color-primary);
                color: var(--md-sys-color-on-primary);
                padding: 1rem 1.5rem;
                border-radius: 8px;
                box-shadow: var(--md-sys-elevation-3);
                z-index: 2000;
                animation: slideInFromRight 0.3s ease-out;
            `;
            notification.textContent = message;
            document.body.appendChild(notification);
            
            setTimeout(() => {
                notification.style.animation = 'slideOutToRight 0.3s ease-in forwards';
                setTimeout(() => notification.remove(), 300);
            }, 2000);
        }

        // Add slide animations
        const style = document.createElement('style');
        style.textContent = `
            @keyframes slideInFromRight {
                from { transform: translateX(100%); opacity: 0; }
                to { transform: translateX(0); opacity: 1; }
            }
            @keyframes slideOutToRight {
                from { transform: translateX(0); opacity: 1; }
                to { transform: translateX(100%); opacity: 0; }
            }
        `;
        document.head.appendChild(style);
