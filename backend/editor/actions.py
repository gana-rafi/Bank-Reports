from enum import StrEnum


class Action(StrEnum):
    CREDIT_CARD = "CREDIT_CARD"
    TRANSFER = "TRANSFER"
    CASH_CHECK = "CASH_CHECK"
    STANDING_ORDER = "STANDING_ORDER"
    FOREX = "FOREX"
    COMMISSION = "COMMISSION"
    UNKNOWN = "UNKNOWN"


_available_actions =  {"מסטרקרד": Action.CREDIT_CARD,
            "ביטוח לאומי-י": Action.TRANSFER,
            'ביטוח.ל-אזו"-י': Action.TRANSFER,
            'הו"ק לחיסכון': Action.STANDING_ORDER,
            "הוראת קבע": Action.STANDING_ORDER,
            "העברה בנקאית": Action.TRANSFER,
            "מב. הפועלים-י": Action.TRANSFER,
            "מרכנתיל די.-י": Action.TRANSFER,
            "הפקדה לחיסכון": Action.TRANSFER,
            "ויזה כ.א.ל-י": Action.CREDIT_CARD,
            'ישראכרט בע"מ-י': Action.CREDIT_CARD,
            "כ.הפק` מזומן ": Action.CASH_CHECK,
            'לאומי ויזה': Action.CREDIT_CARD,
            'לאומי מאסטרקרד': Action.CREDIT_CARD,
            'לאומי קארד': Action.CREDIT_CARD,
            "מסלול בסיסי": Action.UNKNOWN,
            "מפעל הפיס-זכ-י": Action.TRANSFER,
            'מקס איט פיננ-י': Action.CREDIT_CARD,
            "משיכת חיסכון": Action.TRANSFER,
            "משיכת מזומן ": Action.CASH_CHECK,
            "עמלה ": Action.COMMISSION,
            "פרעון הלוואה": Action.TRANSFER,
            "שירותי בריאו-י": Action.STANDING_ORDER,
            "ביטוח לאומ": Action.TRANSFER,
            'ביטוח לאומי-נכויות': Action.TRANSFER,
            'החזרות זיכויים 00099017 מרכנתיל': Action.TRANSFER,
            "הפקדת מזומן לדיסקונט בכר' 3961": Action.CASH_CHECK,
            "הפקדת מזומן למרכנתיל בכר' 3210": Action.CASH_CHECK,
            "כספומט": Action.CASH_CHECK,
            'משיכה מפיקדון הו"ק 3 שנים': Action.TRANSFER,
            "רווחים ממשיכת הפקדה מפיקדון": Action.TRANSFER,
            "שיק": Action.CASH_CHECK,
            'הו"ק לאסתר גנה לסניף 12-543': Action.STANDING_ORDER,
            'הו"ק לאתי גנה ושרלי לסניף 10-676': Action.STANDING_ORDER,
            'הו"ק לגנה אסתר לסניף 09-001': Action.STANDING_ORDER,
            'הו"ק לגנה אתי אסתר לסניף 09-001': Action.STANDING_ORDER,
            'הוט מערכות חיוב': Action.STANDING_ORDER,
            'הפקדה לפיקדון הו"ק 3 שנים': Action.TRANSFER,
            'חברת פרטנר חיוב': Action.STANDING_ORDER,
            'חברת פרטנר תקשורת בע"מ חיוב': Action.STANDING_ORDER,
            'חיוב לכרטיס ויזה 1468': Action.CREDIT_CARD,
            'חיוב לכרטיס ויזה 3210': Action.CREDIT_CARD,
            'ידיעות אחר חיוב': Action.STANDING_ORDER,
            'ידיעות אחרונות בע"מ-עבור לאשה חיוב': Action.STANDING_ORDER,
            'ידיעות אחרונות בע"מ(ע. מנטה) חיוב': Action.STANDING_ORDER,
            'מגדל חברה חיוב': Action.STANDING_ORDER,
            'מי שיקמה ב חיוב': Action.STANDING_ORDER,
            'מי שיקמה בע"מ חיוב': Action.STANDING_ORDER,
            'עיריית אור חיוב': Action.STANDING_ORDER,
            'עיריית אור יהודה חיוב': Action.STANDING_ORDER,
            'עמלה': Action.COMMISSION, 
            'עמלת ביטול הו"ק/חיוב עפ"י הרשא 3- יח\'': Action.COMMISSION,
            'עמלת פנקסי שיקים אישיים': Action.COMMISSION,
            'ריבית': Action.COMMISSION,
            'שח"ל טלרפו חיוב': Action.STANDING_ORDER,
            'שח"ל טלרפואה בע"מ חיוב': Action.STANDING_ORDER,
            'שירותי בריאות כללית חיוב': Action.STANDING_ORDER,
            'תשלום מס על רווח מפיקדון': Action.TRANSFER,
            "מסטרקרד": Action.CREDIT_CARD,
            'זיכוי מדיסקונט': Action.TRANSFER,
            'יד שרה (ע"ר)': Action.CASH_CHECK,
            "העב' לאחר-נייד": Action.TRANSFER,
            "איילון חברה": Action.STANDING_ORDER,
            "פרימיום אקספרס": Action.CREDIT_CARD,
            "הפק.שיק בסלולר": Action.CASH_CHECK,
            "זיכוי מלאומי": Action.TRANSFER,
            "ישראכרט בע\"מ": Action.CREDIT_CARD,
            "bit העברת כסף": Action.TRANSFER,
            "תשלום שובר-נט": Action.TRANSFER,
            "שיק": Action.CASH_CHECK,
            "מגדל חברה לביט": Action.STANDING_ORDER,
            "העברה-נייד": Action.TRANSFER,
            "העברה": Action.TRANSFER,
            "מטח": Action.FOREX,
            "מטח-מכירה": Action.FOREX,
            }


def suggest_actions(type: Action) -> set[Action]:
    """
    Suggest actions based on the type of action.
    """
    return {action for action, act_type in _available_actions.items() if act_type == type}


def parse_action(s):
    print('DO THIS WITH ORLY! ADD ACTIONS IF NEEDED')
    return _available_actions.get(s, Action.UNKNOWN)