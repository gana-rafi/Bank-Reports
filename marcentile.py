import traceback

import pandas as pd
from bank import Action, Corp, BankTransaction


def parse_action(s):
    print('DO THIS WITH ORLY! ADD ACTIONS IF NEEDED')
    return {"ביטוח לאומ": Action.TRANSFER,
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
            'חברת החשמל חיוב': Action.STANDING_ORDER,
            'חברת החשמל לישראל בע"מ חיוב': Action.STANDING_ORDER,
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
            'תשלום מס על רווח מפיקדון': Action.TRANSFER}[s.strip()]



def parse_account_number(cell):
    return cell.replace('\u200e', '').replace('\u200f', '').split(' ')[-1]


def find_account_number(report):
    account_number = input("Mercantile doesn't provide account number in reports. Type it now:\n")
    if len(account_number) > 0:
        return account_number
        
    raise Exception('No account number in this report')


def find_report_start(report):
    if 'תאריך' in report.columns:
        return 0
        
    raise Exception('No report found in file')



def parse_transaction(filename):
    account_number = find_account_number(pd.read_excel(filename))
    table_start = find_report_start(pd.read_excel(filename))
    xls_report = pd.read_excel(filename, sheet_name=0, header=table_start)

    report = []
    for pd_row in xls_report.iterrows():
        row = pd_row[1]

        transaction = None
        try:
            transaction = BankTransaction(filename,
                                        Corp.MERCANTILE,
                                        account_number,
                                        row['תאריך'],
                                        row['תיאור התנועה'],
                                        row['תיאור התנועה'],
                                        row['אסמכתה'],
                                        row['₪ זכות/חובה '],
                                        row['₪ יתרה '],
                                        row['יום ערך'],
                                        parse_action(row['תיאור התנועה']))
        except Exception as e:
            traceback.print_exc()
            print("FIX THIS. REPORT IS NOT CONSISTANT!!!")
            break
        report.append(transaction)

    return report
