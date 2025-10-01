import type { WikipediaArticle, WikipediaSearchResult, WikipediaPageContent } from '../types/game';

const WIKIPEDIA_API_BASE = 'https://en.wikipedia.org/api/rest_v1';
const WIKIPEDIA_API_ACTION = 'https://en.wikipedia.org/w/api.php';

export class WikipediaAPI {
  static async searchArticles(query: string, limit = 10): Promise<WikipediaSearchResult[]> {
    try {
      const params = new URLSearchParams({
        action: 'query',
        format: 'json',
        list: 'search',
        srsearch: query,
        srlimit: limit.toString(),
        origin: '*'
      });

      const response = await fetch(`${WIKIPEDIA_API_ACTION}?${params}`);
      const data = await response.json();

      if (data.query?.search) {
        return data.query.search.map((result: any) => ({
          title: result.title,
          pageid: result.pageid,
          extract: result.snippet.replace(/<[^>]*>/g, '') // Remove HTML tags
        }));
      }
      return [];
    } catch (error) {
      console.error('Error searching Wikipedia:', error);
      return [];
    }
  }

  static async getRandomArticle(): Promise<WikipediaArticle | null> {
    try {
      const params = new URLSearchParams({
        action: 'query',
        format: 'json',
        list: 'random',
        rnnamespace: '0',
        rnlimit: '1',
        origin: '*'
      });

      const response = await fetch(`${WIKIPEDIA_API_ACTION}?${params}`);
      const data = await response.json();

      if (data.query?.random?.[0]) {
        const randomPage = data.query.random[0];
        return {
          title: randomPage.title,
          pageid: randomPage.id,
          url: `https://en.wikipedia.org/wiki/${encodeURIComponent(randomPage.title)}`
        };
      }
      return null;
    } catch (error) {
      console.error('Error getting random article:', error);
      return null;
    }
  }

  static async getPageContent(title: string): Promise<WikipediaPageContent | null> {
    try {
      // Get page content
      const contentParams = new URLSearchParams({
        action: 'parse',
        format: 'json',
        page: title,
        prop: 'text|links',
        origin: '*'
      });

      const response = await fetch(`${WIKIPEDIA_API_ACTION}?${contentParams}`);
      const data = await response.json();

      if (data.parse) {
        const links = data.parse.links
          ?.filter((link: any) => link.ns === 0) // Only main namespace articles
          ?.map((link: any) => link['*'])
          ?.slice(0, 100) || []; // Limit to first 100 links

        return {
          title: data.parse.title,
          pageid: data.parse.pageid,
          content: data.parse.text['*'],
          links
        };
      }
      return null;
    } catch (error) {
      console.error('Error getting page content:', error);
      return null;
    }
  }

  static async getPageSummary(title: string): Promise<WikipediaArticle | null> {
    try {
      const response = await fetch(`${WIKIPEDIA_API_BASE}/page/summary/${encodeURIComponent(title)}`);
      const data = await response.json();

      return {
        title: data.title,
        pageid: data.pageid,
        extract: data.extract,
        url: data.content_urls?.desktop?.page
      };
    } catch (error) {
      console.error('Error getting page summary:', error);
      return null;
    }
  }

  static isValidWikipediaLink(href: string): boolean {
    return href.startsWith('/wiki/') &&
           !href.includes(':') &&
           !href.includes('#') &&
           !href.startsWith('/wiki/File:') &&
           !href.startsWith('/wiki/Category:') &&
           !href.startsWith('/wiki/Template:');
  }

  static extractTitleFromUrl(url: string): string {
    const match = url.match(/\/wiki\/(.+)$/);
    return match ? decodeURIComponent(match[1].replace(/_/g, ' ')) : '';
  }
}