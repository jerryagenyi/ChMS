import React from 'react';
import {
  Box,
  FormControl,
  FormLabel,
  Select,
  VStack,
  Text,
  useColorModeValue,
} from '@chakra-ui/react';
import {
  TOUCHPOINT_TYPES,
  TOUCHPOINT_SOURCES,
  TOUCHPOINT_LABELS,
  SOURCE_LABELS,
  TouchpointType,
  TouchpointSource,
} from '@/constants/touchpoints';

interface TouchpointSelectorProps {
  value: {
    type: TouchpointType;
    source: TouchpointSource;
  };
  onChange: (value: { type: TouchpointType; source: TouchpointSource }) => void;
  isRequired?: boolean;
}

export function TouchpointSelector({
  value,
  onChange,
  isRequired = false,
}: TouchpointSelectorProps) {
  const bgColor = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.600');

  const handleTypeChange = (type: TouchpointType) => {
    onChange({ type, source: '' as TouchpointSource });
  };

  const handleSourceChange = (source: TouchpointSource) => {
    onChange({ ...value, source });
  };

  const getSourceOptions = (type: TouchpointType) => {
    switch (type) {
      case 'SOCIAL_MEDIA':
        return [
          TOUCHPOINT_SOURCES.FACEBOOK,
          TOUCHPOINT_SOURCES.INSTAGRAM,
          TOUCHPOINT_SOURCES.TWITTER,
          TOUCHPOINT_SOURCES.TIKTOK,
          TOUCHPOINT_SOURCES.LINKEDIN,
          TOUCHPOINT_SOURCES.YOUTUBE,
        ];
      case 'REFERRAL':
        return [
          TOUCHPOINT_SOURCES.FRIEND,
          TOUCHPOINT_SOURCES.FAMILY,
          TOUCHPOINT_SOURCES.MEMBER,
          TOUCHPOINT_SOURCES.CO_WORKER,
        ];
      case 'ADVERTISING':
        return [
          TOUCHPOINT_SOURCES.POSTER,
          TOUCHPOINT_SOURCES.BILLBOARD,
          TOUCHPOINT_SOURCES.RADIO,
          TOUCHPOINT_SOURCES.TV,
          TOUCHPOINT_SOURCES.NEWSPAPER,
          TOUCHPOINT_SOURCES.MAGAZINE,
        ];
      case 'OTHER':
        return [
          TOUCHPOINT_SOURCES.WEBSITE,
          TOUCHPOINT_SOURCES.SEARCH_ENGINE,
          TOUCHPOINT_SOURCES.EMAIL,
          TOUCHPOINT_SOURCES.SMS,
          TOUCHPOINT_SOURCES.WALK_IN,
        ];
      default:
        return [];
    }
  };

  return (
    <VStack spacing={4} align="stretch">
      <FormControl isRequired={isRequired}>
        <FormLabel>How did you hear about us?</FormLabel>
        <Select
          value={value.type}
          onChange={e => handleTypeChange(e.target.value as TouchpointType)}
          bg={bgColor}
          borderColor={borderColor}
        >
          <option value="">Select an option</option>
          {Object.entries(TOUCHPOINT_TYPES).map(([key, value]) => (
            <option key={key} value={value}>
              {TOUCHPOINT_LABELS[value]}
            </option>
          ))}
        </Select>
      </FormControl>

      {value.type && (
        <FormControl isRequired={isRequired}>
          <FormLabel>Please specify</FormLabel>
          <Select
            value={value.source}
            onChange={e => handleSourceChange(e.target.value as TouchpointSource)}
            bg={bgColor}
            borderColor={borderColor}
          >
            <option value="">Select an option</option>
            {getSourceOptions(value.type).map(source => (
              <option key={source} value={source}>
                {SOURCE_LABELS[source]}
              </option>
            ))}
          </Select>
        </FormControl>
      )}
    </VStack>
  );
}
