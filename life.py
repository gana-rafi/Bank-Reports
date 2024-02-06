import strenum
import pickle

class Domain(strenum.StrEnum):
    UNSPECIFIED = '',
    VACATION = 'נופש',
    LEASURE ='בילוי ומסעדות',
    EDUCATION ='חינוך',
    COLTURE ='תרבות ופנאי',
    FOOD ='מזון',
    CLOTHING ='ביגוד והנעלה',
    HEALTH ='בריאות',
    ELECTRONICS ='מוצרי חשמל',
    HOUSE ='בית',
    INSURANCE = 'ביטוח',
    TRANSPORTATION = 'תחבורה',
    BILLS = 'מיסים ותשלומים',
    SAVINGS = 'חיסכון',
    BUISNESS = 'עסק',
    HOBBIES = 'תחביבים',
    GIFTS = 'מתנות'


_BUISNESSES = None
def guess_domain(buisness_name):
    global _BUISNESSES
    if not _BUISNESSES:
        try:
            _BUISNESSES = pickle.load(open('buisnesses.bin', 'rb'))
        except:
            _BUISNESSES = {}

    return _BUISNESSES.get(buisness_name, Domain.UNSPECIFIED)
