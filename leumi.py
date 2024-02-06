import math
import pandas as pd
from datetime import datetime
from bank import Action, Corp, BankTransaction


def parse_action(s):
    print('DO THIS WITH ORLY! ADD ACTIONS IF NEEDED')
    return {"מסטרקרד": Action.CREDIT_CARD,
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
            "מרכנתיל די.-י": Action.TRANSFER,
            "משיכת חיסכון": Action.TRANSFER,
            "משיכת מזומן ": Action.CASH_CHECK,
            "עמלה ": Action.COMMISSION,
            "פרעון הלוואה": Action.TRANSFER,
            "שירותי בריאו-י": Action.STANDING_ORDER}[s]



def parse_account_number(cell):
    return cell.replace('\u200e', '').replace('\u200f', '').split(' ')[-1]


def find_account_number(report):
    for v in report['בנק לאומי |']:
        if v == v and "מס' חשבון :" in v:
            return parse_account_number(v)
        
    raise Exception('No account number in this report')


def find_report_start(report):
    for i, v in enumerate(report['בנק לאומי |']):
        if v == 'תאריך':
            return i
        
    raise Exception('No report found in file')



def parse_transaction(filename):
    account_number = find_account_number(pd.read_excel(filename))
    table_start = find_report_start(pd.read_excel(filename))
    xls_report = pd.read_excel(filename, sheet_name=0, header=table_start+1)

    report = []
    for pd_row in xls_report.iterrows():
        row = pd_row[1]
        print(row)
        amount = row['בחובה'] * -1 if math.isnan(row['בזכות']) else row['בזכות']

        details = row['תאור מורחב']
        details = details if details == details else ''
        transaction = None
        try:
            transaction = BankTransaction(filename,
                                        Corp.LEUMI,
                                        account_number,
                                        datetime.strptime(row['תאריך'], '%d/%m/%y'),
                                        row['תיאור'],
                                        details,
                                        row['אסמכתא'],
                                        amount,
                                        row['היתרה בש"ח'],
                                        datetime.strptime(row['תאריך ערך'], '%d/%m/%y'),
                                        parse_action(row['תיאור']))
        except Exception as e:
            print(e)
            print("FIX THIS. REPORT IS NOT CONSISTANT!!!")
            break
        report.append(transaction)

    return report
