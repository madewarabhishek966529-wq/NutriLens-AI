import io

import pandas as pd
from fastapi import APIRouter, Depends
from fastapi.responses import StreamingResponse
from reportlab.lib import colors
from reportlab.lib.pagesizes import letter
from reportlab.platypus import SimpleDocTemplate, Table, TableStyle, Paragraph, Spacer
from reportlab.lib.styles import getSampleStyleSheet

from app.core.security import CurrentUser, get_current_user
from app.services.supabase_service import get_supabase

router = APIRouter(prefix="/api/export", tags=["export"])

COLUMNS = ["logged_at", "food_name", "meal_type", "calories", "protein_g", "carbs_g", "fat_g", "fiber_g"]


def _fetch_logs(user_id: str) -> list[dict]:
    supabase = get_supabase()
    result = (
        supabase.table("food_logs")
        .select(",".join(COLUMNS))
        .eq("user_id", user_id)
        .order("logged_at", desc=True)
        .execute()
    )
    return result.data


@router.get("/csv")
def export_csv(user: CurrentUser = Depends(get_current_user)):
    logs = _fetch_logs(user.id)
    df = pd.DataFrame(logs, columns=COLUMNS)
    buffer = io.StringIO()
    df.to_csv(buffer, index=False)
    buffer.seek(0)
    return StreamingResponse(
        iter([buffer.getvalue()]),
        media_type="text/csv",
        headers={"Content-Disposition": "attachment; filename=nutrilens_history.csv"},
    )


@router.get("/pdf")
def export_pdf(user: CurrentUser = Depends(get_current_user)):
    logs = _fetch_logs(user.id)
    buffer = io.BytesIO()
    doc = SimpleDocTemplate(buffer, pagesize=letter)
    styles = getSampleStyleSheet()
    elements = [Paragraph("NutriLens AI — Nutrition History", styles["Title"]), Spacer(1, 12)]

    table_data = [["Date", "Food", "Meal", "Calories", "Protein (g)", "Carbs (g)", "Fat (g)", "Fiber (g)"]]
    for log in logs:
        table_data.append(
            [
                log["logged_at"][:16].replace("T", " "),
                log["food_name"],
                log["meal_type"],
                round(log["calories"], 1),
                round(log["protein_g"], 1),
                round(log["carbs_g"], 1),
                round(log["fat_g"], 1),
                round(log["fiber_g"], 1),
            ]
        )

    table = Table(table_data, repeatRows=1)
    table.setStyle(
        TableStyle(
            [
                ("BACKGROUND", (0, 0), (-1, 0), colors.HexColor("#1B4332")),
                ("TEXTCOLOR", (0, 0), (-1, 0), colors.white),
                ("FONTSIZE", (0, 0), (-1, -1), 8),
                ("GRID", (0, 0), (-1, -1), 0.5, colors.HexColor("#CCCCCC")),
                ("ROWBACKGROUNDS", (0, 1), (-1, -1), [colors.white, colors.HexColor("#F3F7F3")]),
            ]
        )
    )
    elements.append(table)
    doc.build(elements)
    buffer.seek(0)
    return StreamingResponse(
        buffer,
        media_type="application/pdf",
        headers={"Content-Disposition": "attachment; filename=nutrilens_history.pdf"},
    )
