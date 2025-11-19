from sqlalchemy import Column, Integer, String, Text, DateTime, ForeignKey, Boolean, Float, JSON
from database import Base
from datetime import datetime

class AdaptiveAssessment(Base):
    __tablename__ = "adaptive_assessments"
    
    id = Column(Integer, primary_key=True, index=True)
    student_id = Column(Integer, ForeignKey("students.id"))
    subject = Column(String)
    difficulty_level = Column(String)  # easy, medium, hard
    questions_answered = Column(Integer)
    correct_answers = Column(Integer)
    score_percentage = Column(Float)
    time_spent = Column(Integer)  # in seconds
    assessment_data = Column(JSON)  # Store detailed Q&A data
    created_at = Column(DateTime, default=datetime.utcnow)

class LearningPath(Base):
    __tablename__ = "learning_paths"
    
    id = Column(Integer, primary_key=True, index=True)
    student_id = Column(Integer, ForeignKey("students.id"))
    recommended_topics = Column(JSON)  # Array of recommended topics
    completed_topics = Column(JSON)  # Array of completed topics
    weak_areas = Column(JSON)  # Areas needing improvement
    strong_areas = Column(JSON)  # Areas of strength
    last_updated = Column(DateTime, default=datetime.utcnow)

class StudentMetrics(Base):
    __tablename__ = "student_metrics"
    
    id = Column(Integer, primary_key=True, index=True)
    student_id = Column(Integer, ForeignKey("students.id"))
    learning_velocity = Column(Float)  # Progress per week
    engagement_score = Column(Float)  # 0-100
    concept_mastery = Column(JSON)  # {concept: mastery_percentage}
    improvement_trend = Column(String)  # improving, stable, declining
    last_calculated = Column(DateTime, default=datetime.utcnow)
