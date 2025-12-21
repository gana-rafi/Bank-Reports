import strenum
import pickle

class Domain(strenum.StrEnum):
    UNSPECIFIED = ''
    VACATION = 'נופש'
    LEISURE = 'בילוי ומסעדות'
    EDUCATION = 'חינוך'
    CULTURE = 'תרבות ופנאי'
    FOOD = 'מזון'
    CLOTHING = 'ביגוד והנעלה'
    HEALTH = 'בריאות'
    ELECTRONICS = 'מוצרי חשמל'
    HOUSE = 'בית'
    INSURANCE = 'ביטוח'
    TRANSPORTATION = 'תחבורה'
    BILLS = 'מיסים ותשלומים'
    SAVINGS = 'חיסכון'
    BUSINESS = 'עסק'
    HOBBIES = 'תחביבים'
    GIFTS = 'מתנות'
    INCOME = 'הכנסות'


_BUSINESSES = None
def guess_domain(business_name):
    global _BUSINESSES
    if not _BUSINESSES:
        try:
            _BUSINESSES = pickle.load(open('businesses.bin', 'rb'))
        except:
            _BUSINESSES = {}

    return _BUSINESSES.get(business_name, Domain.UNSPECIFIED)
