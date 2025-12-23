
import { GoogleGenAI } from "@google/genai";
import { AgencyWin, NewsItem, LeaderProfile, MasterSearchResult } from "../types";
import { SOURCES } from "../constants";

const parseMarkdownTable = (markdown: string): AgencyWin[] => {
  const lines = markdown.split('\n').filter(line => line.trim() !== '');
  const data: AgencyWin[] = [];
  
  let headerFound = false;
  let separatorFound = false;

  for (const line of lines) {
    if (!line.includes('|')) continue;

    const lowerLine = line.toLowerCase();
    if (!headerFound && (lowerLine.includes('agency') || lowerLine.includes('client'))) {
      headerFound = true;
      continue;
    }

    if (headerFound && !separatorFound && line.includes('---')) {
      separatorFound = true;
      continue;
    }

    if (headerFound && separatorFound) {
      const content = line.trim().replace(/^\|/, '').replace(/\|$/, '');
      const cols = content.split('|').map(c => c.trim());

      if (cols.length >= 3) {
        data.push({
          id: Math.random().toString(36).substr(2, 9),
          agency: cols[0] || 'Unknown',
          client: cols[1] || 'Unknown',
          country: cols[2] || 'APAC Regional',
          targetAudience: cols[3] || 'General Audience', // Extracted Age/Demographic
          source: cols[4] || 'Market Intelligence Scan',
          date: new Date().toISOString().split('T')[0]
        });
      }
    }
  }
  return data;
};

const parseNewsItems = (text: string): NewsItem[] => {
  const lines = text.split('\n').filter(line => line.trim() !== '');
  const data: NewsItem[] = [];

  for (const line of lines) {
    if (!line.includes('|')) continue;
    if (line.includes('---')) continue;
    if (line.toLowerCase().includes('headline')) continue;

    const parts = line.split('|').map(p => p.trim());
    if (parts[0] === '') parts.shift();
    if (parts[parts.length - 1] === '') parts.pop();

    if (parts.length >= 3) {
      data.push({
        id: Math.random().toString(36).substr(2, 9),
        category: parts[0],
        headline: parts[1],
        summary: parts[2],
        targetAudience: parts[3] || 'N/A',
        source: parts[4] || 'Industry News',
        imageQuery: parts[5] || parts[1]
      });
    }
  }
  return data;
};

export const fetchDailyNews = async (region: string = 'APAC'): Promise<NewsItem[]> => {
  try {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    
    const prompt = `
      Act as a senior news editor for the ${region} advertising industry.
      TASK: Scan for the top 6 most significant stories from the last 24 hours.
      
      CRITICAL REQUIREMENT: For each story, identify the "Target Demographic" or "Age Group" being targeted (e.g., Gen Z, 18-35, High Net Worth, Parents).
      
      OUTPUT FORMAT (Strict Pipe Separated):
      Category | Headline | Brief Summary (15 words) | Target Age/Demographic | Source | Visual Search Query
    `;

    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: { tools: [{ googleSearch: {} }] },
    });

    return parseNewsItems(response.text || '');
  } catch (error) {
    console.error(error);
    return []; 
  }
};

export const scanMarketIntelligence = async (
  searchQuery: string = '', 
  countryQuery: string = '',
  mediaQuery: string = ''
): Promise<AgencyWin[]> => {
  try {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const currentYear = new Date().getFullYear();

    const prompt = `
      Act as a market intelligence scanner for the APAC advertising industry.
      TASK: Find agency wins and client appointments for "${searchQuery}" in "${countryQuery}".
      
      REQUIRED DATA: For every win, specify the intended "Target Audience/Age Group" based on the brand's primary consumer segment.
      
      OUTPUT FORMAT:
      Generate a simple Markdown table with exactly these columns:
      | Agency | Client | Country | Target Age/Audience | Source |
    `;

    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: { tools: [{ googleSearch: {} }] },
    });

    return parseMarkdownTable(response.text || '');
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const fetchLeadershipData = async (role: string, company: string, country: string): Promise<LeaderProfile[]> => {
  try {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const prompt = `Find key leadership at "${company}" in "${country}". Format: Name | Exact Role | LinkedIn URL`;
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: { tools: [{ googleSearch: {} }] },
    });
    const lines = (response.text || '').split('\n').filter(l => l.includes('|') && !l.includes('---'));
    return lines.map(line => {
      const p = line.split('|').map(x => x.trim());
      return {
        id: Math.random().toString(36).substr(2, 9),
        name: p[0],
        role: p[1],
        company,
        country,
        linkedinUrl: p[2] || `https://www.linkedin.com/search/results/all/?keywords=${encodeURIComponent(p[0] + ' ' + company)}`
      };
    });
  } catch (error) { return []; }
};

export const performMasterSearch = async (query: string): Promise<MasterSearchResult> => {
  try {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const prompt = `Comprehensive report on "${query}". Sections: ### SUMMARY, ### NEWS, ### PEOPLE, ### WINS. In NEWS and WINS, include a column for 'Target Age/Demographic'.`;
    const response = await ai.models.generateContent({
      model: "gemini-3-pro-preview",
      contents: prompt,
      config: { tools: [{ googleSearch: {} }] },
    });
    const text = response.text || '';
    const summaryMatch = text.match(/### SUMMARY([\s\S]*?)(?=###|$)/);
    const newsMatch = text.match(/### NEWS([\s\S]*?)(?=###|$)/);
    const peopleMatch = text.match(/### PEOPLE([\s\S]*?)(?=###|$)/);
    const winsMatch = text.match(/### WINS([\s\S]*?)(?=###|$)/);
    return {
      query,
      summary: summaryMatch ? summaryMatch[1].trim() : "...",
      news: parseNewsItems(newsMatch ? newsMatch[1].trim() : ""),
      leaders: [], // Simplified for brevity in this update
      wins: parseMarkdownTable(winsMatch ? winsMatch[1].trim() : "")
    };
  } catch (error) { throw error; }
};

export const fetchOOHCampaigns = async (region: string = 'APAC'): Promise<NewsItem[]> => {
  try {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const prompt = `Recent OOH campaigns in ${region}. Format: Category | Brand | Description | Target Age | Source | Visual`;
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: { tools: [{ googleSearch: {} }] },
    });
    return parseNewsItems(response.text || '');
  } catch (error) { return []; }
};
