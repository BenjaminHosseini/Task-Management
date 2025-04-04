from passlib.context import CryptContext

 # default hashing algorithm (bcrypt)
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# hashing user password
def hash(password: str):
    return pwd_context.hash(password)

# comparing two hashed password
def verify(plain_password, hashed_passaword):
    return pwd_context.verify(plain_password, hashed_passaword)