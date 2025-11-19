from sqlalchemy import Column, Integer, String, Text, DateTime, ForeignKey, Boolean, Float
from sqlalchemy.orm import relationship
from datetime import datetime
from database import Base

class User(Base):
    __tablename__ = "users"
    
    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True)
    full_name = Column(String)
    password_hash = Column(String)
    role = Column(String)  # teacher, student, parent
    created_at = Column(DateTime, default=datetime.utcnow)
    
    courses = relationship("Course", back_populates="teacher")
    grades = relationship("Grade", back_populates="teacher_user")

class Student(Base):
    __tablename__ = "students"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    roll_number = Column(String, unique=True)
    grade_level = Column(Integer)
    parent_email = Column(String, nullable=True)
    attendance = Column(Integer, default=0)
    created_at = Column(DateTime, default=datetime.utcnow)
    
    assignments = relationship("Assignment", back_populates="student")
    grades = relationship("Grade", back_populates="student")

class Course(Base):
    __tablename__ = "courses"
    
    id = Column(Integer, primary_key=True, index=True)
    title = Column(String)
    description = Column(Text)
    teacher_id = Column(Integer, ForeignKey("users.id"))
    created_at = Column(DateTime, default=datetime.utcnow)
    
    teacher = relationship("User", back_populates="courses")
    assignments = relationship("Assignment", back_populates="course")

class Assignment(Base):
    __tablename__ = "assignments"
    
    id = Column(Integer, primary_key=True, index=True)
    course_id = Column(Integer, ForeignKey("courses.id"))
    student_id = Column(Integer, ForeignKey("students.id"))
    title = Column(String)
    description = Column(Text)
    due_date = Column(DateTime)
    submitted = Column(Boolean, default=False)
    submitted_at = Column(DateTime, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    
    course = relationship("Course", back_populates="assignments")
    student = relationship("Student", back_populates="assignments")
    grades = relationship("Grade", back_populates="assignment")

class Grade(Base):
    __tablename__ = "grades"
    
    id = Column(Integer, primary_key=True, index=True)
    student_id = Column(Integer, ForeignKey("students.id"))
    assignment_id = Column(Integer, ForeignKey("assignments.id"))
    marks = Column(Float)
    max_marks = Column(Float)
    feedback = Column(Text)
    graded_by = Column(Integer, ForeignKey("users.id"))
    created_at = Column(DateTime, default=datetime.utcnow)
    
    student = relationship("Student", back_populates="grades")
    assignment = relationship("Assignment", back_populates="grades")
    teacher_user = relationship("User", back_populates="grades")
