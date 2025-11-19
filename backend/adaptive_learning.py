from groq import Groq
from database import SessionLocal
from models_extended import AdaptiveAssessment, LearningPath, StudentMetrics
import json

client = Groq()

def calculate_adaptive_difficulty(student_id: int, recent_assessments: list) -> str:
    """Calculate next difficulty level based on performance"""
    if not recent_assessments:
        return "medium"
    
    recent_scores = [a.score_percentage for a in recent_assessments[-3:]]
    avg_score = sum(recent_scores) / len(recent_scores)
    
    if avg_score >= 85:
        return "hard"
    elif avg_score >= 65:
        return "medium"
    else:
        return "easy"

def generate_adaptive_recommendations(student_id: int) -> str:
    """Generate AI-powered personalized learning recommendations"""
    db = SessionLocal()
    metrics = db.query(StudentMetrics).filter(StudentMetrics.student_id == student_id).first()
    
    if not metrics:
        return "Start your learning journey by taking an assessment!"
    
    prompt = f"""Based on this student's learning metrics, provide 3 specific, actionable recommendations:
    
    Learning Velocity: {metrics.learning_velocity}
    Engagement Score: {metrics.engagement_score}
    Improvement Trend: {metrics.improvement_trend}
    Weak Areas: {json.dumps(metrics.concept_mastery)}
    
    Format as a numbered list with brief explanations focused on next steps."""
    
    message = client.messages.create(
        model="mixtral-8x7b-32768",
        max_tokens=300,
        messages=[
            {"role": "user", "content": prompt}
        ]
    )
    
    db.close()
    return message.content[0].text

def update_learning_path(student_id: int, assessment_results: dict):
    """Update student's adaptive learning path based on assessment"""
    db = SessionLocal()
    
    learning_path = db.query(LearningPath).filter(LearningPath.student_id == student_id).first()
    if not learning_path:
        learning_path = LearningPath(student_id=student_id)
        db.add(learning_path)
    
    # Extract weak and strong areas from assessment
    weak_areas = assessment_results.get("weak_areas", [])
    strong_areas = assessment_results.get("strong_areas", [])
    
    learning_path.weak_areas = weak_areas
    learning_path.strong_areas = strong_areas
    learning_path.recommended_topics = generate_recommended_topics(weak_areas)
    
    db.commit()
    db.close()

def generate_recommended_topics(weak_areas: list) -> list:
    """Generate recommended topics based on weak areas"""
    topic_mapping = {
        "algebra": ["basic_equations", "polynomials", "factoring"],
        "geometry": ["shapes", "angles", "proofs"],
        "physics": ["motion", "forces", "energy"],
        "chemistry": ["atoms", "bonding", "reactions"],
    }
    
    recommended = []
    for area in weak_areas:
        if area in topic_mapping:
            recommended.extend(topic_mapping[area])
    
    return recommended[:5]  # Return top 5 recommendations
