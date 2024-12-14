from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from transformers import pipeline
import json

app = FastAPI()

# Enable CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],  # React app URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize Mistral model
try:
    analyzer = pipeline(
        "text-generation",
        model="mistralai/Mistral-7B-v0.1",
        device="cpu"  # Use "cuda" if you have GPU
    )
except Exception as e:
    print(f"Error loading model: {e}")
    analyzer = None

class AnalysisRequest(BaseModel):
    content: str
    isAdvanced: bool

@app.post("/analyze")
async def analyze_content(request: AnalysisRequest):
    if not analyzer:
        raise HTTPException(status_code=500, detail="Model not initialized")
    
    try:
        # Create prompt based on analysis type
        system_prompt = """Analyze the following content and provide a JSON response with:
        {
            "grammar": {
                "score": <0-100>,
                "errors": ["error1", "error2"],
                "suggestions": ["suggestion1", "suggestion2"]
            },
            "readability": {
                "score": <0-100>,
                "level": "<level>",
                "suggestions": ["suggestion1", "suggestion2"]
            },
            "seo": {
                "score": <0-100>,
                "keywords": [{"word": "<word>", "count": <number>, "density": <number>}],
                "suggestions": ["suggestion1", "suggestion2"]
            },
            "writingStyle": {
                "tone": "<tone>",
                "strengths": ["strength1", "strength2"],
                "improvements": ["improvement1", "improvement2"]
            },
            "summary": "<summary>",
            "improvementSuggestions": ["suggestion1", "suggestion2"]
        }
        """
        
        if request.isAdvanced:
            system_prompt += "\nProvide detailed analysis with specific examples and comprehensive suggestions."
        
        prompt = f"{system_prompt}\n\nContent to analyze: {request.content}"
        
        # Generate analysis
        response = analyzer(
            prompt,
            max_length=1000,
            num_return_sequences=1,
            temperature=0.3,
            do_sample=True
        )
        
        # Extract JSON from response
        result_text = response[0]['generated_text']
        json_start = result_text.find('{')
        json_end = result_text.rfind('}') + 1
        json_str = result_text[json_start:json_end]
        
        # Parse and validate JSON
        analysis_result = json.loads(json_str)
        return analysis_result
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
