// Vercel Serverless Function: /api/team-recommend
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
    const { project, candidates } = await req.json();
    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      return new Response(JSON.stringify({ useFallback: true }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const prompt = `
You are a team architecture AI. Select the optimal 3-5 person team for this project from the available candidates pool:

Project:
Title: ${project.title}
Required Roles: ${project.required_roles?.join(', ')}
Required Skills: ${project.required_skills?.join(', ')}
Commitment: ${project.commitment_hours} hrs/week

Available Candidates:
${JSON.stringify(candidates?.map((c: any) => ({
  id: c.id,
  name: c.full_name,
  skills: c.skills,
  roles: c.preferred_roles,
  hours: c.hours_per_week,
  days: c.days_available
})))}

Return ONLY a valid JSON object without markdown:
{
  "teamCompatibilityScore": number (0-100),
  "skillCoverageScore": number (0-100),
  "availabilitySynergyScore": number (0-100),
  "teamBalanceScore": number (0-100),
  "overallSynergyReasoning": "Narrative explanation of why this multi-person team works well together.",
  "strengths": ["Key strength 1", "Key strength 2"],
  "potentialRisks": ["Risk or caveat 1"],
  "uncoveredSkills": ["skill if any missing"]
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
