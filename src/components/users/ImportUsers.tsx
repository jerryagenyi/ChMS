import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  VStack,
  Text,
  useToast,
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
  List,
  ListItem,
  Progress,
} from "@chakra-ui/react";
import { useState } from "react";
import { DownloadIcon, UploadIcon } from "@chakra-ui/icons";

export interface ImportResults {
  successful: number;
  failed: number;
  errors: string[];
}

const ImportUsers = () => {
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [results, setResults] = useState<ImportResults | null>(null);
  const toast = useToast();

  const downloadTemplate = () => {
    const csvContent =
      "email,name,role,department,phoneNumber,dateOfBirth,address\n" +
      'john@example.com,John Doe,MEMBER,Youth,+1234567890,1990-01-01,"123 Main St"';

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "user-import-template.csv";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) return;

    setIsUploading(true);
    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetch("/api/users/import", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Import failed");
      }

      setResults(data);
      toast({
        title: "Import Complete",
        description: `Successfully imported ${data.successful} users`,
        status: "success",
        duration: 5000,
        isClosable: true,
      });
    } catch (error) {
      toast({
        title: "Import Failed",
        description:
          error instanceof Error ? error.message : "Unknown error occurred",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <Box p={4} data-testid="import-users-component">
      <VStack spacing={6} align="stretch">
        <Button
          leftIcon={<DownloadIcon />}
          onClick={downloadTemplate}
          colorScheme="blue"
          variant="outline"
          data-testid="download-template-button"
        >
          Download Template
        </Button>

        <form onSubmit={handleSubmit}>
          <VStack spacing={4}>
            <FormControl>
              <FormLabel>Upload CSV File</FormLabel>
              <Input
                type="file"
                accept=".csv"
                onChange={handleFileChange}
                p={1}
                data-testid="file-input"
              />
            </FormControl>

            <Button
              type="submit"
              colorScheme="purple"
              isLoading={isUploading}
              leftIcon={<UploadIcon />}
              isDisabled={!file}
              data-testid="import-button"
            >
              Import Users
            </Button>
          </VStack>
        </form>

        {isUploading && (
          <Box>
            <Text mb={2}>Uploading...</Text>
            <Progress size="xs" isIndeterminate />
          </Box>
        )}

        {results && (
          <Alert
            status={results.failed > 0 ? "warning" : "success"}
            variant="subtle"
            flexDirection="column"
            alignItems="flex-start"
            gap={2}
          >
            <AlertIcon />
            <AlertTitle>Import Results</AlertTitle>
            <AlertDescription>
              <Text>Successfully imported: {results.successful}</Text>
              <Text>Failed: {results.failed}</Text>

              {results.errors.length > 0 && (
                <Box mt={2}>
                  <Text fontWeight="bold">Errors:</Text>
                  <List styleType="disc" pl={4}>
                    {results.errors.map((error, index) => (
                      <ListItem key={index} fontSize="sm">
                        {error}
                      </ListItem>
                    ))}
                  </List>
                </Box>
              )}
            </AlertDescription>
          </Alert>
        )}
      </VStack>
    </Box>
  );
};

export default ImportUsers;
