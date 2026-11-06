// export const OUTPUT_PROMPT = `Return this JSON structure:
//       {
//         "summary": "Brief summary of the work",
//         "actions": [],
//         "skills": [],
//         "tools": [],
//         "impact": "Evidence-based impact or Not specified",
//         "cvStatement": "A polished CV-ready achievement"
//       }
//     `



export const OUTPUT_PROMPT = `
Analyse the work entry and return valid JSON. 

{
  "summary": "Concise description of the contribution",
  "actions": ["Specific actions performed"],
  "skills": ["Demonstrated professional competencies"],
  "tools": ["Explicitly mentioned technologies and tools"],
  "impact": "Evidence-based outcome or Not specified",
  "cvStatement": "One concise, achievement-focused CV statement"
}

### REQUIREMENTS
- Separate skills from tools.
- Preserve specific technical contributions.
- Include only supported information.
- Do not manufacture impact.
- Avoid repeating the original entry verbatim.
- Make the CV statement specific, clear and professional.
- Return JSON only. No Markdown or commentary.
- Do not return objects inside the actions, skills, and tools arrays.
`;