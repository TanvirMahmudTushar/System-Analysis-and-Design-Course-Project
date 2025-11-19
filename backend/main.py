from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from datetime import datetime, timedelta
import os
from dotenv import load_dotenv

load_dotenv()

from database import engine, Base, get_db
from models import User, Student, Course, Assignment, Grade
from schemas import (
    UserCreate, UserLogin, UserResponse,
    StudentResponse, CourseResponse, AssignmentResponse, GradeResponse
)
from auth import create_access_token, verify_password, hash_password, get_current_user
from groq_ai import generate_ai_feedback, chat_with_ai

# Create tables
Base.metadata.create_all(bind=engine)

app = FastAPI(title="Education Platform API")

# Enable CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allow all origins for dev, restrict in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ==================== Auth Routes ====================
@app.post("/api/auth/register", response_model=UserResponse)
def register(user: UserCreate, db: Session = Depends(get_db)):
    """Register a new user (teacher, student, or parent)"""
    existing_user = db.query(User).filter(User.email == user.email).first()
    if existing_user:
        raise HTTPException(status_code=400, detail="Email already registered")
    
    hashed_password = hash_password(user.password)
    db_user = User(
        email=user.email,
        full_name=user.full_name,
        role=user.role,
        password_hash=hashed_password
    )
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    
    access_token = create_access_token(data={"sub": db_user.id, "role": db_user.role})
    return {**db_user.__dict__, "access_token": access_token}

@app.post("/api/auth/login", response_model=UserResponse)
def login(user: UserLogin, db: Session = Depends(get_db)):
    """Login user and get access token"""
    db_user = db.query(User).filter(User.email == user.email).first()
    if not db_user or not verify_password(user.password, db_user.password_hash):
        raise HTTPException(status_code=401, detail="Invalid credentials")
    
    access_token = create_access_token(data={"sub": db_user.id, "role": db_user.role})
    return {**db_user.__dict__, "access_token": access_token}

# ==================== Student Routes ====================
@app.get("/api/students", response_model=list[StudentResponse])
def get_students(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    """Get all students (teacher/parent only)"""
    if current_user.role == "student":
        raise HTTPException(status_code=403, detail="Not authorized")
    return db.query(Student).all()

@app.get("/api/students/{student_id}", response_model=StudentResponse)
def get_student(student_id: int, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    """Get student profile"""
    student = db.query(Student).filter(Student.id == student_id).first()
    if not student:
        raise HTTPException(status_code=404, detail="Student not found")
    return student

@app.post("/api/students", response_model=StudentResponse)
def create_student(student: StudentResponse, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    """Create student profile (teacher/parent only)"""
    if current_user.role not in ["teacher", "parent"]:
        raise HTTPException(status_code=403, detail="Not authorized")
    
    db_student = Student(**student.dict())
    db.add(db_student)
    db.commit()
    db.refresh(db_student)
    return db_student

# ==================== Course Routes ====================
@app.get("/api/courses", response_model=list[CourseResponse])
def get_courses(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    """Get courses"""
    return db.query(Course).all()

@app.post("/api/courses", response_model=CourseResponse)
def create_course(course: CourseResponse, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    """Create course (teacher only)"""
    if current_user.role != "teacher":
        raise HTTPException(status_code=403, detail="Only teachers can create courses")
    
    db_course = Course(
        title=course.title,
        description=course.description,
        teacher_id=current_user.id
    )
    db.add(db_course)
    db.commit()
    db.refresh(db_course)
    return db_course

# ==================== Assignment Routes ====================
@app.post("/api/assignments", response_model=AssignmentResponse)
def create_assignment(assignment: AssignmentResponse, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    """Create assignment (teacher only)"""
    if current_user.role != "teacher":
        raise HTTPException(status_code=403, detail="Only teachers can create assignments")
    
    db_assignment = Assignment(**assignment.dict())
    db.add(db_assignment)
    db.commit()
    db.refresh(db_assignment)
    return db_assignment

@app.get("/api/assignments/{assignment_id}", response_model=AssignmentResponse)
def get_assignment(assignment_id: int, db: Session = Depends(get_db)):
    """Get assignment details"""
    assignment = db.query(Assignment).filter(Assignment.id == assignment_id).first()
    if not assignment:
        raise HTTPException(status_code=404, detail="Assignment not found")
    return assignment

# ==================== Grade & Feedback Routes ====================
@app.post("/api/grades", response_model=GradeResponse)
def submit_grade(grade: GradeResponse, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    """Submit grade with AI-generated feedback"""
    if current_user.role != "teacher":
        raise HTTPException(status_code=403, detail="Only teachers can submit grades")
    
    # Generate AI feedback
    feedback = generate_ai_feedback(grade.marks, grade.max_marks, grade.subject or "General")
    
    db_grade = Grade(
        student_id=grade.student_id,
        assignment_id=grade.assignment_id,
        marks=grade.marks,
        max_marks=grade.max_marks,
        feedback=feedback,
        graded_by=current_user.id
    )
    db.add(db_grade)
    db.commit()
    db.refresh(db_grade)
    return db_grade

@app.get("/api/grades/student/{student_id}")
def get_student_grades(student_id: int, db: Session = Depends(get_db)):
    """Get grades for a student"""
    grades = db.query(Grade).filter(Grade.student_id == student_id).all()
    if not grades:
        raise HTTPException(status_code=404, detail="No grades found")
    return grades

# ==================== AI Chat ====================
from pydantic import BaseModel

class ChatRequest(BaseModel):
    message: str
    context: str = "student"

class ChatResponse(BaseModel):
    response: str

@app.post("/api/ai/chat", response_model=ChatResponse)
def ai_chat(request: ChatRequest):
    """Chat with AI assistant powered by Groq"""
    response = chat_with_ai(request.message, request.context)
    return {"response": response}

# ==================== Health Check ====================
@app.get("/api/health")
def health_check():
    """Health check endpoint"""
    return {"status": "healthy"}
