# Backend (Django)

This backend provides interview generation and evaluation endpoints plus optional voice proxy endpoints to a VAPI-compatible voice service.

## Environment variables

- OPENAI_API_KEY - required for question generation and evaluation via OpenAI
- VAPI_API_KEY - optional; if you want to enable voice TTS/STT proxy
- VAPI_TTS_URL - optional; VAPI endpoint for TTS generation
- VAPI_STT_URL - optional; VAPI endpoint for STT/transcription

## Relevant endpoints

- POST /api/interviews/create/  -> create an interview (already present)
- GET  /api/interviews/         -> list interviews
- GET  /api/interviews/:id/     -> get interview
- DELETE /api/interviews/:id/delete/ -> delete
- POST /api/interviews/:id/answer/ -> submit an answer text for evaluation (returns AI feedback and follow-up)
- POST /api/interviews/voice/tts/ -> proxy TTS generation to VAPI (requires VAPI_* env vars)
- POST /api/interviews/voice/stt/ -> proxy STT (multipart/form-data 'file') to VAPI (requires VAPI_* env vars)

## Notes

- Ensure `OPENAI_API_KEY` is set in the environment before starting the Django server.
- The voice endpoints proxy to external VAPI URLs. If not configured, they return 501 Not Implemented.

