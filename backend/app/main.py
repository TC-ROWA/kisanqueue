from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.config import settings
from app.routers import (
    auth, farmers, centres, bookings, payments, complaints, operator, admin,
    notifications, procurement, queue,
)

app = FastAPI(
    title="KisanQueue API",
    description="Smart agricultural procurement and queue management — backend API.",
    version="1.0.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router)
app.include_router(farmers.router)
app.include_router(centres.router)
app.include_router(bookings.router)
app.include_router(payments.router)
app.include_router(complaints.router)
app.include_router(operator.router)
app.include_router(admin.router)
app.include_router(notifications.router)
app.include_router(procurement.router)
app.include_router(queue.router)


@app.get("/")
def root():
    return {"service": "KisanQueue API", "status": "ok"}


@app.get("/health")
def health():
    return {"status": "healthy"}
