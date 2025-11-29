
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
    // Look for the specific headers requested
    if (!headerFound && (lowerLine.includes('agency') || lowerLine.includes('client'))) {
      headerFound = true;
      continue;
    }

    // Check for separator row (e.g., |---|---|)
    if (headerFound && !separatorFound && line.includes('---')) {
      separatorFound = true;
      continue;
    }

    if (headerFound && separatorFound) {
      // Remove outer pipes if they exist and split
      const content = line.trim().replace(/^\|/, '').replace(/\|$/, '');
      const cols = content.split('|').map(c => c.trim());

      if (cols.length >= 3) {
        data.push({
          id: Math.random().toString(36).substr(2, 9),
          agency: cols[0] || 'Unknown',
          client: cols[1] || 'Unknown',
          country: cols[2] || 'APAC Regional',
          source: cols[3] || 'Market Intelligence Scan', // Optional 4th column if model provides it
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
    // Expected format: Category | Headline | Summary | Source | ImageQuery
    if (!line.includes('|')) continue;
    if (line.includes('---')) continue; // skip table separators
    if (line.toLowerCase().includes('headline')) continue; // skip header

    const parts = line.split('|').map(p => p.trim());
    // Remove markdown table syntax if present at edges
    if (parts[0] === '') parts.shift();
    if (parts[parts.length - 1] === '') parts.pop();

    if (parts.length >= 3) {
      data.push({
        id: Math.random().toString(36).substr(2, 9),
        category: parts[0],
        headline: parts[1],
        summary: parts[2],
        source: parts[3] || 'Industry News',
        imageQuery: parts[4] || parts[1] // Fallback to headline if no image query
      });
    }
  }
  return data;
};

const parseLeadershipItems = (text: string, company: string, country: string): LeaderProfile[] => {
  const lines = text.split('\n').filter(line => line.trim() !== '');
  const data: LeaderProfile[] = [];

  for (const line of lines) {
    // Expected format: Name | Exact Role | LinkedInURL
    if (!line.includes('|')) continue;
    if (line.includes('---')) continue; // skip separator
    if (line.toLowerCase().includes('exact role') || line.toLowerCase().includes('name')) continue; // skip header

    const parts = line.split('|').map(p => p.trim());
    if (parts[0] === '') parts.shift();
    if (parts[parts.length - 1] === '') parts.pop();

    if (parts.length >= 2) {
      let linkedinUrl = parts[2] || '';
      // If URL is missing or invalid, construct a search URL
      if (!linkedinUrl.startsWith('http')) {
        linkedinUrl = `https://www.linkedin.com/search/results/all/?keywords=${encodeURIComponent(parts[0] + ' ' + parts[1] + ' ' + company)}`;
      }

      data.push({
        id: Math.random().toString(36).substr(2, 9),
        name: parts[0],
        role: parts[1],
        company: company || 'Company',
        country: country || 'APAC',
        linkedinUrl: linkedinUrl,
        isAddedToCrm: false
      });
    }
  }
  return data;
};

export const fetchDailyNews = async (region: string = 'APAC'): Promise<NewsItem[]> => {
  try {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    
    const prompt = `
      Act as a senior news editor for the ${region} advertising and marketing industry.
      
      TASK:
      Scan the web for the top 6-8 most significant news stories from the last 24 hours specifically related to the ${region} market.
      Prioritize news from high-quality trade journals and business news sources.

      FOCUS AREAS:
      1. Major Account Wins or Reviews in ${region}
      2. C-Suite People Moves in ${region} (CEO, CCO, CMO level)
      3. Significant Mergers & Acquisitions or Business Restructuring in ${region}
      4. Major Tech/AI announcements impacting advertising in ${region}
      
      OUTPUT FORMAT:
      Categorize each story into a broad topic (e.g., "Agency Business", "People Moves", "Creative Work", "Tech & AI").
      
      Return the data strictly as a pipe-separated list (one story per line). Do not include a table header.
      Format:
      Category | Headline | Brief Summary (Max 15 words) | Source Name | Visual Search Query

      The "Visual Search Query" should be a short, descriptive phrase (3-5 words) describing a relevant image for the story (e.g., "corporate handshake in office", "modern skyscraper in singapore", "artificial intelligence network").
    `;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        tools: [{ googleSearch: {} }],
      },
    });

    const text = response.text || '';
    return parseNewsItems(text);

  } catch (error) {
    console.error("Error fetching daily news:", error);
    return []; 
  }
};

