interface LanguageDetectionResponse {
    language: "english" | "hebrew" | "unknown"
    confidence: number
  }
  
  interface LanguageDetectionRequest {
    examId?: string | number
    fileId?: string | number
  }
  
  class LanguageDetectionService {
    /**
     * Detect language from an uploaded file
     * @param params Request parameters
     * @param file The file to analyze
     * @returns Detection result with language and confidence score
     */
    static async detectLanguage(params: LanguageDetectionRequest, file: File): Promise<LanguageDetectionResponse> {
        try {
          const formData = new FormData()
          formData.append("file", file)
      
          if (params.examId) {
            formData.append("examId", params.examId.toString())
          }
      
          if (params.fileId) {
            formData.append("fileId", params.fileId.toString())
          }
      
          const response = await fetch("http://localhost:5000/detect-language", {
            method: "POST",
            body: formData,
          })
      
          if (!response.ok) {
            throw new Error("Failed to detect language")
          }
      
          const data = await response.json()
      
          return {
            language: data.language,
            confidence: data.confidence,
          }
        } catch (error) {
          console.error("Error detecting language:", error)
          return {
            language: "unknown",
            confidence: 0,
          }
        }
      }
      
  
    /**
     * Set the language for a specific exam or file
     * @param params Request parameters
     * @param language The language to set
     */
    static async setLanguage(params: LanguageDetectionRequest, language: "english" | "hebrew"): Promise<void> {
      try {
        const payload = {
          ...params,
          language,
        }
  
        // In a real implementation, this would call your backend API
        // For demo purposes, we'll simulate a successful response
        await new Promise((resolve) => setTimeout(resolve, 500))
  
        console.log("Language set successfully:", payload)
      } catch (error) {
        console.error("Error setting language:", error)
        throw error
      }
    }
  }
  
  export default LanguageDetectionService
  