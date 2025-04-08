import pandas as pd
import math
from bank import Action, BankTransaction, Corp


def parse_action(s):
    return {"מסטרקרד": Action.CREDIT_CARD,
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
            "מטח-מכירה": Action.FOREX}[s]



def parse_account_number(cell):
    return cell.split(' ')[3]


def find_account_number(report):
    for v in report['Unnamed: 0']:
        if v == v and 'מספר חשבון' in v:
            return parse_account_number(v)
        
    raise Exception('No account number in this report')


def find_report_start(report):
    for i, v in enumerate(report['Unnamed: 0']):
        if v == v and 'תאריך' in v:
            return i
        
    raise Exception('No report found in file')


def parse_transaction(filename):
    account_number = find_account_number(pd.read_excel(filename))
    table_start = find_report_start(pd.read_excel(filename))
    xls_report = pd.read_excel(filename, sheet_name=0, header=table_start+2)

    report = []
    for pd_row in xls_report.iterrows():
        row = pd_row[1]
        amount = row['חובה'] * -1 if math.isnan(row['זכות']) else row['זכות']

        details = row['פרטים']
        details = details if details == details else ''

        transaction = BankTransaction(filename,
                                        Corp.POALIM,
                                        account_number,
                                        row['תאריך'].to_pydatetime(),
                                        row['הפעולה'],
                                        details,
                                        row['אסמכתא'],
                                        amount,
                                        row["יתרה בש''ח"],
                                        row['תאריך ערך'].to_pydatetime(),
                                        parse_action(row['הפעולה']))
        report.append(transaction)

    return report

