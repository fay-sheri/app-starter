from fastapi import FastAPI

app = FastAPI(title="App Starter Backend")

@app.get("/")
def root():
    return {"message": "App Starter Backend is running"}

@app.get("/health")
def health():
    return {"status": "ok"}