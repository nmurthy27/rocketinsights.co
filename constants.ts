
import { Source } from './types';

// REPLACE THIS with your Mailchimp Embedded Form Action URL
// It usually looks like: https://yourdomain.us20.list-manage.com/subscribe/post?u=xxxx&id=xxxx
export const MAILCHIMP_ACTION_URL = ""; 

export const MEDIA_TYPES = [
  "All Media",
  "Digital",
  "Out of Home",
  "Social Media",
  "Creative",
  "Media Buying",
  "PR & Comms"
];

export const NEWS_REGIONS = [
  "APAC",
  "China",
  "ANZ",
  "Middle East",
  "Africa",
  "Europe",
  "Americas",
  "Global"
];

export const NEWS_TOPICS = [
  "Agency Business",
  "People Moves",
  "Creative Work",
  "Tech & AI",
  "Account Wins",
  "Mergers & Acquisitions",
  "Events & Awards"
];

export const COMMON_ROLES = [
  "All Key Leaders",
  "CEO",
  "CMO",
  "Head of Marketing",
  "Media Director",
  "Trading Head",
  "President",
  "Client Leader",
  "Client Partner",
  "Media Planner",
  "Creative Director",
  "Chief Strategy Officer"
];

export const SOURCES: Source[] = [
  // 1. Top Regional News & Trade Journals
  {
    name: "Campaign Asia-Pacific",
    url: "https://www.campaignasia.com/",
    category: "News",
    description: "The most prestigious trade publication in the region. Famous for 'Agency of the Year' awards and high-level industry analysis."
  },
  {
    name: "Marketing-Interactive",
    url: "https://www.marketing-interactive.com/",
    category: "News",
    description: "Highly active news portal covering Singapore, Malaysia, Hong Kong, Philippines, Indonesia, and Thailand."
  },
  {
    name: "The Drum (APAC)",
    url: "https://www.thedrum.com/asia-pacific",
    category: "News",
    description: "Global publication with a dedicated APAC team. Known for edgier tone, creative reviews, and 'World Creative Rankings'."
  },
  {
    name: "Branding in Asia",
    url: "https://www.brandinginasia.com/",
    category: "News",
    description: "Dedicated to brand news, creative work, and profiles of industry people in Asia."
  },
  {
    name: "Digital Market Asia",
    url: "https://www.digitalmarket.asia/",
    category: "News",
    description: "Focuses on the digital marketing ecosystem, including adtech, martech, and digital media."
  },

  // 2. Global Heavy Hitters (New Additions)
  {
    name: "Ad Age",
    url: "https://adage.com/",
    category: "Global",
    description: "The 'New York Times' of advertising. Essential for big brand news, agency rankings, and the 'A-List'."
  },
  {
    name: "Adweek",
    url: "https://www.adweek.com/",
    category: "Global",
    description: "Covers the intersection of media, marketing, and technology. Focused on pop culture and brand crossovers."
  },
  {
    name: "The Drum (Global)",
    url: "https://www.thedrum.com/",
    category: "Global",
    description: "A global publication known for a punchy, opinionated editorial style and extensive coverage of creative work."
  },
  {
    name: "Campaign (Global)",
    url: "https://www.campaignlive.com/",
    category: "Global",
    description: "The 'agency life' bible. Famous for its 'School Reports' on agency performance and 'Power 100' lists."
  },
  {
    name: "Digiday",
    url: "https://digiday.com/",
    category: "Global",
    description: "The best source for modern media and ad-tech. Focuses deeply on the business side of media and platforms."
  },

  // 3. Data, Trends & Consumer Insights
  {
    name: "Think with Google APAC",
    url: "https://www.thinkwithgoogle.com/intl/en-apac/",
    category: "Insights",
    description: "Google’s official source for data, insights, consumer behavior statistics, and search trends."
  },
  {
    name: "WARC",
    url: "https://www.warc.com/",
    category: "Insights",
    description: "The academic backbone of the industry. Focuses on effectiveness and case studies proving ROI."
  },
  {
    name: "Nielsen",
    url: "https://www.nielsen.com/insights/",
    category: "Insights",
    description: "Global leader in audience measurement, TV ratings, and consumer behavior."
  },
  {
    name: "McKinsey (Asia Insights)",
    url: "https://www.mckinsey.com/featured-insights/asia-pacific",
    category: "Insights",
    description: "High-level management consulting reports, macro-economic trends, and digital consumer sentiment."
  },
  {
    name: "Statista",
    url: "https://www.statista.com/",
    category: "Insights",
    description: "General statistics portal, invaluable for finding quick charts on social media usage, ecommerce growth, etc."
  },
  {
    name: "eMarketer",
    url: "https://www.emarketer.com/",
    category: "Insights",
    description: "The most trusted source for digital ad spend forecasts and benchmarks."
  },

  // 4. Creative & Specialized Highlights
  {
    name: "Ads of the World",
    url: "https://www.adsoftheworld.com/",
    category: "Specialized",
    description: "A massive, searchable archive of ad campaigns (TV, Print, OOH) from every country."
  },
  {
    name: "Cannes Lions",
    url: "https://www.canneslions.com/",
    category: "Specialized",
    description: "The world's most prestigious ad festival. Their archive is the ultimate library of award-winning creativity."
  },
  {
    name: "D&AD",
    url: "https://www.dandad.org/",
    category: "Specialized",
    description: "Focuses on design and art direction. Their 'Yellow Pencils' represent the pinnacle of creative excellence."
  },
  {
    name: "Muse by Clio",
    url: "https://musebycl.io/",
    category: "Specialized",
    description: "The editorial arm of the Clio Awards. Frequent updates on cool, pop-culture-centric advertising."
  },
  {
    name: "Lürzer's Archive",
    url: "https://www.luerzersarchive.com/",
    category: "Specialized",
    description: "A curator of the most creative print and TV advertising worldwide."
  },
  {
    name: "Adobo Magazine",
    url: "https://www.adobomagazine.com/",
    category: "Specialized",
    description: "Originally Philippines-centric, now a major voice for creativity, design, and arts across Asia."
  },
  {
    name: "Retail Asia",
    url: "https://retailasia.com/",
    category: "Specialized",
    description: "Marketing news specifically related to FMCG, ecommerce, and brick-and-mortar retail brands."
  },
  {
    name: "Tech in Asia",
    url: "https://www.techinasia.com/",
    category: "Specialized",
    description: "Startup and technology ecosystem, covering strategies of unicorns like Grab, GoTo, and Shopee."
  },
  {
    name: "Telum Media",
    url: "https://www.telummedia.com/",
    category: "Specialized",
    description: "Journalism and PR industry news, tracking journalist moves and media requests."
  },
  {
    name: "Contagious",
    url: "https://www.contagious.com/",
    category: "Global",
    description: "Features innovative campaigns from Asian markets and creative intelligence."
  },
  {
    name: "LinkedIn Marketing Blog",
    url: "https://www.linkedin.com/business/marketing/blog",
    category: "Global",
    description: "Good for B2B marketing trends specific to the region."
  },

  // 5. Major Agency Holding Groups
  {
    name: "WPP",
    url: "https://www.wpp.com",
    category: "Global",
    description: "The world's largest advertising company, parent to Ogilvy, VML, GroupM, and more."
  },
  {
    name: "Publicis Groupe",
    url: "https://www.publicisgroupe.com",
    category: "Global",
    description: "Global marketing and communications leader, parent to Leo Burnett, Saatchi & Saatchi, and Starcom."
  },
  {
    name: "Omnicom Group",
    url: "https://www.omnicomgroup.com",
    category: "Global",
    description: "A leading global marketing and corporate communications company, holding BBDO, DDB, and TBWA."
  },
  {
    name: "The Interpublic Group of Companies (IPG)",
    url: "https://www.interpublic.com",
    category: "Global",
    description: "Global provider of marketing solutions, parent to McCann Worldgroup, IPG Mediabrands, and FCB."
  },
  {
    name: "Dentsu",
    url: "https://www.dentsu.com",
    category: "Global",
    description: "Japanese international advertising and public relations joint stock company operating globally."
  },
  {
    name: "Havas",
    url: "https://www.havas.com",
    category: "Global",
    description: "French multinational advertising and public relations company, part of the Vivendi group."
  }
];
