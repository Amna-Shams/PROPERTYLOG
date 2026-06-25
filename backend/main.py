from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .config import settings
from .database import engine, Base
from .routes import auth, property, unit, tenant, lease, rent, maintenance, report, notification

# Initialize database tables on startup (For development demo/mockup postgres)
try:
    Base.metadata.create_all(bind=engine)
except Exception as e:
    print(f"PostgreSQL connection/creation warning: {str(e)}. (Ensure engine URL is active in production)")

app = FastAPI(
    title=settings.PROJECT_NAME,
    description="Secure Role-Based Property Management Backend",
    version="1.0.0"
)

# CORS configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Set to specific domains in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Mount Routers
app.include_router(auth.router, prefix="/api")
app.include_router(property.router, prefix="/api")
app.include_router(unit.router, prefix="/api")
app.include_router(tenant.router, prefix="/api")
app.include_router(lease.router, prefix="/api")
app.include_router(rent.router, prefix="/api")
app.include_router(maintenance.router, prefix="/api")
app.include_router(report.router, prefix="/api")
app.include_router(notification.router, prefix="/api")

@app.get("/")
def read_root():
    return {
        "app": settings.PROJECT_NAME,
        "status": "online",
        "documentation": "/docs"
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("backend.main:app", host="0.0.0.0", port=8000, reload=True)
