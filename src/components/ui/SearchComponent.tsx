import { useState, useRef, KeyboardEvent } from 'react';
import {
  Input,
  Box,
  List,
  ListItem,
  Spinner,
  InputGroup,
  InputRightElement,
} from '@chakra-ui/react';

interface SearchResult {
  id: number;
  title: string;
}

interface SearchComponentProps {
  onSearch: (query: string) => Promise<SearchResult[]>;
  onSelect?: (result: SearchResult) => void;
}

export const SearchComponent: React.FC<SearchComponentProps> = ({ onSearch, onSelect }) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const timeoutRef = useRef<NodeJS.Timeout>();

  const handleSearch = async (value: string) => {
    setQuery(value);
    setIsLoading(true);

    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = setTimeout(async () => {
      try {
        const searchResults = await onSearch(value);
        setResults(searchResults);
      } catch (error) {
        console.error('Search error:', error);
        setResults([]);
      } finally {
        setIsLoading(false);
      }
    }, 300);
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    switch (event.key) {
      case 'ArrowDown':
        setSelectedIndex(prev => Math.min(prev + 1, results.length - 1));
        break;
      case 'ArrowUp':
        setSelectedIndex(prev => Math.max(prev - 1, -1));
        break;
      case 'Enter':
        if (selectedIndex >= 0 && results[selectedIndex]) {
          onSelect?.(results[selectedIndex]);
        }
        break;
    }
  };

  return (
    <Box position="relative">
      <InputGroup>
        <Input
          role="searchbox"
          value={query}
          onChange={e => handleSearch(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Search..."
        />
        {isLoading && (
          <InputRightElement>
            <Spinner size="sm" />
          </InputRightElement>
        )}
      </InputGroup>

      {results.length > 0 && (
        <List
          role="listbox"
          position="absolute"
          w="100%"
          bg="white"
          boxShadow="md"
          mt={2}
          maxH="300px"
          overflowY="auto"
          zIndex={1}
        >
          {results.map((result, index) => (
            <ListItem
              key={result.id}
              p={2}
              cursor="pointer"
              bg={index === selectedIndex ? 'gray.100' : undefined}
              _hover={{ bg: 'gray.50' }}
              onClick={() => onSelect?.(result)}
            >
              {result.title}
            </ListItem>
          ))}
        </List>
      )}
    </Box>
  );
};
