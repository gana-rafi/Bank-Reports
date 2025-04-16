import traceback

import pandas as pd
from bank import Action, Corp, BankTransaction


def parse_action(s):
    return {"כספומט": Action.CASH_CHECK,
            "רווחים ממשיכת הפקדה מפיקדון": Action.TRANSFER,
            "שיק": Action.CASH_CHECK,
            'הוט מערכות חיוב': Action.STANDING_ORDER,
            'חברת החשמל חיוב': Action.STANDING_ORDER,
            'חברת החשמל לישראל בע"מ חיוב': Action.STANDING_ORDER,
            'חברת פרטנר חיוב': Action.STANDING_ORDER,
            'חברת פרטנר תקשורת בע"מ חיוב': Action.STANDING_ORDER,
            'עמלה': Action.COMMISSION, 
            'עמלת פנקסי שיקים אישיים': Action.COMMISSION,
            'ריבית': Action.COMMISSION,
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
