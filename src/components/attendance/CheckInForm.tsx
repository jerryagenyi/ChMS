"use client";

import { useState } from "react";
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Select,
  Switch,
  VStack,
  Checkbox,
  CheckboxGroup,
  Text,
} from "@chakra-ui/react";

interface Member {
  id: string;
  name: string;
}

interface CheckInFormProps {
  members: Member[];
  onSubmit: (data: {
    memberId?: string;
    memberIds?: string[];
    type: "INDIVIDUAL" | "FAMILY";
  }) => void;
}

export default function CheckInForm({ members, onSubmit }: CheckInFormProps) {
  const [isFamilyCheckIn, setIsFamilyCheckIn] = useState(false);
  const [selectedMemberId, setSelectedMemberId] = useState<string>("");
  const [selectedMemberIds, setSelectedMemberIds] = useState<string[]>([]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isFamilyCheckIn) {
      onSubmit({
        memberIds: selectedMemberIds,
        type: "FAMILY",
      });
    } else {
      onSubmit({
        memberId: selectedMemberId,
        type: "INDIVIDUAL",
      });
    }
  };

  return (
    <Box as="form" onSubmit={handleSubmit}>
      <VStack spacing={4} align="stretch">
        <FormControl display="flex" alignItems="center">
          <FormLabel htmlFor="family-check-in" mb="0">
            Family Check-in
          </FormLabel>
          <Switch
            id="family-check-in"
            isChecked={isFamilyCheckIn}
            onChange={(e) => {
              setIsFamilyCheckIn(e.target.checked);
              setSelectedMemberId("");
              setSelectedMemberIds([]);
            }}
          />
        </FormControl>

        {isFamilyCheckIn ? (
          <FormControl>
            <FormLabel>Select Family Members</FormLabel>
            <CheckboxGroup
              value={selectedMemberIds}
              onChange={(values) => setSelectedMemberIds(values as string[])}
            >
              <VStack align="stretch" spacing={2}>
                {members.map((member) => (
                  <Checkbox key={member.id} value={member.id}>
                    {member.name}
                  </Checkbox>
                ))}
              </VStack>
            </CheckboxGroup>
          </FormControl>
        ) : (
          <FormControl>
            <FormLabel id="member-select-label" htmlFor="member-select">
              Select Member
            </FormLabel>
            <Select
              id="member-select"
              value={selectedMemberId}
              onChange={(e) => setSelectedMemberId(e.target.value)}
              placeholder="Select a member"
              aria-labelledby="member-select-label"
            >
              {members.map((member) => (
                <option key={member.id} value={member.id}>
                  {member.name}
                </option>
              ))}
            </Select>
          </FormControl>
        )}

        <Button
          type="submit"
          colorScheme="blue"
          isDisabled={
            isFamilyCheckIn ? selectedMemberIds.length === 0 : !selectedMemberId
          }
        >
          {isFamilyCheckIn ? "Check In Family" : "Check In"}
        </Button>
      </VStack>
    </Box>
  );
}
