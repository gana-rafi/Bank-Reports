import math
import pandas as pd
from datetime import datetime
from bank import Corp, BankTransaction
from editor import actions

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
                                        actions.parse_action(row['תיאור']))
        except Exception as e:
            print(e)
            print("FIX THIS. REPORT IS NOT CONSISTANT!!!")
            break
        report.append(transaction)

    return report
