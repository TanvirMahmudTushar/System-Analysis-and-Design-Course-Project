import os
from typing import Optional

# Store API key but don't initialize client at module level
groq_api_key = os.getenv("GROQ_API_KEY")
print(f"DEBUG: GROQ_API_KEY loaded: {'Yes' if groq_api_key else 'No'}")
if groq_api_key:
    print(f"DEBUG: API Key starts with: {groq_api_key[:10]}...")

def get_groq_client():
    """Get or create Groq client instance"""
    if not groq_api_key:
        print("DEBUG: No API key found")
        return None
    try:
        from groq import Groq
        print("DEBUG: Creating Groq client...")
        client = Groq(api_key=groq_api_key)
        print("DEBUG: Groq client created successfully")
        return client
    except Exception as e:
        print(f"DEBUG: Error initializing Groq client: {e}")
        import traceback
        traceback.print_exc()
        return None

def chat_with_ai(message: str, context: str = "student") -> str:
    """Chat with AI assistant using Groq API"""
    client = get_groq_client()
    
    if not client:
        return "AI Chat is currently unavailable. Please contact your administrator."
    
    try:
        system_prompt = """You are an intelligent educational assistant helping students with their learning journey. 
        You can help with:
        - Answering questions about courses and subjects
        - Providing study tips and learning strategies
        - Explaining difficult concepts
        - Offering career guidance
        - Suggesting learning resources
        - Motivating and encouraging students
        
        Be friendly, supportive, and educational in your responses."""
        
        chat_completion = client.chat.completions.create(
            messages=[
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": message}
            ],
            model="llama-3.3-70b-versatile",
            temperature=0.7,
            max_tokens=500,
        )
        
        # Remove markdown formatting like ** and other special characters
        response = chat_completion.choices[0].message.content
        # Remove bold markdown
        response = response.replace('**', '')
        # Remove italic markdown
        response = response.replace('*', '')
        # Remove headers
        response = response.replace('###', '').replace('##', '').replace('#', '')
        
        return response
    except Exception as e:
        return f"I'm having trouble connecting right now. Please try again in a moment. (Error: {str(e)})"

def generate_ai_feedback(marks: float, max_marks: float, subject: str = "General") -> str:
    """Generate AI-powered feedback based on student performance"""
    percentage = (marks / max_marks) * 100
    
    # Provide default feedback without using Groq API
    if percentage >= 90:
        return f"Excellent work on your {subject} assignment! You scored {marks}/{max_marks} ({percentage:.1f}%). Your understanding of the material is outstanding. Keep up the exceptional effort and continue to challenge yourself!"
    elif percentage >= 80:
        return f"Great job on your {subject} assignment! You scored {marks}/{max_marks} ({percentage:.1f}%). You've demonstrated strong comprehension. Focus on mastering the finer details to reach the next level of excellence."
    elif percentage >= 70:
        return f"Good work on your {subject} assignment. You scored {marks}/{max_marks} ({percentage:.1f}%). You're on the right track! Review the areas where you lost points and practice similar problems to strengthen your understanding."
    elif percentage >= 60:
        return f"You scored {marks}/{max_marks} ({percentage:.1f}%) on your {subject} assignment. There's definitely progress here. Spend more time reviewing the core concepts and don't hesitate to ask questions when something is unclear."
    elif percentage >= 50:
        return f"You scored {marks}/{max_marks} ({percentage:.1f}%) on your {subject} assignment. You're making an effort, but there's significant room for improvement. Consider seeking additional help, forming study groups, or using supplementary materials to strengthen your grasp of the subject."
    else:
        return f"You scored {marks}/{max_marks} ({percentage:.1f}%) on your {subject} assignment. Don't get discouraged! This indicates you need extra support. Talk to your teacher, attend tutoring sessions, and focus on understanding the fundamental concepts. With dedicated effort, you can improve!"

def generate_learning_path(student_performance: dict) -> str:
    """Generate personalized learning path based on student performance"""
    avg_score = student_performance.get('avg_score', 0)
    weak_areas = student_performance.get('weak_areas', [])
    strong_areas = student_performance.get('strong_areas', [])
    
    recommendations = [
        f"Focus on improving in: {', '.join(weak_areas) if weak_areas else 'core fundamentals'}",
        f"Leverage your strengths in: {', '.join(strong_areas) if strong_areas else 'your best subjects'}",
        "Practice regularly with timed exercises to build confidence",
        "Review mistakes and understand why incorrect answers were wrong",
        "Seek help from teachers or peers when concepts are unclear"
    ]
    
    return "\n".join([f"{i+1}. {rec}" for i, rec in enumerate(recommendations)])
