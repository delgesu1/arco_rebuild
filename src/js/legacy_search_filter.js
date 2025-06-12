/**
 * legacy_search_filter.js
 * ----------------------------------------------------------
 * This file preserves the original (non-mock) search-filtering
 * logic that was in place before we switched to the simple
 * “7 random tags” mock implementation.  Feel free to copy / paste
 * or import any of these snippets back into `main.js` when you are
 * ready to hook the search bar up to a real LLM ranking call.
 * ----------------------------------------------------------
 */

/**
 * Given `techniqueDatabase` (an object whose keys are category names and
 * values are arrays of technique strings) and `composerDatabase` (array),
 * return deterministic filtered results that match `searchQuery`.
 *
 * The algorithm:
 *   1.  Flatten the technique database into an array of
 *       `{ name, category }` objects.
 *   2.  Filter both techniques and composers with
 *       `name.toLowerCase().includes(searchQuery.toLowerCase())`.
 *   3.  Group the surviving techniques back by category so the sidebar
 *       can render them under their respective section headings.
 *   4.  Return an object containing:
 *          - techniquesBySection : { [category]: string[] }
 *          - filteredComposers   : string[]
 */
export function legacyFilterTechniques(searchQuery, techniqueDatabase, composerDatabase) {
    const allTechniques = [];
    Object.entries(techniqueDatabase).forEach(([category, techniques]) => {
        techniques.forEach(name => allTechniques.push({ name, category }));
    });

    const query = searchQuery.trim().toLowerCase();
    if (!query) {
        // If query is empty return everything (or handle upstream).
        return {
            techniquesBySection: techniqueDatabase,
            filteredComposers: composerDatabase,
        };
    }

    // 1)  technique filtering
    const filteredTechniqueObjects = allTechniques.filter(t =>
        t.name.toLowerCase().includes(query)
    );

    // 2)  group techniques by section
    const techniquesBySection = {};
    filteredTechniqueObjects.forEach(t => {
        if (!techniquesBySection[t.category]) {
            techniquesBySection[t.category] = [];
        }
        techniquesBySection[t.category].push(t.name);
    });

    // 3) composer filtering
    const filteredComposers = composerDatabase.filter(c =>
        c.toLowerCase().includes(query)
    );

    return { techniquesBySection, filteredComposers };
}

/* ----------------------------------------------------------
 *  Example usage snippet (for the sidebar UI):
 * ----------------------------------------------------------

    const { techniquesBySection, filteredComposers } = legacyFilterTechniques(
        searchQuery,
        techniqueDatabase,
        composerDatabase
    );

    // === Techniques Section ===
    if (Object.keys(techniquesBySection).length) {
        const techniquesSection = createFilterSection('techniques', 'Techniques', true);
        Object.entries(techniquesBySection).forEach(([sectionName, techniqueNames]) => {
            const sectionDiv = document.createElement('div');
            sectionDiv.className = 'technique-section';

            const title = document.createElement('div');
            title.className = 'section-title';
            title.textContent = sectionName;

            const tagsDiv = document.createElement('div');
            tagsDiv.className = 'technique-tags';

            techniqueNames.forEach(name => {
                const tag = createTechniqueTag(name, 'technique');
                tagsDiv.appendChild(tag);
            });

            sectionDiv.appendChild(title);
            sectionDiv.appendChild(tagsDiv);
            techniquesSection.sectionContent.appendChild(sectionDiv);
        });
        container.appendChild(techniquesSection.element);
    }

    // === Composers Section ===
    if (filteredComposers.length) {
        const composersSection = createFilterSection('composers', 'Composers', true);
        const composerTagsDiv = document.createElement('div');
        composerTagsDiv.className = 'technique-tags';

        filteredComposers.forEach(c => {
            const tag = createTechniqueTag(c, 'composer');
            composerTagsDiv.appendChild(tag);
        });

        composersSection.sectionContent.appendChild(composerTagsDiv);
        container.appendChild(composersSection.element);
    }

 */
