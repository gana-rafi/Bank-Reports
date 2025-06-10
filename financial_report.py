import argparse, os, csv
import bank, credit_card, poalim, leumi, marcentile, config


def load_credit_reports(reports_fnames):    
    parsed_report = []
    for report in reports_fnames:
        for report_filename in report:
            parsed_report.extend(credit_card.parse(report_filename))

    return parsed_report


def load_bank_reports(bank_reports: list[list[str]]):
    parsed_report = []
    supported_reports = {config.POALIM_FILE_PREFIX: poalim.parse_transaction,
                         config.LEUMI_FILE_PREFIX: leumi.parse_transaction,
                         config.MERCANTILE_FILE_PREFIX: marcentile.parse_transaction}
    for report in bank_reports:
        for report_filename in report:
            report_type = os.path.basename(report_filename).split('_')[0]
            parsed_report.extend(supported_reports[report_type](report_filename))

    return parsed_report


def create_expenses_report(bank_report, credit_report, report_filename):
    csv_rows = list()
    with open(report_filename, 'w') as csvfile:
        fieldnames = ['דו"ח מקורי', 'תאריך', 'תחום', 'עבור', 'סכום', 'אסמכתא', 'פרטים', 'הערה']
        writer = csv.DictWriter(csvfile, fieldnames=fieldnames)

        writer.writeheader()
        for transaction in credit_report:
            row = dict.fromkeys(fieldnames)
            row['דו"ח מקורי'] = transaction.filename
            row['תאריך'] = transaction.date.strftime('%d/%m/%Y')
            row['עבור'] = getattr(transaction, 'business', getattr(transaction, 'buisness', ''))
            row['סכום'] = transaction.billing_amount
            row['אסמכתא'] = transaction.reference
            row['פרטים'] = transaction.details
            row['תחום'] = getattr(transaction, 'domain', '')
            row['הערה'] = getattr(transaction, 'note', '')
            csv_rows.append(row)

        for transaction in bank_report:
            # Only include negative amounts (expenses) and skip credit card payments
            if getattr(transaction, 'action_type', None) == bank.Action.CREDIT_CARD or \
                getattr(transaction, 'amount', 0) >= 0:
                continue
            row = dict.fromkeys(fieldnames)
            row['דו"ח מקורי'] = transaction.filename
            row['תאריך'] = transaction.date.strftime('%d/%m/%Y')
            row['עבור'] = getattr(transaction, 'action', '')
            row['סכום'] = abs(transaction.amount)
            row['אסמכתא'] = transaction.reference
            row['פרטים'] = transaction.details
            row['תחום'] = getattr(transaction, 'domain', '')
            row['הערה'] = ''
            csv_rows.append(row)

        for row in csv_rows:
            writer.writerow(row)


def create_income_report(bank_report, report_filename):
    csv_rows = list()
    with open(report_filename, 'w') as csvfile:
        fieldnames = ['דו"ח מקורי', 'תאריך', 'מקור', 'סכום', 'אסמכתא', 'פרטים', 'תחום', 'הערה']
        writer = csv.DictWriter(csvfile, fieldnames=fieldnames)

        writer.writeheader()
        for transaction in bank_report:
            # Only include positive amounts (income)
            if getattr(transaction, 'amount', 0) <= 0:
                continue
            row = dict.fromkeys(fieldnames)
            row['דו"ח מקורי'] = transaction.filename
            row['תאריך'] = transaction.date.strftime('%d/%m/%Y')
            row['מקור'] = getattr(transaction, 'action', '')
            row['סכום'] = transaction.amount
            row['אסמכתא'] = transaction.reference
            row['פרטים'] = transaction.details
            row['תחום'] = getattr(transaction, 'domain', '')
            row['הערה'] = ''
            writer.writerow(row)


if __name__ == '__main__':
    parser = argparse.ArgumentParser()
    parser.add_argument('--bank', action='append', nargs='+', default=[])
    parser.add_argument('--credit', action='append', nargs='+', default=[])
    parser.add_argument('--dump-expenses', action='store_true')
    parser.add_argument('--dump-incomes', action='store_true')
    parser.add_argument('--print-expenses', action='store_true')
    parser.add_argument('--print-incomes', action='store_true')
    args = parser.parse_args()
    
    credit_report = load_credit_reports(args.credit)
    bank_report = load_bank_reports(args.bank)


    min_date = min(t.date for t in bank_report + credit_report)
    max_date = max(t.date for t in bank_report + credit_report)
    expenses_report_filename = f"{config.EXPENSES_OUT_FILE_PREFIX}_{min_date.strftime('%Y%m%d')}_{max_date.strftime('%Y%m%d')}.csv"
    income_report_filename = f"{config.INCOME_OUT_FILE_PREFIX}_{min_date.strftime('%Y%m%d')}_{max_date.strftime('%Y%m%d')}.csv"

    if args.dump_expenses:
        create_expenses_report(bank_report, credit_report, expenses_report_filename)

    if args.dump_incomes:
        create_income_report(bank_report, income_report_filename)

    if args.print_expenses:
        s = 0
        for transaction in bank_report:
            if transaction.action_type == bank.Action.CREDIT_CARD or\
                transaction.amount > 0:
                continue
            s += abs(transaction.amount)
            print(transaction)
        
        for transaction in credit_report:
            s += abs(transaction.amount)
            print(transaction)

        print(f'Total expenses {s}')
            
    if args.print_incomes:
        s = 0
        for transaction in bank_report:
            if transaction.amount < 0:
                continue
            print(transaction)
            s += transaction.amount

        print(f'Total income {s}')
