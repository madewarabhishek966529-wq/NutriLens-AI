from fastapi import APIRouter, Depends

from app.core.security import CurrentUser, get_current_user
from app.services.supabase_service import get_supabase

router = APIRouter(prefix="/api/auth", tags=["auth"])


@router.get("/me")
def get_me(user: CurrentUser = Depends(get_current_user)):
    return {"id": user.id, "email": user.email, "name": user.name, "avatar_url": user.avatar_url}


@router.post("/sync")
def sync_profile(user: CurrentUser = Depends(get_current_user)):
    """Called once right after a successful Google Sign-In to ensure a
    profile row exists. Uses upsert so it's safe to call on every login.
    """
    supabase = get_supabase()
    supabase.table("profiles").upsert(
        {
            "id": user.id,
            "email": user.email,
            "name": user.name,
            "avatar_url": user.avatar_url,
        },
        on_conflict="id",
    ).execute()
    return {"synced": True}
