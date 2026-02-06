import os
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

from fastapi import FastAPI, HTTPException, Depends, status
from fastapi.security import OAuth2PasswordRequestForm, OAuth2PasswordBearer
from pydantic import BaseModel
from typing import Optional, List # Added List
from passlib.context import CryptContext
from datetime import datetime, timedelta
from jose import JWTError, jwt
from notion_client import Client # New Import
from fastapi.middleware.cors import CORSMiddleware # New Import

app = FastAPI()

# CORS Middleware
origins = [
    "http://localhost:5173",  # React frontend development server
    # Add other origins as needed for production deployment
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Configuration for JWT
# Get SECRET_KEY from environment variables, with a placeholder default for safety check
SECRET_KEY = os.getenv("SECRET_KEY", "YOUR_SECRET_KEY_NOT_SET") # Changed default for check
if SECRET_KEY == "YOUR_SECRET_KEY_NOT_SET":
    raise ValueError("SECRET_KEY is not set. Please set it in your environment or in a .env file.")

ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30

pwd_context = CryptContext(schemes=["argon2"], deprecated="auto")

def verify_password(plain_password, hashed_password):
    return pwd_context.verify(plain_password, hashed_password)

def get_password_hash(password):
    return pwd_context.hash(password)

def create_access_token(data: dict, expires_delta: Optional[timedelta] = None):
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

class User(BaseModel):
    username: str
    email: Optional[str] = None
    full_name: Optional[str] = None
    disabled: Optional[bool] = None

class UserInDB(User):
    hashed_password: str
    notion_api_token: Optional[str] = None # Added for Notion API integration

# Temporary database (replace with actual DB later)
# This is a very simplistic in-memory store for demonstration
# Initializing as empty to avoid startup errors. Users must be created via /register endpoint.
fake_users_db = {}

class UserCreate(BaseModel):
    username: str
    password: str
    email: Optional[str] = None
    full_name: Optional[str] = None

@app.post("/register", response_model=User)
async def register_user(user: UserCreate):
    if user.username in fake_users_db:
        raise HTTPException(status_code=400, detail="Username already registered")
    
    hashed_password = get_password_hash(user.password)
    user_in_db = UserInDB(**user.dict(), hashed_password=hashed_password)
    fake_users_db[user.username] = user_in_db.dict()
    
    return User(**user_in_db.dict())

async def authenticate_user(username: str, password: str):
    user = fake_users_db.get(username)
    if not user:
        return None
    if not verify_password(password, user["hashed_password"]):
        return None
    return UserInDB(**user)

@app.post("/token")
async def login_for_access_token(form_data: OAuth2PasswordRequestForm = Depends()):
    user = await authenticate_user(form_data.username, form_data.password)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": user.username}, expires_delta=access_token_expires
    )
    return {"access_token": access_token, "token_type": "bearer"}

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")

def get_user(username: str):
    user = fake_users_db.get(username)
    if user:
        return UserInDB(**user)
    return None

async def get_current_user(token: str = Depends(oauth2_scheme)):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        username: str = payload.get("sub")
        if username is None:
            raise credentials_exception
        token_data = username
    except JWTError:
        raise credentials_exception
    user = get_user(username=token_data)
    if user is None:
        raise credentials_exception
    return user

@app.get("/users/me", response_model=User)
async def read_users_me(current_user: User = Depends(get_current_user)):
    return current_user

class NotionTokenRequest(BaseModel):
    notion_api_token: str

@app.post("/notion/token")
async def save_notion_token(
    request: NotionTokenRequest, current_user: User = Depends(get_current_user)
):
    # For a real application, you might encrypt this token before storing
    fake_users_db[current_user.username]["notion_api_token"] = request.notion_api_token
    return {"message": "Notion API token saved successfully"}

@app.get("/notion/pages")
async def get_notion_pages(current_user: User = Depends(get_current_user)):
    if not current_user.notion_api_token:
        raise HTTPException(
            status_code=400, detail="Notion API token not set for this user"
        )
    
    notion = Client(auth=current_user.notion_api_token)
    
    try:
        # Query for all pages the integration has access to
        # This is a simplified approach, a real app might involve more complex filtering
        response = await notion.search(query="", filter={"property": "object", "value": "page"})
        
        pages = []
        for result in response["results"]:
            if result["object"] == "page":
                title = "Untitled"
                # Extract title based on Notion API structure
                if "properties" in result and "title" in result["properties"] and len(result["properties"]["title"]["title"]) > 0:
                    title = result["properties"]["title"]["title"][0]["plain_text"]
                
                pages.append({"id": result["id"], "title": title})
        
        return {"pages": pages}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Notion API error: {e}")