export const fetchOOHCampaigns = async (region: string = 'APAC'): Promise<NewsItem[]> => {
  try {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    
    const prompt = `
      Act as an Out-of-Home (OOH) media specialist for the ${region} market.
      
      TASK:
      Scan the web for the top 6 recent OOH, DOOH, Retail Media, and Transit media campaigns launched in ${region} within the last 7-14 days.
      
      FOCUS AREAS:
      1. Innovative Billboards & Spectaculars
      2. Digital Out of Home (DOOH) activations (3D billboards, interactive screens)
      3. Transit Advertising (Bus, Train, Airport, Subway wraps)
      4. Retail Media & In-store activations
      
      OUTPUT FORMAT:
      Categorize each story into a specific media type (e.g., "Large Format OOH", "DOOH", "Transit Media", "Retail Media", "Airport Ads").
      
      Return the data strictly as a pipe-separated list (one story per line). Do not include a table header.
      Format:
      Category | Brand/Campaign Headline | Brief Description of the Creative/Location | Source Name | Visual Description
    `;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        tools: [{ googleSearch: {} }],
      },
    });

    const text = response.text || '';
    return parseNewsItems(text);

  } catch (error) {
    console.error("Error fetching OOH campaigns:", error);
    return [];
  }
};

export const fetchLeadershipData = async (role: string, company: string, country: string): Promise<LeaderProfile[]> => {
  try {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    
    const isAll = role === 'All Key Leaders';

    const prompt = `
      TASK:
      ${isAll 
        ? `Find the key leadership team (top 5-8 executives like CEO, MD, CMO, Head of Media, Strategy Lead) at "${company}" located in "${country}".`
        : `Find the specific person who currently holds the title of "${role}" (or equivalent closest leadership role) at "${company}" located in "${country}".`
      }
      
      INSTRUCTIONS:
      1. Search for the most current information.
      2. Identify the Full Name and Exact Job Title for each key person found.
      3. Find the public URL to their LinkedIn profile.
      ${isAll ? '4. Return a list of the top key personnel found.' : '4. If you cannot find an exact match, find the closest relevant senior leader.'}
      5. If a direct LinkedIn URL is not found, generate a valid LinkedIn search URL.
      
      OUTPUT FORMAT:
      Return a pipe-separated list (one person per line).
      Format:
      Name | Exact Role | LinkedIn URL
    `;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        tools: [{ googleSearch: {} }],
      },
    });

    const text = response.text || '';
    return parseLeadershipItems(text, company, country);

  } catch (error) {
    console.error("Error fetching leadership data:", error);
    throw error;
  }
};

