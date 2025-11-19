from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from database import get_db
from models import Student, Grade, Assignment
import statistics

router = APIRouter(prefix="/api/students", tags=["students"])

@router.get("/{student_id}/records")
def get_student_records(student_id: int, db: Session = Depends(get_db)):
    """Get comprehensive student academic records"""
    student = db.query(Student).filter(Student.id == student_id).first()
    if not student:
        raise HTTPException(status_code=404, detail="Student not found")
    
    grades = db.query(Grade).filter(Grade.student_id == student_id).all()
    assignments = db.query(Assignment).filter(Assignment.student_id == student_id).all()
    
    if grades:
        scores = [g.marks / g.max_marks * 100 for g in grades]
        avg_score = statistics.mean(scores)
    else:
        avg_score = 0
    
    return {
        "student_id": student_id,
        "roll_number": student.roll_number,
        "grade_level": student.grade_level,
        "attendance": student.attendance,
        "total_grades": len(grades),
        "average_score": avg_score,
        "total_assignments": len(assignments),
        "completed_assignments": sum(1 for a in assignments if a.submitted),
    }

@router.get("/{student_id}/performance")
def get_student_performance(student_id: int, db: Session = Depends(get_db)):
    """Get detailed performance analytics"""
    grades = db.query(Grade).filter(Grade.student_id == student_id).all()
    
    if not grades:
        return {"message": "No grades found"}
    
    scores = [g.marks / g.max_marks * 100 for g in grades]
    
    return {
        "total_assessments": len(grades),
        "average_score": statistics.mean(scores),
        "highest_score": max(scores),
        "lowest_score": min(scores),
        "median_score": statistics.median(scores),
        "trend": "improving" if scores[-1] > scores[0] else "declining" if scores[-1] < scores[0] else "stable",
    }
