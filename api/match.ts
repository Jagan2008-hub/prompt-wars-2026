// Vercel Serverless Function: /api/match
export const config = {
  runtime: 'edge',
};

export default async function handler(req: Request) {
  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), {
      status: 405,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  try {
    const { project, profile } = await req.json();
    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      // Return a graceful code indicating local fallback should be used
      return new Response(JSON.stringify({ useFallback: true }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const prompt = `
You are an expert AI talent matcher and hackathon team builder. Analyze the compatibility between this project and candidate:

Project:
Title: ${project.title}
Category: ${project.category}
Required Skills: ${project.required_skills?.join(', ')}
Required Roles: ${project.required_roles?.join(', ')}
Commitment: ${project.commitment_hours} hrs/week
Availability Requirement: ${project.availability_requirement}

Candidate:
Name: ${profile.full_name}
Skills: ${profile.skills?.join(', ')}
Preferred Roles: ${profile.preferred_roles?.join(', ')}
Available Hours: ${profile.hours_per_week} hrs/week
Available Days: ${profile.days_available?.join(', ')}
Experience Level: ${profile.experience_level}
Interests: ${profile.interests?.join(', ')}
Learning Goals: ${profile.learning_goals?.join(', ')}

Return ONLY a valid JSON object without markdown formatting:
{
  "overallScore": number (0-100),
  "skillMatch": number (0-100),
  "roleMatch": number (0-100),
  "availabilityMatch": number (0-100),
  "experienceMatch": number (0-100),
  "interestMatch": number (0-100),
  "keyStrengths": ["strength 1", "strength 2", "strength 3"],
  "growthAreas": ["area or risk 1", "area or risk 2"],
  "synergyReasoning": "2 sentence clear explanation of why this match works or where the synergy lies."
}
`;

    const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;
    const response = await fetch(geminiUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: {
          temperature: 0.2,
          responseMimeType: 'application/json',
        },
      }),
    });

    if (!response.ok) {
      return new Response(JSON.stringify({ useFallback: true }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const result = await response.json();
    const text = result.candidates?.[0]?.content?.parts?.[0]?.text;
    const parsed = JSON.parse(text);

    return new Response(JSON.stringify(parsed), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error: any) {
    return new Response(JSON.stringify({ useFallback: true, error: error.message }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
