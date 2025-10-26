from django.db import models

class Interview(models.Model):
    INTERVIEW_TYPES = [
        ('technical', 'Technical'),
        ('hr', 'HR'),
        ('behavioral', 'Behavioral'),
    ]
    EXPERIENCE_LEVELS = [
        ('beginner', 'Beginner'),
        ('intermediate', 'Intermediate'),
        ('advanced', 'Advanced'),
    ]

    role = models.CharField(max_length=100)
    interview_type = models.CharField(max_length=20, choices=INTERVIEW_TYPES)
    experience_level = models.CharField(max_length=20, choices=EXPERIENCE_LEVELS)
    num_questions = models.IntegerField()
    questions = models.JSONField(default=list)
    responses = models.JSONField(default=list)
    feedback = models.JSONField(default=dict)
    created_at = models.DateTimeField(auto_now_add=True)