export const scanMarketIntelligence = async (
  searchQuery: string = '', 
  countryQuery: string = '',
  mediaQuery: string = ''
): Promise<AgencyWin[]> => {
  try {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const sourceNames = SOURCES.map(s => s.name).join(', ');
    const currentYear = new Date().getFullYear();

    let taskDescription = '';
    let timeRange = '';
    
    const hasMediaFilter = mediaQuery && mediaQuery !== 'All Media';
    const hasSearch = searchQuery.trim() !== '' || countryQuery.trim() !== '' || hasMediaFilter;

    if (hasSearch) {
      taskDescription = `Find all agency-client appointments, account wins, and creative/media reviews`;
      const constraints = [];
      if (searchQuery.trim()) {
        constraints.push(`involving "${searchQuery}" (including all associated subsidiaries, partner agencies, and holding group entities)`);
      }
      if (countryQuery.trim()) constraints.push(`specifically within the market of "${countryQuery}"`);
      if (hasMediaFilter) constraints.push(`related to "${mediaQuery}" media duties/scope`);
      
      taskDescription += ` ${constraints.join(' and ')}.`;
      timeRange = `Year to Date (from January 1, ${currentYear} to Present)`;
    } else {
      taskDescription = `Scan for the LATEST announcements regarding "Agency Wins", "Client Appointments", and "Creative/Media Reviews".`;
      timeRange = `Past 7 Days (Weekly Scan)`;
    }

    const prompt = `
      Act as an automated market intelligence scanner for the APAC advertising industry.
      MODE: ${hasSearch ? 'TARGETED SEARCH (Year to Date)' : 'WEEKLY PULSE SCAN'}
      TASK: ${taskDescription}
      SCOPE: Region: Asia-Pacific (APAC)${countryQuery ? ` (Focus: ${countryQuery})` : ''} - Time Range: ${timeRange}
      TARGET SOURCES: ${sourceNames}

      OUTPUT FORMAT:
      Generate a simple Markdown table with exactly these columns:
      | Agency | Client | Country (APAC) | Source |
      Do not include markdown code blocks. Just return the raw table text.
    `;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        tools: [{ googleSearch: {} }],
      },
    });

    const text = response.text || '';
    return parseMarkdownTable(text);

  } catch (error) {
    console.error("Error scanning market intelligence:", error);
    throw error;
  }
};

export const performMasterSearch = async (query: string): Promise<MasterSearchResult> => {
  try {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

    const prompt = `
      Act as a Chief Intelligence Officer for the advertising industry.
      
      QUERY: "${query}"
      TIMEFRAME: Last 12 Months
      
      TASK:
      Provide a comprehensive deep-dive report on "${query}". 
      You must cover the following three areas based on data from the last year.

      1. EXECUTIVE SUMMARY:
      Write a concise 2-3 sentence summary of the entity's performance, key strategic shifts, or market position in the last year.

      2. RECENT NEWS (Last 12 Months):
      Find 4-5 key news headlines involving "${query}". Focus on business growth, controversies, or major announcements.
      Format: Category | Headline | Brief Summary | Source
      (Categories examples: Business, People, Work, Legal, Finance)

      3. KEY LEADERSHIP:
      Identify 3-4 key figures currently associated with "${query}" (e.g., CEO, CMO, ECD).
      Format: Name | Role | LinkedIn URL (or type "Search")

      4. WINS & WORK (Last 12 Months):
      Find 3-4 significant account wins, campaign launches, or client partnerships involving "${query}".
      Format: Agency | Client | Country | Source

      OUTPUT FORMAT:
      Use strictly defined section headers.
      
      ### SUMMARY
      (Text here)

      ### NEWS
      (Pipe separated list here)

      ### PEOPLE
      (Pipe separated list here)

      ### WINS
      (Pipe separated list here)
    `;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        tools: [{ googleSearch: {} }],
      },
    });

    const text = response.text || '';
    
    // Manual Parsing of Sections
    const summaryMatch = text.match(/### SUMMARY([\s\S]*?)(?=###|$)/);
    const newsMatch = text.match(/### NEWS([\s\S]*?)(?=###|$)/);
    const peopleMatch = text.match(/### PEOPLE([\s\S]*?)(?=###|$)/);
    const winsMatch = text.match(/### WINS([\s\S]*?)(?=###|$)/);

    const summary = summaryMatch ? summaryMatch[1].trim() : "No summary available.";
    const newsText = newsMatch ? newsMatch[1].trim() : "";
    const peopleText = peopleMatch ? peopleMatch[1].trim() : "";
    const winsText = winsMatch ? winsMatch[1].trim() : "";

    return {
      query,
      summary,
      news: parseNewsItems(newsText),
      leaders: parseLeadershipItems(peopleText, query, "Global/APAC"),
      wins: parseMarkdownTable(winsText)
    };

  } catch (error) {
    console.error("Master Search Error:", error);
    throw error;
  }
};
