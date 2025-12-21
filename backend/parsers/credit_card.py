import datetime, csv
from dataclasses import dataclass
import pandas as pd
import editor.domains as domains


@dataclass
class CreditTransaction:
    filename: str
    card_number: int
    date: datetime.datetime
    billing_date: datetime.datetime
    buisness: str
    amount: int
    currency: str
    billing_amount: int
    billing_currency: str
    reference: str
    details: str
    domain: domains.Domain = domains.Domain.UNSPECIFIED
    note: str = ''


def find_indexes(l, value):
    return [i for i, v in enumerate(l) if v == value]


def find_reports(report):
    reports_rows = find_indexes(report['Unnamed: 0'], 'תאריך רכישה')
    issuer = None
    card_number = None
    reports = []
    for row in reports_rows:
        if report['Unnamed: 0'][row - 1] == 'עסקאות בחו˝ל':
            if card_number is None:
                raise Exception('No card number before this report')
        elif report['Unnamed: 0'][row - 1] == 'עסקאות בארץ':
            issuer, card_number = report['Unnamed: 0'][row - 2].rsplit('-', 1)
        else:
            print(report['Unnamed: 0'][row - 1])
            raise Exception('Unrecognized report')

        reports.append((row, card_number))
    
    return reports
    
def parse(filename):
    xls_report = pd.read_excel(filename, sheet_name=0)
    reports = find_reports(xls_report)

    report = []
    for header_row, card_number in reports:
        xls_report = pd.read_excel(filename, sheet_name=0, header=header_row+1)
        for pd_row in xls_report.iterrows():
            row = pd_row[1]
            if row['שם בית עסק'] != row['שם בית עסק'] or row['שם בית עסק'] == 'סך חיוב בש"ח:':
                break
            elif row['שם בית עסק'] == 'TOTAL FOR DATE':
                continue

            amount = row.get('סכום עסקה', row.get('סכום מקורי'))
            if amount is None:
                continue  # Skip rows with no amount
            details = row.get('פירוט נוסף')
            details = details if details == details else ''

            reference = row.get('מספר שובר')
            reference = reference if reference == reference else ''
            

            billing_date =  datetime.datetime.strptime(row.get('תאריך חיוב'), '%d/%m/%Y') if 'תאריך חיוב' in row else ''
            assert amount is not None, 'amount cannot be None'
            transaction = CreditTransaction(filename,
                                            card_number.strip(),
                                            datetime.datetime.strptime(row['תאריך רכישה'], '%d/%m/%Y'),
                                            billing_date,
                                            row['שם בית עסק'],
                                            -(amount),
                                            row['מטבע מקור'],
                                            row['סכום חיוב'],
                                            row['מטבע לחיוב'],
                                            reference,
                                            details,
                                            domains.guess_domain(row['שם בית עסק']))
            report.append(transaction)
    return report


def dump(filename, transactions):
    with open(filename, 'w') as csvfile:
        fieldnames = ['דו"ח מקורי', 'כרטיס מספר', 'תאריך', 'בית עסק', 'סכום', 'מספר שובר', 'פרטים', 'תחום', 'הערה']
        writer = csv.DictWriter(csvfile, fieldnames=fieldnames)

        row = dict.fromkeys(fieldnames)
        writer.writeheader()
        for transaction in transactions:
            row['דו"ח מקורי'] = transaction.filename
            row['כרטיס מספר'] = transaction.card_number
            row['תאריך'] = transaction.date.strftime('%d/%m/%Y')
            row['בית עסק'] = transaction.buisness
            row['סכום'] = transaction.billing_amount
            row['מספר שובר'] = transaction.reference
            row['תחום'] = transaction.domain
            row['פרטים'] = transaction.details
            row['הערה'] = transaction.note

            writer.writerow(row)

