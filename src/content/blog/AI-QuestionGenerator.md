---
title: "Creating a Proper Backend for the AI generator Web App"
description: "Learn how to make it with Open AI API."
publishDate: 2025-06-20
tags: ["CSS", "Tailwind CSS", "Web Development", "UI Design","Python"]
image: "/images/blog/Home.png"
---
The backend is a **FastAPI-based Python application** that provides an AI-powered question generation service from PDF documents. Here's the complete workflow:

### 📁 **Directory Structure**
- `backend/main.py` - FastAPI web server with REST endpoints
- `backend/processor.py` - PDF processing and text chunking module  
- `backend/generator.py` - AI question generation using OpenAI
- `backend/uploads/` - Stores uploaded PDF files
- `backend/data/` - Stores processed chunk files and document state
- `backend/data/document_state.json` - Tracks processing status of each document

### 🔄 **Core Workflow**

#### 1. **Document Upload & Processing** (`/upload` endpoint)
```
PDF Upload → Text Extraction → Text Chunking → Embedding Generation → Storage
```

- **Upload**: PDF saved to `uploads/` directory
- **Text Extraction**: Uses PyMuPDF (`fitz`) to extract text from each page
- **Chunking**: Splits text into 300-word chunks for better processing
- **Embedding**: Each chunk gets an OpenAI embedding (`text-embedding-3-small`)
- **Storage**: Chunks saved as JSON in `data/{filename}_chunks.json`
- **State Tracking**: Document status saved in `document_state.json`

#### 2. **Document Management**
- **List Documents** (`/documents`): Shows all uploaded PDFs with processing status
- **Toggle Enable/Disable** (`/toggle-enable`): Controls which documents can generate questions
- **Manual Reprocessing** (`/ingest`): Reprocess a document if needed

#### 3. **Question Generation** (`/generate-question` endpoint)
```
Query → Semantic Search → Context Building → AI Generation → MCQ Response
```

- **Semantic Search**: Uses FAISS vector database to find relevant chunks
- **Context Building**: Combines top 5 most relevant chunks
- **AI Generation**: GPT-4 creates multiple-choice questions in structured JSON format
- **Response**: Returns question, options, correct answer, explanation, and sources

### 🛠️ **Key Components**

#### **main.py - FastAPI Server**
- **CORS**: Configured for frontend communication
- **Error Handling**: Robust error responses with proper HTTP status codes
- **State Management**: Tracks document processing and enable/disable status
- **Health Check**: `/health` endpoint for system monitoring

#### **processor.py - PDF Processing**
- **Multi-format Support**: Handles various PDF types including encrypted ones
- **Batch Processing**: Processes pages in batches to avoid memory issues
- **Retry Logic**: Handles OpenAI API failures with exponential backoff
- **Validation**: Ensures chunks contain meaningful text

#### **generator.py - AI Question Generation**
- **Two Functions**:
  - `generate_question_from_document()` - New function for specific documents
  - `generate_question_from_query()` - Legacy function for backward compatibility
- **Vector Search**: Uses FAISS for semantic similarity search
- **Structured Output**: Enforces JSON format for consistent responses
- **Fallback Handling**: Provides default questions if AI generation fails

### 📊 **Current System State**

Looking at your `document_state.json`, you have:
- ✅ **AIGP_BOK_version 1.pdf**: Successfully processed and enabled
- ✅ **PEND OCDE 2023 Common guideposts...pdf**: Successfully processed and enabled  
- ❌ **Mapping emerging critical risks.pdf**: Failed processing (no valid chunks)
- ❌ **OECD Framework...pdf**: Failed processing (no valid chunks)

### 🔌 **API Endpoints Summary**

| Endpoint | Method | Purpose |
|----------|--------|---------|
| `/health` | GET | Health check |
| `/upload` | POST | Upload and process PDF |
| `/documents` | GET | List all documents with status |
| `/toggle-enable` | POST | Enable/disable document for questions |
| `/ingest` | POST | Manually reprocess a document |
| `/generate-question` | POST | Generate MCQ from enabled document |

### 🧠 **Dependencies**
- **FastAPI**: Web framework
- **OpenAI**: Text embeddings and GPT-4 for question generation
- **PyMuPDF (fitz)**: PDF text extraction
- **FAISS**: Vector similarity search
- **Uvicorn**: ASGI server

The system is well-architected with proper separation of concerns, error handling, and state management. The main strength is the semantic search capability that finds the most relevant content before generating questions, ensuring high-quality, contextually appropriate exam questions.

