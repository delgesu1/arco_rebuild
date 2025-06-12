// app.js loaded sentinel
console.log("app.js loaded");

        let originalMainContentHTML = '';
        let isPreviewActive = false;
        let hoverTimeout = null; // To manage quick hovers
        let persistentSelectedTechniques = []; // To store actual technique selections during preview
let persistentSelectedComposers = []; // To store actual composer selections during preview
        let selectedComposers = []; // To store selected composers
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

        // Violin etude composers database
        const composerDatabase = [
            "Kreutzer",
            "Rode", 
            "Dont",
            "Fiorillo",
            "Gaviniès",
            "Mazas",
            "Campagnoli",
            "Wieniawski",
            "Paganini",
            "Sevcik"
        ];

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
        const etudeDatabase = [
  {
    "id": 1,
    "title": "Etude No. 1",
    "composer": "Kreutzer",
    "difficulty": "Intermediate",
    "techniques": [
      "Detache",
      "Major Scales (One Octave)",
      "Basic Rhythms (Quarter, Half, Whole)"
    ],
    "description": "A intermediate etude by Kreutzer focusing on Detache and Major Scales (One Octave)."
  },
  {
    "id": 2,
    "title": "Etude No. 2",
    "composer": "Kreutzer",
    "difficulty": "Advanced",
    "techniques": [
      "Spiccato",
      "Chromatic Scale (One Octave)",
      "Shifting (Positions 1-3)",
      "Syncopation (Simple)"
    ],
    "description": "An advanced etude by Kreutzer focusing on Spiccato and Chromatic Scale (One Octave)."
  },
  {
    "id": 3,
    "title": "Etude No. 3",
    "composer": "Kreutzer",
    "difficulty": "Beginner",
    "techniques": [
      "Legato",
      "Minor Scales (One Octave)",
      "Metronome Practice"
    ],
    "description": "A beginner etude by Kreutzer focusing on Legato and Minor Scales (One Octave)."
  },
  {
    "id": 4,
    "title": "Etude No. 4",
    "composer": "Kreutzer",
    "difficulty": "Intermediate",
    "techniques": [
      "Staccato",
      "Major Arpeggios (One Octave)",
      "Dynamics (p, mf, f)",
      "Finger Dexterity"
    ],
    "description": "An intermediate etude by Kreutzer focusing on Staccato and Major Arpeggios (One Octave)."
  },
  {
    "id": 5,
    "title": "Etude No. 5",
    "composer": "Kreutzer",
    "difficulty": "Advanced",
    "techniques": [
      "Martelé",
      "Scales in Thirds",
      "Vibrato (Introduction)",
      "Phrasing (Simple Melodies)"
    ],
    "description": "An advanced etude by Kreutzer focusing on Martelé and Scales in Thirds."
  },
  {
    "id": 6,
    "title": "Etude No. 6",
    "composer": "Kreutzer",
    "difficulty": "Intermediate",
    "techniques": [
      "Ricochet",
      "Two Octave Major Scales",
      "Double Stops (Basic)",
      "Articulation Accents"
    ],
    "description": "An intermediate etude by Kreutzer focusing on Ricochet and Two Octave Major Scales."
  },
  {
    "id": 7,
    "title": "Etude No. 7",
    "composer": "Kreutzer",
    "difficulty": "Beginner",
    "techniques": [
      "Pizzicato (Left Hand)",
      "Tuplets (Triplets)",
      "Basic Music Theory (Key Signatures)"
    ],
    "description": "A beginner etude by Kreutzer focusing on Pizzicato (Left Hand) and Tuplets (Triplets)."
  },
  {
    "id": 8,
    "title": "Etude No. 8",
    "composer": "Kreutzer",
    "difficulty": "Advanced",
    "techniques": [
      "Detache",
      "Shifting (Positions 1-3)",
      "Dotted Rhythms",
      "Chromatic Scale (One Octave)"
    ],
    "description": "An advanced etude by Kreutzer focusing on Detache and Shifting (Positions 1-3)."
  },
  {
    "id": 9,
    "title": "Etude No. 9",
    "composer": "Kreutzer",
    "difficulty": "Intermediate",
    "techniques": [
      "Legato",
      "Finger Dexterity",
      "Syncopation (Simple)",
      "Major Scales (One Octave)"
    ],
    "description": "An intermediate etude by Kreutzer focusing on Legato and Finger Dexterity."
  },
  {
    "id": 10,
    "title": "Etude No. 10",
    "composer": "Kreutzer",
    "difficulty": "Beginner",
    "techniques": [
      "Spiccato",
      "Vibrato (Introduction)",
      "Metronome Practice",
      "Minor Scales (One Octave)"
    ],
    "description": "A beginner etude by Kreutzer focusing on Spiccato and Vibrato (Introduction)."
  },
  {
    "id": 11,
    "title": "Etude No. 1",
    "composer": "Rode",
    "difficulty": "Advanced",
    "techniques": [
      "Staccato",
      "Double Stops (Basic)",
      "Dynamics (p, mf, f)",
      "Major Arpeggios (One Octave)"
    ],
    "description": "An advanced etude by Rode focusing on Staccato and Double Stops (Basic)."
  },
  {
    "id": 12,
    "title": "Etude No. 2",
    "composer": "Rode",
    "difficulty": "Intermediate",
    "techniques": [
      "Martelé",
      "Trills",
      "Phrasing (Simple Melodies)",
      "Scales in Thirds"
    ],
    "description": "An intermediate etude by Rode focusing on Martelé and Trills."
  },
  {
    "id": 13,
    "title": "Etude No. 3",
    "composer": "Rode",
    "difficulty": "Beginner",
    "techniques": [
      "Ricochet",
      "Pizzicato (Left Hand)",
      "Articulation Accents",
      "Two Octave Major Scales"
    ],
    "description": "A beginner etude by Rode focusing on Ricochet and Pizzicato (Left Hand)."
  },
  {
    "id": 14,
    "title": "Etude No. 4",
    "composer": "Rode",
    "difficulty": "Advanced",
    "techniques": [
      "Detache",
      "Tuplets (Triplets)",
      "Basic Music Theory (Key Signatures)",
      "Chromatic Scale (One Octave)"
    ],
    "description": "An advanced etude by Rode focusing on Detache and Tuplets (Triplets)."
  },
  {
    "id": 15,
    "title": "Etude No. 5",
    "composer": "Rode",
    "difficulty": "Intermediate",
    "techniques": [
      "Legato",
      "Dotted Rhythms",
      "Shifting (Positions 1-3)",
      "Major Scales (One Octave)"
    ],
    "description": "An intermediate etude by Rode focusing on Legato and Dotted Rhythms."
  },
  {
    "id": 16,
    "title": "Etude No. 6",
    "composer": "Rode",
    "difficulty": "Advanced",
    "techniques": [
      "Spiccato",
      "Syncopation (Simple)",
      "Finger Dexterity",
      "Minor Scales (One Octave)"
    ],
    "description": "An advanced etude by Rode focusing on Spiccato and Syncopation (Simple)."
  },
  {
    "id": 17,
    "title": "Etude No. 7",
    "composer": "Rode",
    "difficulty": "Beginner",
    "techniques": [
      "Staccato",
      "Metronome Practice",
      "Vibrato (Introduction)",
      "Major Arpeggios (One Octave)"
    ],
    "description": "A beginner etude by Rode focusing on Staccato and Metronome Practice."
  },
  {
    "id": 18,
    "title": "Etude No. 8",
    "composer": "Rode",
    "difficulty": "Intermediate",
    "techniques": [
      "Martelé",
      "Dynamics (p, mf, f)",
      "Double Stops (Basic)",
      "Scales in Thirds"
    ],
    "description": "An intermediate etude by Rode focusing on Martelé and Dynamics (p, mf, f)."
  },
  {
    "id": 19,
    "title": "Etude No. 9",
    "composer": "Rode",
    "difficulty": "Advanced",
    "techniques": [
      "Ricochet",
      "Phrasing (Simple Melodies)",
      "Trills",
      "Two Octave Major Scales"
    ],
    "description": "An advanced etude by Rode focusing on Ricochet and Phrasing (Simple Melodies)."
  },
  {
    "id": 20,
    "title": "Etude No. 10",
    "composer": "Rode",
    "difficulty": "Beginner",
    "techniques": [
      "Detache",
      "Articulation Accents",
      "Pizzicato (Left Hand)",
      "Chromatic Scale (One Octave)"
    ],
    "description": "A beginner etude by Rode focusing on Detache and Articulation Accents."
  },
  {
    "id": 21,
    "title": "Etude No. 1",
    "composer": "Dont",
    "difficulty": "Intermediate",
    "techniques": [
      "Legato",
      "Basic Music Theory (Key Signatures)",
      "Tuplets (Triplets)",
      "Major Scales (One Octave)"
    ],
    "description": "An intermediate etude by Dont focusing on Legato and Basic Music Theory (Key Signatures)."
  },
  {
    "id": 22,
    "title": "Etude No. 2",
    "composer": "Dont",
    "difficulty": "Advanced",
    "techniques": [
      "Spiccato",
      "Dotted Rhythms",
      "Shifting (Positions 1-3)",
      "Minor Scales (One Octave)"
    ],
    "description": "An advanced etude by Dont focusing on Spiccato and Dotted Rhythms."
  },
  {
    "id": 23,
    "title": "Etude No. 3",
    "composer": "Dont",
    "difficulty": "Beginner",
    "techniques": [
      "Staccato",
      "Syncopation (Simple)",
      "Finger Dexterity",
      "Major Arpeggios (One Octave)"
    ],
    "description": "A beginner etude by Dont focusing on Staccato and Syncopation (Simple)."
  },
  {
    "id": 24,
    "title": "Etude No. 4",
    "composer": "Dont",
    "difficulty": "Intermediate",
    "techniques": [
      "Martelé",
      "Metronome Practice",
      "Vibrato (Introduction)",
      "Scales in Thirds"
    ],
    "description": "An intermediate etude by Dont focusing on Martelé and Metronome Practice."
  },
  {
    "id": 25,
    "title": "Etude No. 5",
    "composer": "Dont",
    "difficulty": "Advanced",
    "techniques": [
      "Ricochet",
      "Dynamics (p, mf, f)",
      "Double Stops (Basic)",
      "Two Octave Major Scales"
    ],
    "description": "An advanced etude by Dont focusing on Ricochet and Dynamics (p, mf, f)."
  },
  {
    "id": 26,
    "title": "Etude No. 6",
    "composer": "Dont",
    "difficulty": "Beginner",
    "techniques": [
      "Detache",
      "Phrasing (Simple Melodies)",
      "Trills",
      "Chromatic Scale (One Octave)"
    ],
    "description": "A beginner etude by Dont focusing on Detache and Phrasing (Simple Melodies)."
  },
  {
    "id": 27,
    "title": "Etude No. 7",
    "composer": "Dont",
    "difficulty": "Intermediate",
    "techniques": [
      "Legato",
      "Articulation Accents",
      "Pizzicato (Left Hand)",
      "Major Scales (One Octave)"
    ],
    "description": "An intermediate etude by Dont focusing on Legato and Articulation Accents."
  },
  {
    "id": 28,
    "title": "Etude No. 8",
    "composer": "Dont",
    "difficulty": "Advanced",
    "techniques": [
      "Spiccato",
      "Basic Music Theory (Key Signatures)",
      "Tuplets (Triplets)",
      "Minor Scales (One Octave)"
    ],
    "description": "An advanced etude by Dont focusing on Spiccato and Basic Music Theory (Key Signatures)."
  },
  {
    "id": 29,
    "title": "Etude No. 9",
    "composer": "Dont",
    "difficulty": "Beginner",
    "techniques": [
      "Staccato",
      "Dotted Rhythms",
      "Shifting (Positions 1-3)",
      "Major Arpeggios (One Octave)"
    ],
    "description": "A beginner etude by Dont focusing on Staccato and Dotted Rhythms."
  },
  {
    "id": 30,
    "title": "Etude No. 10",
    "composer": "Dont",
    "difficulty": "Intermediate",
    "techniques": [
      "Martelé",
      "Syncopation (Simple)",
      "Finger Dexterity",
      "Scales in Thirds"
    ],
    "description": "An intermediate etude by Dont focusing on Martelé and Syncopation (Simple)."
  },
  {
    "id": 31,
    "title": "Etude No. 1",
    "composer": "Fiorillo",
    "difficulty": "Advanced",
    "techniques": [
      "Ricochet",
      "Metronome Practice",
      "Vibrato (Introduction)",
      "Two Octave Major Scales"
    ],
    "description": "An advanced etude by Fiorillo focusing on Ricochet and Metronome Practice."
  },
  {
    "id": 32,
    "title": "Etude No. 2",
    "composer": "Fiorillo",
    "difficulty": "Beginner",
    "techniques": [
      "Detache",
      "Dynamics (p, mf, f)",
      "Double Stops (Basic)",
      "Chromatic Scale (One Octave)"
    ],
    "description": "A beginner etude by Fiorillo focusing on Detache and Dynamics (p, mf, f)."
  },
  {
    "id": 33,
    "title": "Etude No. 3",
    "composer": "Fiorillo",
    "difficulty": "Intermediate",
    "techniques": [
      "Legato",
      "Phrasing (Simple Melodies)",
      "Trills",
      "Major Scales (One Octave)"
    ],
    "description": "An intermediate etude by Fiorillo focusing on Legato and Phrasing (Simple Melodies)."
  },
  {
    "id": 34,
    "title": "Etude No. 4",
    "composer": "Fiorillo",
    "difficulty": "Advanced",
    "techniques": [
      "Spiccato",
      "Articulation Accents",
      "Pizzicato (Left Hand)",
      "Minor Scales (One Octave)"
    ],
    "description": "An advanced etude by Fiorillo focusing on Spiccato and Articulation Accents."
  },
  {
    "id": 35,
    "title": "Etude No. 5",
    "composer": "Fiorillo",
    "difficulty": "Beginner",
    "techniques": [
      "Staccato",
      "Basic Music Theory (Key Signatures)",
      "Tuplets (Triplets)",
      "Major Arpeggios (One Octave)"
    ],
    "description": "A beginner etude by Fiorillo focusing on Staccato and Basic Music Theory (Key Signatures)."
  },
  {
    "id": 36,
    "title": "Etude No. 6",
    "composer": "Fiorillo",
    "difficulty": "Intermediate",
    "techniques": [
      "Martelé",
      "Dotted Rhythms",
      "Shifting (Positions 1-3)",
      "Scales in Thirds"
    ],
    "description": "An intermediate etude by Fiorillo focusing on Martelé and Dotted Rhythms."
  },
  {
    "id": 37,
    "title": "Etude No. 7",
    "composer": "Fiorillo",
    "difficulty": "Advanced",
    "techniques": [
      "Ricochet",
      "Syncopation (Simple)",
      "Finger Dexterity",
      "Two Octave Major Scales"
    ],
    "description": "An advanced etude by Fiorillo focusing on Ricochet and Syncopation (Simple)."
  },
  {
    "id": 38,
    "title": "Etude No. 8",
    "composer": "Fiorillo",
    "difficulty": "Beginner",
    "techniques": [
      "Detache",
      "Metronome Practice",
      "Vibrato (Introduction)",
      "Chromatic Scale (One Octave)"
    ],
    "description": "A beginner etude by Fiorillo focusing on Detache and Metronome Practice."
  },
  {
    "id": 39,
    "title": "Etude No. 9",
    "composer": "Fiorillo",
    "difficulty": "Intermediate",
    "techniques": [
      "Legato",
      "Dynamics (p, mf, f)",
      "Double Stops (Basic)",
      "Major Scales (One Octave)"
    ],
    "description": "An intermediate etude by Fiorillo focusing on Legato and Dynamics (p, mf, f)."
  },
  {
    "id": 40,
    "title": "Etude No. 10",
    "composer": "Fiorillo",
    "difficulty": "Advanced",
    "techniques": [
      "Spiccato",
      "Phrasing (Simple Melodies)",
      "Trills",
      "Minor Scales (One Octave)"
    ],
    "description": "An advanced etude by Fiorillo focusing on Spiccato and Phrasing (Simple Melodies)."
  },
  {
    "id": 41,
    "title": "Etude No. 1",
    "composer": "Gaviniès",
    "difficulty": "Beginner",
    "techniques": [
      "Staccato",
      "Articulation Accents",
      "Pizzicato (Left Hand)",
      "Major Arpeggios (One Octave)"
    ],
    "description": "A beginner etude by Gaviniès focusing on Staccato and Articulation Accents."
  },
  {
    "id": 42,
    "title": "Etude No. 2",
    "composer": "Gaviniès",
    "difficulty": "Intermediate",
    "techniques": [
      "Martelé",
      "Basic Music Theory (Key Signatures)",
      "Tuplets (Triplets)",
      "Scales in Thirds"
    ],
    "description": "An intermediate etude by Gaviniès focusing on Martelé and Basic Music Theory (Key Signatures)."
  },
  {
    "id": 43,
    "title": "Etude No. 3",
    "composer": "Gaviniès",
    "difficulty": "Advanced",
    "techniques": [
      "Ricochet",
      "Dotted Rhythms",
      "Shifting (Positions 1-3)",
      "Two Octave Major Scales"
    ],
    "description": "An advanced etude by Gaviniès focusing on Ricochet and Dotted Rhythms."
  },
  {
    "id": 44,
    "title": "Etude No. 4",
    "composer": "Gaviniès",
    "difficulty": "Beginner",
    "techniques": [
      "Detache",
      "Syncopation (Simple)",
      "Finger Dexterity",
      "Chromatic Scale (One Octave)"
    ],
    "description": "A beginner etude by Gaviniès focusing on Detache and Syncopation (Simple)."
  },
  {
    "id": 45,
    "title": "Etude No. 5",
    "composer": "Gaviniès",
    "difficulty": "Intermediate",
    "techniques": [
      "Legato",
      "Metronome Practice",
      "Vibrato (Introduction)",
      "Major Scales (One Octave)"
    ],
    "description": "An intermediate etude by Gaviniès focusing on Legato and Metronome Practice."
  },
  {
    "id": 46,
    "title": "Etude No. 6",
    "composer": "Gaviniès",
    "difficulty": "Advanced",
    "techniques": [
      "Spiccato",
      "Dynamics (p, mf, f)",
      "Double Stops (Basic)",
      "Minor Scales (One Octave)"
    ],
    "description": "An advanced etude by Gaviniès focusing on Spiccato and Dynamics (p, mf, f)."
  },
  {
    "id": 47,
    "title": "Etude No. 7",
    "composer": "Gaviniès",
    "difficulty": "Beginner",
    "techniques": [
      "Staccato",
      "Phrasing (Simple Melodies)",
      "Trills",
      "Major Arpeggios (One Octave)"
    ],
    "description": "A beginner etude by Gaviniès focusing on Staccato and Phrasing (Simple Melodies)."
  },
  {
    "id": 48,
    "title": "Etude No. 8",
    "composer": "Gaviniès",
    "difficulty": "Intermediate",
    "techniques": [
      "Martelé",
      "Articulation Accents",
      "Pizzicato (Left Hand)",
      "Scales in Thirds"
    ],
    "description": "An intermediate etude by Gaviniès focusing on Martelé and Articulation Accents."
  },
  {
    "id": 49,
    "title": "Etude No. 9",
    "composer": "Gaviniès",
    "difficulty": "Advanced",
    "techniques": [
      "Ricochet",
      "Basic Music Theory (Key Signatures)",
      "Tuplets (Triplets)",
      "Two Octave Major Scales"
    ],
    "description": "An advanced etude by Gaviniès focusing on Ricochet and Basic Music Theory (Key Signatures)."
  },
  {
    "id": 50,
    "title": "Etude No. 10",
    "composer": "Gaviniès",
    "difficulty": "Beginner",
    "techniques": [
      "Detache",
      "Dotted Rhythms",
      "Shifting (Positions 1-3)",
      "Chromatic Scale (One Octave)"
    ],
    "description": "A beginner etude by Gaviniès focusing on Detache and Dotted Rhythms."
  },
  {
    "id": 51,
    "title": "Etude No. 1",
    "composer": "Mazas",
    "difficulty": "Intermediate",
    "techniques": [
      "Legato",
      "Syncopation (Simple)",
      "Finger Dexterity",
      "Major Scales (One Octave)"
    ],
    "description": "An intermediate etude by Mazas focusing on Legato and Syncopation (Simple)."
  },
  {
    "id": 52,
    "title": "Etude No. 2",
    "composer": "Mazas",
    "difficulty": "Advanced",
    "techniques": [
      "Spiccato",
      "Metronome Practice",
      "Vibrato (Introduction)",
      "Minor Scales (One Octave)"
    ],
    "description": "An advanced etude by Mazas focusing on Spiccato and Metronome Practice."
  },
  {
    "id": 53,
    "title": "Etude No. 3",
    "composer": "Mazas",
    "difficulty": "Beginner",
    "techniques": [
      "Staccato",
      "Dynamics (p, mf, f)",
      "Double Stops (Basic)",
      "Major Arpeggios (One Octave)"
    ],
    "description": "A beginner etude by Mazas focusing on Staccato and Dynamics (p, mf, f)."
  },
  {
    "id": 54,
    "title": "Etude No. 4",
    "composer": "Mazas",
    "difficulty": "Intermediate",
    "techniques": [
      "Martelé",
      "Phrasing (Simple Melodies)",
      "Trills",
      "Scales in Thirds"
    ],
    "description": "An intermediate etude by Mazas focusing on Martelé and Phrasing (Simple Melodies)."
  },
  {
    "id": 55,
    "title": "Etude No. 5",
    "composer": "Mazas",
    "difficulty": "Advanced",
    "techniques": [
      "Ricochet",
      "Articulation Accents",
      "Pizzicato (Left Hand)",
      "Two Octave Major Scales"
    ],
    "description": "An advanced etude by Mazas focusing on Ricochet and Articulation Accents."
  },
  {
    "id": 56,
    "title": "Etude No. 6",
    "composer": "Mazas",
    "difficulty": "Beginner",
    "techniques": [
      "Detache",
      "Basic Music Theory (Key Signatures)",
      "Tuplets (Triplets)",
      "Chromatic Scale (One Octave)"
    ],
    "description": "A beginner etude by Mazas focusing on Detache and Basic Music Theory (Key Signatures)."
  },
  {
    "id": 57,
    "title": "Etude No. 7",
    "composer": "Mazas",
    "difficulty": "Intermediate",
    "techniques": [
      "Legato",
      "Dotted Rhythms",
      "Shifting (Positions 1-3)",
      "Major Scales (One Octave)"
    ],
    "description": "An intermediate etude by Mazas focusing on Legato and Dotted Rhythms."
  },
  {
    "id": 58,
    "title": "Etude No. 8",
    "composer": "Mazas",
    "difficulty": "Advanced",
    "techniques": [
      "Spiccato",
      "Syncopation (Simple)",
      "Finger Dexterity",
      "Minor Scales (One Octave)"
    ],
    "description": "An advanced etude by Mazas focusing on Spiccato and Syncopation (Simple)."
  },
  {
    "id": 59,
    "title": "Etude No. 9",
    "composer": "Mazas",
    "difficulty": "Beginner",
    "techniques": [
      "Staccato",
      "Metronome Practice",
      "Vibrato (Introduction)",
      "Major Arpeggios (One Octave)"
    ],
    "description": "A beginner etude by Mazas focusing on Staccato and Metronome Practice."
  },
  {
    "id": 60,
    "title": "Etude No. 10",
    "composer": "Mazas",
    "difficulty": "Intermediate",
    "techniques": [
      "Martelé",
      "Dynamics (p, mf, f)",
      "Double Stops (Basic)",
      "Scales in Thirds"
    ],
    "description": "An intermediate etude by Mazas focusing on Martelé and Dynamics (p, mf, f)."
  },
  {
    "id": 61,
    "title": "Etude No. 1",
    "composer": "Campagnoli",
    "difficulty": "Advanced",
    "techniques": [
      "Ricochet",
      "Phrasing (Simple Melodies)",
      "Trills",
      "Two Octave Major Scales"
    ],
    "description": "An advanced etude by Campagnoli focusing on Ricochet and Phrasing (Simple Melodies)."
  },
  {
    "id": 62,
    "title": "Etude No. 2",
    "composer": "Campagnoli",
    "difficulty": "Beginner",
    "techniques": [
      "Detache",
      "Articulation Accents",
      "Pizzicato (Left Hand)",
      "Chromatic Scale (One Octave)"
    ],
    "description": "A beginner etude by Campagnoli focusing on Detache and Articulation Accents."
  },
  {
    "id": 63,
    "title": "Etude No. 3",
    "composer": "Campagnoli",
    "difficulty": "Intermediate",
    "techniques": [
      "Legato",
      "Basic Music Theory (Key Signatures)",
      "Tuplets (Triplets)",
      "Major Scales (One Octave)"
    ],
    "description": "An intermediate etude by Campagnoli focusing on Legato and Basic Music Theory (Key Signatures)."
  },
  {
    "id": 64,
    "title": "Etude No. 4",
    "composer": "Campagnoli",
    "difficulty": "Advanced",
    "techniques": [
      "Spiccato",
      "Dotted Rhythms",
      "Shifting (Positions 1-3)",
      "Minor Scales (One Octave)"
    ],
    "description": "An advanced etude by Campagnoli focusing on Spiccato and Dotted Rhythms."
  },
  {
    "id": 65,
    "title": "Etude No. 5",
    "composer": "Campagnoli",
    "difficulty": "Beginner",
    "techniques": [
      "Staccato",
      "Syncopation (Simple)",
      "Finger Dexterity",
      "Major Arpeggios (One Octave)"
    ],
    "description": "A beginner etude by Campagnoli focusing on Staccato and Syncopation (Simple)."
  },
  {
    "id": 66,
    "title": "Etude No. 6",
    "composer": "Campagnoli",
    "difficulty": "Intermediate",
    "techniques": [
      "Martelé",
      "Metronome Practice",
      "Vibrato (Introduction)",
      "Scales in Thirds"
    ],
    "description": "An intermediate etude by Campagnoli focusing on Martelé and Metronome Practice."
  },
  {
    "id": 67,
    "title": "Etude No. 7",
    "composer": "Campagnoli",
    "difficulty": "Advanced",
    "techniques": [
      "Ricochet",
      "Dynamics (p, mf, f)",
      "Double Stops (Basic)",
      "Two Octave Major Scales"
    ],
    "description": "An advanced etude by Campagnoli focusing on Ricochet and Dynamics (p, mf, f)."
  },
  {
    "id": 68,
    "title": "Etude No. 8",
    "composer": "Campagnoli",
    "difficulty": "Beginner",
    "techniques": [
      "Detache",
      "Phrasing (Simple Melodies)",
      "Trills",
      "Chromatic Scale (One Octave)"
    ],
    "description": "A beginner etude by Campagnoli focusing on Detache and Phrasing (Simple Melodies)."
  },
  {
    "id": 69,
    "title": "Etude No. 9",
    "composer": "Campagnoli",
    "difficulty": "Intermediate",
    "techniques": [
      "Legato",
      "Articulation Accents",
      "Pizzicato (Left Hand)",
      "Major Scales (One Octave)"
    ],
    "description": "An intermediate etude by Campagnoli focusing on Legato and Articulation Accents."
  },
  {
    "id": 70,
    "title": "Etude No. 10",
    "composer": "Campagnoli",
    "difficulty": "Advanced",
    "techniques": [
      "Spiccato",
      "Basic Music Theory (Key Signatures)",
      "Tuplets (Triplets)",
      "Minor Scales (One Octave)"
    ],
    "description": "An advanced etude by Campagnoli focusing on Spiccato and Basic Music Theory (Key Signatures)."
  },
  {
    "id": 71,
    "title": "Etude No. 1",
    "composer": "Wieniawski",
    "difficulty": "Beginner",
    "techniques": [
      "Staccato",
      "Dotted Rhythms",
      "Shifting (Positions 1-3)",
      "Major Arpeggios (One Octave)"
    ],
    "description": "A beginner etude by Wieniawski focusing on Staccato and Dotted Rhythms."
  },
  {
    "id": 72,
    "title": "Etude No. 2",
    "composer": "Wieniawski",
    "difficulty": "Intermediate",
    "techniques": [
      "Martelé",
      "Syncopation (Simple)",
      "Finger Dexterity",
      "Scales in Thirds"
    ],
    "description": "An intermediate etude by Wieniawski focusing on Martelé and Syncopation (Simple)."
  },
  {
    "id": 73,
    "title": "Etude No. 3",
    "composer": "Wieniawski",
    "difficulty": "Advanced",
    "techniques": [
      "Ricochet",
      "Metronome Practice",
      "Vibrato (Introduction)",
      "Two Octave Major Scales"
    ],
    "description": "An advanced etude by Wieniawski focusing on Ricochet and Metronome Practice."
  },
  {
    "id": 74,
    "title": "Etude No. 4",
    "composer": "Wieniawski",
    "difficulty": "Beginner",
    "techniques": [
      "Detache",
      "Dynamics (p, mf, f)",
      "Double Stops (Basic)",
      "Chromatic Scale (One Octave)"
    ],
    "description": "A beginner etude by Wieniawski focusing on Detache and Dynamics (p, mf, f)."
  },
  {
    "id": 75,
    "title": "Etude No. 5",
    "composer": "Wieniawski",
    "difficulty": "Intermediate",
    "techniques": [
      "Legato",
      "Phrasing (Simple Melodies)",
      "Trills",
      "Major Scales (One Octave)"
    ],
    "description": "An intermediate etude by Wieniawski focusing on Legato and Phrasing (Simple Melodies)."
  },
  {
    "id": 76,
    "title": "Etude No. 6",
    "composer": "Wieniawski",
    "difficulty": "Advanced",
    "techniques": [
      "Spiccato",
      "Articulation Accents",
      "Pizzicato (Left Hand)",
      "Minor Scales (One Octave)"
    ],
    "description": "An advanced etude by Wieniawski focusing on Spiccato and Articulation Accents."
  },
  {
    "id": 77,
    "title": "Etude No. 7",
    "composer": "Wieniawski",
    "difficulty": "Beginner",
    "techniques": [
      "Staccato",
      "Basic Music Theory (Key Signatures)",
      "Tuplets (Triplets)",
      "Major Arpeggios (One Octave)"
    ],
    "description": "A beginner etude by Wieniawski focusing on Staccato and Basic Music Theory (Key Signatures)."
  },
  {
    "id": 78,
    "title": "Etude No. 8",
    "composer": "Wieniawski",
    "difficulty": "Intermediate",
    "techniques": [
      "Martelé",
      "Dotted Rhythms",
      "Shifting (Positions 1-3)",
      "Scales in Thirds"
    ],
    "description": "An intermediate etude by Wieniawski focusing on Martelé and Dotted Rhythms."
  },
  {
    "id": 79,
    "title": "Etude No. 9",
    "composer": "Wieniawski",
    "difficulty": "Advanced",
    "techniques": [
      "Ricochet",
      "Syncopation (Simple)",
      "Finger Dexterity",
      "Two Octave Major Scales"
    ],
    "description": "An advanced etude by Wieniawski focusing on Ricochet and Syncopation (Simple)."
  },
  {
    "id": 80,
    "title": "Etude No. 10",
    "composer": "Wieniawski",
    "difficulty": "Beginner",
    "techniques": [
      "Detache",
      "Metronome Practice",
      "Vibrato (Introduction)",
      "Chromatic Scale (One Octave)"
    ],
    "description": "A beginner etude by Wieniawski focusing on Detache and Metronome Practice."
  },
  {
    "id": 81,
    "title": "Etude No. 1",
    "composer": "Paganini",
    "difficulty": "Intermediate",
    "techniques": [
      "Legato",
      "Dynamics (p, mf, f)",
      "Double Stops (Basic)",
      "Major Scales (One Octave)"
    ],
    "description": "An intermediate etude by Paganini focusing on Legato and Dynamics (p, mf, f)."
  },
  {
    "id": 82,
    "title": "Etude No. 2",
    "composer": "Paganini",
    "difficulty": "Advanced",
    "techniques": [
      "Spiccato",
      "Phrasing (Simple Melodies)",
      "Trills",
      "Minor Scales (One Octave)"
    ],
    "description": "An advanced etude by Paganini focusing on Spiccato and Phrasing (Simple Melodies)."
  },
  {
    "id": 83,
    "title": "Etude No. 3",
    "composer": "Paganini",
    "difficulty": "Beginner",
    "techniques": [
      "Staccato",
      "Articulation Accents",
      "Pizzicato (Left Hand)",
      "Major Arpeggios (One Octave)"
    ],
    "description": "A beginner etude by Paganini focusing on Staccato and Articulation Accents."
  },
  {
    "id": 84,
    "title": "Etude No. 4",
    "composer": "Paganini",
    "difficulty": "Intermediate",
    "techniques": [
      "Martelé",
      "Basic Music Theory (Key Signatures)",
      "Tuplets (Triplets)",
      "Scales in Thirds"
    ],
    "description": "An intermediate etude by Paganini focusing on Martelé and Basic Music Theory (Key Signatures)."
  },
  {
    "id": 85,
    "title": "Etude No. 5",
    "composer": "Paganini",
    "difficulty": "Advanced",
    "techniques": [
      "Ricochet",
      "Dotted Rhythms",
      "Shifting (Positions 1-3)",
      "Two Octave Major Scales"
    ],
    "description": "An advanced etude by Paganini focusing on Ricochet and Dotted Rhythms."
  },
  {
    "id": 86,
    "title": "Etude No. 6",
    "composer": "Paganini",
    "difficulty": "Beginner",
    "techniques": [
      "Detache",
      "Syncopation (Simple)",
      "Finger Dexterity",
      "Chromatic Scale (One Octave)"
    ],
    "description": "A beginner etude by Paganini focusing on Detache and Syncopation (Simple)."
  },
  {
    "id": 87,
    "title": "Etude No. 7",
    "composer": "Paganini",
    "difficulty": "Intermediate",
    "techniques": [
      "Legato",
      "Metronome Practice",
      "Vibrato (Introduction)",
      "Major Scales (One Octave)"
    ],
    "description": "An intermediate etude by Paganini focusing on Legato and Metronome Practice."
  },
  {
    "id": 88,
    "title": "Etude No. 8",
    "composer": "Paganini",
    "difficulty": "Advanced",
    "techniques": [
      "Spiccato",
      "Dynamics (p, mf, f)",
      "Double Stops (Basic)",
      "Minor Scales (One Octave)"
    ],
    "description": "An advanced etude by Paganini focusing on Spiccato and Dynamics (p, mf, f)."
  },
  {
    "id": 89,
    "title": "Etude No. 9",
    "composer": "Paganini",
    "difficulty": "Beginner",
    "techniques": [
      "Staccato",
      "Phrasing (Simple Melodies)",
      "Trills",
      "Major Arpeggios (One Octave)"
    ],
    "description": "A beginner etude by Paganini focusing on Staccato and Phrasing (Simple Melodies)."
  },
  {
    "id": 90,
    "title": "Etude No. 10",
    "composer": "Paganini",
    "difficulty": "Intermediate",
    "techniques": [
      "Martelé",
      "Articulation Accents",
      "Pizzicato (Left Hand)",
      "Scales in Thirds"
    ],
    "description": "An intermediate etude by Paganini focusing on Martelé and Articulation Accents."
  },
  {
    "id": 91,
    "title": "Etude No. 1",
    "composer": "Sevcik",
    "difficulty": "Advanced",
    "techniques": [
      "Ricochet",
      "Basic Music Theory (Key Signatures)",
      "Tuplets (Triplets)",
      "Two Octave Major Scales"
    ],
    "description": "An advanced etude by Sevcik focusing on Ricochet and Basic Music Theory (Key Signatures)."
  },
  {
    "id": 92,
    "title": "Etude No. 2",
    "composer": "Sevcik",
    "difficulty": "Beginner",
    "techniques": [
      "Detache",
      "Dotted Rhythms",
      "Shifting (Positions 1-3)",
      "Chromatic Scale (One Octave)"
    ],
    "description": "A beginner etude by Sevcik focusing on Detache and Dotted Rhythms."
  },
  {
    "id": 93,
    "title": "Etude No. 3",
    "composer": "Sevcik",
    "difficulty": "Intermediate",
    "techniques": [
      "Legato",
      "Syncopation (Simple)",
      "Finger Dexterity",
      "Major Scales (One Octave)"
    ],
    "description": "An intermediate etude by Sevcik focusing on Legato and Syncopation (Simple)."
  },
  {
    "id": 94,
    "title": "Etude No. 4",
    "composer": "Sevcik",
    "difficulty": "Advanced",
    "techniques": [
      "Spiccato",
      "Metronome Practice",
      "Vibrato (Introduction)",
      "Minor Scales (One Octave)"
    ],
    "description": "An advanced etude by Sevcik focusing on Spiccato and Metronome Practice."
  },
  {
    "id": 95,
    "title": "Etude No. 5",
    "composer": "Sevcik",
    "difficulty": "Beginner",
    "techniques": [
      "Staccato",
      "Dynamics (p, mf, f)",
      "Double Stops (Basic)",
      "Major Arpeggios (One Octave)"
    ],
    "description": "A beginner etude by Sevcik focusing on Staccato and Dynamics (p, mf, f)."
  },
  {
    "id": 96,
    "title": "Etude No. 6",
    "composer": "Sevcik",
    "difficulty": "Intermediate",
    "techniques": [
      "Martelé",
      "Phrasing (Simple Melodies)",
      "Trills",
      "Scales in Thirds"
    ],
    "description": "An intermediate etude by Sevcik focusing on Martelé and Phrasing (Simple Melodies)."
  },
  {
    "id": 97,
    "title": "Etude No. 7",
    "composer": "Sevcik",
    "difficulty": "Advanced",
    "techniques": [
      "Ricochet",
      "Articulation Accents",
      "Pizzicato (Left Hand)",
      "Two Octave Major Scales"
    ],
    "description": "An advanced etude by Sevcik focusing on Ricochet and Articulation Accents."
  },
  {
    "id": 98,
    "title": "Etude No. 8",
    "composer": "Sevcik",
    "difficulty": "Beginner",
    "techniques": [
      "Detache",
      "Basic Music Theory (Key Signatures)",
      "Tuplets (Triplets)",
      "Chromatic Scale (One Octave)"
    ],
    "description": "A beginner etude by Sevcik focusing on Detache and Basic Music Theory (Key Signatures)."
  },
  {
    "id": 99,
    "title": "Etude No. 9",
    "composer": "Sevcik",
    "difficulty": "Intermediate",
    "techniques": [
      "Legato",
      "Dotted Rhythms",
      "Shifting (Positions 1-3)",
      "Major Scales (One Octave)"
    ],
    "description": "An intermediate etude by Sevcik focusing on Legato and Dotted Rhythms."
  },
  {
    "id": 100,
    "title": "Etude No. 10",
    "composer": "Sevcik",
    "difficulty": "Advanced",
    "techniques": [
      "Spiccato",
      "Syncopation (Simple)",
      "Finger Dexterity",
      "Minor Scales (One Octave)"
    ],
    "description": "An advanced etude by Sevcik focusing on Spiccato and Syncopation (Simple)."
  }
];

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
    if (isViewingSheet) return;

    // If a preview is NOT YET active, and there are ANY persistent selections (either tech or composer), don't start a new preview.
    if (!isPreviewActive && (selectedTechniques.length > 0 || selectedComposers.length > 0)) {
        return;
    }

    const mainContent = document.getElementById('mainContent');
    if (!mainContent) return;

    if (!isPreviewActive) { // Only save state if starting a new preview sequence
        originalMainContentHTML = mainContent.innerHTML;
        persistentSelectedTechniques = [...selectedTechniques];
        persistentSelectedComposers = [...selectedComposers];
    }
    
    selectedTechniques = [techniqueName]; // Temporarily set to the technique being previewed
    selectedComposers = []; // Clear composer filters for technique preview
    updateMainContent();
    
    isPreviewActive = true;
}

        function clearFilterPreview() {
    if (isPreviewActive) {
        selectedTechniques = [...persistentSelectedTechniques]; // Restore actual technique selections
        selectedComposers = [...persistentSelectedComposers];   // Restore actual composer selections
        
        isPreviewActive = false; // Set flag before updating content, so updateMainContent knows it's not a preview
        
        updateMainContent(); // Re-render content with restored persistent filters
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

                if (selectedTechniques.length === 0 && selectedComposers.length === 0) {
                    mainContent.innerHTML = `
                        <div class="empty-state">
                            <i class="fas fa-music"></i>
                            <h3>Welcome to Arco</h3>
                            <p>Search for techniques or composers, or select from the sidebar to get started.</p>
                        </div>
                    `;
                    return;
                }

                let filteredEtudes = [...etudeDatabase];

                // Filter by selected composers (OR logic if multiple composers selected)
                if (selectedComposers.length > 0) {
                    filteredEtudes = filteredEtudes.filter(etude => 
                        selectedComposers.includes(etude.composer)
                    );
                }

                // Filter by selected techniques (AND logic - etude must have ALL selected techniques)
                if (selectedTechniques.length > 0) {
                    filteredEtudes = filteredEtudes.filter(etude => 
                        selectedTechniques.every(technique => etude.techniques.includes(technique))
                    );
                }

                if (filteredEtudes.length === 0) {
                    mainContent.innerHTML = `
                        <div class="empty-state">
                            <i class="fas fa-folder-open"></i>
                            <h3>No Results</h3>
                            <p>No etudes found matching your selected criteria. Try a different combination.</p>
                        </div>
                    `;
                } else {
                    mainContent.innerHTML = `
                        <div class="sheet-music-grid">
                            ${filteredEtudes.map(etude => `
                                <div class="sheet-item" data-title="${etude.title}" data-composer="${etude.composer}" data-id="${etude.id}" data-difficulty="${etude.difficulty}">
                                    <div class="sheet-thumbnail">
                                        <img src="assets/images/rode-01.png" alt="${etude.title} by ${etude.composer} thumbnail">
                                    </div>
                                    <div class="sheet-info">
                                        <div class="sheet-title">${etude.title}</div>
                                        <div class="sheet-composer">${etude.composer}</div>
                                        <div class="sheet-difficulty">${etude.difficulty}</div>
                                    </div>
                                </div>
                            `).join('')}
                        </div>
                    `;
                    attachSheetItemListeners();
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


        function toggleComposerSelection(element, composer) {
            if (isViewingSheet) {
                exitSheetView();
            }

            if (selectedComposers.includes(composer)) {
                selectedComposers = selectedComposers.filter(c => c !== composer);
                element.classList.remove('selected');
            } else {
                if (selectedTechniques.length + selectedComposers.length < 3) { // Combined limit
                    selectedComposers.push(composer);
                    element.classList.add('selected');
                } else {
                    showTemporaryMessage('Maximum 3 filters (techniques or composers) can be selected');
                    return;
                }
            }
            updateSelectionCounter();
            updateMainContent(); // This will eventually use selectedComposers
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
                if (selectedTechniques.length + selectedComposers.length < 3) {
                    selectedTechniques.push(technique);
                    element.classList.add('selected');
                } else {
                    console.log('[TOGGLE] Max selection reached.');
                    showTemporaryMessage('Maximum 3 filters (techniques or composers) can be selected');
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
            
            const totalSelected = selectedTechniques.length + selectedComposers.length;
            text.textContent = `${totalSelected}/3 filters selected`;
            
            if (totalSelected > 0) {
                counter.classList.add('visible');
            } else {
                counter.classList.remove('visible');
            }
            
            // Also handle visibility of the reset/clear button
            const resetBtn = document.getElementById('resetSearchBtn');
            const searchInput = document.querySelector('.search-input');
            if (resetBtn) {
                const hasText = searchInput && searchInput.value.trim().length > 0;
                if (totalSelected > 0 || hasText) {
                    resetBtn.style.display = 'block';
                } else {
                    resetBtn.style.display = 'none';
                }
            }
        }

        function populateTechniques() {
            const container = document.getElementById('filterContainer');
            container.innerHTML = '';

            // Create Techniques section
            const techniquesSection = createFilterSection('techniques', 'Techniques', true);
            Object.entries(techniqueDatabase).forEach(([section, techniques]) => {
                const sectionDiv = document.createElement('div');
                sectionDiv.className = 'technique-section';
                
                const title = document.createElement('div');
                title.className = 'section-title';
                title.textContent = section;
                
                const tagsDiv = document.createElement('div');
                tagsDiv.className = 'technique-tags';
                
                techniques.forEach(technique => {
                    const tag = createTechniqueTag(technique, 'technique');
                    tagsDiv.appendChild(tag);
                });
                
                sectionDiv.appendChild(title);
                sectionDiv.appendChild(tagsDiv);
                techniquesSection.sectionContent.appendChild(sectionDiv);
            });
            container.appendChild(techniquesSection.element);

            // Create Composers section
            const composersSection = createFilterSection('composers', 'Composers', true);
            const composerTagsDiv = document.createElement('div');
            composerTagsDiv.className = 'technique-tags';
            
            composerDatabase.forEach(composer => {
                const tag = createTechniqueTag(composer, 'composer');
                composerTagsDiv.appendChild(tag);
            });
            
            composersSection.sectionContent.appendChild(composerTagsDiv);
            container.appendChild(composersSection.element);
        }

        function createFilterSection(sectionId, title, expanded = true) {
            const sectionDiv = document.createElement('div');
            sectionDiv.className = 'filter-section';
            sectionDiv.dataset.section = sectionId;

            const headerDiv = document.createElement('div');
            headerDiv.className = 'section-header';

            const titleElement = document.createElement('h3');
            titleElement.className = 'section-title';
            titleElement.textContent = title;

            const toggleButton = document.createElement('button');
            toggleButton.className = 'section-toggle';
            toggleButton.setAttribute('aria-expanded', expanded.toString());
            toggleButton.innerHTML = '<i class="fas fa-chevron-down"></i>';

            const contentDiv = document.createElement('div');
            contentDiv.className = `section-content ${expanded ? 'expanded' : 'collapsed'}`;

            // Add click event for toggle
            headerDiv.addEventListener('click', () => {
                toggleSection(sectionDiv, toggleButton, contentDiv);
            });

            headerDiv.appendChild(titleElement);
            headerDiv.appendChild(toggleButton);
            sectionDiv.appendChild(headerDiv);
            sectionDiv.appendChild(contentDiv);

            return {
                element: sectionDiv,
                sectionContent: contentDiv,
                toggle: toggleButton
            };
        }

        function createTechniqueTag(name, type) {
            const tag = document.createElement('div');
            tag.className = 'technique-tag';
            tag.textContent = name;
            tag.dataset[type] = name;
            
            tag.addEventListener('click', () => {
                if (isPreviewActive) {
                    selectedTechniques = [...persistentSelectedTechniques];
                    selectedComposers  = [...persistentSelectedComposers];
                    isPreviewActive = false;
                    updateMainContent(); // Ensure UI reflects restored state
                }
                if (type === 'technique') {
                    toggleTechniqueSelection(tag, name);
                } else if (type === 'composer') {
                    toggleComposerSelection(tag, name);
                }
            });
            
            tag.addEventListener('mouseover', () => {
                clearTimeout(hoverTimeout); 
                if (type === 'technique') {
                    previewTechniqueContent(name);
                } else if (type === 'composer') {
                    previewComposerContent(name);
                }
            });
            
            return tag;
        }

        function toggleSection(sectionDiv, toggleButton, contentDiv) {
            const isExpanded = toggleButton.getAttribute('aria-expanded') === 'true';
            
            toggleButton.setAttribute('aria-expanded', (!isExpanded).toString());
            
            if (isExpanded) {
                contentDiv.classList.remove('expanded');
                contentDiv.classList.add('collapsed');
            } else {
                contentDiv.classList.remove('collapsed');
                contentDiv.classList.add('expanded');
            }
        }

        function previewComposerContent(composer) {
    // Disable hover previews if a sheet is currently open
    if (isViewingSheet) return;

    // If a preview is NOT YET active, and there are ANY persistent selections (either tech or composer), don't start a new preview.
    if (!isPreviewActive && (selectedTechniques.length > 0 || selectedComposers.length > 0)) {
        return;
    }

    const mainContent = document.getElementById('mainContent');
    if (!mainContent) return;

    if (!isPreviewActive) { // Only save state if starting a new preview sequence
        originalMainContentHTML = mainContent.innerHTML;
        persistentSelectedTechniques = [...selectedTechniques];
        persistentSelectedComposers = [...selectedComposers];
    }
    
    selectedComposers = [composer]; // Temporarily set to the composer being previewed
    selectedTechniques = []; // Clear technique filters for composer preview
    updateMainContent();
    
    isPreviewActive = true;
}

        function filterTechniques(searchQuery) { 
            const container = document.getElementById('filterContainer');
            container.innerHTML = '';
            let allTechniquesWithCategory = [];
            Object.entries(techniqueDatabase).forEach(([category, techniques]) => {
                techniques.forEach(technique => {
                    allTechniquesWithCategory.push({ name: technique, category });
                });
            });

            // --- MOCK FILTER LOGIC START ---
            // For any non-empty search query, return 7 random tags total (techniques + composers)
            let filteredTechniques = [];
            let filteredComposers  = [];
            if (searchQuery) {
                // Build a combined collection with type metadata
                const combinedPool = [
                    ...allTechniquesWithCategory.map(t => ({ name: t.name, type: 'technique', category: t.category })),
                    ...composerDatabase.map(c => ({ name: c, type: 'composer' }))
                ];

                const randomSelection = _getRandomSubset(combinedPool, 7);
                randomSelection.forEach(item => {
                    if (item.type === 'technique') {
                        filteredTechniques.push(item);
                    } else {
                        filteredComposers.push(item.name);
                    }
                });
            }
             // --- MOCK FILTER LOGIC END ---

            // Build UI sections only if we have results
            if (filteredTechniques.length > 0) {
                const techniquesSection = createFilterSection('techniques', 'Techniques', true);
                const techniqueTagsDiv = document.createElement('div');
                techniqueTagsDiv.className = 'technique-tags';
                filteredTechniques.forEach(item => {
                    const tag = createTechniqueTag(item.name, 'technique');
                    techniqueTagsDiv.appendChild(tag);
                });
                techniquesSection.sectionContent.appendChild(techniqueTagsDiv);
                container.appendChild(techniquesSection.element);
            }

            if (filteredComposers.length > 0) {
                const composersSection = createFilterSection('composers', 'Composers', true);
                const composerTagsDiv = document.createElement('div');
                composerTagsDiv.className = 'technique-tags';
                filteredComposers.forEach(composer => {
                    const tag = createTechniqueTag(composer, 'composer');
                    composerTagsDiv.appendChild(tag);
                });
                composersSection.sectionContent.appendChild(composerTagsDiv);
                container.appendChild(composersSection.element);
            }

            // Handle empty result (unlikely because we always return random, but keep fallback)
            if (filteredTechniques.length === 0 && filteredComposers.length === 0) {
                container.innerHTML = `
                    <div class="no-results">
                        <p>No techniques or composers found matching "${searchQuery}"</p>
                    </div>
                `;
            }
        }

        function performSearch(isResetAction = false) { 
            const searchInput = document.querySelector('.search-input');
            const query = searchInput.value.trim().toLowerCase();
            const resetBtn = document.getElementById('resetSearchBtn');

            clearFilterPreview();

            const allTechniqueTagsBeforeFilter = document.querySelectorAll('.technique-tag');
            allTechniqueTagsBeforeFilter.forEach(tag => tag.classList.remove('selected'));
            selectedTechniques = [];
            selectedComposers = []; // Clear selected composers on reset

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

        // Utility: get random subset of an array
        function _getRandomSubset(arr, count) {
            const shuffled = [...arr].sort(() => 0.5 - Math.random());
            return shuffled.slice(0, Math.min(count, shuffled.length));
        }

        // Chat helpers (simple demo behaviour)
        function clearChat() {
            const chatEl = document.getElementById('chatMessages');
            if (chatEl) {
                chatEl.innerHTML = '';
            }
        }

        function populateTechniques() {
            const container = document.getElementById('filterContainer');
            container.innerHTML = '';

            // Create Techniques section
            const techniquesSection = createFilterSection('techniques', 'Techniques', true);
            Object.entries(techniqueDatabase).forEach(([section, techniques]) => {
                const sectionDiv = document.createElement('div');
                sectionDiv.className = 'technique-section';
                
                const title = document.createElement('div');
                title.className = 'section-title';
                title.textContent = section;
                
                const tagsDiv = document.createElement('div');
                tagsDiv.className = 'technique-tags';
                
                techniques.forEach(technique => {
                    const tag = createTechniqueTag(technique, 'technique');
                    tagsDiv.appendChild(tag);
                });
                
                sectionDiv.appendChild(title);
                sectionDiv.appendChild(tagsDiv);
                techniquesSection.sectionContent.appendChild(sectionDiv);
            });
            container.appendChild(techniquesSection.element);

            // Create Composers section
            const composersSection = createFilterSection('composers', 'Composers', true);
            const composerTagsDiv = document.createElement('div');
            composerTagsDiv.className = 'technique-tags';
            
            composerDatabase.forEach(composer => {
                const tag = createTechniqueTag(composer, 'composer');
                composerTagsDiv.appendChild(tag);
            });
            
            composersSection.sectionContent.appendChild(composerTagsDiv);
            container.appendChild(composersSection.element);
        }

        function performSearch(isResetAction = false) { 
            const searchInput = document.querySelector('.search-input');
            const query = searchInput.value.trim().toLowerCase();
            const resetBtn = document.getElementById('resetSearchBtn');

            clearFilterPreview();

            const allTechniqueTagsBeforeFilter = document.querySelectorAll('.technique-tag');
            allTechniqueTagsBeforeFilter.forEach(tag => tag.classList.remove('selected'));
            selectedTechniques = [];
            selectedComposers = []; // Clear selected composers on reset

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
            if (query) {
                clearChat();
            }
            Chat.startConversation(query); // Delegate new conversation to chat module
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
                techniqueContainer.addEventListener('mouseleave', clearFilterPreview); 
            }
            setupEventListeners(); 
        });
