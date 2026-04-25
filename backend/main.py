from fastapi import FastAPI
from routes.auth import router as auth_router
import uvicorn


app = FastAPI()

app.include_router(auth_router)


@app.get("/")
async def root():
    return {"message": "API is running"}


if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)