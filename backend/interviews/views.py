from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from .models import Interview
from .serializers import InterviewSerializer
import openai
from django.conf import settings
import requests
import base64
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework import status
from rest_framework.response import Response

openai.api_key = settings.OPENAI_API_KEY

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def create_interview(request):
    data = request.data
    role = data.get('role')
    interview_type = data.get('type')
    experience_level = data.get('level')
    num_questions = data.get('num_questions')

    # Generate questions using OpenAI
    prompt = f"Generate {num_questions} {interview_type} interview questions for a {experience_level} {role} position."
    response = openai.ChatCompletion.create(
        model="gpt-3.5-turbo",
        messages=[{"role": "user", "content": prompt}]
    )
    questions = response.choices[0].message.content.split('\n')

    interview = Interview.objects.create(
        role=role,
        interview_type=interview_type,
        experience_level=experience_level,
        num_questions=num_questions,
        questions=questions
    )
    serializer = InterviewSerializer(interview)
    return Response(serializer.data, status=status.HTTP_201_CREATED)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def list_interviews(request):
    interviews = Interview.objects.all()
    serializer = InterviewSerializer(interviews, many=True)
    return Response(serializer.data)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_interview(request, pk):
    try:
        interview = Interview.objects.get(pk=pk)
    except Interview.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)
    serializer = InterviewSerializer(interview)
    return Response(serializer.data)

@api_view(['DELETE'])
@permission_classes([IsAuthenticated])
def delete_interview(request, pk):
    try:
        interview = Interview.objects.get(pk=pk)
    except Interview.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)
    interview.delete()
    return Response(status=status.HTTP_204_NO_CONTENT)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def answer_interview(request, pk):
    """Accepts a user's answer, evaluates it using OpenAI, stores feedback and returns follow-up."""
    try:
        interview = Interview.objects.get(pk=pk)
    except Interview.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)

    data = request.data
    answer_text = data.get('answer_text') or ''
    question_index = int(data.get('question_index', 0))

    # Bound check
    if question_index < 0 or question_index >= len(interview.questions):
        return Response({'detail': 'Invalid question index'}, status=status.HTTP_400_BAD_REQUEST)

    question_text = interview.questions[question_index]

    # Build prompt for evaluation
    system_msg = "You are an expert technical interviewer. Provide concise feedback, a score 1-10, and an adaptive follow-up question."
    user_msg = (
        f"Question: {question_text}\n"
        f"Candidate Answer: {answer_text}\n\n"
        "Provide a JSON object with keys: feedback (string), score (number 1-10), follow_up (string or null)."
    )

    try:
        resp = openai.ChatCompletion.create(
            model="gpt-4o-mini",
            messages=[{"role": "system", "content": system_msg}, {"role": "user", "content": user_msg}],
            max_tokens=400,
        )
        ai_text = resp.choices[0].message.content.strip()
    except Exception as e:
        return Response({'detail': 'OpenAI error', 'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    # Attempt to parse JSON out of ai_text
    feedback_obj = {
        'raw': ai_text,
        'feedback': None,
        'score': None,
        'follow_up': None,
    }
    try:
        # Try to find and parse JSON substring
        import json, re
        m = re.search(r"\{[\s\S]*\}", ai_text)
        if m:
            parsed = json.loads(m.group(0))
            feedback_obj['feedback'] = parsed.get('feedback')
            feedback_obj['score'] = parsed.get('score')
            feedback_obj['follow_up'] = parsed.get('follow_up')
        else:
            # Fallback: put entire text into feedback
            feedback_obj['feedback'] = ai_text
    except Exception:
        feedback_obj['feedback'] = ai_text

    # Store response and feedback
    interview.responses.append({'question_index': question_index, 'answer': answer_text})
    interview.feedback[str(question_index)] = feedback_obj
    interview.save()

    return Response({
        'ai': ai_text,
        'feedback': feedback_obj,
    })


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def voice_tts(request):
    """Proxy endpoint to generate TTS audio via external Vapi service.

    Expects JSON: { text: string, voice: optional }
    Returns: application/octet-stream audio or JSON with base64 audio on error.
    """
    data = request.data
    text = data.get('text')
    voice = data.get('voice', 'default')

    vapi_key = getattr(settings, 'VAPI_API_KEY', None)
    vapi_tts_url = getattr(settings, 'VAPI_TTS_URL', None)
    if not vapi_key or not vapi_tts_url:
        return Response({'detail': 'VAPI not configured'}, status=status.HTTP_501_NOT_IMPLEMENTED)

    try:
        r = requests.post(vapi_tts_url, json={'text': text, 'voice': voice}, headers={'Authorization': f'Bearer {vapi_key}'} , timeout=30)
        r.raise_for_status()
        # Expect binary audio
        return Response(r.content, content_type=r.headers.get('Content-Type', 'audio/mpeg'))
    except Exception as e:
        return Response({'detail': 'VAPI TTS error', 'error': str(e)}, status=status.HTTP_502_BAD_GATEWAY)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def voice_stt(request):
    """Proxy endpoint to transcribe uploaded audio via external Vapi service.

    Accepts multipart/form-data with 'file' field.
    Returns JSON: { text: transcription }
    """
    vapi_key = getattr(settings, 'VAPI_API_KEY', None)
    vapi_stt_url = getattr(settings, 'VAPI_STT_URL', None)
    if not vapi_key or not vapi_stt_url:
        return Response({'detail': 'VAPI not configured'}, status=status.HTTP_501_NOT_IMPLEMENTED)

    audio_file = request.FILES.get('file')
    if not audio_file:
        return Response({'detail': 'No audio file provided'}, status=status.HTTP_400_BAD_REQUEST)

    try:
        files = {'file': (audio_file.name, audio_file.read(), audio_file.content_type)}
        r = requests.post(vapi_stt_url, files=files, headers={'Authorization': f'Bearer {vapi_key}'}, timeout=30)
        r.raise_for_status()
        return Response(r.json())
    except Exception as e:
        return Response({'detail': 'VAPI STT error', 'error': str(e)}, status=status.HTTP_502_BAD_GATEWAY)
