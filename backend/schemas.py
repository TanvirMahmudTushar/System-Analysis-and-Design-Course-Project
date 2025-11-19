from pydantic import BaseModel, EmailStr
from datetime import datetime
from typing import Optional

class UserCreate(BaseModel):
    email: EmailStr
    full_name: str
    password: str
    role: str  # teacher, student, parent

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class UserResponse(BaseModel):
    id: int
    email: str
    full_name: str
    role: str
    access_token: Optional[str] = None
    created_at: datetime
    
    class Config:
        from_attributes = True

class StudentResponse(BaseModel):
    id: Optional[int] = None
    user_id: Optional[int] = None
    roll_number: str
    grade_level: int
    parent_email: Optional[str] = None
    attendance: int = 0
    
    class Config:
        from_attributes = True

class CourseResponse(BaseModel):
    id: Optional[int] = None
    title: str
    description: str
    teacher_id: Optional[int] = None
    created_at: Optional[datetime] = None
    
    class Config:
        from_attributes = True

class AssignmentResponse(BaseModel):
    id: Optional[int] = None
    course_id: int
    student_id: int
    title: str
    description: str
    due_date: datetime
    submitted: bool = False
    
    class Config:
        from_attributes = True

class GradeResponse(BaseModel):
    id: Optional[int] = None
    student_id: int
    assignment_id: int
    marks: float
    max_marks: float
    feedback: Optional[str] = None
    subject: Optional[str] = None
    
    class Config:
        from_attributes = True
