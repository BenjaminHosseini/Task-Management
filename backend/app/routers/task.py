from fastapi import FastAPI, Response, Request, status, HTTPException, Depends, APIRouter
from .. import models, schemas, oauth2
from ..database import get_db
from sqlalchemy.orm import Session
from typing import List

router = APIRouter(
    prefix="/task",
    tags=["Tasks"]
)

# Endpoint to get all tasks for the current user
@router.get("/", response_model=List[schemas.TaskResponse])
def get_tasks(request: Request, db: Session = Depends(get_db), 
              current_user: int = Depends(oauth2.get_current_user)):
    print("Received Headers:", request.headers)  # Debugging
    tasks = db.query(models.Task).filter(models.Task.owner_id == current_user.id).all()
    return tasks


# Endpoint for adding a new task
@router.post("/add", status_code=status.HTTP_201_CREATED, response_model=schemas.TaskResponse)
def create_task(task: schemas.TaskCreate, db: Session = Depends(get_db), 
                current_user: int = Depends(oauth2.get_current_user)): 
    new_task = models.Task(**task.dict()) 
    db.add(new_task)
    db.commit()
    db.refresh(new_task)
    return new_task

# Endpoint for updating an existing task
@router.put("/update/{id}", status_code=status.HTTP_200_OK, response_model=schemas.TaskResponse)
def update_task(id: int, updated_task: schemas.TaskUpdate, db: Session = Depends(get_db), 
                current_user: int = Depends(oauth2.get_current_user)):
    task_query = db.query(models.Task).filter(models.Task.id == id)
    task = task_query.first()
    
    if task is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND,
                            detail=f"Task with id {id} does not exist")
    
    if task.owner_id != current_user.id:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, 
                            detail="Not authorized to perform requested action")

    task_query.update(updated_task.dict(), synchronize_session=False)
    db.commit()
    
    return task_query.first()  # Return the updated task

# Endpoint for deleting a task
@router.delete("/remove/{id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_task(id: int, db: Session = Depends(get_db), 
                current_user: int = Depends(oauth2.get_current_user)):
    task = db.query(models.Task).filter(models.Task.id == id).first()
    
    if not task:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND,
                            detail=f"Task with id {id} does not exist")
    
    if task.owner_id != current_user.id:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, 
                            detail="Not authorized to perform requested action")
    
    db.delete(task)
    db.commit()

    return Response(status_code=status.HTTP_204_NO_CONTENT)
