from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .routers import task, user, auth
from .database import engine
from . import models
from .config import settings

models.Base.metadata.create_all(bind=engine)

app = FastAPI()

# allowing cross origin resource sharing
origins = ["*"]
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(task.router)
app.include_router(user.router)
app.include_router(auth.router)

@app.get("/")
def root():
    print("Api is running")
    return{"message":"Welcome to To Do App"}


