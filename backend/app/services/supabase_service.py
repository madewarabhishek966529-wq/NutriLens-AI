from functools import lru_cache
from supabase import create_client, Client

from app.core.config import get_settings

settings = get_settings()


@lru_cache
def get_supabase() -> Client:
    """Server-side Supabase client using the service role key.
    Never expose this key to the frontend — it bypasses Row Level Security.
    """
    return create_client(settings.supabase_url, settings.supabase_service_role_key)
