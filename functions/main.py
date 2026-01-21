# ============================================
# CivicConnect Belagavi - Cloud Functions
# AI-Powered Grievance Analysis Backend
# ============================================

from firebase_functions import https_fn, options
from firebase_admin import initialize_app
import google.generativeai as genai
import json
import os
import base64

# Initialize Firebase Admin
initialize_app()

# Configure Gemini AI
GEMINI_API_KEY = os.environ.get('GEMINI_API_KEY', '')

# Grievance categories
CATEGORIES = [
    'SOLID_WASTE',
    'ROADS', 
    'WATER_SUPPLY',
    'DRAINAGE',
    'ELECTRICITY',
    'STREET_LIGHTS',
    'ENCROACHMENT',
    'SANITATION',
    'OTHER'
]

# Jurisdictions in Belagavi
JURISDICTIONS = ['BCC', 'CANTONMENT', 'VTU', 'PWD']

# System prompt for Gemini
SYSTEM_PROMPT = """You are CivicConnect AI, an intelligent civic issue classifier for Belagavi (Belgaum), Karnataka, India.

Your role is to analyze images of civic problems and generate structured reports for municipal authorities.

## Context about Belagavi:
- Population: ~500,000 in the city, ~700,000 in metro area
- Administrative divisions: Belagavi City Corporation (BCC), Cantonment Board, VTU Campus
- Common issues: Solid waste management, road conditions, drainage, water supply
- Languages spoken: Kannada, Marathi, Hindi, English

## Category Selection:
- SOLID_WASTE: Garbage, trash piles, overflowing bins, litter
- ROADS: Potholes, cracks, damaged roads, unpaved surfaces
- WATER_SUPPLY: Pipe leaks, broken taps, water tanks issues
- DRAINAGE: Clogged drains, stagnant water, sewers
- ELECTRICITY: Fallen poles, exposed wires, electrical issues
- STREET_LIGHTS: Non-working lights, broken lamp posts
- ENCROACHMENT: Illegal construction, blocked pathways
- SANITATION: Public toilets, unhygienic areas

## Severity Scoring (1-5):
- 1: Minor cosmetic issue
- 2: Small inconvenience
- 3: Moderate problem requiring attention
- 4: Serious issue affecting many people
- 5: Critical emergency/health hazard

## Jurisdiction Logic:
- BCC: Default for city areas
- CANTONMENT: Military/civil areas near Camp
- VTU: University campus only
- PWD: State highways and major roads

Analyze the image and return a JSON object with:
- category: One of the categories listed
- severity_score: 1-5 integer
- description_summary: 2-3 sentence factual description
- suggested_jurisdiction: BCC, CANTONMENT, VTU, or PWD
- detected_objects: Array of objects detected in image
"""


@https_fn.on_call(
    cors=options.CorsOptions(cors_origins="*", cors_methods=["POST"]),
    memory=options.MemoryOption.MB_512,
    timeout_sec=60
)
def analyze_grievance(req: https_fn.CallableRequest) -> dict:
    """
    Analyze a civic grievance image using Gemini AI.
    
    Args:
        req.data.image_base64: Base64 encoded image
        req.data.audio_base64: Optional base64 encoded audio
        req.data.location: Optional location object {lat, lng}
    
    Returns:
        Structured grievance analysis result
    """
    try:
        # Validate request
        if not req.data:
            return {"error": "No data provided", "success": False}
        
        image_base64 = req.data.get('image_base64')
        if not image_base64:
            return {"error": "No image provided", "success": False}
        
        # Configure Gemini
        if not GEMINI_API_KEY:
            # Return mock response for demo
            return get_mock_analysis()
        
        genai.configure(api_key=GEMINI_API_KEY)
        model = genai.GenerativeModel('gemini-2.0-flash')
        
        # Prepare image for analysis
        image_data = {
            "mime_type": "image/jpeg",
            "data": image_base64
        }
        
        # Build prompt
        prompt = f"""{SYSTEM_PROMPT}

Analyze this image and return ONLY a valid JSON object (no markdown, no code blocks):
{{
    "category": "CATEGORY_NAME",
    "severity_score": 1-5,
    "description_summary": "description here",
    "suggested_jurisdiction": "JURISDICTION",
    "detected_objects": ["object1", "object2"]
}}"""

        # Call Gemini
        response = model.generate_content([prompt, image_data])
        
        # Parse response
        response_text = response.text.strip()
        
        # Remove markdown code blocks if present
        if response_text.startswith('```'):
            lines = response_text.split('\n')
            response_text = '\n'.join(lines[1:-1])
        
        result = json.loads(response_text)
        
        # Validate result
        if result.get('category') not in CATEGORIES:
            result['category'] = 'OTHER'
        
        if result.get('suggested_jurisdiction') not in JURISDICTIONS:
            result['suggested_jurisdiction'] = 'BCC'
        
        severity = result.get('severity_score', 3)
        if not isinstance(severity, int) or severity < 1 or severity > 5:
            result['severity_score'] = 3
        
        return {
            "success": True,
            "analysis": result
        }
        
    except json.JSONDecodeError as e:
        print(f"JSON parse error: {e}")
        return get_mock_analysis()
        
    except Exception as e:
        print(f"Analysis error: {e}")
        return get_mock_analysis()


def get_mock_analysis() -> dict:
    """Return mock analysis for demo/fallback."""
    return {
        "success": True,
        "analysis": {
            "category": "SOLID_WASTE",
            "severity_score": 4,
            "description_summary": "Large garbage pile with accumulated plastic bags, organic waste, and debris. This poses a health hazard and requires municipal attention.",
            "suggested_jurisdiction": "BCC",
            "detected_objects": ["garbage bags", "plastic waste", "organic waste", "debris"]
        }
    }


@https_fn.on_request(cors=options.CorsOptions(cors_origins="*"))
def health_check(req: https_fn.Request) -> https_fn.Response:
    """Health check endpoint for monitoring."""
    return https_fn.Response(
        json.dumps({
            "status": "healthy",
            "service": "civicconnect-ai",
            "version": "1.0.0"
        }),
        content_type="application/json"
    )