@app.get("/notion/pages/{page_id}/content")
async def get_notion_page_content(page_id: str, current_user: User = Depends(get_current_user)):
    if not current_user.notion_api_token:
        raise HTTPException(
            status_code=400, detail="Notion API token not set for this user"
        )
    
    notion = Client(auth=current_user.notion_api_token)
    
    try:
        # Fetch blocks from the Notion page
        response = await notion.blocks.children.list(block_id=page_id)
        
        page_content = ""
        for block in response["results"]:
            if "type" in block and block["type"] == "paragraph":
                if "rich_text" in block["paragraph"] and len(block["paragraph"]["rich_text"]) > 0:
                    for text_object in block["paragraph"]["rich_text"]:
                        if "plain_text" in text_object:
                            page_content += text_object["plain_text"] + "\n"
            # Add more block types as needed (e.g., heading, to_do, bulleted_list, etc.)
            elif "type" in block and block["type"] == "heading_1":
                if "rich_text" in block["heading_1"] and len(block["heading_1"]["rich_text"]) > 0:
                    page_content += "# " + block["heading_1"]["rich_text"][0]["plain_text"] + "\n"
            elif "type" in block and block["type"] == "heading_2":
                if "rich_text" in block["heading_2"] and len(block["heading_2"]["rich_text"]) > 0:
                    page_content += "## " + block["heading_2"]["rich_text"][0]["plain_text"] + "\n"
            elif "type" in block and block["type"] == "heading_3":
                if "rich_text" in block["heading_3"] and len(block["heading_3"]["rich_text"]) > 0:
                    page_content += "### " + block["heading_3"]["rich_text"][0]["plain_text"] + "\n"
            elif "type" in block and block["type"] == "bulleted_list_item":
                if "rich_text" in block["bulleted_list_item"] and len(block["bulleted_list_item"]["rich_text"]) > 0:
                    page_content += "* " + block["bulleted_list_item"]["rich_text"][0]["plain_text"] + "\n"
            elif "type" in block and block["type"] == "numbered_list_item":
                if "rich_text" in block["numbered_list_item"] and len(block["numbered_list_item"]["rich_text"]) > 0:
                    page_content += "1. " + block["numbered_list_item"]["rich_text"][0]["plain_text"] + "\n"
            elif "type" in block and block["type"] == "to_do":
                if "rich_text" in block["to_do"] and len(block["to_do"]["rich_text"]) > 0:
                    checked = "[x] " if block["to_do"]["checked"] else "[ ] "
                    page_content += checked + block["to_do"]["rich_text"][0]["plain_text"] + "\n"
        
        return {"content": page_content}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Notion API error: {e}")

class QuestionRequest(BaseModel):
    page_id: str
    num_questions: int = 5
    question_type: str = "multiple_choice" # e.g., "multiple_choice", "short_answer"

class GeneratedQuestion(BaseModel):
    question: str
    options: Optional[List[str]] = None
    answer: Optional[str] = None

# Placeholder for LLM interaction
async def generate_questions_with_llm(text_content: str, num_questions: int, question_type: str) -> List[GeneratedQuestion]:
    # This is a mock implementation. In a real application, you would call an LLM API here.
    print(f"Generating {num_questions} {question_type} questions from content of length {len(text_content)}...")
    
    mock_questions = [
        GeneratedQuestion(
            question="What is the main topic discussed in the text?",
            options=["Topic A", "Topic B", "Topic C", "Topic D"],
            answer="Topic B"
        ),
        GeneratedQuestion(
            question="Summarize the key takeaway in one sentence.",
            answer="The key takeaway is about X."
        ),
        GeneratedQuestion(
            question="Who is the author of this note?",
            options=["Author 1", "Author 2", "Author 3"],
            answer="Author 1"
        )
    ]
    # Return a subset based on num_questions for mock purposes
    return mock_questions[:num_questions]

@app.post("/generate-questions", response_model=List[GeneratedQuestion])
async def generate_questions(
    request: QuestionRequest, current_user: User = Depends(get_current_user)
):
    if not current_user.notion_api_token:
        raise HTTPException(
            status_code=400, detail="Notion API token not set for this user"
        )
    
    # 1. Get content from Notion page
    page_content_response = await get_notion_page_content(request.page_id, current_user)
    text_content = page_content_response["content"]
    
    if not text_content.strip():
        raise HTTPException(status_code=400, detail="Notion page has no content to generate questions from.")

    # 2. Generate questions using LLM (mock implementation for now)
    generated_questions = await generate_questions_with_llm(
        text_content, request.num_questions, request.question_type
    )
    
    return generated_questions

@app.get("/")
async def root():
    return {"message": "Welcome to Notion Quiz Maker Backend!"}



