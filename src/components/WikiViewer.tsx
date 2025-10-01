import React, { useEffect, useState, useRef } from 'react';
import type { WikipediaPageContent } from '../types/game';
import { WikipediaAPI } from '../utils/wikipedia';

interface WikiViewerProps {
  articleTitle: string;
  onLinkClick: (title: string) => void;
  className?: string;
}

export const WikiViewer: React.FC<WikiViewerProps> = ({
  articleTitle,
  onLinkClick,
  className = ''
}) => {
  const [content, setContent] = useState<WikipediaPageContent | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    loadArticle(articleTitle);
  }, [articleTitle]);

  const loadArticle = async (title: string) => {
    setIsLoading(true);
    setError(null);

    try {
      const pageContent = await WikipediaAPI.getPageContent(title);
      if (pageContent) {
        setContent(pageContent);
      } else {
        setError('Article not found');
      }
    } catch (err) {
      setError('Failed to load article');
      console.error('Error loading article:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (!content || !contentRef.current) return;

    const contentElement = contentRef.current;

    // Process all links in the content
    const links = contentElement.querySelectorAll('a[href^="/wiki/"]');

    links.forEach((link) => {
      const href = link.getAttribute('href');
      if (href && WikipediaAPI.isValidWikipediaLink(href)) {
        // Style valid links
        link.classList.add('text-blue-600', 'hover:text-blue-800', 'hover:underline', 'cursor-pointer');

        // Add click handler
        link.addEventListener('click', (e) => {
          e.preventDefault();
          e.stopPropagation();
          const title = WikipediaAPI.extractTitleFromUrl(href);
          if (title) {
            onLinkClick(title);
          }
        });
      } else {
        // Style invalid links (external, files, etc.)
        link.classList.add('text-gray-400', 'cursor-not-allowed');
        link.addEventListener('click', (e) => {
          e.preventDefault();
          e.stopPropagation();
        });
      }
    });

    // Remove edit links and other unwanted elements
    const editLinks = contentElement.querySelectorAll('.mw-editsection');
    editLinks.forEach(el => el.remove());

    // Remove reference links
    const refLinks = contentElement.querySelectorAll('sup.reference');
    refLinks.forEach(el => el.remove());

    // Style the content for better readability
    const paragraphs = contentElement.querySelectorAll('p');
    paragraphs.forEach(p => {
      p.classList.add('mb-4', 'leading-relaxed');
    });

    const headings = contentElement.querySelectorAll('h1, h2, h3, h4, h5, h6');
    headings.forEach(h => {
      h.classList.add('font-bold', 'mt-6', 'mb-3');
      if (h.tagName === 'H1') h.classList.add('text-2xl');
      if (h.tagName === 'H2') h.classList.add('text-xl');
      if (h.tagName === 'H3') h.classList.add('text-lg');
    });

    // Style tables
    const tables = contentElement.querySelectorAll('table');
    tables.forEach(table => {
      table.classList.add('border-collapse', 'border', 'border-gray-300', 'my-4');
      const cells = table.querySelectorAll('td, th');
      cells.forEach(cell => {
        cell.classList.add('border', 'border-gray-300', 'px-2', 'py-1');
      });
    });

    // Style lists
    const lists = contentElement.querySelectorAll('ul, ol');
    lists.forEach(list => {
      list.classList.add('ml-6', 'mb-4');
    });

    // Scroll to top when content changes
    contentElement.scrollTop = 0;

  }, [content, onLinkClick]);

  if (isLoading) {
    return (
      <div className={`flex items-center justify-center h-64 ${className}`}>
        <div className="text-lg text-gray-600">Loading article...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`flex items-center justify-center h-64 ${className}`}>
        <div className="text-lg text-red-600">{error}</div>
      </div>
    );
  }

  if (!content) {
    return (
      <div className={`flex items-center justify-center h-64 ${className}`}>
        <div className="text-lg text-gray-600">No article loaded</div>
      </div>
    );
  }

  return (
    <div className={`bg-white ${className}`}>
      <div className="border-b border-gray-200 p-4 bg-gray-50">
        <h1 className="text-2xl font-bold text-gray-800">{content.title}</h1>
      </div>

      <div
        ref={contentRef}
        className="p-6 overflow-y-auto prose prose-sm max-w-none"
        dangerouslySetInnerHTML={{ __html: content.content }}
        style={{ maxHeight: 'calc(100vh - 200px)' }}
      />
    </div>
  );
};