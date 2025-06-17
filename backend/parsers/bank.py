import datetime, enum, csv
from dataclasses import dataclass
import life


class Corp(enum.Enum):
    OTHER = 0,
    LEUMI = 10,
    POALIM = 12,
    MERCANTILE = 17,


class Action(enum.Enum):
    CREDIT_CARD = 1,
    TRANSFER = 2,
    CASH_CHECK = 3,
    STANDING_ORDER = 4,
    FOREX = 5,
    COMMISSION = 6,
    UNKNOWN = 7


@dataclass
class BankTransaction:
    filename: str
    corp: Corp
    account_number: str
    date: datetime.datetime
    action: str
    details: str
    reference: str
    amount: int
    balance: int
    value_date: datetime.datetime
    action_type: Action
    domain: life.Domain = life.Domain.UNSPECIFIED